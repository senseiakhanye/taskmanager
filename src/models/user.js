const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task.js');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password weak");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        min: 0
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'creator'
});

userSchema.methods.createJsonWebToken = async function() {
    const token = jwt.sign( { _id: this._id} , process.env.JWT_SECRET);
    this.tokens.push( {token} );
    this.save();
    return token;
}

userSchema.methods.toJSON = function() {
    const user = this.toObject();

    delete user.password;
    delete user.tokens;
    delete user.avatar;
    return user;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( {email} );
    if (user == null) {
        throw new Error("Unable to login");
    }
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Unable to login");
    }
    return user;
}

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8);
    } else {
        console.log("Is not modified");
    }
    next();
});

userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id});
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
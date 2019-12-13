const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

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
    }
});

userSchema.pre("save", async function (next) {
    console.log(this);
    if (this.isModified('password')) {
        console.log("Is modified");
        this.password = await bcryptjs.hash(this.password, 8);
    } else {
        console.log("Is not modified");
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
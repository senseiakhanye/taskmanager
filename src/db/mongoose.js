const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27018/task-manager-api', { 
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology: true }).then( () => {
            console.log("Connected");
        }).catch( (error) => {
            console.log("Error", error);
        });

const tasksModel = mongoose.model('tasks', {
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

const User = mongoose.model('User', {
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
})

const user = new User({
    name: 'Katleho',
    email:'KATLEHO@gmail.com',
    password:'passdword123',
    age: 0
});

user.save().then( () => {
    console.log(user);
}).catch( (error) => {
    console.log(error);
})

// const tasks = new tasksModel({
//     description: 'This is my second description ever using Mongoose',
//     completed: false
// });

// tasks.save().then( (taskData) => {
//     console.log(taskData);
// }).catch( (error) => {
//     console.log(error);
// })

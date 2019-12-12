const mongoose = require('mongoose');

const Task = mongoose.model('tasks', {
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = Task;
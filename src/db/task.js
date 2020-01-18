const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        minlength: 4
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = Task;

const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const routers = express.Router();

routers.get("/tasks", auth, (req, res) => {
    Task.find({ creator: req.user._id}).then( (tasks) => {
        res.send(tasks);
    }).catch( (error) => {
        res.status(500).send(error);
    })
})

routers.post("/task", auth, (req, res) => {
    const task = new Task({
        ...req.body,
        creator: req.user._id
    })

    task.save().then( () => {
        res.send(task);
    }).catch( (error) => {
        res.status(400).send(error);
    })
})

module.exports = routers;
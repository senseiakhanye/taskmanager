const express = require('express');
const Task = require('../models/task');
const routers = express.Router();

routers.get("/tasks", (req, res) => {
    Task.find({}).then( (tasks) => {
        res.send(tasks);
    }).catch( (error) => {
        res.status(500).send(error);
    })
})

routers.post("/task", (req, res) => {
    const task = new Task(req.body);

    task.save().then( () => {
        res.send(task);
    }).catch( (error) => {
        res.status(400).send(error);
    })
})

module.exports = routers;
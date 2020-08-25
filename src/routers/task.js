const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const routers = express.Router();

routers.get("/tasks", auth, async (req, res) => {
    try {
        const match = {};
        Object.keys(req.query).forEach(key => {
            if (key.toLowerCase() === "completed") {
                match.completed = req.query[key].toLowerCase() === "true"
            }
        });
        console.log(match);
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
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

routers.delete("/tasks", auth, (req, res) => {
    Task.deleteMany({ creator: req.user._id}).then( () => {
        res.send({ok: true});
    }).catch( error => {
        res.status(400).send(error);
    })
})

module.exports = routers;
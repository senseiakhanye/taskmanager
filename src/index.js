const express = require('express');
const User = require('./models/user');
const Task = require('./models/task');
require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.get("/users", (req, res) => {
    User.find({}).then( (users) => {
        res.send(users);
    }).catch( (error) => {
        res.status(500).send(error);
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then( (tasks) => {
        res.send(tasks);
    }).catch( (error) => {
        res.status(500).send(error);
    })
})

app.post("/user", (req, res) => {
    const user = new User(req.body);
    user.save().then( () => {
        res.send(user);
    }).catch( (error) => {
        res.status(400).send(error);
    })
})

app.post("/task", (req, res) => {
    const task = new Task(req.body);

    task.save().then( () => {
        res.send(task);
    }).catch( (error) => {
        res.status(400).send(error);
    })
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
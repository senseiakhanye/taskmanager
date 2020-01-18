const express = require('express');
require("./db/mongoose");

const User = require("./db/user");
const Task = require("./db/task");;

const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());

app.delete("/task/:id", (req, res) => {
    const deleteTask = async(id) => {
        const delTask = await Task.findByIdAndDelete(id);
        const count = await Task.countDocuments({completed: false});
        return count;
    }
    deleteTask(req.params.id).then( (count) => {
        res.status(200).send({count});
    }).catch( (error) => {
        res.status(500).send(error);
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then( (tasks) => {
        res.send(tasks);d
    }).catch( (error) => {
        res.status(500).send();
    })
});

app.get("/task/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).send();
    }
    Task.find( {_id : req.params.id }).then( (task) => {
        console.log(task);
        if (!task) {
            return res.status(204).send();
        }
        res.status(200).send(task);
    }).catch( (error) => {
        return res.status(500).send(error);
    })
})

app.post("/task", (req, res) => {
    const task = new Task(req.body);

    task.save().then( () => {
        res.status(201).send(task);
    }).catch( (error) => {
        res.status(400).send(error);
    })
});

app.listen(port, () => {
    console.log("Listen on port : " + port);
})
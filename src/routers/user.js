const express = require('express');
const User = require('../models/user');
const routers = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth')

routers.get("/users", auth, (req, res) => {
    User.find({}).then( (users) => {
        res.send(users);
    }).catch( (error) => {
        res.status(500).send(error);
    })
});

routers.get("/user", auth, (req, res) => {
    res.send(req.user);
})

routers.post("/user/login", async (req, res) => {
    try {
        if (req.body.email == null || req.body.password == null) {
            throw new Error("Invalid request");
        }
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.createJsonWebToken();
        res.send({user, token});
    } catch ( error ) {
        res.status(400).send( {error: error.message});
    }
})

routers.post("/user", async (req, res) => {
    try {
        const user = new User(req.body);
    
        await user.save();
        if (!user) {
            return res.status(400).send("User not created");
        }
        return res.send(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
});

routers.patch("/user/:id", async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdateFields = ["age", "name", "email", "password"];
    const id = req.params.id;
    const updateOk = keys.every((key) => allowedUpdateFields.includes(key) );

    if (!updateOk) {
        return res.status(400).send("Invalid request");
    }

    try {
        const userToModify = await User.findById(id);
        keys.forEach( (key) => {
            userToModify[key] = req.body[key];
        })
        await userToModify.save();
        if (!userToModify) {
            return res.status(404).send("Not found");
        }
        return res.send(userToModify);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = routers;
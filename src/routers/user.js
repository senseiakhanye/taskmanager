const express = require('express');
const User = require('../models/user');
const Task = require('../models/task');
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

routers.post("/user/signup", async (req, res) => {
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

routers.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter( (token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch ( error ) {
        res.status(400).send( {error: error.message});
    }
})

routers.post("/user/logoutall", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch ( error ) {
        res.status(400).send( {error: error.message});
    }
})

routers.post("/user", auth, async (req, res) => {
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

routers.patch("/user", auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdateFields = ["age", "name", "email", "password"];
    const updateOk = keys.every((key) => allowedUpdateFields.includes(key) );

    if (!updateOk) {
        return res.status(400).send("Invalid request");
    }

    try {
        keys.forEach( (key) => {
            req.user[key] = req.body[key];
        })
        await req.user.save();
        return res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

routers.delete("/user", auth, async (req, res) => {
    try {
        await req.user.remove();
        const tasks = await Task.remove( { creator: req.user._id} );
        res.send();
    } catch ( error ) {
        res.status(400).send(error);
    }
})

module.exports = routers;
const express = require('express');
const User = require('../models/user');
const routers = express.Router();
const bcryptjs = require('bcryptjs');

routers.get("/users", (req, res) => {
    User.find({}).then( (users) => {
        res.send(users);
    }).catch( (error) => {
        res.status(500).send(error);
    })
});

routers.post("/user", async (req, res) => {
    let modifyUser = req.body;

    console.log(req.body.password);
    try {
        const gPass = req.body.password;
        console.log(gPass);
        const pass = await bcryptjs.hash(req.body.password, 8);
        modifyUser.password = pass;
        const user = new User(modifyUser);
    
        await user.save();
        if (!user) {
            return res.status(400).send("User not created");
        }
        return res.send(user);
    }
    catch (error) {
        res.status(400).send(error);
    }
    
    // user.save().then( () => {
    //     res.send(user);
    // }).catch( (error) => {
    //     res.status(400).send(error);
    // })
});

routers.patch("/user/:id", async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdateFields = ["age", "name", "email"];
    const id = req.params.id;
    const updateOk = keys.every((key) => allowedUpdateFields.includes(key) );

    if (!updateOk) {
        return res.status(400).send("Invalid request");
    }
    try {
        // const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true});
        const user = await User.findByIdAndUpdate( {_id : id}, req.body, {new: true, runValidators: true});

        if (!user) {
            return res.status(404).send("Not found");
        }
        return res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = routers;
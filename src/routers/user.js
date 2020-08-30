const express = require('express');
const User = require('../models/user');
const Task = require('../models/task');
const routers = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendConfirmEmail } = require('../emails/account');

const upload = multer({
    // dest: 'images', //Saving to filesystem
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|gpeg|png)$/) && !file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
            return cb(new Error("Please upload an Image"))
        }
        cb(undefined, true);
        // cb(undefined, true); // Accept the file
        // cb(undefined, false); // Deny the file
        // cb(new Error('File must be a PDF')); // Throw error
    }
})

routers.get("/user/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null || user.avatar == null) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(400).send();
    }
})

routers.get("/users", auth, (req, res) => {
    User.find({}).then( (users) => {
        res.send(users);
    }).catch( (error) => {
        res.status(500).send(error);
    })
});

routers.get("/user", auth, (req, res) => {
    res.send(req.user);
});

routers.post("/user/me/avatar", auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar =  buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error : error.message});
});

routers.post("/user/signup", async (req, res) => {
    try {
        const user = new User(req.body);
    
        await user.save();
        if (!user) {
            return res.status(400).send("User not created");
        }
        sendConfirmEmail(user.email, user.name);
        return res.status(201).send(user);
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
        // const tasks = await Task.remove( { creator: req.user._id} );
        res.send();
    } catch ( error ) {
        res.status(400).send(error);
    }
});

routers.delete("/user/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = routers;
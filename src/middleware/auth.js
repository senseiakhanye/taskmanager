const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const verify = jwt.verify(token, "testingwebtoken");
        const user = await User.findOne( {_id: verify._id, 'tokens.token': token});
        if (user == null) {
            throw new Error("Please sign in.");
        }
        req.token = token;
        req.user = user;
        next();
    } catch ( error ) {
        res.status(401).send("You are not authorized");
    }
}

module.exports = auth;
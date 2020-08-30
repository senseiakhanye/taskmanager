const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId;
const userOne = {
    _id: userOneId,
    name: 'Testing',
    email: 'test@test.com',
    password: 'thisisatest',
    tokens: [{
        token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId;
const userTwo = {
    _id: userTwoId,
    name: 'Testing 123',
    email: 'test1@test1.com',
    password: 'thisisatest123',
    tokens: [{
        token: jwt.sign({_id: userOneId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "First",
    completed: false,
    creator: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Second",
    completed: true,
    creator: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Third",
    completed: true,
    creator: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    setupDatabase
}
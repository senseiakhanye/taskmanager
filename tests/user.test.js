const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const userOne = {
    name: 'Testing',
    email: 'test@test.com',
    password: 'thisisatest'
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

// afterEach(() => {
//     console.log("After each");
// })

test("Should signup a new user", async () => {
    await request(app).post('/user/signup').send({
        name: 'Test User',
        email: 'kakhanye@yahoo.com',
        password: 'ThisIsPass123'
    }).expect(201);
});

test("Should login existing user", async () => {
    await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
});

test("Should not login nonexistent user", async () => {
    await request(app).post("/user/login").send({
        email: 'Whoisthiuser',
        passowrd: 'HisPasswordIsNonExistant'
    }).expect(400);
});

test("Existing User with wrong password should not work", async () => {
    await request(app).post("/user/login").send({
        email: userOne.email,
        password: `${userOne.password}123`
    }).expect(400);
});
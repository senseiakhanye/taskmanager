const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

// afterEach(() => {
//     console.log("After each");
// })

test("Should signup a new user", async () => {
    const response = await request(app).post('/user/signup').send({
        name: 'Test User',
        email: 'kakhanye@yahoo.com',
        password: 'ThisIsPass123'
    }).expect(201);


    // Assert that the database was changed correctly
    const user = await User.findById(response.body._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        name: 'Test User',
        email: 'kakhanye@yahoo.com'
    });

    expect(user.password).not.toBe("ThisIsPass123");
});

test("Should login existing user", async () => {
    const response = await request(app).post('/user/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const savedUser = await User.findById(userOne._id);
    expect(savedUser.tokens[1].token).toBe(response.body.token);
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


test("User without a valid token should not get user", async () => {
    await request(app).get("/user").send().expect(401);
});

test("Authorised user should get user info", async () => {
    await request(app)
        .get("/user")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Unauthorised user should not delete accout", async () => {
    await request(app)
            .delete("/user")
            .send().expect(401);
});

test("Authorised user can delete profile", async () => {
    await request(app)
            .delete("/user")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
    
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test("Should upload avatar image", async () => {
    await request(app)
            .post("/user/me/avatar")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .attach("avatar", "tests/fixtures/profile-pic.jpg")
            .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
    await request(app)
            .patch("/user")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send({
                "name": "Katleho"
            })
            .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe("Katleho");
});

test("Should not update invalid field", async () => {
    await request(app)
            .patch("/user")
            .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
            .send({
                "namex": "Katleho"
            })
            .expect(400);
});

test("Unauthorised user should not update a field", async () => {
    await request(app)
            .patch("/user")
            .send({
                "name": "Katleho"
            })
            .expect(401);
})
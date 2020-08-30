const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const { userOneId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test("Should create task for user", async () => {
    const response = await request(app)
                        .post("/task")
                        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
                        .send({
                            description: "From my test"
                        })
                        .expect(201);
    const task = await Task.findById(response.body._id);
    expect(task._id).not.toBeNull();
    expect(task.creator).toEqual(userOne._id);
    expect(task.completed).toEqual(false);
});

test("Get user one tasks", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toEqual(2);
})

test("Unauthonticated user should not get tasks", async () => {
    await request(app)
        .get("/tasks")
        .send()
        .expect(401);
});

test("Authorised user should not delete tasks not belonging to the user", async () => {

})
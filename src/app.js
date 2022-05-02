const express = require('express');
const userRouters = require("./routers/user");
const taskRoutes = require("./routers/task");
require('./db/mongoose');

const app = express();


app.use(express.json());
app.use(userRouters);
app.use(taskRoutes);

module.exports = app;
// thisisafunnypassword123
//mongodb+srv://taskapp:<password>@cluster0.lyx66.azure.mongodb.net/test
const express = require('express');
const userRouters = require("./routers/user");
const taskRoutes = require("./routers/task");
require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouters);
app.use(taskRoutes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

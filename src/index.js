"use strict";
const express = require("express");
const bcrypt = require("bcryptjs");
require("./db/mongoose");
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});

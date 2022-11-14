"use strict";

const mongoose = require("mongoose");
mongoose.connect(process.env.DBURL);
//{
//   useNewUrlParser: true,
// useCreateIndex: true,
// } OPTIONS NOT SUPPORTED NOW

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("Error !", error);
//   });

// const task1 = new Task({
//   //description: "This is my 1st task",
//   iscompleted: true,
// });

// const task2 = new Task({
//   description: "This is my 2nd Task",
//   iscompleted: false,
// });

// task1
//   .save()
//   .then(() => {
//     console.log(task1);
//   })
//   .catch((error) => {
//     console.log("Error.. !", error);
//   });

// task2
//   .save()
//   .then(() => {
//     console.log(task2);
//   })
//   .catch((error) => console.log("Error..!", error));

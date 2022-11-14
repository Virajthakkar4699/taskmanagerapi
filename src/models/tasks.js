"use strict";

const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    iscompleted: {
      type: Number,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = new mongoose.model("Task", taskSchema);

module.exports = Task;

const express = require("express");
const router = express.Router();
const Task = require("../models/tasks");
const auth = require("../middleware/auth");
const { route } = require("./users");

router.post("/tasks", auth, async (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  console.log(req.user._id);

  try {
    task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET /Tasks?complete=false
router.get("/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).populate({
      path: "owner",
    });
    if (tasks.length === 0) {
      return res.status(200).send("Zero Tasks Found");
    }
    // await req.user.populate("tasks").execPopulate();
    res.status(200).send(tasks);

    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log(req.user);

  try {
    //const task = await Task.findById(_id);
    const task = await Task.findOne({
      _id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send("Task Not Found");
    }
    res.status(200).send(task);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "iscompleted"];
  const isValidOperations = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperations) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).send("Task not found to update.");
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
    // console.log(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("No Task found to delete");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

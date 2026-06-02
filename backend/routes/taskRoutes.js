const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {

  const tasks = await Task.find({
    userId: req.user.id,
  });

  res.json(tasks);
});

router.post("/", auth, async (req, res) => {

  const task = await Task.create({
    ...req.body,
    userId: req.user.id,
  });

  res.json(task);
});

router.put("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { title: req.body.title },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ msg: "Task not found." });
  }

  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!task) {
    return res.status(404).json({ msg: "Task not found." });
  }

  res.json({ msg: "Task deleted." });
});

module.exports = router;
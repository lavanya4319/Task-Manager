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

module.exports = router;
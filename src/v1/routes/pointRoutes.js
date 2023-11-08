// In src/v1/routes/workoutRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get all points");
});

router.get("/:pointId", (req, res) => {
  res.send("Get an existing point");
});

router.post("/", (req, res) => {
  res.send("Create a new point");
});

router.patch("/:workoutId", (req, res) => {
  res.send("Update an existing point");
});

router.delete("/:workoutId", (req, res) => {
  res.send("Delete an existing point");
});

module.exports = router;
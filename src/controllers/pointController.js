const express = require("express");
const pointService= require( "../services/pointService");
const getAllPoints = (req, res) => {
  const allPoints = pointService.getAllPoints();
  res.send("Get all workouts");
};

const getOnePoint  = (req, res) => {
  const point = pointService.getOnePoint();
  res.send("Get an existing point");
};

const createNewPoint  = (req, res) => {
  const createdpoint = pointService.createNewPoint();
  res.send("Create a new point");
};

const updateOnePoint  = (req, res) => {
  const updatedpoint = pointService.updateOnePoint();
  res.send("Update an existing point");
};

const deleteOnePoint  = (req, res) => {
  pointService.deleteOnePoint();
  res.send("Delete an existing point");
};

  
module.exports = {
    getAllPoints,
    getOnePoint,
    createNewPoint,
    updateOnePoint,
    deleteOnePoint,
  };
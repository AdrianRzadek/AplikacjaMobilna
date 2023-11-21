const express = require("express");
const pointService = require("../services/pointService");

const getAllPoints = (req, res) => {
  const allPoints = pointService.getAllPoints();
  res.send({ status: "OK", data: allPoints });
};

const getOnePoint = (req, res) => {
  const {
    params: { pointId },
  } = req;
  if (!pointId) {
    return res
      .status(400)
      .send({ status: "Bad Request", message: "Invalid pointId" });
      
    }try {
        const point = pointService.getOnePoint(pointId);
        res.send({ status: "OK", data: point });
      } catch (error) {
        res
          .status(error?.status || 500)
          .send({ status: "FAILED", data: { error: error?.message || error } });
      }
    };

const createNewPoint = (req, res) => {
  const { body } = req;
  if (!body.id) {
    res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'name', 'mode', 'equipment', 'exercises', 'trainerTips'",
      },
    });
    return;
  }

  const newPoint = {
    id: body.id,
    x: body.x,
    y: body.y,
  };
  try {
    const createdPoint = pointService.createNewPoint(newPoint);

    res.status(201).send({ status: "OK", data: createdPoint });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const updateOnePoint = (req, res) => {
  const {
    body,
    params: { pointId },
  } = req;
  if (!pointId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':workoutId' can not be empty" },
    });
  }
  try {
    const updatedPoint = pointService.updateOnePoint(pointId, body);
    res.send({ status: "OK", data: updatedPoint });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

const deleteOnePoint = (req, res) => {
  const {
    params: { pointId },
  } = req;
  if (!pointId) {
    res.status(400).send({
      status: "FAILED",
      data: { error: "Parameter ':workoutId' can not be empty" },
    });
  }
  try {
    pointService.deleteOnePoint(pointId);
    res.status(204).send({ status: "OK" });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILED", data: { error: error?.message || error } });
  }
};

module.exports = {
  getAllPoints,
  getOnePoint,
  createNewPoint,
  updateOnePoint,
  deleteOnePoint,
};

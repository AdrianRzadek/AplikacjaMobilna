const { v4: uuid } = require("uuid");
const Point = require("../database/Point");

const getAllPoints = () => {
  try {
    const allPoints = Point.getAllPoints();
    return allPoints;
  } catch (error) {
    throw error;
  }
};

const getOnePoint = (pointId) => {
  try {
    const point = Point.getOnePoint(pointId);
    return point;
  } catch (error) {
    throw error;
  }
};

const createNewPoint = (newPoint) => {
  const pointToInsert = {
    ...newPoint,
    id: uuid(),
    createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
  };
  try {
    const createdPoint = Point.createNewPoint(pointToInsert);
    return createdPoint;
  } catch (error) {
    throw error;
  }
};

const updateOnePoint = (pointId, changes) => {
  try {
    const updatedPoint = Point.updateOnePoint(pointId, changes);
    return updatedPoint;
  } catch (error) {
    throw error;
  }
};

const deleteOnePoint = (pointId) => {
  try {
    Point.deleteOnePoint(pointId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllPoints,
  getOnePoint,
  createNewPoint,
  updateOnePoint,
  deleteOnePoint,
};

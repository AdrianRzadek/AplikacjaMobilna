const DB = require("./db.json");

const { saveToDatabase } = require("./utils");

const getAllPoints = () => {
  try {
  return DB.points;
} catch (error) {
  throw { status: 500, message: error };
}
};
const getOnePoint = (pointId) => {
  try {
  const point = DB.points.find((point) => point.id === pointId);
  if (!point) {
    throw {
      status: 400,
      message: `Can't find point with the id '${pointId}'`,
    };
   
  }
  return point;
} catch (error) {
  throw { status: error?.status || 500, message: error?.message || error };
}
};
const createNewPoint = (newPoint) => {
  try {
  const isAlreadyAdded =
    DB.points.findIndex((point) => point.name === newPoint.name) > -1;
  if (isAlreadyAdded) {
    throw {
      status: 400,
      message: `Point with the name '${newPoint.name}' already exists`,
    };
  }
 
  DB.points.push(newPoint);
  saveToDatabase(DB);
  return newPoint;
} catch (error) {
  throw { status: 500, message: error?.message || error };
}
};
const updateOnePoint = (pointId, changes) => {
  try {
    const isAlreadyAdded =
      DB.points.findIndex((point) => point.name === changes.name) > -1;
    if (isAlreadyAdded) {
      throw {
        status: 400,
        message: `Point with the name '${changes.name}' already exists`,
      };
    }
    const indexForUpdate = DB.points.findIndex(
      (point) => point.id === pointId
    );
    if (indexForUpdate === -1) {
      throw {
        status: 400,
        message: `Can't find point with the id '${pointId}'`,
      };
    }
    const updatedPoint = {
      ...DB.points[indexForUpdate],
      ...changes,
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    DB.points[indexForUpdate] = updatedPoint;
    saveToDatabase(DB);
    return updatedPoint;
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
};

const deleteOnePoint = (pointId) => {
  try {
const indexForDeletion = DB.points.findIndex(
  (point) => point.id === pointId
);
if (indexForDeletion === -1) {
  throw {
    status: 400,
    message: `Can't find workout with the id '${pointId}'`,
  };
}
DB.points.splice(indexForDeletion, 1);
saveToDatabase(DB);
} catch (error) {
  throw { status: error?.status || 500, message: error?.message || error };
}
};

/**
 * @openapi
 * components:
 *   schemas:
 *    Point:
 *       type: object
 *       properties:
 *       
 *        
 */

module.exports = { 
  getAllPoints,
  getOnePoint,
  deleteOnePoint,
  updateOnePoint,
  createNewPoint,

};
import { Request, Response } from 'express';
import * as pointService from "../services/pointService";
const getAllPoints = (req: Request, res: Response): void => {
  const allPoints = pointService.getAllPoints();
  res.send("Get all workouts");
};

const getOnePoint = (req: Request, res: Response): void => {
  const point = pointService.getOnePoint();
  res.send("Get an existing point");
};

const createNewPoint = (req: Request, res: Response): void => {
  const createdpoint = pointService.createNewPoint();
  res.send("Create a new point");
};

const updateOnePoint = (req: Request, res: Response): void => {
  const updatedpoint = pointService.updateOnePoint();
  res.send("Update an existing point");
};

const deleteOnePoint = (req: Request, res: Response): void => {
  pointService.deleteOnePoint();
  res.send("Delete an existing point");
};

  
export  {
    getAllPoints,
    getOnePoint,
    createNewPoint,
    updateOnePoint,
    deleteOnePoint,
  };
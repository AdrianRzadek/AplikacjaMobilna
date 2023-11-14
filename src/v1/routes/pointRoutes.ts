// In src/v1/routes/workoutRoutes.js
import express from 'express';

import * as pointController from "../../controllers/pointController";
const router = express.Router();



router.get("/", pointController.getAllPoints);

router.get("/:pointId", pointController.getOnePoint);

router.post("/", pointController.createNewPoint);

router.patch("/:pointId", pointController.updateOnePoint);

router.delete("/:pointId", pointController.deleteOnePoint);


module.exports = router;
// In src/v1/routes/workoutRoutes.js
const express = require("express");
const pointController = require("../../controllers/pointController");
const router = express.Router();

/**
 * @openapi
 * /api/v1/points:
 *   get:
 *     tags:
 *       - Points
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *         description: The mode of a point
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 *                   items: 
 *                     $ref: "#/components/schemas/Point"
 *       5XX:
 *         description: FAILED
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: 
 *                   type: string
 *                   example: FAILED
 *                 data:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: string 
 *                       example: "Some error message"
 *  */


router.get("/", pointController.getAllPoints);

router.get("/:pointId", pointController.getOnePoint);

router.post("/", pointController.createNewPoint);

router.patch("/:pointId", pointController.updateOnePoint);

router.delete("/:pointId", pointController.deleteOnePoint);




module.exports = router;
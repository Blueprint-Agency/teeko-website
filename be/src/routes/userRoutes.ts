import express from "express";
import { getPointsAndStreak, addReserveRestaurantPoints } from "../controllers/userController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/points", authenticateToken, getPointsAndStreak);
router.post("/points/reserve-restaurant", authenticateToken, addReserveRestaurantPoints);

export default router;

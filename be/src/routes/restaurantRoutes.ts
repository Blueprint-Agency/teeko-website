import { Router } from "express";
import { getRestaurants, createRestaurant, getRestaurantBySlug } from "../controllers/restaurantController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/:slug", getRestaurantBySlug);
router.post("/", requireAdmin, createRestaurant);

export default router;

import { Router } from "express";
import { getRestaurants, createRestaurant, getRestaurantBySlug, updateRestaurant, getRestaurantById } from "../controllers/restaurantController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/:slug", getRestaurantBySlug);
router.get("/id/:id", getRestaurantById);
router.post("/", requireAdmin, createRestaurant);
router.patch("/:id", requireAdmin, updateRestaurant);

export default router;

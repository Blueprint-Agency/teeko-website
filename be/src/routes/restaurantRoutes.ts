import { Router } from "express";
import { getRestaurants, createRestaurant, getRestaurantBySlug, updateRestaurant, getRestaurantById, createRestaurantByTripAdvisorID, getRestaurantByTripAdvisorID, getRestaurantStatsByGoogleSearchQuery, getRestaurantShortVideosBySearchQuery } from "../controllers/restaurantController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/:slug", getRestaurantBySlug);
router.get("/id/:id", getRestaurantById);
router.get("/tripadvisor/:tripAdvisorID", requireAdmin, getRestaurantByTripAdvisorID);
router.get('/google/stats/:searchQuery', requireAdmin, getRestaurantStatsByGoogleSearchQuery)
router.get('/shortVideos/:searchQuery', requireAdmin, getRestaurantShortVideosBySearchQuery)
router.post("/", requireAdmin, createRestaurant);
router.post("/:tripAdvisorID", requireAdmin, createRestaurantByTripAdvisorID)
router.patch("/:id", requireAdmin, updateRestaurant);

export default router;

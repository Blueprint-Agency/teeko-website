import { Router } from "express";
import { getLocations, createLocation, getLocationBySlug, updateLocation } from "../controllers/locationController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getLocations);
router.get("/:slug", requireAdmin, getLocationBySlug);
router.post("/", requireAdmin, createLocation);
router.patch("/:id", requireAdmin, updateLocation);

export default router;

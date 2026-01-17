import { Router } from "express";
import { getLocations, createLocation, getLocationBySlug } from "../controllers/locationController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getLocations);
router.get("/:slug", getLocationBySlug);
router.post("/", requireAdmin, createLocation);

export default router;

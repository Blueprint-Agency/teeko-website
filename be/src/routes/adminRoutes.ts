import { Router } from "express";
import { getStats } from "../controllers/adminController";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/stats", requireAdmin, getStats);
router.get("/settings", getSettings); // Publicly accessible for metadata
router.patch("/settings", requireAdmin, updateSettings);

export default router;

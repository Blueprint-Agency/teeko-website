import { Router } from "express";
import { getStats } from "../controllers/adminController";
import { getSettings, updateSettings, uploadFavicon } from "../controllers/settingsController";
import { adminLogin } from "../controllers/authController";
import { requireAdmin } from "../middleware/authMiddleware";
import locationRoutes from "./locationRoutes";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/stats", requireAdmin, getStats);
router.get("/settings", getSettings); // Publicly accessible for metadata
router.patch("/settings", requireAdmin, updateSettings);
router.post("/settings/upload", requireAdmin, upload.single("image"), uploadFavicon);
router.post("/auth/login", adminLogin);

router.use("/locations", locationRoutes);

export default router;


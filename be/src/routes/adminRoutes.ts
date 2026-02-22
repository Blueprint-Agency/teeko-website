import { Router } from "express";
import { getStats, getUsers, verifyUser, createAdmin, updateAdminPermissions, deleteAdmin, requestPasswordChangeCode, verifyPasswordChangeAndSet, deleteUser } from "../controllers/adminController";
import { getSettings, updateSettings, uploadFavicon } from "../controllers/settingsController";
import { adminLogin } from "../controllers/authController";
import { requireAdmin, requireSuperAdmin } from "../middleware/authMiddleware";
import locationRoutes from "./locationRoutes";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.get("/stats", requireAdmin, getStats);
router.get("/users", requireAdmin, getUsers);
router.post("/users/:userId/verify", requireAdmin, verifyUser);
router.delete("/users/:userId", requireAdmin, deleteUser);

// Admin Management (Superadmin only)
router.post("/admins", requireSuperAdmin, createAdmin);
router.patch("/admins/:userId", requireSuperAdmin, updateAdminPermissions);
router.delete("/admins/:userId", requireSuperAdmin, deleteAdmin);

// Profile Settings
router.post("/profile/password-code", requireAdmin, requestPasswordChangeCode);
router.post("/profile/change-password", requireAdmin, verifyPasswordChangeAndSet);
router.get("/settings", getSettings); // Publicly accessible for metadata
router.patch("/settings", requireAdmin, updateSettings);
router.post("/settings/upload", requireAdmin, upload.single("image"), uploadFavicon);
router.post("/auth/login", adminLogin);

router.use("/locations", locationRoutes);

export default router;


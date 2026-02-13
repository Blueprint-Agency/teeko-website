import { Router } from "express";
import { getStats } from "../controllers/adminController";
import { getSettings, updateSettings } from "../controllers/settingsController";
import {
    getSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    getPublicSnippets
} from "../controllers/snippetController";
import { adminLogin } from "../controllers/authController";
import { requireAdmin } from "../middleware/authMiddleware";
import locationRoutes from "./locationRoutes";

const router = Router();

router.get("/stats", requireAdmin, getStats);
router.get("/settings", getSettings); // Publicly accessible for metadata
router.patch("/settings", requireAdmin, updateSettings);
router.post("/auth/login", adminLogin);

// Snippet Management
router.get("/snippets", requireAdmin, getSnippets);
router.post("/snippets", requireAdmin, createSnippet);
router.patch("/snippets/:id", requireAdmin, updateSnippet);
router.delete("/snippets/:id", requireAdmin, deleteSnippet);
router.get("/public/snippets", getPublicSnippets); // Publicly accessible

router.use("/locations", locationRoutes);

export default router;

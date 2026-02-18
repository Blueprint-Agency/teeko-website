import { Router } from "express";
import {
    getProviders,
    createProvider,
    updateProvider,
    deleteProvider,
    getPackages,
    getPublishedPackages,
    getPackageBySlug,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
    uploadSimImage,
    getContentTemplates,
    getContentTemplateById,
    createContentTemplate,
    updateContentTemplate,
    deleteContentTemplate,
} from "../controllers/simController";
import { requireAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

// Provider routes
router.get("/providers", getProviders); // Public - for filtering
router.post("/providers", requireAdmin, createProvider); // Admin only
router.patch("/providers/:id", requireAdmin, updateProvider); // Admin only
router.delete("/providers/:id", requireAdmin, deleteProvider); // Admin only

// Package routes
router.get("/packages", getPublishedPackages); // Public - published only
router.get("/packages/all", requireAdmin, getPackages); // Admin - all packages
router.get("/packages/slug/:slug", getPackageBySlug); // Public - by slug
router.get("/packages/id/:id", requireAdmin, getPackageById); // Admin - by ID
router.post("/packages", requireAdmin, createPackage);
router.post("/packages/upload", requireAdmin, upload.single("image"), uploadSimImage);
router.patch("/packages/:id", requireAdmin, updatePackage);
router.delete("/packages/:id", requireAdmin, deletePackage);

// Content Template routes
router.get("/content-templates", requireAdmin, getContentTemplates);
router.get("/content-templates/:id", requireAdmin, getContentTemplateById);
router.post("/content-templates", requireAdmin, createContentTemplate);
router.patch("/content-templates/:id", requireAdmin, updateContentTemplate);
router.delete("/content-templates/:id", requireAdmin, deleteContentTemplate);

export default router;

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
} from "../controllers/simController";
import { requireAdmin } from "../middleware/authMiddleware";

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
router.patch("/packages/:id", requireAdmin, updatePackage);
router.delete("/packages/:id", requireAdmin, deletePackage);

export default router;

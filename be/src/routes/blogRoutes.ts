import { Router } from "express";
import {
    getAllPosts,
    getPublishedPosts,
    getPostBySlug,
    getPostById,
    createPost,
    updatePost,
    moveToBin,
    deletePost,
} from "../controllers/blogController";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/posts", getPublishedPosts); // Get published posts
router.get("/posts/slug/:slug", getPostBySlug); // Get post by slug

// Admin routes
router.get("/posts/all", requireAdmin, getAllPosts); // Get all posts (including drafts and bin)
router.get("/posts/id/:id", requireAdmin, getPostById); // Get post by ID
router.post("/posts", requireAdmin, createPost);
router.patch("/posts/:id", requireAdmin, updatePost);
router.patch("/posts/:id/bin", requireAdmin, moveToBin); // Soft delete
router.delete("/posts/:id", requireAdmin, deletePost); // Hard delete

export default router;

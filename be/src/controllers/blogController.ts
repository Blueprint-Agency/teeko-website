import { Request, Response } from "express";
import { db } from "../db";
import { blogPosts, blogContentBlocks } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";

// Get all blog posts (admin)
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get published blog posts (public)
export const getPublishedPosts = async (req: Request, res: Response) => {
    try {
        const posts = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.status, "PUBLISHED"))
            .orderBy(desc(blogPosts.publishedAt));

        res.json(posts);
    } catch (error) {
        console.error("Error fetching published posts:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get blog post by slug (public)
export const getPostBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
        const [post] = await db
            .select()
            .from(blogPosts)
            .where(and(eq(blogPosts.slug, slug as string), eq(blogPosts.status, "PUBLISHED")));

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        // Get content blocks
        const blocks = await db
            .select()
            .from(blogContentBlocks)
            .where(eq(blogContentBlocks.blogPostId, post.id))
            .orderBy(blogContentBlocks.orderIndex);

        res.json({ ...post, contentBlocks: blocks });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get blog post by ID (admin)
export const getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id as string));

        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        // Get content blocks
        const blocks = await db
            .select()
            .from(blogContentBlocks)
            .where(eq(blogContentBlocks.blogPostId, id as string))
            .orderBy(blogContentBlocks.orderIndex);

        res.json({ ...post, contentBlocks: blocks });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create blog post
export const createPost = async (req: Request, res: Response) => {
    const { title, slug, metaDescription, featureImage, status, contentBlocks } = req.body;

    try {
        const [newPost] = await db
            .insert(blogPosts)
            .values({
                title,
                slug,
                metaDescription,
                featureImage,
                status: status || "DRAFT",
                authorId: (req as any).user?.id, // From auth middleware
                publishedAt: status === "PUBLISHED" ? new Date() : null,
            })
            .returning();

        // Insert content blocks if provided
        if (contentBlocks && Array.isArray(contentBlocks)) {
            await db.insert(blogContentBlocks).values(
                contentBlocks.map((block: any, index: number) => ({
                    blogPostId: newPost.id,
                    blockType: block.blockType,
                    content: block.content,
                    orderIndex: String(index),
                }))
            );
        }

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update blog post
export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, metaDescription, featureImage, status, contentBlocks } = req.body;

    try {
        // Check if status is changing to PUBLISHED
        const [existingPost] = await db.select().from(blogPosts).where(eq(blogPosts.id, id as string));

        const publishedAt =
            status === "PUBLISHED" && existingPost?.status !== "PUBLISHED"
                ? new Date()
                : existingPost?.publishedAt;

        const [updated] = await db
            .update(blogPosts)
            .set({
                title,
                slug,
                metaDescription,
                featureImage,
                status,
                publishedAt,
                updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, id as string))
            .returning();

        if (!updated) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        // Update content blocks
        if (contentBlocks && Array.isArray(contentBlocks)) {
            // Delete existing blocks
            await db.delete(blogContentBlocks).where(eq(blogContentBlocks.blogPostId, id as string));

            // Insert new blocks
            await db.insert(blogContentBlocks).values(
                contentBlocks.map((block: any, index: number) => ({
                    blogPostId: id as string,
                    blockType: block.blockType,
                    content: block.content,
                    orderIndex: String(index),
                }))
            );
        }

        res.json(updated);
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Soft delete (move to bin)
export const moveToBin = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const [updated] = await db
            .update(blogPosts)
            .set({ status: "BIN", updatedAt: new Date() })
            .where(eq(blogPosts.id, id as string))
            .returning();

        if (!updated) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.json({ message: "Post moved to bin" });
    } catch (error) {
        console.error("Error moving post to bin:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Hard delete
export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Delete content blocks first
        await db.delete(blogContentBlocks).where(eq(blogContentBlocks.blogPostId, id as string));

        // Delete post
        await db.delete(blogPosts).where(eq(blogPosts.id, id as string));

        res.json({ message: "Post deleted permanently" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

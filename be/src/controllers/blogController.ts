import { Request, Response } from "express";
import { db } from "../db";
import { blogPosts, blogContentBlocks, restaurants, locations, restaurantImages, restaurantStats } from "../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { uploadImageToR2 } from "../utils/upload";

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
            .orderBy(sql`CAST(${blogContentBlocks.orderIndex} AS INTEGER)`);

        // Enrich blocks with linked entities
        const enrichedBlocks = await Promise.all(
            blocks.map(async (block) => {
                let suggestions = null;
                let linkedEntity = null;

                if (block.restaurantId) {
                    // Fetch specific restaurant
                    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, block.restaurantId));
                    if (restaurant) {
                        const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, restaurant.id));
                        const [stats] = await db.select().from(restaurantStats).where(eq(restaurantStats.restaurantId, restaurant.id));
                        linkedEntity = { ...restaurant, images, stats };
                    }
                } else if (block.locationId) {
                    // Fetch location info and top restaurants
                    const [location] = await db.select().from(locations).where(eq(locations.id, block.locationId));
                    if (location) {
                        const topRestaurants = await db.select().from(restaurants).where(eq(restaurants.locationId, location.id)).limit(10);
                        // Enrich these top restaurants with images
                        const enrichedTop = await Promise.all(topRestaurants.map(async (r) => {
                            const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, r.id));
                            const [stats] = await db.select().from(restaurantStats).where(eq(restaurantStats.restaurantId, r.id));
                            return { ...r, images, stats };
                        }));
                        linkedEntity = location;
                        suggestions = enrichedTop;
                    }
                }

                return {
                    ...block,
                    linkedEntity,
                    suggestions
                };
            })
        );

        res.json({ ...post, contentBlocks: enrichedBlocks });
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
            .orderBy(sql`CAST(${blogContentBlocks.orderIndex} AS INTEGER)`);

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
        console.log("Creating post with featureImage:", featureImage);
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
                    locationId: block.locationId,
                    restaurantId: block.restaurantId,
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

        console.log("Updating post", id, "with featureImage:", featureImage);
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
                    locationId: block.locationId,
                    restaurantId: block.restaurantId,
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

// Upload blog image
export const uploadBlogImage = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const { blogPostId } = req.body;

        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const imageUrl = await uploadImageToR2(file, "blogs");
        console.log("Uploaded image to R2, returning URL:", imageUrl);

        // If blogPostId is provided (e.g. from Edit page), update DB immediately
        if (blogPostId) {
            console.log("Immediate DB update for blog post", blogPostId, "with URL:", imageUrl);
            await db
                .update(blogPosts)
                .set({ featureImage: imageUrl, updatedAt: new Date() })
                .where(eq(blogPosts.id, blogPostId));
        }

        res.json({ url: imageUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

import { Request, Response } from "express";
import { db } from "../db";
import { appSnippets } from "../db/schema";
import { eq } from "drizzle-orm";

export const getSnippets = async (req: Request, res: Response) => {
    try {
        const snippets = await db.select().from(appSnippets).orderBy(appSnippets.createdAt);
        res.json(snippets);
    } catch (error) {
        console.error("Error fetching snippets:", error);
        res.status(500).json({ message: "Failed to fetch snippets" });
    }
};

export const createSnippet = async (req: Request, res: Response) => {
    try {
        const { name, content, position, target, pagePath, isActive } = req.body;

        if (!name || !content || !position || !target) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const [newSnippet] = await db.insert(appSnippets).values({
            name,
            content,
            position,
            target,
            pagePath: target === "SPECIFIC_PAGE" ? pagePath : null,
            isActive: isActive ?? true,
        }).returning();

        res.status(201).json(newSnippet);
    } catch (error) {
        console.error("Error creating snippet:", error);
        res.status(500).json({ message: "Failed to create snippet" });
    }
};

export const updateSnippet = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, content, position, target, pagePath, isActive } = req.body;

        const [updatedSnippet] = await db.update(appSnippets)
            .set({
                name,
                content,
                position,
                target,
                pagePath: target === "SPECIFIC_PAGE" ? pagePath : null,
                isActive,
                updatedAt: new Date(),
            })
            .where(eq(appSnippets.id, id))
            .returning();

        if (!updatedSnippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        res.json(updatedSnippet);
    } catch (error) {
        console.error("Error updating snippet:", error);
        res.status(500).json({ message: "Failed to update snippet" });
    }
};

export const deleteSnippet = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const [deletedSnippet] = await db.delete(appSnippets)
            .where(eq(appSnippets.id, id))
            .returning();

        if (!deletedSnippet) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        res.json({ message: "Snippet deleted successfully" });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        res.status(500).json({ message: "Failed to delete snippet" });
    }
};

export const getPublicSnippets = async (req: Request, res: Response) => {
    try {
        const snippets = await db.select().from(appSnippets).where(eq(appSnippets.isActive, true));
        res.json(snippets);
    } catch (error) {
        console.error("Error fetching public snippets:", error);
        res.status(500).json({ message: "Failed to fetch snippets" });
    }
};

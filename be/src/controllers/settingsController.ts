import { Request, Response } from "express";
import { db } from "../db";
import { settings } from "../db/schema";
import { eq } from "drizzle-orm";

export const getSettings = async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(settings).limit(1);
        if (result.length === 0) {
            // Initialize settings if not exists
            const [newSettings] = await db.insert(settings).values({}).returning();
            res.json(newSettings);
            return;
        }
        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    const { siteTitle, siteDescription, faviconUrl } = req.body;

    try {
        const existing = await db.select().from(settings).limit(1);
        if (existing.length === 0) {
            const [newSettings] = await db.insert(settings).values({
                siteTitle,
                siteDescription,
                faviconUrl
            }).returning();
            res.json(newSettings);
        } else {
            const [updated] = await db
                .update(settings)
                .set({
                    siteTitle,
                    siteDescription,
                    faviconUrl,
                    updatedAt: new Date()
                })
                .where(eq(settings.id, existing[0].id))
                .returning();
            res.json(updated);
        }
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

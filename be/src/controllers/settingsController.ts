import { Request, Response } from "express";
import { db } from "../db";
import { settings } from "../db/schema";
import { eq } from "drizzle-orm";
import { uploadImageToR2 } from "../utils/upload";

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
    const { siteTitle, siteDescription, faviconUrl, maintenanceMode, googleIndexing } = req.body;

    try {
        const existing = await db.select().from(settings).limit(1);
        if (existing.length === 0) {
            const [newSettings] = await db.insert(settings).values({
                siteTitle,
                siteDescription,
                faviconUrl,
                maintenanceMode: maintenanceMode ?? false,
                googleIndexing: googleIndexing ?? true
            }).returning();
            res.json(newSettings);
        } else {
            const [updated] = await db
                .update(settings)
                .set({
                    siteTitle,
                    siteDescription,
                    faviconUrl,
                    maintenanceMode: maintenanceMode ?? existing[0].maintenanceMode,
                    googleIndexing: googleIndexing ?? existing[0].googleIndexing,
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

export const uploadFavicon = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const imageUrl = await uploadImageToR2(file, "settings");
        console.log("Uploaded favicon to R2, returning URL:", imageUrl);

        // Update settings immediately
        const existing = await db.select().from(settings).limit(1);
        if (existing.length > 0) {
            await db
                .update(settings)
                .set({ faviconUrl: imageUrl, updatedAt: new Date() })
                .where(eq(settings.id, existing[0].id));
        } else {
            await db.insert(settings).values({ faviconUrl: imageUrl }).returning();
        }

        res.json({ url: imageUrl });
    } catch (error) {
        console.error("Error uploading favicon:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

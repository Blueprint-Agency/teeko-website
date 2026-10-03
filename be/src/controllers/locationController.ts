import { Request, Response } from "express";
import { db } from "../db";
import { locations } from "../db/schema";
import { eq } from "drizzle-orm";
import { sanitizeTranslations } from "../utils/translations";

const LOCATION_TRANSLATED_FIELDS = { seoTitle: "string", seoDescription: "string" } as const;

export const getLocations = async (req: Request, res: Response) => {
    try {
        const allLocations = await db.select().from(locations);
        res.json(allLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createLocation = async (req: Request, res: Response) => {
    const { name, slug, seoTitle, seoDescription } = req.body;
    const translations = sanitizeTranslations(req.body.translations, LOCATION_TRANSLATED_FIELDS);

    try {
        const newLocation = await db
            .insert(locations)
            .values({
                name,
                slug,
                seoTitle,
                seoDescription,
                translations,
            })
            .returning();

        res.status(201).json(newLocation[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLocationBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const location = await db.select().from(locations).where(eq(locations.slug, slug as string));
        if (location.length === 0) {
            res.status(404).json({ message: "Location not found" });
            return;
        }
        res.json(location[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, seoTitle, seoDescription } = req.body;
    const translations = sanitizeTranslations(req.body.translations, LOCATION_TRANSLATED_FIELDS);

    try {
        const [updatedLocation] = await db
            .update(locations)
            .set({
                name,
                slug,
                seoTitle,
                seoDescription,
                translations,
            })
            .where(eq(locations.id, id as string))
            .returning();

        if (!updatedLocation) {
            res.status(404).json({ message: "Location not found" });
            return;
        }

        res.json(updatedLocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

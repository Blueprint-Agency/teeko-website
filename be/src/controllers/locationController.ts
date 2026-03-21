import { Request, Response } from "express";
import { db } from "../db";
import { locations } from "../db/schema";
import { eq } from "drizzle-orm";

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

    try {
        const newLocation = await db
            .insert(locations)
            .values({
                name,
                slug,
                seoTitle,
                seoDescription,
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

    try {
        const [updatedLocation] = await db
            .update(locations)
            .set({
                name,
                slug,
                seoTitle,
                seoDescription,
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

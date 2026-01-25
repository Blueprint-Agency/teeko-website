import { Request, Response } from "express";
import { db } from "../db";
import { restaurants, locations, users } from "../db/schema";
import { sql } from "drizzle-orm";

export const getStats = async (req: Request, res: Response) => {
    try {
        const [restaurantCount] = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
        const [locationCount] = await db.select({ count: sql<number>`count(*)` }).from(locations);
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

        res.json({
            restaurants: Number(restaurantCount.count),
            locations: Number(locationCount.count),
            users: Number(userCount.count),
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Server error while fetching stats" });
    }
};

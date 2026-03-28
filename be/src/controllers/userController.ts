import { Request, Response } from "express";
import { db } from "../db";
import { users, pointHistory, restaurants } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { addPoints } from "../utils/points";

interface AuthRequest extends Request {
    user?: any;
}

export const getPointsAndStreak = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;

    try {
        const userResult = await db.select({
            points: users.points,
            currentStreak: users.currentStreak,
            longestStreak: users.longestStreak,
            lastLoginAt: users.lastLoginAt
        }).from(users).where(eq(users.id, userId));

        if (userResult.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const history = await db.select()
            .from(pointHistory)
            .where(eq(pointHistory.userId, userId))
            .orderBy(desc(pointHistory.createdAt))
            .limit(50); // get last 50 points history max

        res.json({
            stats: userResult[0],
            history
        });
    } catch (error) {
        console.error("Error fetching point history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addReserveRestaurantPoints = async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const { restaurantId } = req.body;

    try {
        let event = "Reserved Restaurant Table";

        if (restaurantId) {
            const restaurantResult = await db.select({ name: restaurants.name })
                .from(restaurants)
                .where(eq(restaurants.id, restaurantId));
            if (restaurantResult.length > 0) {
                event = `Reserved Table at ${restaurantResult[0].name}`;
            }
        }

        const success = await addPoints(userId, event, 5);

        if (success) {
            res.status(200).json({ message: "Points added successfully", pointsEarned: 5 });
        } else {
            res.status(500).json({ message: "Failed to add points" });
        }
    } catch (error) {
        console.error("Error adding reservation points:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

export const getUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await db.select({
            id: users.id,
            email: users.email,
            role: users.role,
            isVerified: users.isVerified,
            createdAt: users.createdAt,
            hasPassword: sql<boolean>`CASE WHEN ${users.passwordHash} IS NOT NULL THEN TRUE ELSE FALSE END`,
            hasGoogle: sql<boolean>`CASE WHEN ${users.googleId} IS NOT NULL THEN TRUE ELSE FALSE END`,
        }).from(users).orderBy(sql`${users.createdAt} DESC`);

        const usersWithMethod = allUsers.map(user => {
            let method = "Unknown";
            if (user.hasPassword && user.hasGoogle) {
                method = "Both";
            } else if (user.hasPassword) {
                method = "Email/Password";
            } else if (user.hasGoogle) {
                method = "Google";
            }

            return {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                method: method
            };
        });

        res.json(usersWithMethod);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const [updatedUser] = await db.update(users)
            .set({
                isVerified: true,
                verificationCode: null,
                verificationExpires: null,
                verificationToken: null
            })
            .where(sql`${users.id} = ${userId}`)
            .returning();

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User verified successfully", user: updatedUser });
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).json({ message: "Server error while verifying user" });
    }
};

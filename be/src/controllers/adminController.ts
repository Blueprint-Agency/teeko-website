import { Request, Response } from "express";
import { db } from "../db";
import { restaurants, locations, users } from "../db/schema";
import { sql, eq, isNull } from "drizzle-orm";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/email";

export const getStats = async (req: Request, res: Response) => {
    try {
        const [restaurantCount] = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
        const [locationCount] = await db.select({ count: sql<number>`count(*)` }).from(locations);
        const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users).where(isNull(users.deletedAt));

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
            permissions: users.permissions,
            createdAt: users.createdAt,
            hasPassword: sql<boolean>`CASE WHEN ${users.passwordHash} IS NOT NULL THEN TRUE ELSE FALSE END`,
            hasGoogle: sql<boolean>`CASE WHEN ${users.googleId} IS NOT NULL THEN TRUE ELSE FALSE END`,
        }).from(users).where(isNull(users.deletedAt)).orderBy(sql`${users.createdAt} DESC`);

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
                permissions: user.permissions,
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
        const { userId } = req.params as { userId: string };

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

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password, permissions } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const existingUser = await db.select().from(users).where(sql`lower(${users.email}) = lower(${email})`).limit(1);
        if (existingUser[0]) {
            res.status(400).json({ message: "An account with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newAdmin] = await db.insert(users).values({
            email,
            passwordHash: hashedPassword,
            role: "ADMIN",
            permissions: permissions || {
                userManagement: false,
                blogManagement: false,
                simManagement: false,
                restaurantManagement: false,
                generalSettings: false
            },
            isVerified: true
        }).returning();

        res.status(201).json({ message: "Admin created successfully", user: newAdmin });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Server error while creating admin" });
    }
};

export const updateAdminPermissions = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: string };
        const { permissions, role } = req.body;

        const updateData: any = {};
        if (permissions) updateData.permissions = permissions;
        if (role) updateData.role = role;

        const [updatedUser] = await db.update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "Admin details updated", user: updatedUser });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: "Server error while updating admin" });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: string };

        const [deletedUser] = await db.update(users)
            .set({ deletedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "User soft-deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error while deleting user" });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params as { userId: string };

        const [deletedUser] = await db.update(users)
            .set({ deletedAt: new Date() })
            .where(eq(users.id, userId))
            .returning();

        if (!deletedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ message: "Admin soft-deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Server error while deleting admin" });
    }
};

export const requestPasswordChangeCode = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userResult[0];

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.update(users)
            .set({ verificationCode, verificationExpires })
            .where(eq(users.id, userId));

        await sendVerificationEmail(user.email, verificationCode);

        res.json({ message: "Verification code sent to your email" });
    } catch (error) {
        console.error("Error requesting password code:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyPasswordChangeAndSet = async (req: any, res: Response) => {
    try {
        const { code, newPassword } = req.body;
        const userId = req.user.id;

        const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        const user = userResult[0];

        if (!user || user.verificationCode !== code) {
            res.status(400).json({ message: "Invalid verification code" });
            return;
        }

        if (new Date() > (user.verificationExpires || new Date(0))) {
            res.status(400).json({ message: "Verification code has expired" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.update(users)
            .set({
                passwordHash: hashedPassword,
                verificationCode: null,
                verificationExpires: null
            })
            .where(eq(users.id, userId));

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error setting new password:", error);
        res.status(500).json({ message: "Server error" });
    }
};

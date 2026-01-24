import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../utils/email";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newUser = await db
            .insert(users)
            .values({
                email,
                passwordHash: hashedPassword,
                role: role || "USER",
                verificationToken,
            })
            .returning();

        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: "User registered. Please check your email to verify." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        if (!user.isVerified && user.role !== "ADMIN") {
            // Option: allow login but restrict access, or deny. 
            // For strict verification:
            res.status(403).json({ message: "Please verify your email first." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
    }

    try {
        const userResult = await db.select().from(users).where(eq(users.verificationToken, token as string));
        const user = userResult[0];

        if (!user) {
            res.status(400).json({ message: "Invalid token" });
            return;
        }

        await db
            .update(users)
            .set({ isVerified: true, verificationToken: null })
            .where(eq(users.id, user.id));

        res.json({ message: "Email verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

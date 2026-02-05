import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../utils/email";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const existingUserResult = await db.select().from(users).where(eq(users.email, email));
        const existingUser = existingUserResult[0];

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        if (existingUser) {
            if (existingUser.isVerified) {
                res.status(400).json({ message: "Email already in use" });
                return;
            } else {
                // Update existing unverified user with new code
                await db.update(users)
                    .set({
                        verificationCode,
                        verificationExpires,
                        passwordHash: await bcrypt.hash(password, 10)
                    })
                    .where(eq(users.id, existingUser.id));

                await sendVerificationEmail(email, verificationCode);
                res.status(200).json({ message: "Verification code sent. Please check your email." });
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db
            .insert(users)
            .values({
                email,
                passwordHash: hashedPassword,
                role: "USER",
                verificationCode,
                verificationExpires,
                isVerified: false,
            });

        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({ message: "User registered. Please check your email for verification code." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyCode = async (req: Request, res: Response) => {
    const { email, code } = req.body;

    try {
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ message: "User is already verified" });
            return;
        }

        if (user.verificationCode !== code) {
            res.status(400).json({ message: "Invalid verification code" });
            return;
        }

        if (new Date() > (user.verificationExpires || new Date(0))) {
            res.status(400).json({ message: "Verification code has expired" });
            return;
        }

        await db
            .update(users)
            .set({ isVerified: true, verificationCode: null, verificationExpires: null })
            .where(eq(users.id, user.id));

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "10h" }
        );

        res.json({
            message: "Email verified successfully",
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resendCode = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ message: "User is already verified" });
            return;
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        await db
            .update(users)
            .set({ verificationCode, verificationExpires })
            .where(eq(users.id, user.id));

        await sendVerificationEmail(email, verificationCode);

        res.json({ message: "New verification code sent" });
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

        if (!user.passwordHash) {
            res.status(400).json({ message: "This account uses Google Login. Please sign in with Google." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash as string);
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

export const adminLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const userResult = await db.select().from(users).where(eq(users.email, email));
        const user = userResult[0];

        if (!user) {
            res.status(403).json({ message: "Access denied. Admin credentials only." });
            return;
        }

        // Check for admin roles
        if (user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
            res.status(403).json({ message: "Access denied. Admin credentials only." });
            return;
        }

        if (!user.passwordHash) {
            res.status(403).json({ message: "Access denied." });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash as string);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "10h" } // Longer session for admin
        );

        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { sub: googleId, email } = payload;

        if (!email) {
            res.status(400).json({ message: "Google account must have an email" });
            return;
        }

        // Check if user exists
        let userResult = await db.select().from(users).where(eq(users.email, email));
        let user = userResult[0];

        if (user) {
            // Update googleId if not present
            if (!user.googleId) {
                await db.update(users).set({ googleId }).where(eq(users.id, user.id));
            }
        } else {
            // Create new user
            const newUser = await db.insert(users).values({
                email,
                googleId,
                isVerified: true, // Google emails are already verified
                role: "USER"
            }).returning();
            user = newUser[0];
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "10h" }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Google login failed" });
    }
};

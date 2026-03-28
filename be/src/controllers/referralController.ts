import { Request, Response } from "express";
import { db } from "../db";
import { users, userReferralCodes, referrals } from "../db/schema";
import { eq, aliasedTable } from "drizzle-orm";

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const getReferralStatus = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        // Get user's own referral code
        const codeResult = await db.select().from(userReferralCodes).where(eq(userReferralCodes.userId, userId));
        const userCode = codeResult[0]?.code;

        // Get user's referrer (who referred this user)
        const referrerTable = aliasedTable(users, "referrer");
        const referrerResult = await db.select({
            id: referrerTable.id,
            email: referrerTable.email,
        })
            .from(referrals)
            .innerJoin(referrerTable, eq(referrals.referrerId, referrerTable.id))
            .where(eq(referrals.refereeId, userId));

        const referrer = referrerResult[0] || null;

        res.json({
            referralCode: userCode,
            referredBy: referrer,
        });
    } catch (error: any) {
        console.error("error getting referral status", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const applyReferralCode = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { referralCode } = req.body;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!referralCode) {
        res.status(400).json({ message: "Referral code is required" });
        return;
    }

    try {
        // Check if user already has a referrer
        const existingReferral = await db.select().from(referrals).where(eq(referrals.refereeId, userId));
        if (existingReferral.length > 0) {
            res.status(400).json({ message: "You have already been referred by someone" });
            return;
        }

        // Find the owner of the referral code
        const referrerCodeResult = await db.select().from(userReferralCodes).where(eq(userReferralCodes.code, referralCode));
        const referrerEntry = referrerCodeResult[0];

        if (!referrerEntry) {
            res.status(400).json({ message: "Invalid referral code" });
            return;
        }

        if (referrerEntry.userId === userId) {
            res.status(400).json({ message: "You cannot refer yourself" });
            return;
        }

        // Create the referral link
        await db.insert(referrals).values({
            referrerId: referrerEntry.userId,
            refereeId: userId,
        });

        res.status(201).json({ message: "Referral code applied successfully" });
    } catch (error: any) {
        console.error("error applying referral code", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getReferees = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const refereeTable = aliasedTable(users, "referee");
        const results = await db.select({
            id: refereeTable.id,
            email: refereeTable.email,
            createdAt: referrals.createdAt
        })
            .from(referrals)
            .innerJoin(refereeTable, eq(referrals.refereeId, refereeTable.id))
            .where(eq(referrals.referrerId, userId));

        res.json(results);
    } catch (error: any) {
        console.error("error getting referees", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

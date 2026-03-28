import { db } from "../db";
import { users, pointHistory } from "../db/schema";
import { eq, sql } from "drizzle-orm";

export const addPoints = async (userId: string, event: string, pointsEarned: number) => {
    try {
        await db.transaction(async (tx) => {
            // Update user's points
            await tx.update(users)
                .set({
                    points: sql`${users.points} + ${pointsEarned}`
                })
                .where(eq(users.id, userId));

            // Record point history
            await tx.insert(pointHistory).values({
                userId,
                event,
                pointsEarned,
            });
        });
        return true;
    } catch (error) {
        console.error("Error adding points:", error);
        return false;
    }
};

export const handleUserLoginStreak = async (userId: string) => {
    try {
        const userResult = await db.select().from(users).where(eq(users.id, userId));
        const user = userResult[0];

        if (!user) return null;

        const now = new Date();

        let newStreak = user.currentStreak || 0;
        let pointsToAdd = 0;
        let streakUpdated = false;

        if (user.lastLoginAt) {
            const lastLoginDate = new Date(user.lastLoginAt);

            // Format both dates to `YYYY-MM-DD` in Malaysia Time
            const getMyaDateString = (date: Date) => {
                return new Intl.DateTimeFormat('en-CA', {
                    timeZone: 'Asia/Kuala_Lumpur',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).format(date);
            };

            const currentDateStr = getMyaDateString(now);
            const lastLoginDateStr = getMyaDateString(lastLoginDate);

            // Compare as plain dates
            const currentObj = new Date(currentDateStr);
            const lastObj = new Date(lastLoginDateStr);

            const timeDiff = currentObj.getTime() - lastObj.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

            if (daysDiff === 1) {
                // Consecutively logged in
                newStreak += 1;
                streakUpdated = true;
            } else if (daysDiff > 1) {
                // Streak broken
                newStreak = 1;
                streakUpdated = true;
            } else if (daysDiff === 0) {
                // Already logged in today (in Malaysia time), do nothing for streak
            }
        } else {
            // First time ever logging in (or at least first time recorded)
            newStreak = 1;
            streakUpdated = true;
        }

        const longestStreak = Math.max(user.longestStreak || 0, newStreak);

        // Add points if applicable
        if (streakUpdated) {
            await addPoints(userId, "Daily Login", 10);
            pointsToAdd += 10;

            if (newStreak > 1 && newStreak % 7 === 0) {
                await addPoints(userId, "7-Day Streak Bonus", 100);
                pointsToAdd += 100;
            }
        }

        // Update user
        await db.update(users)
            .set({
                currentStreak: newStreak,
                longestStreak: longestStreak,
                lastLoginAt: now,
            })
            .where(eq(users.id, userId));

        return {
            streakUpdated,
            newStreak,
            pointsAdded: pointsToAdd
        };
    } catch (error) {
        console.error("Error handling login streak:", error);
        return null;
    }
};

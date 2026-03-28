import bcrypt from "bcrypt";
import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export const seedAdmin = async () => {
    const adminUsername = process.env.SUPERADMIN_USERNAME;
    const adminPassword = process.env.SUPERADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
        console.warn("SUPERADMIN_USERNAME or SUPERADMIN_PASSWORD not set in environment variables. Skipping admin seed.");
        return;
    }

    try {
        // Try to find the unique superadmin by role
        const existingSuperAdmins = await db.select().from(users).where(eq(users.role, "SUPERADMIN")).limit(1);

        if (existingSuperAdmins.length === 0) {
            console.log("No SUPERADMIN found. Checking if configured email is available...");

            // Check if another user already has the intended superadmin email to avoid unique constraint violations
            const emailConflict = await db.select().from(users).where(eq(users.email, adminUsername)).limit(1);

            if (emailConflict.length > 0) {
                console.log(`User with email ${adminUsername} exists. Upgrading to SUPERADMIN...`);
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await db.update(users)
                    .set({
                        role: "SUPERADMIN",
                        passwordHash: hashedPassword,
                        isVerified: true
                    })
                    .where(eq(users.id, emailConflict[0].id));
                console.log(`✅ User upgraded to SUPERADMIN: ${adminUsername}`);
            } else {
                console.log("Creating new SUPERADMIN...");
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await db.insert(users).values({
                    email: adminUsername,
                    passwordHash: hashedPassword,
                    role: "SUPERADMIN",
                    isVerified: true,
                });
                console.log(`✅ SUPERADMIN account created: ${adminUsername}`);
            }
        } else {
            const admin = existingSuperAdmins[0];
            console.log(`SUPERADMIN found (${admin.email}). Synchronizing credentials...`);

            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await db.update(users)
                .set({
                    email: adminUsername, // Update email in case it changed in .env
                    passwordHash: hashedPassword,
                    isVerified: true,
                })
                .where(eq(users.id, admin.id));

            console.log(`✅ SUPERADMIN credentials synchronized for: ${adminUsername}`);
        }
    } catch (error) {
        console.error("❌ Error seeding SUPERADMIN account:", error);
    }
};

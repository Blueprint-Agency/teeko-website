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
        const existingAdmin = await db.select().from(users).where(eq(users.email, adminUsername));

        if (existingAdmin.length === 0) {
            console.log("Admin account not found. Creating...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await db.insert(users).values({
                email: adminUsername,
                passwordHash: hashedPassword,
                role: "ADMIN",
                isVerified: true,
            });
            console.log("✅ Admin account created successfully.");
        } else {
            console.log("Admin account already exists. Updating credentials...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await db.update(users)
                .set({
                    passwordHash: hashedPassword,
                    role: "ADMIN",
                    isVerified: true,
                })
                .where(eq(users.email, adminUsername));
            console.log("✅ Admin account updated successfully.");
        }
    } catch (error) {
        console.error("❌ Error seeding admin account:", error);
    }
};

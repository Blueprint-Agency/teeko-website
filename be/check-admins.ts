import { db } from "./src/db";
import { users } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function checkAdmins() {
    const allAdmins = await db.select().from(users).where(eq(users.role, "ADMIN"));
    const allSuperAdmins = await db.select().from(users).where(eq(users.role, "SUPERADMIN"));

    console.log("Admins:", allAdmins.map(u => u.email));
    console.log("SuperAdmins:", allSuperAdmins.map(u => u.email));

    if (allSuperAdmins.length === 0 && allAdmins.length > 0) {
        console.log("Promoting", allAdmins[0].email, "to SUPERADMIN for testing...");
        await db.update(users).set({ role: "SUPERADMIN" }).where(eq(users.id, allAdmins[0].id));
    }
}

checkAdmins().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });

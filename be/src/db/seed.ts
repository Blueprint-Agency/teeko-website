import { db } from "./index";
import { users, locations, restaurants, restaurantImages } from "./schema";
import bcrypt from "bcrypt";

async function main() {
    console.log("Seeding database...");

    // Clear existing data (optional, but good for idempotent seeding in dev)
    console.log("Clearing existing data...");
    await db.delete(restaurantImages);
    await db.delete(restaurants);
    await db.delete(locations);
    await db.delete(users);
    console.log("Data cleared.");

    // 1. Create Users
    const passwordHash = await bcrypt.hash("password123", 10);

    const [admin] = await db.insert(users).values({
        email: "admin@teeko.com",
        passwordHash,
        role: "ADMIN",
        isVerified: true,
    }).returning();

    const [user] = await db.insert(users).values({
        email: "user@teeko.com",
        passwordHash,
        role: "USER",
        isVerified: true,
    }).returning();

    console.log("Users created.");

    // 2. Create Locations
    const locationData = [
        { name: "Kuala Lumpur", slug: "kuala-lumpur", seoTitle: "Best Food in KL" },
        { name: "Penang", slug: "penang", seoTitle: "Penang Food Guide" },
        { name: "Johor Bahru", slug: "johor-bahru", seoTitle: "JB Food & Places" },
        { name: "Melaka", slug: "melaka", seoTitle: "Melaka Historical Food" },
    ];

    const createdLocations = await db.insert(locations).values(locationData).returning();
    console.log("Locations created.");

    // Map locations for easy access
    const kl = createdLocations.find(l => l.slug === "kuala-lumpur");
    const penang = createdLocations.find(l => l.slug === "penang");

    if (!kl || !penang) throw new Error("Locations not created correctly");

    // 3. Create Restaurants
    const restaurantData = [
        {
            name: "Nasi Kandar Pelita",
            slug: "nasi-kandar-pelita-kl",
            locationId: kl.id,
            description: "Famous Nasi Kandar chain in Malaysia. Open 24 hours.",
            address: "149, Jalan Ampang, Kuala Lumpur, 50450 Kuala Lumpur",
            priceRange: "$",
            contactInfo: { phone: "+60321625532" },
            reservationUrl: "https://www.google.com/search?q=nasi+kandar+pelita",
            seoTitle: "Nasi Kandar Pelita KL",
        },
        {
            name: "Madam Kwan's",
            slug: "madam-kwans-pavilion",
            locationId: kl.id,
            description: "Serving Malaysian cuisine since 1977. Famous for Nasi Lemak.",
            address: "Pavilion KL, 168, Jalan Bukit Bintang, 55100 Kuala Lumpur",
            priceRange: "$$",
            contactInfo: { website: "https://www.madamkwans.com.my" },
            reservationUrl: "https://www.madamkwans.com.my/reservation",
            seoTitle: "Madam Kwan's Pavilion KL",
        },
        {
            name: "Line Clear Nasi Kandar",
            slug: "line-clear-nasi-kandar-penang",
            locationId: penang.id,
            description: "Legendary Nasi Kandar spot in Penang, executing recipes since 1930.",
            address: "Corner of Chulia Street and Penang Road, George Town, Penang",
            priceRange: "$",
            seoTitle: "Line Clear Nasi Kandar Penang",
        },
    ];

    const createdRestaurants = await db.insert(restaurants).values(restaurantData).returning();
    console.log("Restaurants created.");

    // 4. Create Images
    const imageData = [
        {
            restaurantId: createdRestaurants[0].id, // Pelita
            url: "https://placehold.co/800x600?text=Pelita+Nasi+Kandar",
            caption: "Exterior view",
            isPrimary: true,
        },
        {
            restaurantId: createdRestaurants[1].id, // Madam Kwan's
            url: "https://placehold.co/800x600?text=Madam+Kwans",
            caption: "Signature Nasi Lemak",
            isPrimary: true,
        },
        {
            restaurantId: createdRestaurants[2].id, // Line Clear
            url: "https://placehold.co/800x600?text=Line+Clear",
            caption: "Busy lunchtime queue",
            isPrimary: true,
        }
    ];

    await db.insert(restaurantImages).values(imageData);
    console.log("Images created.");

    console.log("Database seeded successfully!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

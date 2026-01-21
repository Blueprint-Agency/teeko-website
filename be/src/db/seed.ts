import { db } from "./index";
import { users, locations, restaurants, restaurantImages, restaurantStats } from "./schema";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Starting consolidated database seed...");

    try {
        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await db.delete(restaurantImages);
        await db.delete(restaurants);
        await db.delete(locations);
        await db.delete(users);
        console.log("✅ Cleared existing data");

        // 1. Create Users
        console.log("👤 Creating users...");
        const passwordHash = await bcrypt.hash("password123", 10);

        await db.insert(users).values([
            {
                email: "admin@teeko.com",
                passwordHash,
                role: "ADMIN",
                isVerified: true,
            },
            {
                email: "user@teeko.com",
                passwordHash,
                role: "USER",
                isVerified: true,
            },
        ]);
        console.log("✅ Created users");

        // 2. Create Locations
        console.log("📍 Creating locations...");
        const [kualaLumpur, penang, johorBahru] = await db.insert(locations).values([
            {
                name: "Kuala Lumpur",
                slug: "kuala-lumpur",
                seoTitle: "Best Restaurants in Kuala Lumpur - Teeko",
                seoDescription: "Discover the best dining experiences in Kuala Lumpur, from street food to fine dining.",
                isIndexed: true,
            },
            {
                name: "Penang",
                slug: "penang",
                seoTitle: "Best Restaurants in Penang - Teeko",
                seoDescription: "Explore Penang's famous food scene with our curated restaurant recommendations.",
                isIndexed: true,
            },
            {
                name: "Johor Bahru",
                slug: "johor-bahru",
                seoTitle: "Best Restaurants in Johor Bahru - Teeko",
                seoDescription: "Find the best places to eat in Johor Bahru, Malaysia.",
                isIndexed: true,
            },
        ]).returning();

        console.log(`✅ Created ${[kualaLumpur, penang, johorBahru].length} locations`);

        // 3. Create Restaurants
        console.log("🍽️  Creating restaurants...");
        const restaurantData = [
            {
                name: "Iketeru Restaurant",
                slug: "iketeru-restaurant",
                locationId: kualaLumpur.id,
                tripAdvisorLocationId: "796300",
                description: "Embark on a gastronomic adventure that showcases the finest nuances of Japanese cuisine. With a dedicated team led by Chef Tokuhisa Naotaka, Iketeru stands as one of the city's culinary gems, renowned for curated multi-course menus, fresh air-flown produce sashimi and an emphasis on quality ingredients and innovation.",
                address: "3 Jalan Stesen Sentral Level 8, Hilton Hotel, Kuala Lumpur 50470 Malaysia",
                priceRange: "$$$$",
                contactInfo: { phone: "+60 3-2264 2264", website: "https://www.sevenrooms.com/reservations/iketeru/tripadvisor" },
                reservationUrl: "https://www.sevenrooms.com/reservations/iketeru/tripadvisor",
                operatingHours: [
                    {
                        "day": "Mon-Sun",
                        "time": "12:00 PM - 02:30 PM"
                    },
                    {
                        "day": "Mon-Sun",
                        "time": "06:30 PM - 10:30 PM"
                    }
                ],
                seoTitle: "Iketeru Restaurant",
                seoDescription: "",
                isIndexed: true,
            },
        ];

        const createdRestaurants = await db.insert(restaurants).values(restaurantData).returning();
        console.log(`✅ Created ${createdRestaurants.length} restaurants`);

        // 4. Create Restaurant Images
        console.log("🖼️  Adding restaurant images...");
        const imageData = createdRestaurants.flatMap((restaurant, index) => {
            const imageUrls = [
                "https://media-cdn.tripadvisor.com/media/photo-o/17/f8/75/34/iketeru-restaurant.jpg",
            ];

            return [
                {
                    restaurantId: restaurant.id,
                    url: imageUrls[index % imageUrls.length],
                    caption: "Main dining area",
                    isPrimary: true,
                },
            ];
        });

        await db.insert(restaurantImages).values(imageData);
        console.log(`✅ Added ${imageData.length} images`);

        // 5. Create Restaurant Stats
        console.log("🖼️  Adding restaurant images...");
        const statsData = createdRestaurants.flatMap((restaurant, index) => {

            return [
                {
                    restaurantId: restaurant.id,
                    googleStats: {
                        rating: 4.6,
                        totalReviews: 1250,
                        link: "https://www.google.com/maps/place/Iketeru/@3.1357476,101.6832023,17z/data=!4m8!3m7!1s0x31cc49c0ed174cb7:0xabacd06c6242dde0!8m2!3d3.1357422!4d101.6857772!9m1!1b1!16s%2Fg%2F1tf5yt3b?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D",
                    },
                    tripAdvisorStats: {
                        rating: 4.5,
                        totalReviews: 2704,
                        link: "https://www.tripadvisor.com/Restaurant_Review-g298570-d796300-Reviews-Iketeru_Restaurant-Kuala_Lumpur_Wilayah_Persekutuan.html",
                    },
                },
            ];
        });

        await db.insert(restaurantStats).values(statsData);
        console.log(`✅ Added ${statsData.length} stats`);

        console.log("\n✨ Database seeded successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - 2 users`);
        console.log(`   - ${[kualaLumpur, penang, johorBahru].length} locations`);
        console.log(`   - ${createdRestaurants.length} restaurants`);
        console.log(`   - ${imageData.length} images`);
        console.log(`   - ${statsData.length} stats`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

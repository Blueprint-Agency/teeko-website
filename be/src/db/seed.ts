import { db } from "./index";
import { users, locations, restaurants, restaurantImages } from "./schema";
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
                name: "Nasi Kandar Pelita",
                slug: "nasi-kandar-pelita",
                locationId: kualaLumpur.id,
                description: "Famous 24-hour Nasi Kandar chain serving authentic Malaysian flavors with a wide variety of curries and dishes.",
                address: "Jalan Ampang, Kuala Lumpur",
                priceRange: "$$",
                contactInfo: { phone: "+60 3-4251 1010", website: "https://pelita.com.my" },
                operatingHours: { monday: "24 hours", tuesday: "24 hours", wednesday: "24 hours", thursday: "24 hours", friday: "24 hours", saturday: "24 hours", sunday: "24 hours" },
                seoTitle: "Nasi Kandar Pelita - 24 Hour Malaysian Restaurant KL",
                seoDescription: "Experience authentic Nasi Kandar at Pelita, open 24 hours in Kuala Lumpur.",
                isIndexed: true,
            },
            {
                name: "Jalan Alor Food Street",
                slug: "jalan-alor-food-street",
                locationId: kualaLumpur.id,
                description: "Iconic street food destination with endless local delicacies, from BBQ seafood to Chinese cuisine.",
                address: "Jalan Alor, Bukit Bintang, Kuala Lumpur",
                priceRange: "$",
                contactInfo: { phone: "N/A" },
                operatingHours: { daily: "5:00 PM - 4:00 AM" },
                seoTitle: "Jalan Alor Food Street - KL's Famous Night Market",
                seoDescription: "Explore Jalan Alor, Kuala Lumpur's most famous street food destination.",
                isIndexed: true,
            },
            {
                name: "Bijan Bar & Restaurant",
                slug: "bijan-bar-restaurant",
                locationId: kualaLumpur.id,
                description: "Refined Malay cuisine in an elegant colonial setting, perfect for special occasions.",
                address: "3 Jalan Ceylon, Kuala Lumpur",
                priceRange: "$$$",
                contactInfo: { phone: "+60 3-2031 3575", website: "https://bijanrestaurant.com" },
                reservationUrl: "https://bijanrestaurant.com/reservations",
                operatingHours: { lunch: "12:00 PM - 2:30 PM", dinner: "6:30 PM - 10:30 PM" },
                seoTitle: "Bijan - Fine Malay Dining in Kuala Lumpur",
                seoDescription: "Experience refined Malay cuisine at Bijan, KL's premier fine dining restaurant.",
                isIndexed: true,
            },
            {
                name: "Restoran Yut Kee",
                slug: "restoran-yut-kee",
                locationId: kualaLumpur.id,
                description: "Historic kopitiam serving Hainanese classics since 1928. Famous for their marble cake and pork chops.",
                address: "1 Jalan Kamunting, Kuala Lumpur",
                priceRange: "$",
                contactInfo: { phone: "+60 3-2698 8108" },
                operatingHours: { tuesday_saturday: "7:30 AM - 5:00 PM", closed: "Sunday & Monday" },
                seoTitle: "Yut Kee - Historic Hainanese Kopitiam Since 1928",
                seoDescription: "Visit Yut Kee, a legendary kopitiam serving authentic Hainanese food since 1928.",
                isIndexed: true,
            },
            {
                name: "Gurney Drive Hawker Centre",
                slug: "gurney-drive-hawker-centre",
                locationId: penang.id,
                description: "Penang's most famous hawker center offering the best of local street food by the seaside.",
                address: "Persiaran Gurney, George Town, Penang",
                priceRange: "$",
                contactInfo: { phone: "N/A" },
                operatingHours: { daily: "6:00 PM - 12:00 AM" },
                seoTitle: "Gurney Drive Hawker Centre - Penang's Best Street Food",
                seoDescription: "Experience authentic Penang street food at the famous Gurney Drive Hawker Centre.",
                isIndexed: true,
            },
            {
                name: "Tek Sen Restaurant",
                slug: "tek-sen-restaurant",
                locationId: penang.id,
                description: "Beloved Chinese restaurant known for generous portions and authentic Penang-style cooking.",
                address: "18 Lebuh Carnarvon, George Town, Penang",
                priceRange: "$$",
                contactInfo: { phone: "+60 4-261 4611" },
                operatingHours: { lunch: "12:00 PM - 2:30 PM", dinner: "6:00 PM - 9:30 PM", closed: "Tuesday" },
                seoTitle: "Tek Sen Restaurant - Authentic Penang Chinese Cuisine",
                seoDescription: "Enjoy generous portions of authentic Penang-style Chinese food at Tek Sen.",
                isIndexed: true,
            },
            {
                name: "Hiap Joo Bakery",
                slug: "hiap-joo-bakery",
                locationId: johorBahru.id,
                description: "Famous for their traditional banana cake baked in a charcoal oven since 1919.",
                address: "13 Jalan Tan Hiok Nee, Johor Bahru",
                priceRange: "$",
                contactInfo: { phone: "+60 7-224 4508" },
                operatingHours: { daily: "7:00 AM - 6:00 PM" },
                seoTitle: "Hiap Joo Bakery - Famous Banana Cake Since 1919",
                seoDescription: "Try the legendary charcoal-baked banana cake at Hiap Joo Bakery in JB.",
                isIndexed: true,
            },
            {
                name: "IT Roo Cafe",
                slug: "it-roo-cafe",
                locationId: johorBahru.id,
                description: "Trendy cafe serving fusion Western and Asian cuisine in a cozy atmosphere.",
                address: "38 Jalan Dhoby, Johor Bahru",
                priceRange: "$$",
                contactInfo: { phone: "+60 7-222 3207", website: "https://itroo.com.my" },
                operatingHours: { daily: "11:00 AM - 10:00 PM" },
                seoTitle: "IT Roo Cafe - Fusion Dining in Johor Bahru",
                seoDescription: "Enjoy fusion Western and Asian cuisine at IT Roo Cafe in JB.",
                isIndexed: true,
            },
        ];

        const createdRestaurants = await db.insert(restaurants).values(restaurantData).returning();
        console.log(`✅ Created ${createdRestaurants.length} restaurants`);

        // 4. Create Restaurant Images
        console.log("🖼️  Adding restaurant images...");
        const imageData = createdRestaurants.flatMap((restaurant, index) => {
            const imageUrls = [
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
                "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
                "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
            ];

            return [
                {
                    restaurantId: restaurant.id,
                    url: imageUrls[index % imageUrls.length],
                    caption: "Main dining area",
                    isPrimary: true,
                },
                {
                    restaurantId: restaurant.id,
                    url: imageUrls[(index + 1) % imageUrls.length],
                    caption: "Signature dish",
                    isPrimary: false,
                },
            ];
        });

        await db.insert(restaurantImages).values(imageData);
        console.log(`✅ Added ${imageData.length} images`);

        console.log("\n✨ Database seeded successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - 2 users`);
        console.log(`   - ${[kualaLumpur, penang, johorBahru].length} locations`);
        console.log(`   - ${createdRestaurants.length} restaurants`);
        console.log(`   - ${imageData.length} images`);

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

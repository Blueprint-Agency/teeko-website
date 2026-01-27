import { db } from "./index";
import { users, locations, restaurants, restaurantImages, restaurantStats, blogPosts, blogContentBlocks } from "./schema";
import bcrypt from "bcrypt";
import { seedAdmin } from "./seedAdmin";
import { seedBlogPosts } from "./seedBlog";

async function main() {
    console.log("🌱 Starting consolidated database seed...");

    try {
        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await db.delete(blogContentBlocks);
        await db.delete(blogPosts);
        await db.delete(restaurantImages);
        await db.delete(restaurantStats);
        await db.delete(restaurants);
        await db.delete(locations);
        await db.delete(users);
        console.log("✅ Cleared existing data");

        // 1. Users are now exclusively handled by seedAdmin() below
        console.log("👤 User initialization moved to seedAdmin step...");

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
                cuisine: "Japanese",
                feature: [
                    "American Express",
                    "Accepts Credit Cards",
                    "Mastercard",
                    "Visa",
                    "Buffet",
                    "Family style",
                    "Free Wifi",
                    "Highchairs Available",
                    "Non-smoking restaurants",
                    "Parking Available",
                    "Private Dining",
                    "Reservations",
                    "Seating",
                    "Serves Alcohol",
                    "Table Service",
                    "Takeout",
                    "Valet Parking",
                    "Validated Parking"
                ],
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
            {
                name: "Sky51",
                slug: "sky51",
                locationId: kualaLumpur.id,
                tripAdvisorLocationId: "25066495",
                description: "The eye-popping Sky51 is an entire floor dedicated to fine dining, fine wines, creative cocktails, and unrivalled views. Featured here are Sabayon, specializing in gourmet Continental cuisine, and Blue, an open-air rooftop lounge. All of which, promises a memorable experience. Sabayon Contemporary European dining reaches a whole new level – literally and lavishly. Sabayon is on most everyone’s places to eat. The cuisine is best described as the perfect combination of classic and contemporary. The award-winning restaurant serves degustation menus with an option for wine pairing. Be delighted in Sabayon’s fine-dining journey. For those requiring a private setting, our team will be happy to arrange a more personal dining experience for parties of any size. Give the special occasion that extra shine. Blue KL’s top bespoke outdoor rooftop bar at Sky51 offers tantalising snacks and handcrafted cocktails prepared by seasoned mixologists. The picture-perfect skybar provides the best panoramic views of the city, spanning from the KL Tower to the Petronas Twin Towers. There are three main areas: Lounge to unwind and watch live performances, Sky Deck where one gets a front-row seat to the city skyline and VIP Deck for private parties.",
                cuisine: "International",
                feature: [
                    "Accepts Credit Cards",
                    "Full Bar",
                    "Outdoor Seating",
                    "Parking Available",
                    "Reservations",
                    "Seating",
                    "Serves Alcohol",
                    "Table Service",
                    "Wine and Beer"
                ],
                address: "Jalan Sultan Ismail Equatorial Plaza, Kuala Lumpur 50250 Malaysia",
                priceRange: "$$$$",
                contactInfo: { phone: "+60 3-2789 7777", website: "https://www.eqkualalumpur.equatorial.com/dining/sky51/" },
                reservationUrl: "https://www.sevenrooms.com/explore/sky51andblue/reservations/create/search",
                operatingHours: [
                    { day: "Mon-Sun", time: "05:00 PM - 01:00 AM" },
                ],
                seoTitle: "Sky51",
                seoDescription: "",
                isIndexed: true,
            },
            {
                name: "Vasco's",
                slug: "vasco's",
                locationId: kualaLumpur.id,
                tripAdvisorLocationId: "4831795",
                description: "An innovative all-day-dining restaurant designed with an \"al fresco\" urban park feel. Impressive buffet showcase with choice selection of Asian and international favourites.",
                cuisine: "International",
                feature: [
                    "American Express",
                    "Accepts Credit Cards",
                    "Mastercard",
                    "Visa",
                    "Buffet",
                    "Free Wifi",
                    "Highchairs Available",
                    "Parking Available",
                    "Private Dining",
                    "Reservations",
                    "Seating",
                    "Table Service",
                    "Valet Parking",
                    "Validated Parking",
                    "Wheelchair Accessible",
                    "Wine and Beer"
                ],
                address: "3 Jalan Stesen Sentral Lobby Level, Hilton Kuala Lumpur, Kuala Lumpur 50470 Malaysia",
                priceRange: "$$ - $$$",
                contactInfo: { phone: "+60 3-2264 2264", website: "https://www.sevenrooms.com/reservations/vascos/tripadvisor" },
                reservationUrl: "https://www.sevenrooms.com/reservations/vascos/tripadvisor",
                operatingHours: [
                    { day: "Mon-Fri", time: "12:00 PM - 02:30 PM" },
                    { day: "Mon-Fri", time: "06:00 PM - 10:00 PM" },
                    { day: "Sat-Sun", time: "12:30 PM - 03:00 PM" },
                    { day: "Sat-Sun", time: "06:00 PM - 10:00 PM" },
                ],
                seoTitle: "Vasco's",
                seoDescription: "",
                isIndexed: true,
            },
            {
                name: "Kampachi EQ",
                slug: "kampachi-eq",
                locationId: kualaLumpur.id,
                tripAdvisorLocationId: "1092910",
                description: "The latest and finest version of Kampachi Restaurants after the great remake. Features a sophisticated Hinoki Wood Sushi counter that will surely bring your Sushi Omakase dining experience to the next level.",
                cuisine: "Japanese",
                feature: [
                    "American Express",
                    "Accepts Credit Cards",
                    "Mastercard",
                    "Visa",
                    "Buffet",
                    "Family style",
                    "Free Wifi",
                    "Full Bar",
                    "Gift Cards Available",
                    "Highchairs Available",
                    "Non-smoking restaurants",
                    "Parking Available",
                    "Private Dining",
                    "Reservations",
                    "Seating",
                    "Serves Alcohol",
                    "Table Service",
                    "Takeout",
                    "Valet Parking",
                    "Wheelchair Accessible",
                    "Wine and Beer"
                ],
                address: "Equatorial Hotel 27 Jalan Sultan Ismail, Kuala Lumpur 50250 Malaysia",
                priceRange: "$$$$",
                contactInfo: { phone: "+60 3-2789 7722", website: "http://www.kampachi.com.my/" },
                reservationUrl: "https://www.sevenrooms.com/explore/kampachieq/reservations/create/search",
                operatingHours: [
                    { day: "Mon-Sun", time: "12:00 PM - 03:00 PM" },
                    { day: "Mon-Sun", time: "06:00 PM - 10:00 PM" },
                ],
                seoTitle: "Kampachi EQ",
                seoDescription: "",
                isIndexed: true,
            },
            {
                name: "The Mesh",
                slug: "the-mesh",
                locationId: kualaLumpur.id,
                tripAdvisorLocationId: "26825851",
                description: "Embrace the communal spirit and savour authentic Malaysian cuisine at The Mesh. Our all-day dining venue blends traditional dishes with a modern twist in a unique, inviting atmosphere, celebrating community and culture, fit for a capacity of over 200 persons.",
                cuisine: "International",
                feature: [
                    "American Express",
                    "Accepts Credit Cards",
                    "Mastercard",
                    "Visa",
                    "Buffet",
                    "Family style",
                    "Free Wifi",
                    "Highchairs Available",
                    "Non-smoking restaurants",
                    "Parking Available",
                    "Private Dining",
                    "Reservations",
                    "Seating",
                    "Serves Alcohol",
                    "Table Service",
                    "Takeout",
                    "Valet Parking",
                    "Validated Parking"
                ],
                address: "Jalan Ampang Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail, Kuala Lumpur 50450 Malaysia",
                priceRange: "$$$$",
                contactInfo: { phone: "+60 3-2706 9099", website: "http://www.themeshkl.com" },
                reservationUrl: "https://www.sevenrooms.com/reservations/themesh/tripadvisor",
                operatingHours: [
                    { day: "Mon-Sun", time: "06:30 AM - 10:30 PM" },
                ],
                seoTitle: "The Mesh",
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
                "https://media-cdn.tripadvisor.com/media/photo-o/26/96/bc/92/sky51-facade.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-o/06/11/bf/f5/vasco-s-kl-hilton.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/19/magnificent-sushi-counter.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/2a/c6/ec/a4/merasa-kembali-kenangan.jpg"
            ];

            const image2Urls = [
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/16/e3/d5/ea/assortment-of-sashimi.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/26/96/b7/de/sky51.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-o/06/11/c0/83/vasco-s-kl-hilton.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/fe/78/be-seated-at-the-sushi.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/2b/b5/68/73/seafood-asam-pedas.jpg",
            ]

            const image3Urls = [
                "https://media-cdn.tripadvisor.com/media/photo-o/06/0b/94/4a/iketeru-restaurant.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-w/26/96/b7/dc/blue-private-pods.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-o/2c/ee/85/07/mini-nutella-dorayaki.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/6a/exquisite-kappou-dining.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/2b/b5/68/72/chicken-burger-triple.jpg",
            ]

            const image4Urls = [
                "https://media-cdn.tripadvisor.com/media/photo-o/06/0a/72/38/iketeru-restaurant.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/26/96/b7/d9/sky51-sky-deck.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-o/2c/ee/84/6e/meat-lovers-to-dine-at.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/4d/semi-private-dining-area.jpg",
                "https://media-cdn.tripadvisor.com/media/photo-w/2b/b5/68/71/booze.jpg",
            ]

            return [
                {
                    restaurantId: restaurant.id,
                    url: imageUrls[index % imageUrls.length],
                    caption: "Main dining area",
                    isPrimary: true,
                },
                {
                    restaurantId: restaurant.id,
                    url: image2Urls[index % image2Urls.length],
                    caption: "Details Image 1",
                    isPrimary: false,
                },
                {
                    restaurantId: restaurant.id,
                    url: image3Urls[index % image3Urls.length],
                    caption: "Details Image 2",
                    isPrimary: false,
                },
                {
                    restaurantId: restaurant.id,
                    url: image4Urls[index % image4Urls.length],
                    caption: "Details Image 3",
                    isPrimary: false,
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

        // 6. Seed Admin User
        console.log("\n👤 Seeding admin user...");
        await seedAdmin();

        // 7. Seed Blog Posts
        console.log("\n📝 Seeding blog posts...");
        await seedBlogPosts();

        console.log("\n✨ Database seeded successfully!");
        console.log(`📊 Summary:`);
        console.log(`   - Superadmin account (synchronized from .env)`);
        console.log(`   - ${[kualaLumpur, penang, johorBahru].length} locations`);
        console.log(`   - ${createdRestaurants.length} restaurants`);
        console.log(`   - ${imageData.length} images`);
        console.log(`   - ${statsData.length} stats`);
        console.log(`   - Blog posts (check output above)`);

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

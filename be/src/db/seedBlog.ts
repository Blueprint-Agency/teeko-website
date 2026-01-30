import { db } from "./index";
import { blogPosts, blogContentBlocks, users } from "./schema";
import { inArray } from "drizzle-orm";

export const seedBlogPosts = async () => {
    try {
        console.log("Starting blog posts seed...");

        // Get admin user to use as author (can be ADMIN or SUPERADMIN)
        const [adminUser] = await db.select().from(users).where(inArray(users.role, ["ADMIN", "SUPERADMIN"])).limit(1);

        if (!adminUser) {
            console.warn("No admin user found. Skipping blog seed.");
            return;
        }

        const authorId = adminUser.id;

        // Check if blog posts already exist
        const existingPosts = await db.select().from(blogPosts).limit(1);
        if (existingPosts.length > 0) {
            console.log("Blog posts already exist. Skipping seed.");
            return;
        }

        // Sample blog posts data
        const blogPostsData = [
            {
                title: "Top 10 Must-Visit Restaurants in Kuala Lumpur",
                slug: "top-10-must-visit-restaurants-kuala-lumpur",
                metaDescription: "Discover the best dining experiences in KL, from street food to fine dining. Our curated list of top 10 restaurants you absolutely must try.",
                featureImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
                status: "PUBLISHED" as const,
                contentBlocks: [
                    { blockType: "paragraph", content: "Kuala Lumpur is a food lover's paradise, offering an incredible variety of cuisines from traditional Malaysian fare to international fine dining. Whether you're a local or a tourist, these 10 restaurants are absolute must-visits." },
                    { blockType: "h2", content: "1. Atmosphere 360 - Dining in the Sky" },
                    { blockType: "paragraph", content: "Located at the top of KL Tower, Atmosphere 360 offers breathtaking panoramic views of the city while you enjoy a sumptuous buffet. The revolving restaurant completes a full rotation in about an hour, giving you a complete view of Kuala Lumpur's skyline." },
                    { blockType: "h2", content: "2. Jalan Alor Food Street - Street Food Heaven" },
                    { blockType: "paragraph", content: "No visit to KL is complete without experiencing the vibrant street food scene at Jalan Alor. From char kway teow to satay, this bustling street comes alive at night with endless food options and authentic local flavors." },
                    { blockType: "h2", content: "3. Bijan Bar & Restaurant - Modern Malay Cuisine" },
                    { blockType: "paragraph", content: "Bijan elevates traditional Malay cuisine to fine dining standards. Set in a beautiful colonial bungalow, this restaurant offers an elegant ambiance and expertly crafted dishes that showcase the rich flavors of Malaysian cooking." },
                    { blockType: "h3", content: "Why We Love It" },
                    { blockType: "paragraph", content: "The rendang here is legendary, and their sambal is made fresh daily. The intimate setting makes it perfect for special occasions." },
                ]
            },
            {
                title: "Essential Travel Tips for First-Time Visitors to Malaysia",
                slug: "essential-travel-tips-first-time-visitors-malaysia",
                metaDescription: "Planning your first trip to Malaysia? Read our comprehensive guide with insider tips on transportation, food, culture, and must-see attractions.",
                featureImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=600&fit=crop",
                status: "PUBLISHED" as const,
                contentBlocks: [
                    { blockType: "paragraph", content: "Malaysia is an incredible destination that offers diverse experiences, from bustling cities to pristine beaches and lush rainforests. Here's everything you need to know for your first visit." },
                    { blockType: "h2", content: "Getting Around Malaysia" },
                    { blockType: "paragraph", content: "Malaysia has excellent public transportation in major cities. The LRT, MRT, and monorail systems in Kuala Lumpur are efficient and affordable. For intercity travel, consider the ETS trains or domestic flights." },
                    { blockType: "h3", content: "Grab is Your Best Friend" },
                    { blockType: "paragraph", content: "Download the Grab app before you arrive. It's the Southeast Asian equivalent of Uber and is widely used throughout Malaysia. It's safe, affordable, and drivers are generally very friendly." },
                    { blockType: "h2", content: "Food and Dining Etiquette" },
                    { blockType: "paragraph", content: "Malaysian food is incredibly diverse and delicious. Don't be afraid to try street food - it's generally safe and offers the most authentic experience. Remember that Malaysia is a Muslim-majority country, so pork is not as common, but you'll find it in Chinese restaurants." },
                    { blockType: "h2", content: "Weather and What to Pack" },
                    { blockType: "paragraph", content: "Malaysia is hot and humid year-round. Pack light, breathable clothing, but bring a light jacket for air-conditioned spaces. Don't forget sunscreen, an umbrella (for both sun and rain), and comfortable walking shoes." },
                ]
            },
            {
                title: "The Ultimate Guide to Malaysian Street Food",
                slug: "ultimate-guide-malaysian-street-food",
                metaDescription: "From nasi lemak to char kway teow, explore the incredible world of Malaysian street food with our comprehensive guide to must-try dishes.",
                featureImage: "https://images.unsplash.com/photo-1596040033229-a0b3b83e7c8d?w=1200&h=600&fit=crop",
                status: "PUBLISHED" as const,
                contentBlocks: [
                    { blockType: "paragraph", content: "Malaysian street food is world-renowned for its incredible flavors, diversity, and affordability. This guide will help you navigate the delicious world of hawker stalls and street vendors." },
                    { blockType: "h2", content: "Breakfast Champions" },
                    { blockType: "h3", content: "Nasi Lemak - The National Dish" },
                    { blockType: "paragraph", content: "Nasi lemak is Malaysia's beloved national dish. Fragrant coconut rice served with sambal, fried anchovies, peanuts, cucumber, and a hard-boiled egg. For the full experience, add rendang or fried chicken." },
                    { blockType: "h3", content: "Roti Canai - Flaky Perfection" },
                    { blockType: "paragraph", content: "This flaky, crispy flatbread is a breakfast staple. Watch as skilled vendors flip and toss the dough before cooking it on a hot griddle. Dip it in dhal curry or chicken curry for the authentic experience." },
                    { blockType: "h2", content: "Lunch and Dinner Favorites" },
                    { blockType: "h3", content: "Char Kway Teow" },
                    { blockType: "paragraph", content: "Flat rice noodles stir-fried with prawns, Chinese sausage, eggs, and bean sprouts in a dark soy sauce. The best versions have a smoky 'wok hei' flavor that comes from high-heat cooking." },
                    { blockType: "h3", content: "Satay - Grilled Perfection" },
                    { blockType: "paragraph", content: "Skewered and grilled meat (chicken, beef, or lamb) served with peanut sauce, cucumber, and onions. The meat is marinated in a blend of spices before grilling over charcoal." },
                ]
            },
            {
                title: "Best eSIM Options for Traveling to Malaysia",
                slug: "best-esim-options-traveling-malaysia",
                metaDescription: "Stay connected during your Malaysia trip with our guide to the best eSIM providers. Compare prices, coverage, and data plans.",
                featureImage: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop",
                status: "PUBLISHED" as const,
                contentBlocks: [
                    { blockType: "paragraph", content: "Staying connected while traveling is essential, and eSIMs have revolutionized how we access mobile data abroad. Here's everything you need to know about using eSIMs in Malaysia." },
                    { blockType: "h2", content: "Why Choose an eSIM for Malaysia?" },
                    { blockType: "paragraph", content: "eSIMs offer several advantages over traditional SIM cards: instant activation, no need to find a store, competitive pricing, and the ability to keep your home number active. Malaysia has excellent 4G and 5G coverage in urban areas." },
                    { blockType: "h2", content: "Coverage and Network Quality" },
                    { blockType: "paragraph", content: "Malaysia's major cities like Kuala Lumpur, Penang, and Johor Bahru have excellent mobile coverage. Even in smaller towns and tourist destinations, you'll generally have good connectivity. The main networks (Maxis, Celcom, Digi) all offer reliable service." },
                    { blockType: "h3", content: "What to Look For" },
                    { blockType: "paragraph", content: "When choosing an eSIM for Malaysia, consider: data allowance (5-10GB is usually sufficient for a week), validity period, network coverage, and price. Some providers offer unlimited data plans which are great for heavy users." },
                    { blockType: "h2", content: "Installation Tips" },
                    { blockType: "paragraph", content: "Install your eSIM before you leave home while you still have WiFi. Most eSIMs activate automatically when you land in Malaysia. Make sure your phone is eSIM compatible and unlocked before purchasing." },
                ]
            },
            {
                title: "Hidden Gems: Underrated Restaurants in Penang",
                slug: "hidden-gems-underrated-restaurants-penang",
                metaDescription: "Discover Penang's best-kept culinary secrets. These underrated restaurants offer incredible food away from the tourist crowds.",
                featureImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop",
                status: "DRAFT" as const,
                contentBlocks: [
                    { blockType: "paragraph", content: "While Penang is famous for its food scene, some of the best restaurants fly under the radar. Here are our favorite hidden gems that locals love but tourists often miss." },
                    { blockType: "h2", content: "1. Tek Sen Restaurant - Authentic Chinese Cuisine" },
                    { blockType: "paragraph", content: "This no-frills restaurant has been serving incredible Chinese food for decades. The menu changes daily based on what's fresh, and everything is cooked to perfection. Arrive early as they often sell out." },
                    { blockType: "h2", content: "2. Hameediyah Restaurant - Historic Nasi Kandar" },
                    { blockType: "paragraph", content: "Established in 1907, this is one of Penang's oldest nasi kandar restaurants. While not exactly hidden, it's often overlooked by tourists in favor of more famous spots. The quality here is consistently excellent." },
                ]
            }
        ];

        // Insert blog posts with their content blocks
        for (const postData of blogPostsData) {
            const { contentBlocks, ...postFields } = postData;

            // Insert blog post
            const [newPost] = await db.insert(blogPosts).values({
                ...postFields,
                authorId,
                publishedAt: postFields.status === "PUBLISHED" ? new Date() : null,
            }).returning();

            console.log(`Created blog post: ${newPost.title}`);

            // Insert content blocks
            if (contentBlocks && contentBlocks.length > 0) {
                await db.insert(blogContentBlocks).values(
                    contentBlocks.map((block, index) => ({
                        blogPostId: newPost.id,
                        blockType: block.blockType,
                        content: block.content,
                        orderIndex: String(index),
                    }))
                );
                console.log(`  - Added ${contentBlocks.length} content blocks`);
            }
        }

        console.log("✅ Blog posts seed completed successfully!");
    } catch (error) {
        console.error("❌ Error seeding blog posts:", error);
        throw error;
    }
};

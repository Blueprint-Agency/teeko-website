import { Request, Response } from "express";
import { db } from "../db";
import { restaurants, restaurantImages, locations, restaurantStats, restaurantReviews, restaurantShortVideos } from "../db/schema";
import { eq } from "drizzle-orm";
import { getJson } from "serpapi";

export const getRestaurants = async (req: Request, res: Response) => {
    const { location: locationSlug } = req.query;

    try {
        let query = db.select({
            id: restaurants.id,
            name: restaurants.name,
            slug: restaurants.slug,
            description: restaurants.description,
            cuisine: restaurants.cuisine,
            feature: restaurants.feature,
            address: restaurants.address,
            priceRange: restaurants.priceRange,
            contactInfo: restaurants.contactInfo,
            reservationUrl: restaurants.reservationUrl,
            operatingHours: restaurants.operatingHours,
            location: {
                id: locations.id,
                name: locations.name,
                slug: locations.slug
            },
            stats: {
                id: restaurantStats.id,
                googleStats: restaurantStats.googleStats,
                tripAdvisorStats: restaurantStats.tripAdvisorStats,
            }
        })
            .from(restaurants)
            .leftJoin(locations, eq(restaurants.locationId, locations.id))
            .leftJoin(restaurantStats, eq(restaurants.id, restaurantStats.restaurantId));

        if (locationSlug) {
            // @ts-ignore - drizzle-orm and express types mismatch sometimes on req.query
            query = query.where(eq(locations.slug, locationSlug as string));
        }

        const allRestaurants = await query;

        // Get images and reviews for each restaurant
        const restaurantsWithDetails = await Promise.all(allRestaurants.map(async (res) => {
            const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, res.id));
            const reviews = await db.select().from(restaurantReviews).where(eq(restaurantReviews.restaurantId, res.id));
            const googleReviews = reviews.filter(r => r.source === 'google');
            const shortVideos = await db.select().from(restaurantShortVideos).where(eq(restaurantShortVideos.restaurantId, res.id));
            return { ...res, restaurantImages: images, googleReviews, shortVideos };
        }));

        res.json(restaurantsWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurants" });
    }
};

export const getRestaurantBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
        const result = await db.select({
            id: restaurants.id,
            name: restaurants.name,
            slug: restaurants.slug,
            description: restaurants.description,
            cuisine: restaurants.cuisine,
            feature: restaurants.feature,
            address: restaurants.address,
            priceRange: restaurants.priceRange,
            contactInfo: restaurants.contactInfo,
            reservationUrl: restaurants.reservationUrl,
            operatingHours: restaurants.operatingHours,
            seoTitle: restaurants.seoTitle,
            seoDescription: restaurants.seoDescription,
            location: {
                id: locations.id,
                name: locations.name,
                slug: locations.slug
            },
            stats: {
                id: restaurantStats.id,
                googleStats: restaurantStats.googleStats,
                tripAdvisorStats: restaurantStats.tripAdvisorStats,
            }
        })
            .from(restaurants)
            .leftJoin(locations, eq(restaurants.locationId, locations.id))
            .leftJoin(restaurantStats, eq(restaurants.id, restaurantStats.restaurantId))
            .where(eq(restaurants.slug, slug as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, result[0].id));
        const reviews = await db.select().from(restaurantReviews).where(eq(restaurantReviews.restaurantId, result[0].id));
        const googleReviews = reviews.filter(r => r.source === 'google');

        res.json({ ...result[0], restaurantImages: images, googleReviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const getRestaurantById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await db.select({
            id: restaurants.id,
            name: restaurants.name,
            slug: restaurants.slug,
            locationId: restaurants.locationId,
            description: restaurants.description,
            feature: restaurants.feature,
            cuisine: restaurants.cuisine,
            address: restaurants.address,
            priceRange: restaurants.priceRange,
            contactInfo: restaurants.contactInfo,
            reservationUrl: restaurants.reservationUrl,
            operatingHours: restaurants.operatingHours,
            seoTitle: restaurants.seoTitle,
            seoDescription: restaurants.seoDescription,
            tripAdvisorId: restaurants.tripAdvisorLocationId,
        })
            .from(restaurants)
            .where(eq(restaurants.id, id as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, id as string));

        const stats = await db.select().from(restaurantStats).where(eq(restaurantStats.restaurantId, id as string));

        const review = await db.select().from(restaurantReviews).where(eq(restaurantReviews.restaurantId, id as string));

        const shortVideos = await db.select().from(restaurantShortVideos).where(eq(restaurantShortVideos.restaurantId, id as string));

        res.json({ ...result[0], restaurantImages: images, restaurantStats: stats, restaurantReviews: review, shortVideos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const createRestaurant = async (req: Request, res: Response) => {
    const { name, slug, tripAdvisorId, locationId, description, address, priceRange, contactInfo, operatingHours, images, feature, cuisine, reservationUrl, googleStats, tripAdvisorStats, googleReviews, shortVideos } = req.body;

    try {
        // 1. Create Restaurant
        const newRestaurant = await db
            .insert(restaurants)
            .values({
                name,
                slug,
                locationId,
                tripAdvisorLocationId: tripAdvisorId,
                description,
                address,
                priceRange,
                contactInfo,
                operatingHours,
                feature,
                cuisine,
            })
            .returning();

        const restaurantId = newRestaurant[0].id;

        // 2. Add Images if provided
        if (images && Array.isArray(images) && images.length > 0) {
            await db.insert(restaurantImages).values(
                images.map((img: any) => ({
                    restaurantId,
                    url: img.url,
                    caption: img.caption,
                    isPrimary: img.isPrimary || false,
                }))
            );
        }

        const hasGoogleStats = googleStats && Object.keys(googleStats).length > 0;
        const hasTripAdvisorStats = tripAdvisorStats && Object.keys(tripAdvisorStats).length > 0;
        await db.insert(restaurantStats).values({
            restaurantId,
            googleStats: hasGoogleStats ? googleStats : null,
            tripAdvisorStats: hasTripAdvisorStats ? tripAdvisorStats : null,
        });

        if (googleReviews && Array.isArray(googleReviews) && googleReviews.length > 0) {
            await db.insert(restaurantReviews).values(
                googleReviews.map((review: any) => ({
                    restaurantId,
                    source: 'google',
                    rating: review.rating,
                    description: review.description,
                    images: review.user_image,
                    userName: review.user_name,
                }))
            );
        }

        if (shortVideos && Array.isArray(shortVideos) && shortVideos.length > 0) {
            await db.insert(restaurantShortVideos).values(
                shortVideos.map((video: any) => ({
                    restaurantId,
                    title: video.title,
                    link: video.link,
                    thumbnail: video.thumbnail,
                    source: video.source,
                    channel: video.channel,
                }))
            );
        }

        res.status(201).json({ message: "Restaurant created successfully", restaurant: newRestaurant[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getRestaurantByTripAdvisorID = async (req: Request, res: Response) => {
    const { tripAdvisorID } = req.params;

    try {
        getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "tripadvisor_place",
            place_id: tripAdvisorID,
            tripadvisor_domain: "www.tripadvisor.com.my"
        }, async (json: any) => {
            if (!json.place_result) {
                res.status(404).json({ message: "TripAdvisor place not found" });
                return;
            }

            const result = {
                name: json.place_result.name as string,
                slug: (json.place_result.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
                tripAdvisorLocationId: tripAdvisorID as string,
                description: json.place_result.description as string,
                address: json.place_result.address as string,
                website: json.place_result.website as string,
                cuisine: json.place_result.cuisines?.[0] as string,
                contactInfo: {
                    phone: json.place_result.phone,
                    website: json.place_result.website,
                },
                operatingHours: json.place_result.operation_hours?.hours,
                images: json.place_result.images,
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const getRestaurantStatsByGoogleSearchQuery = async (req: Request, res: Response) => {
    const { searchQuery } = req.params;
    try {
        getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "google_maps",
            type: "search",
            google_domain: "google.com",
            q: searchQuery,
            hl: "en"
        }, (json) => {
            if (!json.place_results) {
                res.status(404).json({ message: "Google place not found" });
                return;
            }

            const result = {
                title: json.place_results.title as string,
                rating: json.place_results.rating as string,
                reviews: (json.place_results.reviews as number),
                googleReviews: json.place_results.user_reviews.most_relevant.map((review: any) => ({
                    rating: review.rating,
                    description: review.description,
                    user_name: review.username,
                    user_image: review.images,
                    date: review.date,
                    date_iso8601: review.date_iso8601,
                }))
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const getRestaurantShortVideosBySearchQuery = async (req: Request, res: Response) => {
    const { searchQuery } = req.params;
    try {
        getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "google_short_videos",
            google_domain: "google.com",
            q: searchQuery,
            hl: "en"
        }, (json) => {
            if (!json.short_video_results) {
                res.status(404).json({ message: "Google short videos not found" });
                return;
            }

            const result = json.short_video_results.map((video: any) => {
                return {
                    title: video.title as string,
                    link: video.link as string,
                    thumbnail: video.thumbnail as string,
                    source: video.source as string,
                    channel: video.channel as string,
                }
            });

            res.json({ shortVideos: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const createRestaurantByTripAdvisorID = async (req: Request, res: Response) => {
    const { tripAdvisorID } = req.params;
    const { locationId, priceRange } = req.body;

    try {
        getJson({
            api_key: process.env.SERPAPI_API_KEY,
            engine: "tripadvisor_place",
            place_id: tripAdvisorID,
            tripadvisor_domain: "www.tripadvisor.com.my"
        }, async (json: any) => {
            if (!json.place_result) {
                res.status(404).json({ message: "TripAdvisor place not found" });
                return;
            }

            try {
                const newRestaurant = await db
                    .insert(restaurants)
                    .values({
                        name: json.place_result.name as string,
                        slug: (json.place_result.name as string).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
                        locationId: locationId as string,
                        tripAdvisorLocationId: tripAdvisorID as string,
                        description: json.place_result.description as string,
                        address: json.place_result.address as string,
                        priceRange: priceRange as string,
                        cuisine: json.place_result.cuisines[0] as string,
                        contactInfo: {
                            phone: json.place_result.phone,
                            website: json.place_result.website,
                        },
                        operatingHours: json.place_result.operation_hours?.hours,
                    })
                    .returning();

                const restaurantId = newRestaurant[0].id;

                // 2. Add Images if provided
                if (json.place_result.images && Array.isArray(json.place_result.images)) {
                    await db.insert(restaurantImages).values(
                        json.place_result.images.map((img: any, index: number) => ({
                            restaurantId,
                            url: img,
                            caption: `Image ${index + 1}`,
                            isPrimary: index === 0,
                        }))
                    );
                }

                res.status(201).json({
                    message: "Restaurant created successfully via TripAdvisor",
                    restaurant: newRestaurant[0]
                });
            } catch (dbError) {
                console.error("Database error:", dbError);
                res.status(500).json({ message: "Failed to save restaurant to database" });
            }
        });
    } catch (error) {
        console.error("SerpApi error:", error);
        res.status(500).json({ message: "Error fetching data from TripAdvisor" });
    }
}

export const updateRestaurant = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, locationId, description, address, priceRange, contactInfo, operatingHours, images, feature, cuisine, reservationUrl, googleStats, tripAdvisorStats, googleReviews, shortVideos } = req.body;

    try {
        const [updatedRestaurant] = await db
            .update(restaurants)
            .set({
                name,
                slug,
                locationId,
                description,
                address,
                priceRange,
                contactInfo,
                operatingHours,
                feature,
                cuisine,
                reservationUrl,
                updatedAt: new Date(),
            })
            .where(eq(restaurants.id, id as string))
            .returning();

        if (!updatedRestaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        // Handle images if provided
        if (images && Array.isArray(images) && images.length > 0) {
            // Simplistic approach: delete old images and add new ones (better approach would be syncing)
            await db.delete(restaurantImages).where(eq(restaurantImages.restaurantId, id as string));
            await db.insert(restaurantImages).values(
                images.map((img: any) => ({
                    restaurantId: id as string,
                    url: img.url,
                    caption: img.caption,
                    isPrimary: img.isPrimary || false,
                }))
            );
        }

        const hasGoogleStats = googleStats && Object.keys(googleStats).length > 0;
        const hasTripAdvisorStats = tripAdvisorStats && Object.keys(tripAdvisorStats).length > 0;
        await db
            .delete(restaurantStats)
            .where(eq(restaurantStats.restaurantId, id as string));
        await db.insert(restaurantStats).values({
            restaurantId: id as string,
            ...(hasGoogleStats && { googleStats }),
            ...(hasTripAdvisorStats && { tripAdvisorStats }),
        });

        if (googleReviews && Array.isArray(googleReviews) && googleReviews.length > 0) {
            await db.delete(restaurantReviews).where(eq(restaurantReviews.restaurantId, id as string));
            await db.insert(restaurantReviews).values(
                googleReviews.map((review: any) => ({
                    restaurantId: id as string,
                    source: "google",
                    rating: review.rating,
                    description: review.description,
                    images: review.user_image,
                    userName: review.user_name,
                }))
            );
        }

        if (shortVideos && Array.isArray(shortVideos) && shortVideos.length > 0) {
            await db.delete(restaurantShortVideos).where(eq(restaurantShortVideos.restaurantId, id as string));
            await db.insert(restaurantShortVideos).values(
                shortVideos.map((video: any) => ({
                    restaurantId: id as string,
                    title: video.title,
                    link: video.link,
                    thumbnail: video.thumbnail,
                    source: video.source,
                    channel: video.channel,
                }))
            );
        }
        res.json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

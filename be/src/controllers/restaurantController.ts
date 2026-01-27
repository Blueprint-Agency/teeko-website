import { Request, Response } from "express";
import { db } from "../db";
import { restaurants, restaurantImages, locations, restaurantStats } from "../db/schema";
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

        // Get images for each restaurant
        const restaurantsWithImages = await Promise.all(allRestaurants.map(async (res) => {
            const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, res.id));
            return { ...res, restaurantImages: images };
        }));

        res.json(restaurantsWithImages);
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

        res.json({ ...result[0], restaurantImages: images });
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
            address: restaurants.address,
            priceRange: restaurants.priceRange,
            contactInfo: restaurants.contactInfo,
            reservationUrl: restaurants.reservationUrl,
            operatingHours: restaurants.operatingHours,
            seoTitle: restaurants.seoTitle,
            seoDescription: restaurants.seoDescription,
        })
            .from(restaurants)
            .where(eq(restaurants.id, id as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        const images = await db.select().from(restaurantImages).where(eq(restaurantImages.restaurantId, id as string));

        res.json({ ...result[0], restaurantImages: images });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching restaurant" });
    }
};

export const createRestaurant = async (req: Request, res: Response) => {
    const { name, slug, tripAdvisorLocationId, locationId, description, address, priceRange, contactInfo, operatingHours, images } = req.body;

    try {
        // 1. Create Restaurant
        const newRestaurant = await db
            .insert(restaurants)
            .values({
                name,
                slug,
                locationId,
                tripAdvisorLocationId,
                description,
                address,
                priceRange,
                contactInfo,
                operatingHours,
            })
            .returning();

        const restaurantId = newRestaurant[0].id;

        // 2. Add Images if provided
        if (images && Array.isArray(images)) {
            await db.insert(restaurantImages).values(
                images.map((img: any) => ({
                    restaurantId,
                    url: img.url,
                    caption: img.caption,
                    isPrimary: img.isPrimary || false,
                }))
            );
        }

        res.status(201).json({ message: "Restaurant created successfully", restaurant: newRestaurant[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
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
    const { name, slug, locationId, description, address, priceRange, contactInfo, operatingHours, images } = req.body;

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
                updatedAt: new Date(),
            })
            .where(eq(restaurants.id, id as string))
            .returning();

        if (!updatedRestaurant) {
            res.status(404).json({ message: "Restaurant not found" });
            return;
        }

        // Handle images if provided
        if (images && Array.isArray(images)) {
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

        res.json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

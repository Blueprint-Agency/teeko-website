import { Request, Response } from "express";
import { db } from "../db";
import { restaurants, restaurantImages, locations } from "../db/schema";
import { eq } from "drizzle-orm";

export const getRestaurants = async (req: Request, res: Response) => {
    const { location: locationSlug } = req.query;

    try {
        let query = db.select({
            id: restaurants.id,
            name: restaurants.name,
            slug: restaurants.slug,
            description: restaurants.description,
            address: restaurants.address,
            priceRange: restaurants.priceRange,
            contactInfo: restaurants.contactInfo,
            operatingHours: restaurants.operatingHours,
            location: {
                id: locations.id,
                name: locations.name,
                slug: locations.slug
            }
        })
            .from(restaurants)
            .leftJoin(locations, eq(restaurants.locationId, locations.id));

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
            }
        })
            .from(restaurants)
            .leftJoin(locations, eq(restaurants.locationId, locations.id))
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
    const { name, slug, locationId, description, address, priceRange, contactInfo, operatingHours, images } = req.body;

    try {
        // 1. Create Restaurant
        const newRestaurant = await db
            .insert(restaurants)
            .values({
                name,
                slug,
                locationId,
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

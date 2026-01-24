import { Request, Response } from "express";
import { db } from "../db";
import { esimProviders, esimPackages } from "../db/schema";
import { eq } from "drizzle-orm";

// eSIM Providers
export const getProviders = async (req: Request, res: Response) => {
    try {
        const providers = await db.select().from(esimProviders);
        res.json(providers);
    } catch (error) {
        console.error("Error fetching providers:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createProvider = async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    try {
        const [newProvider] = await db.insert(esimProviders).values({ name, slug }).returning();
        res.status(201).json(newProvider);
    } catch (error) {
        console.error("Error creating provider:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateProvider = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug } = req.body;

    try {
        const [updated] = await db
            .update(esimProviders)
            .set({ name, slug })
            .where(eq(esimProviders.id, id as string))
            .returning();

        if (!updated) {
            res.status(404).json({ message: "Provider not found" });
            return;
        }

        res.json(updated);
    } catch (error) {
        console.error("Error updating provider:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteProvider = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.delete(esimProviders).where(eq(esimProviders.id, id as string));
        res.json({ message: "Provider deleted successfully" });
    } catch (error) {
        console.error("Error deleting provider:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// eSIM Packages
export const getPackages = async (req: Request, res: Response) => {
    try {
        const packages = await db
            .select({
                id: esimPackages.id,
                packageName: esimPackages.packageName,
                slug: esimPackages.slug,
                providerId: esimPackages.providerId,
                featureImage: esimPackages.featureImage,
                price: esimPackages.price,
                about: esimPackages.about,
                ctaLink: esimPackages.ctaLink,
                seoTitle: esimPackages.seoTitle,
                seoDescription: esimPackages.seoDescription,
                isPublished: esimPackages.isPublished,
                createdAt: esimPackages.createdAt,
                updatedAt: esimPackages.updatedAt,
                provider: {
                    id: esimProviders.id,
                    name: esimProviders.name,
                    slug: esimProviders.slug,
                },
            })
            .from(esimPackages)
            .leftJoin(esimProviders, eq(esimPackages.providerId, esimProviders.id));

        res.json(packages);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPublishedPackages = async (req: Request, res: Response) => {
    try {
        const packages = await db
            .select({
                id: esimPackages.id,
                packageName: esimPackages.packageName,
                slug: esimPackages.slug,
                featureImage: esimPackages.featureImage,
                price: esimPackages.price,
                about: esimPackages.about,
                ctaLink: esimPackages.ctaLink,
                seoTitle: esimPackages.seoTitle,
                seoDescription: esimPackages.seoDescription,
                provider: {
                    id: esimProviders.id,
                    name: esimProviders.name,
                    slug: esimProviders.slug,
                },
            })
            .from(esimPackages)
            .leftJoin(esimProviders, eq(esimPackages.providerId, esimProviders.id))
            .where(eq(esimPackages.isPublished, true));

        res.json(packages);
    } catch (error) {
        console.error("Error fetching published packages:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    try {
        const result = await db
            .select({
                id: esimPackages.id,
                packageName: esimPackages.packageName,
                slug: esimPackages.slug,
                featureImage: esimPackages.featureImage,
                price: esimPackages.price,
                about: esimPackages.about,
                ctaLink: esimPackages.ctaLink,
                seoTitle: esimPackages.seoTitle,
                seoDescription: esimPackages.seoDescription,
                provider: {
                    id: esimProviders.id,
                    name: esimProviders.name,
                    slug: esimProviders.slug,
                },
            })
            .from(esimPackages)
            .leftJoin(esimProviders, eq(esimPackages.providerId, esimProviders.id))
            .where(eq(esimPackages.slug, slug as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Package not found" });
            return;
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPackageById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await db
            .select()
            .from(esimPackages)
            .where(eq(esimPackages.id, id as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Package not found" });
            return;
        }

        res.json(result[0]);
    } catch (error) {
        console.error("Error fetching package:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createPackage = async (req: Request, res: Response) => {
    const { packageName, slug, providerId, featureImage, price, about, ctaLink, seoTitle, seoDescription, isPublished } = req.body;

    try {
        const [newPackage] = await db
            .insert(esimPackages)
            .values({
                packageName,
                slug,
                providerId,
                featureImage,
                price,
                about,
                ctaLink,
                seoTitle,
                seoDescription,
                isPublished: isPublished || false,
            })
            .returning();

        res.status(201).json(newPackage);
    } catch (error) {
        console.error("Error creating package:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updatePackage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { packageName, slug, providerId, featureImage, price, about, ctaLink, seoTitle, seoDescription, isPublished } = req.body;

    try {
        const [updated] = await db
            .update(esimPackages)
            .set({
                packageName,
                slug,
                providerId,
                featureImage,
                price,
                about,
                ctaLink,
                seoTitle,
                seoDescription,
                isPublished,
                updatedAt: new Date(),
            })
            .where(eq(esimPackages.id, id as string))
            .returning();

        if (!updated) {
            res.status(404).json({ message: "Package not found" });
            return;
        }

        res.json(updated);
    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deletePackage = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.delete(esimPackages).where(eq(esimPackages.id, id as string));
        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Server error" });
    }
};

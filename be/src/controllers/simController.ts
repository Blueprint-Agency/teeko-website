import { Request, Response } from "express";
import { db } from "../db";
import { simProviders, simPackages, simContentTemplates } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { uploadImageToR2 } from "../utils/upload";

// SIM Providers
export const getProviders = async (req: Request, res: Response) => {
    try {
        const providers = await db.select().from(simProviders);
        res.json(providers);
    } catch (error) {
        console.error("Error fetching providers:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createProvider = async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    try {
        const [newProvider] = await db.insert(simProviders).values({ name, slug }).returning();
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
            .update(simProviders)
            .set({ name, slug })
            .where(eq(simProviders.id, id as string))
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
        await db.delete(simProviders).where(eq(simProviders.id, id as string));
        res.json({ message: "Provider deleted successfully" });
    } catch (error) {
        console.error("Error deleting provider:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// SIM Packages
export const getPackages = async (req: Request, res: Response) => {
    try {
        const packages = await db
            .select({
                id: simPackages.id,
                packageName: simPackages.packageName,
                slug: simPackages.slug,
                providerId: simPackages.providerId,
                featureImage: simPackages.featureImage,
                price: simPackages.price,
                duration: simPackages.duration,
                durationUnit: simPackages.durationUnit,
                about: simPackages.about,
                ctaLink: simPackages.ctaLink,
                seoTitle: simPackages.seoTitle,
                seoDescription: simPackages.seoDescription,
                features: simPackages.features,
                status: simPackages.status,
                publishedAt: simPackages.publishedAt,
                createdAt: simPackages.createdAt,
                updatedAt: simPackages.updatedAt,
                provider: {
                    id: simProviders.id,
                    name: simProviders.name,
                    slug: simProviders.slug,
                },
            })
            .from(simPackages)
            .leftJoin(simProviders, eq(simPackages.providerId, simProviders.id));

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
                id: simPackages.id,
                packageName: simPackages.packageName,
                slug: simPackages.slug,
                featureImage: simPackages.featureImage,
                price: simPackages.price,
                duration: simPackages.duration,
                durationUnit: simPackages.durationUnit,
                about: simPackages.about,
                ctaLink: simPackages.ctaLink,
                seoTitle: simPackages.seoTitle,
                seoDescription: simPackages.seoDescription,
                features: simPackages.features,
                publishedAt: simPackages.publishedAt,
                provider: {
                    id: simProviders.id,
                    name: simProviders.name,
                    slug: simProviders.slug,
                },
            })
            .from(simPackages)
            .leftJoin(simProviders, eq(simPackages.providerId, simProviders.id))
            .where(eq(simPackages.status, "PUBLISHED"));

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
                id: simPackages.id,
                packageName: simPackages.packageName,
                slug: simPackages.slug,
                featureImage: simPackages.featureImage,
                price: simPackages.price,
                duration: simPackages.duration,
                durationUnit: simPackages.durationUnit,
                about: simPackages.about,
                ctaLink: simPackages.ctaLink,
                seoTitle: simPackages.seoTitle,
                seoDescription: simPackages.seoDescription,
                features: simPackages.features,
                publishedAt: simPackages.publishedAt,
                provider: {
                    id: simProviders.id,
                    name: simProviders.name,
                    slug: simProviders.slug,
                },
            })
            .from(simPackages)
            .leftJoin(simProviders, eq(simPackages.providerId, simProviders.id))
            .where(eq(simPackages.slug, slug as string));

        if (result.length === 0) {
            res.status(404).json({ message: "Package not found" });
            return;
        }

        const pkg = result[0];

        // Fetch template for this provider
        const [template] = await db
            .select()
            .from(simContentTemplates)
            .where(eq(simContentTemplates.providerId, pkg.provider?.id as string));

        res.json({
            ...pkg,
            contentTemplate: template || null
        });
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
            .from(simPackages)
            .where(eq(simPackages.id, id as string));

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
    const { packageName, slug, providerId, featureImage, price, duration, about, ctaLink, seoTitle, seoDescription, status, features } = req.body;


    // Validate price
    if (price) {
        // Check if price contains only digits (integers only, no decimals, no other chars)
        const priceRegex = /^\d+$/;
        if (!priceRegex.test(price.toString())) {
            res.status(400).json({ message: "Price must be a whole number (integer) only. No decimals or other characters allowed." });
            return;
        }
    }

    // Validate duration (must be integer if provided)
    if (duration) {
        if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
            res.status(400).json({ message: "Duration must be a positive integer." });
            return;
        }
    }

    try {
        const [newPackage] = await db
            .insert(simPackages)
            .values({
                packageName,
                slug,
                providerId,
                featureImage,
                price: price ? `RM${price}` : null,
                duration: duration ? parseInt(duration.toString(), 10) : 3,
                durationUnit: req.body.durationUnit || "days",
                about,
                ctaLink,
                seoTitle,
                seoDescription,
                features,
                status: status || "DRAFT",
                publishedAt: (status === "PUBLISHED") ? new Date() : null,
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
    const { packageName, slug, providerId, featureImage, price, duration, about, ctaLink, seoTitle, seoDescription, status, features } = req.body;

    let formattedPrice = price;

    // Validate price if it's being updated
    if (price !== undefined && price !== null) {
        const priceStr = price.toString();

        const priceRegex = /^\d+$/;
        if (!priceRegex.test(priceStr)) {
            res.status(400).json({ message: "Price must be a whole number (integer) only. No decimals or other characters allowed." });
            return;
        }

        formattedPrice = `RM${priceStr}`;
    }

    // Validate duration if it's being updated
    if (duration !== undefined && duration !== null) {
        if (!Number.isInteger(Number(duration)) || Number(duration) <= 0) {
            res.status(400).json({ message: "Duration must be a positive integer." });
            return;
        }
    }

    try {
        const [updated] = await db
            .update(simPackages)
            .set({
                packageName,
                slug,
                providerId,
                featureImage,
                price: formattedPrice,
                duration: duration ? parseInt(duration.toString(), 10) : undefined,
                durationUnit: req.body.durationUnit,
                about,
                ctaLink,
                seoTitle,
                seoDescription,
                features,
                status,
                publishedAt: (status === "PUBLISHED") ? new Date() : null,
                updatedAt: new Date(),
            })
            .where(eq(simPackages.id, id as string))
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
        await db.delete(simPackages).where(eq(simPackages.id, id as string));
        res.json({ message: "Package deleted successfully" });
    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Upload SIM image
export const uploadSimImage = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const { simPackageId } = req.body;

        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }

        const imageUrl = await uploadImageToR2(file, "sims");
        console.log("Uploaded SIM image to R2, returning URL:", imageUrl);

        // If simPackageId is provided (e.g. from Edit page), update DB immediately
        if (simPackageId) {
            console.log("Immediate DB update for SIM package", simPackageId, "with URL:", imageUrl);
            await db
                .update(simPackages)
                .set({ featureImage: imageUrl, updatedAt: new Date() })
                .where(eq(simPackages.id, simPackageId));
        }

        res.json({ url: imageUrl });
    } catch (error) {
        console.error("Error uploading SIM image:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

// SIM Content Templates
export const getContentTemplates = async (req: Request, res: Response) => {
    try {
        const templates = await db.select({
            id: simContentTemplates.id,
            providerId: simContentTemplates.providerId,
            features: simContentTemplates.features,
            paymentMethods: simContentTemplates.paymentMethods,
            createdAt: simContentTemplates.createdAt,
            updatedAt: simContentTemplates.updatedAt,
            provider: {
                id: simProviders.id,
                name: simProviders.name,
                slug: simProviders.slug,
            }
        })
            .from(simContentTemplates)
            .leftJoin(simProviders, eq(simContentTemplates.providerId, simProviders.id));
        res.json(templates);
    } catch (error) {
        console.error("Error fetching content templates:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getContentTemplateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [template] = await db.select().from(simContentTemplates).where(eq(simContentTemplates.id, id as string));
        if (!template) {
            res.status(404).json({ message: "Template not found" });
            return;
        }
        res.json(template);
    } catch (error) {
        console.error("Error fetching content template:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createContentTemplate = async (req: Request, res: Response) => {
    const { providerId, features, paymentMethods } = req.body;
    try {
        const [newTemplate] = await db.insert(simContentTemplates).values({
            providerId,
            features,
            paymentMethods
        }).returning();
        res.status(201).json(newTemplate);
    } catch (error) {
        console.error("Error creating content template:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateContentTemplate = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { providerId, features, paymentMethods } = req.body;
    try {
        const [updated] = await db.update(simContentTemplates)
            .set({ providerId, features, paymentMethods, updatedAt: new Date() })
            .where(eq(simContentTemplates.id, id as string))
            .returning();
        if (!updated) {
            res.status(404).json({ message: "Template not found" });
            return;
        }
        res.json(updated);
    } catch (error) {
        console.error("Error updating content template:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteContentTemplate = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.delete(simContentTemplates).where(eq(simContentTemplates.id, id as string));
        res.json({ message: "Template deleted successfully" });
    } catch (error) {
        console.error("Error deleting content template:", error);
        res.status(500).json({ message: "Server error" });
    }
};

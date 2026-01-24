import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash").notNull(),
    role: roleEnum("role").default("USER").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    verificationToken: varchar("verification_token"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull().unique(),
    seoTitle: varchar("seo_title"),
    seoDescription: text("seo_description"),
    isIndexed: boolean("is_indexed").default(true).notNull(),
});

export const restaurants = pgTable("restaurants", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull().unique(),
    locationId: uuid("location_id").references(() => locations.id).notNull(),
    description: text("description"),
    address: text("address"),
    priceRange: varchar("price_range"), // $, $$, $$$
    contactInfo: jsonb("contact_info"), // { phone, website, email }
    reservationUrl: varchar("reservation_url"),
    operatingHours: jsonb("operating_hours"),
    seoTitle: varchar("seo_title"),
    seoDescription: text("seo_description"),
    isIndexed: boolean("is_indexed").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const restaurantImages = pgTable("restaurant_images", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    url: varchar("url").notNull(),
    caption: varchar("caption"),
    isPrimary: boolean("is_primary").default(false).notNull(),
});

export const settings = pgTable("settings", {
    id: uuid("id").defaultRandom().primaryKey(),
    siteTitle: varchar("site_title", { length: 255 }).default("Teeko Advisor"),
    siteDescription: text("site_description").default("Discover amazing restaurants near you."),
    faviconUrl: text("favicon_url"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

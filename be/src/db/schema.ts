import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, pgEnum, numeric, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN", "SUPERADMIN"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash"), // Optional for Google users
    googleId: varchar("google_id").unique(),
    role: roleEnum("role").default("USER").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    verificationToken: varchar("verification_token"),
    verificationCode: varchar("verification_code", { length: 6 }),
    verificationExpires: timestamp("verification_expires"),
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

// Restaurant status enum
export const restaurantStatusEnum = pgEnum("restaurant_status", ["ACTIVE", "INACTIVE"]);

export const restaurants = pgTable("restaurants", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull().unique(),
    locationId: uuid("location_id").references(() => locations.id).notNull(),
    tripAdvisorLocationId: varchar("trip_advisor_location_id").notNull(),
    description: text("description"),
    cuisine: text("cuisine"),
    feature: jsonb("feature"),
    address: text("address"),
    priceRange: varchar("price_range"), // $, $$, $$$
    contactInfo: jsonb("contact_info"), // { phone, website, email }
    reservationUrl: varchar("reservation_url"),
    operatingHours: jsonb("operating_hours"),
    seoTitle: varchar("seo_title"),
    seoDescription: text("seo_description"),
    status: restaurantStatusEnum("status").default("ACTIVE").notNull(),
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
    maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
    googleIndexing: boolean("google_indexing").default(false).notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),

});

// SIM status enum
export const simStatusEnum = pgEnum("sim_status", ["DRAFT", "PUBLISHED", "BIN"]);

// SIM Provider table
export const simProviders = pgTable("sim_providers", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// SIM Package table
export const simPackages = pgTable("sim_packages", {
    id: uuid("id").defaultRandom().primaryKey(),
    packageName: varchar("package_name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    providerId: uuid("provider_id").references(() => simProviders.id).notNull(),
    featureImage: text("feature_image"),
    price: varchar("price", { length: 100 }),
    duration: integer("duration").default(3).notNull(),
    durationUnit: varchar("duration_unit", { length: 20 }).default("days").notNull(),
    about: text("about"),
    ctaLink: text("cta_link"),
    seoTitle: varchar("seo_title"),
    seoDescription: text("seo_description"),
    features: jsonb("features"), // [{ title, description }]
    status: simStatusEnum("status").default("DRAFT").notNull(),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SIM Booking status enum
export const simBookingStatusEnum = pgEnum("sim_booking_status", ["booked", "cancelled", "completed", "expired", "rejected"]);

// SIM Bookings table
export const simBookings = pgTable("sim_bookings", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    simId: uuid("sim_id").references(() => simPackages.id).notNull(),
    quantity: numeric("quantity").default("1").notNull(),
    status: simBookingStatusEnum("status").default("booked").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    verificationCode: varchar("verification_code", { length: 12 }).unique(),
});


// Blog status enum
export const blogStatusEnum = pgEnum("blog_status", ["DRAFT", "PUBLISHED", "BIN"]);

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    metaDescription: text("meta_description"),
    featureImage: text("feature_image"),
    status: blogStatusEnum("status").default("DRAFT").notNull(),
    authorId: uuid("author_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
});

// Blog content blocks (for dynamic headings and paragraphs)
export const blogContentBlocks = pgTable("blog_content_blocks", {
    id: uuid("id").defaultRandom().primaryKey(),
    blogPostId: uuid("blog_post_id").references(() => blogPosts.id).notNull(),
    blockType: varchar("block_type", { length: 50 }).notNull(), // 'h2', 'h3', 'h4', 'paragraph'
    content: text("content").notNull(),
    orderIndex: varchar("order_index", { length: 10 }).notNull(), // For ordering blocks
    locationId: uuid("location_id").references(() => locations.id), // Link to a location
    restaurantId: uuid("restaurant_id").references(() => restaurants.id), // Link to a restaurant
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const restaurantStats = pgTable("restaurant_stats", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    googleStats: jsonb("google_stats"), // { rating, totalReviews, link }
    tripAdvisorStats: jsonb("trip_advisor_stats"), // { rating, totalReviews, link }
});

export const restaurantReviews = pgTable("restaurant_reviews", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    source: varchar("source").notNull(), // google, tripadvisor
    rating: numeric("rating").notNull(),
    userName: varchar("user_name").notNull(),
    description: text("description").notNull(),
    images: jsonb("images"),
});

export const restaurantShortVideos = pgTable("restaurant_short_videos", {
    id: uuid("id").defaultRandom().primaryKey(),
    restaurantId: uuid("restaurant_id").references(() => restaurants.id).notNull(),
    title: varchar("title").notNull(),
    link: varchar("link").notNull(),
    thumbnail: varchar("thumbnail").notNull(),
    source: varchar("source").notNull(),
    channel: varchar("channel").notNull(),
});





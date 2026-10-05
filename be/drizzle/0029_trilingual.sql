ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_slug_unique";--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "locale" varchar(5) DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "translation_group_id" uuid;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "sim_packages" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_locale_slug_unique" UNIQUE("locale","slug");--> statement-breakpoint
-- Every existing post is English and starts its own translation group.
UPDATE "blog_posts" SET "translation_group_id" = "id" WHERE "translation_group_id" IS NULL;

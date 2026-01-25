CREATE TYPE "public"."blog_status" AS ENUM('DRAFT', 'PUBLISHED', 'BIN');--> statement-breakpoint
CREATE TABLE "blog_content_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blog_post_id" uuid NOT NULL,
	"block_type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"order_index" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"meta_description" text,
	"feature_image" text,
	"status" "blog_status" DEFAULT 'DRAFT' NOT NULL,
	"author_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "esim_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"provider_id" uuid NOT NULL,
	"feature_image" text,
	"price" varchar(100),
	"about" text,
	"cta_link" text,
	"seo_title" varchar,
	"seo_description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "esim_packages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "esim_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "esim_providers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_title" varchar(255) DEFAULT 'Teeko Advisor',
	"site_description" text DEFAULT 'Discover amazing restaurants near you.',
	"favicon_url" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blog_content_blocks" ADD CONSTRAINT "blog_content_blocks_blog_post_id_blog_posts_id_fk" FOREIGN KEY ("blog_post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "esim_packages" ADD CONSTRAINT "esim_packages_provider_id_esim_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."esim_providers"("id") ON DELETE no action ON UPDATE no action;
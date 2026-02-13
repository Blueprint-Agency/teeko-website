CREATE TYPE "public"."snippet_position" AS ENUM('HEAD', 'BODY');--> statement-breakpoint
CREATE TYPE "public"."snippet_target" AS ENUM('EVERY_PAGE', 'SPECIFIC_PAGE');--> statement-breakpoint
CREATE TABLE "app_snippets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"position" "snippet_position" NOT NULL,
	"target" "snippet_target" NOT NULL,
	"page_path" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

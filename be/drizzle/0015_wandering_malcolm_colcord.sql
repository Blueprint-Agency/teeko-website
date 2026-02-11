CREATE TYPE "public"."restaurant_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "status" "restaurant_status" DEFAULT 'ACTIVE' NOT NULL;
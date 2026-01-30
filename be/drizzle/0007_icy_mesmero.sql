CREATE TYPE "public"."esim_status" AS ENUM('DRAFT', 'PUBLISHED', 'BIN');--> statement-breakpoint
ALTER TABLE "esim_packages" ADD COLUMN "status" "esim_status" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "esim_packages" DROP COLUMN "is_published";
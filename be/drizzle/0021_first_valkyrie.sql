ALTER TABLE "sim_packages" ADD COLUMN "duration" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "sim_packages" ADD COLUMN "duration_unit" varchar(20) DEFAULT 'days' NOT NULL;
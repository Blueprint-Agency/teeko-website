ALTER TABLE "blog_content_blocks" ADD COLUMN "location_id" uuid;--> statement-breakpoint
ALTER TABLE "blog_content_blocks" ADD COLUMN "restaurant_id" uuid;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "maintenance_mode" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_content_blocks" ADD CONSTRAINT "blog_content_blocks_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_content_blocks" ADD CONSTRAINT "blog_content_blocks_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
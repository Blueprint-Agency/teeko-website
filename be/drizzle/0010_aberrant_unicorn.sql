CREATE TABLE "restaurant_short_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"link" varchar NOT NULL,
	"thumbnail" varchar NOT NULL,
	"source" varchar NOT NULL,
	"channel" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "restaurant_short_videos" ADD CONSTRAINT "restaurant_short_videos_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
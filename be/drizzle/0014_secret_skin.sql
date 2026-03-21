ALTER TYPE "public"."booking_status" RENAME TO "sim_booking_status";--> statement-breakpoint
ALTER TYPE "public"."esim_status" RENAME TO "sim_status";--> statement-breakpoint
ALTER TABLE "esim_bookings" RENAME TO "sim_bookings";--> statement-breakpoint
ALTER TABLE "esim_packages" RENAME TO "sim_packages";--> statement-breakpoint
ALTER TABLE "esim_providers" RENAME TO "sim_providers";--> statement-breakpoint
ALTER TABLE "sim_bookings" RENAME COLUMN "esim_id" TO "sim_id";--> statement-breakpoint
ALTER TABLE "sim_bookings" DROP CONSTRAINT "esim_bookings_verification_code_unique";--> statement-breakpoint
ALTER TABLE "sim_packages" DROP CONSTRAINT "esim_packages_slug_unique";--> statement-breakpoint
ALTER TABLE "sim_providers" DROP CONSTRAINT "esim_providers_slug_unique";--> statement-breakpoint
ALTER TABLE "sim_bookings" DROP CONSTRAINT "esim_bookings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sim_bookings" DROP CONSTRAINT "esim_bookings_esim_id_esim_packages_id_fk";
--> statement-breakpoint
ALTER TABLE "sim_packages" DROP CONSTRAINT "esim_packages_provider_id_esim_providers_id_fk";
--> statement-breakpoint
ALTER TABLE "sim_bookings" ADD CONSTRAINT "sim_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim_bookings" ADD CONSTRAINT "sim_bookings_sim_id_sim_packages_id_fk" FOREIGN KEY ("sim_id") REFERENCES "public"."sim_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim_packages" ADD CONSTRAINT "sim_packages_provider_id_sim_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."sim_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim_bookings" ADD CONSTRAINT "sim_bookings_verification_code_unique" UNIQUE("verification_code");--> statement-breakpoint
ALTER TABLE "sim_packages" ADD CONSTRAINT "sim_packages_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "sim_providers" ADD CONSTRAINT "sim_providers_slug_unique" UNIQUE("slug");
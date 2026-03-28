CREATE TABLE "sim_content_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"features" jsonb,
	"payment_methods" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sim_content_templates_provider_id_unique" UNIQUE("provider_id")
);
--> statement-breakpoint
ALTER TABLE "sim_content_templates" ADD CONSTRAINT "sim_content_templates_provider_id_sim_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."sim_providers"("id") ON DELETE no action ON UPDATE no action;
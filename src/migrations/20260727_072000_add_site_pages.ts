import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/**
 * Adds `pages` collection for editable marketing page shells.
 * Column naming follows Payload drizzle conventions (snake_case nested groups).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_key" AS ENUM(
        'home',
        'shop-home',
        'about',
        'contact',
        'warranty',
        'branding',
        'become-a-supplier',
        'privacy-policy',
        'shop-delivery-returns'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published', 'archived');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" "enum_pages_key" NOT NULL,
      "title" varchar NOT NULL,
      "path" varchar,
      "home_hero_eyebrow" varchar,
      "home_hero_title" varchar,
      "home_hero_lead" varchar,
      "home_hero_image_id" integer,
      "home_hero_image_alt" varchar,
      "home_hero_primary_cta_label" varchar,
      "home_hero_primary_cta_href" varchar,
      "home_hero_secondary_cta_label" varchar,
      "home_hero_secondary_cta_href" varchar,
      "home_hero_metric_label" varchar,
      "home_hero_metric_text" varchar,
      "home_selection_entry_eyebrow" varchar,
      "home_selection_entry_title" varchar,
      "home_selection_entry_lead" varchar,
      "home_directions_eyebrow" varchar,
      "home_directions_title" varchar,
      "home_directions_lead" varchar,
      "home_expertise_eyebrow" varchar,
      "home_expertise_title" varchar,
      "home_expertise_lead" varchar,
      "home_shop_campaign_eyebrow" varchar,
      "home_shop_campaign_title" varchar,
      "home_shop_campaign_lead" varchar,
      "home_shop_campaign_image_id" integer,
      "home_shop_campaign_image_alt" varchar,
      "home_shop_campaign_cta_label" varchar,
      "home_shop_campaign_cta_href" varchar,
      "home_resume_eyebrow" varchar,
      "home_resume_title" varchar,
      "home_resume_lead" varchar,
      "home_resume_primary_cta_label" varchar,
      "home_resume_primary_cta_href" varchar,
      "home_resume_secondary_cta_label" varchar,
      "home_resume_secondary_cta_href" varchar,
      "shop_hero_eyebrow" varchar,
      "shop_hero_title" varchar,
      "shop_hero_lead" varchar,
      "shop_hero_image_id" integer,
      "shop_hero_image_alt" varchar,
      "shop_hero_cta_label" varchar,
      "shop_hero_cta_href" varchar,
      "shop_wheels_intro_kicker" varchar,
      "shop_wheels_intro_eyebrow" varchar,
      "shop_wheels_intro_title" varchar,
      "shop_wheels_intro_lead" varchar,
      "shop_vehicles_eyebrow" varchar,
      "shop_vehicles_title" varchar,
      "shop_vehicles_lead" varchar,
      "shop_vehicles_cta_label" varchar,
      "shop_vehicles_cta_href" varchar,
      "stub_hero_eyebrow" varchar,
      "stub_hero_title" varchar,
      "stub_hero_lead" varchar,
      "stub_hero_image_id" integer,
      "stub_hero_image_alt" varchar,
      "seo_seo_title" varchar,
      "seo_seo_description" varchar,
      "seo_seo_keywords" varchar,
      "seo_og_title" varchar,
      "seo_og_description" varchar,
      "seo_og_image_id" integer,
      "seo_canonical_url" varchar,
      "seo_robots_index" boolean DEFAULT true,
      "seo_robots_follow" boolean DEFAULT true,
      "status" "enum_pages_status" DEFAULT 'draft',
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "pages_key_idx" ON "pages" USING btree ("key");
    CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
    CREATE INDEX IF NOT EXISTS "pages_home_hero_image_idx" ON "pages" USING btree ("home_hero_image_id");
    CREATE INDEX IF NOT EXISTS "pages_home_shop_campaign_image_idx" ON "pages" USING btree ("home_shop_campaign_image_id");
    CREATE INDEX IF NOT EXISTS "pages_shop_hero_image_idx" ON "pages" USING btree ("shop_hero_image_id");
    CREATE INDEX IF NOT EXISTS "pages_stub_hero_image_idx" ON "pages" USING btree ("stub_hero_image_id");
    CREATE INDEX IF NOT EXISTS "pages_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");

    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_home_hero_image_id_media_id_fk"
        FOREIGN KEY ("home_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_home_shop_campaign_image_id_media_id_fk"
        FOREIGN KEY ("home_shop_campaign_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_shop_hero_image_id_media_id_fk"
        FOREIGN KEY ("shop_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_stub_hero_image_id_media_id_fk"
        FOREIGN KEY ("stub_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk"
        FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE TABLE IF NOT EXISTS "pages_shop_order_steps" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "description" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_shop_order_steps" ADD CONSTRAINT "pages_shop_order_steps_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_shop_order_steps_order_idx" ON "pages_shop_order_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_shop_order_steps_parent_id_idx" ON "pages_shop_order_steps" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_shop_category_carousel" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "slide_id" varchar,
      "kicker" varchar,
      "title" varchar,
      "action" varchar,
      "href" varchar,
      "desktop_image_id" integer,
      "mobile_image_id" integer,
      "alt" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_shop_category_carousel" ADD CONSTRAINT "pages_shop_category_carousel_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_shop_category_carousel" ADD CONSTRAINT "pages_shop_category_carousel_desktop_image_id_media_id_fk"
        FOREIGN KEY ("desktop_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_shop_category_carousel" ADD CONSTRAINT "pages_shop_category_carousel_mobile_image_id_media_id_fk"
        FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_shop_category_carousel_order_idx" ON "pages_shop_category_carousel" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_shop_category_carousel_parent_id_idx" ON "pages_shop_category_carousel" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "pages_shop_vehicles_slides" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "title" varchar,
      "image_id" integer,
      "alt" varchar
    );
    DO $$ BEGIN
      ALTER TABLE "pages_shop_vehicles_slides" ADD CONSTRAINT "pages_shop_vehicles_slides_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "pages_shop_vehicles_slides" ADD CONSTRAINT "pages_shop_vehicles_slides_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "pages_shop_vehicles_slides_order_idx" ON "pages_shop_vehicles_slides" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "pages_shop_vehicles_slides_parent_id_idx" ON "pages_shop_vehicles_slides" USING btree ("_parent_id");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx"
      ON "payload_locked_documents_rels" USING btree ("pages_id");

    ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
    DO $$ BEGIN
      ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_pages_fk"
        FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    CREATE INDEX IF NOT EXISTS "payload_preferences_rels_pages_id_idx"
      ON "payload_preferences_rels" USING btree ("pages_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT IF EXISTS "payload_preferences_rels_pages_fk";
    DROP INDEX IF EXISTS "payload_preferences_rels_pages_id_idx";
    ALTER TABLE "payload_preferences_rels" DROP COLUMN IF EXISTS "pages_id";

    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_pages_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_pages_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "pages_id";

    DROP TABLE IF EXISTS "pages_shop_vehicles_slides" CASCADE;
    DROP TABLE IF EXISTS "pages_shop_category_carousel" CASCADE;
    DROP TABLE IF EXISTS "pages_shop_order_steps" CASCADE;
    DROP TABLE IF EXISTS "pages" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_pages_status";
    DROP TYPE IF EXISTS "public"."enum_pages_key";
  `);
}

-- Adjusted-rating production schema: the single shipped scheme denormalized onto
-- `shows`, the trimmed `rater_stats`, per-user display prefs, and the
-- `rating_settings` singleton. Forward-only create — prod never had the throwaway
-- experiment tables, so there is nothing to drop here. Idempotent (guarded /
-- IF NOT EXISTS) so a fresh local prod-restore applies it cleanly too.
--
-- (One-time note: an already-dirty local DB that had run the deleted experiment
-- migrations was converged out-of-band; that cleanup is intentionally NOT part of
-- this migration since it never applies to prod or to a fresh restore.)

-- Enums for rater_stats (guarded — CREATE TYPE has no IF NOT EXISTS).
DO $$ BEGIN
  CREATE TYPE "rater_era" AS ENUM ('GLOBAL', 'ALTMAN', 'AUCOIN', 'MARLON');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE "rateable_kind" AS ENUM ('SHOW', 'TRACK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Per-user rating behavior (derived; maintained by RaterWeightService).
CREATE TABLE IF NOT EXISTS "rater_stats" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "era" "rater_era" NOT NULL,
  "kind" "rateable_kind" NOT NULL,
  "ratings_count" INTEGER NOT NULL DEFAULT 0,
  "entropy" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mean" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "is_excluded" BOOLEAN NOT NULL DEFAULT false,
  "computed_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  CONSTRAINT "rater_stats_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "rater_stats_user_id_era_kind_unique" ON "rater_stats" ("user_id", "era", "kind");
CREATE INDEX IF NOT EXISTS "rater_stats_era_idx" ON "rater_stats" ("era");
DO $$ BEGIN
  ALTER TABLE "rater_stats" ADD CONSTRAINT "fk_rater_stats_users_user_id"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Denormalized adjusted score on shows.
ALTER TABLE "shows" ADD COLUMN IF NOT EXISTS "weighted_rating" DOUBLE PRECISION;
ALTER TABLE "shows" ADD COLUMN IF NOT EXISTS "weighted_ratings_count" INTEGER NOT NULL DEFAULT 0;

-- Per-user display preferences (nullable tri-state: null = no explicit choice).
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "show_adjusted_rating" BOOLEAN;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "show_rating_compare" BOOLEAN;

-- Operational/derived settings singleton.
CREATE TABLE IF NOT EXISTS "rating_settings" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "show_shrink_anchor" DOUBLE PRECISION NOT NULL DEFAULT 4.07,
  "ratings_dirty" BOOLEAN NOT NULL DEFAULT true,
  "last_recompute_at" TIMESTAMP(6),
  CONSTRAINT "rating_settings_pkey" PRIMARY KEY ("id")
);
INSERT INTO "rating_settings" ("id")
  SELECT gen_random_uuid() WHERE NOT EXISTS (SELECT 1 FROM "rating_settings");

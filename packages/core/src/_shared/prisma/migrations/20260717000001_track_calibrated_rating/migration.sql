-- Calibrated Track Rating: denormalized per-track discriminating score + its contributing
-- rater count (recomputed in bulk by the ratings recompute, like shows.weighted_rating).
-- Two new prefs let a viewer opt into the calibrated track score and the compare/debug overlay.
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "discriminating_rating" double precision;
ALTER TABLE "tracks" ADD COLUMN IF NOT EXISTS "discriminating_ratings_count" integer NOT NULL DEFAULT 0;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "track_calibrated_rating" boolean;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "track_rating_compare" boolean;

-- Per-track durations (seconds) with provenance, plus a denormalized show
-- total and a throttle timestamp for lazy external resolution. No backfill:
-- durations populate live from nugs.net / archive.org as shows are viewed.

ALTER TABLE "tracks" ADD COLUMN "duration" INTEGER;
ALTER TABLE "tracks" ADD COLUMN "duration_source" VARCHAR;

ALTER TABLE "shows" ADD COLUMN "duration" INTEGER;
ALTER TABLE "shows" ADD COLUMN "duration_checked_at" TIMESTAMP(6);

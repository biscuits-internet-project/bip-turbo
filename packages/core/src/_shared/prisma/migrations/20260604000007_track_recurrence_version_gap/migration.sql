-- Add a "versions of the song between same-shape/same-flag performances"
-- denominator alongside the existing shows-between gap. The version gap is the
-- meaningful one for recurrence footnotes: it's 0 when the prior version was
-- already the same shape (no shape change), so it suppresses vacuous notes that
-- the shows-between gap produced. Both gaps are derived by the stats rebuild;
-- this migration adds the columns and enqueues a full recompute to fill them.

-- AlterTable
ALTER TABLE "track_flags" ADD COLUMN "flag_version_gap" INTEGER;
ALTER TABLE "track_segue_recurrence" ADD COLUMN "version_gap" INTEGER;

-- Queue a full-catalog recompute so the next deploy's recompute-pending run
-- populates the new columns for every track. Idempotent: skips if a request for
-- the earliest show date already exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "stats_recompute_requests"
    WHERE "since_date" = (SELECT MIN("date")::date FROM "shows" WHERE "date" IS NOT NULL)
  );

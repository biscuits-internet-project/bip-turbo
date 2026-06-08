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
-- populates the new columns for every track. The dedup guard is a HAVING clause
-- (evaluated AFTER aggregation), not a WHERE: a WHERE ... NOT EXISTS filters the
-- pre-aggregation rows, so when a request for the earliest date already exists it
-- empties the set and MIN("date") aggregates to NULL, inserting a bogus
-- (uuid, NULL) row that violates the NOT NULL constraint. HAVING filters the
-- single aggregate row instead, inserting zero rows when the request exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);

-- Queue a full-catalog stats recompute so the next deploy's recompute-pending
-- run populates flag + segue recurrence (track_flags.flag_* and
-- track_segue_recurrence) for every track. The rebuild is recurrence-aware as
-- of this release; recurrence is derived, never synced, so this one-time queue
-- entry is the only thing needed to backfill prod. Idempotent: skips if a
-- request for the earliest show date already exists.
--
-- The dedup guard is a HAVING clause, not WHERE ... NOT EXISTS: on an empty
-- "shows" table (any fresh database) the old form aggregated to a NULL
-- since_date and failed the NOT NULL constraint. HAVING inserts zero rows
-- instead. Edited in place after it ran in prod: on a populated table both forms
-- insert the same row, so prod's applied result is unchanged.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);

-- Queue a full-catalog stats recompute so the next deploy's recompute-pending
-- run populates flag + segue recurrence (track_flags.flag_* and
-- track_segue_recurrence) for every track. The rebuild is recurrence-aware as
-- of this release; recurrence is derived, never synced, so this one-time queue
-- entry is the only thing needed to backfill prod. Idempotent: skips if a
-- request for the earliest show date already exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "stats_recompute_requests"
    WHERE "since_date" = (SELECT MIN("date")::date FROM "shows" WHERE "date" IS NOT NULL)
  );

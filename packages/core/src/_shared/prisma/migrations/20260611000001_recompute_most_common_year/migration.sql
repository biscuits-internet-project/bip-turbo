-- Backfill Song.most_common_year, which until now no code ever wrote (it held
-- stale Rails-import values). The stats rebuild now derives it from
-- yearly_play_data, so enqueue a full-catalog recompute: the deploy-time
-- recompute-pending drains this with rebuildGapsAndSongStatsSince(MIN since_date),
-- repopulating most_common_year for every song.
--
-- HAVING (not WHERE NOT EXISTS) guards the dedup AFTER aggregation, so an
-- already-queued earliest date inserts zero rows instead of one bogus
-- (uuid, NULL) row that would trip the since_date NOT NULL constraint.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);

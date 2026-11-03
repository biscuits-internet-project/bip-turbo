-- Renumber every (show, set) group of tracks to contiguous positions 1..n.
-- Segue and neighbor SQL finds a track's predecessor as `position - 1`, so a hole
-- left by a deleted track hides the segue into the track after it (and yields a
-- bogus "not segued into" recurrence footnote). Segue recurrence is derived data,
-- so a stats recompute is queued from the earliest show that currently has a gap.
-- Idempotent: only rows whose position differs from their rank are touched, and a
-- second run finds no gaps and queues nothing.

-- Queue the recompute BEFORE the renumber, while the gaps are still detectable.
-- HAVING (not WHERE ... NOT EXISTS) so it inserts zero rows, not a NULL row, when
-- no show has a gap or a request for that date already exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("shows"."date")::date
FROM "shows"
WHERE "shows"."date" IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM (
      SELECT "show_id", "position",
             ROW_NUMBER() OVER (PARTITION BY "show_id", "set" ORDER BY "position", "id") AS "rank"
      FROM "tracks"
    ) AS "ranked"
    WHERE "ranked"."show_id" = "shows"."id"
      AND "ranked"."position" <> "ranked"."rank"
  )
HAVING MIN("shows"."date") IS NOT NULL
   AND MIN("shows"."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);

UPDATE "tracks"
SET "position" = "ranked"."rank"
FROM (
  SELECT "id",
         ROW_NUMBER() OVER (PARTITION BY "show_id", "set" ORDER BY "position", "id") AS "rank"
  FROM "tracks"
) AS "ranked"
WHERE "tracks"."id" = "ranked"."id"
  AND "tracks"."position" <> "ranked"."rank";

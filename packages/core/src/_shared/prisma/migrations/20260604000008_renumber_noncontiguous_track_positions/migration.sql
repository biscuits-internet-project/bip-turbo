-- Track positions within a set must be contiguous (1..N): the "prior track in
-- set" logic (segue-in detection for setlist footnotes and the /songs
-- segueIn/segueOut/standalone filters) finds the predecessor at position-1, so a
-- gap (e.g. {1,2,3,5,7}) makes a segued track look standalone. Some shows were
-- imported with non-contiguous positions; this renumbers every gappy set to
-- contiguous order, preserving the existing track sequence. Idempotent:
-- already-contiguous sets are untouched, so re-running (or running after a prod
-- sync that re-introduces gaps) is safe.
WITH renumbered AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (PARTITION BY "show_id", "set" ORDER BY "position") AS new_position
  FROM "tracks"
)
UPDATE "tracks" t
   SET "position" = r.new_position,
       "updated_at" = NOW()
  FROM renumbered r
 WHERE t."id" = r."id"
   AND t."position" <> r.new_position;

-- Renumbering changes within-set order resolution, which feeds segue-in
-- detection and therefore the derived gap / recurrence rows. Queue a
-- full-catalog recompute so the next deploy's recompute-pending run rebuilds
-- them. The dedup guard is a HAVING clause, not WHERE ... NOT EXISTS: the latter
-- empties the set when the request already exists, so MIN("date") aggregates to
-- NULL and inserts a bogus (uuid, NULL) row that violates the NOT NULL
-- constraint. HAVING filters the aggregate row, inserting zero rows instead.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);

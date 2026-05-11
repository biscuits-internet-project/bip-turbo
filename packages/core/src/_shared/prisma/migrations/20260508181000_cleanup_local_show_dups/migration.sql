-- Cleanup migration for show duplicates that exist on local DBs but were
-- already deduplicated on prod. Each affected date has two local rows:
--   * data_slug   — carries attendances/favorites/reviews/annotations
--   * empty_slug  — added later (likely by db-sync-missing-shows pulling the
--                   prod-canonical slug); has setlist + ratings, no user data
-- We merge data_row's user data into the keeper, delete the empty row, then
-- rename the keeper's slug to the prod-canonical name. All gates run by slug
-- so this migration is a no-op on prod (where neither dup pair member exists
-- in their pre-cleanup form).
--
-- Tracks on both rows are byte-identical (verified). Annotations live only on
-- the data row (verified). Ratings carry zero user-overlap between the two
-- rows of any pair (verified). So merging is straightforward UPDATEs.
--
-- This migration runs BEFORE the gap backfill (migration 20260508182000_add_track_gap),
-- so no gap re-backfill is needed here — the gap migration computes everything
-- against already-cleaned data.

BEGIN;

-- Resolve the 14 (data_slug, empty_slug, canonical_slug) triples to row ids.
-- On prod where these slugs don't co-exist, this CTE returns zero rows and
-- every subsequent statement is a no-op.
CREATE TEMP TABLE _show_dup_pairs ON COMMIT DROP AS
WITH pair_inputs(data_slug, empty_slug, canonical_slug) AS (
  VALUES
    ('1998-04-09-next-decade-oakland-pa',                                     '1998-04-09-the-next-decade-pittsburgh-pa',                                 '1998-04-09-the-next-decade-pittsburgh-pa'),
    ('2001-12-04-ziggy-s-winston-salem-nc',                                   '2001-12-04-ziggys-winston-salem-nc',                                       '2001-12-04-ziggys-winston-salem-nc'),
    ('2001-12-05-cat-s-cradle-carrboro-nc',                                   '2001-12-05-cats-cradle-carrboro-nc',                                       '2001-12-05-cats-cradle-carrboro-nc'),
    ('2003-05-27-b-b-king-s-blues-club-new-york-ny',                          '2003-05-27-bb-kings-blues-club-new-york-ny',                               '2003-05-27-bb-kings-blues-club-new-york-ny'),
    ('2006-05-11-9-30-club-washington-dc',                                    '2006-05-11-930-club-washington-dc',                                        '2006-05-11-930-club-washington-dc'),
    ('2007-12-15-caribbean-holidaze-runaway-bay-jamaica',                     '2007-12-15-caribbean-holidaze-runaway-bay',                                '2007-12-15-caribbean-holidaze-runaway-bay'),
    ('2009-02-26-the-new-higher-ground-south-burlington-vt',                  '2009-02-26-higher-ground-south-burlington-vt',                             '2009-02-26-higher-ground-south-burlington-vt'),
    ('2009-02-27-the-new-higher-ground-south-burlington-vt',                  '2009-02-27-higher-ground-south-burlington-vt',                             '2009-02-27-higher-ground-south-burlington-vt'),
    ('2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york', '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny',     '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny'),
    ('2024-01-24-crystal-bay-club-casino-crystal-bay-nv',                     '2024-01-25-crystal-bay-club-casino-crystal-bay-nv',                        '2024-01-25-crystal-bay-club-casino-crystal-bay-nv'),
    ('2024-04-04-the-heights-theater-houston-tx',                             '2024-04-05-the-heights-theater-houston-tx',                                '2024-04-05-the-heights-theater-houston-tx'),
    ('2024-11-07-penn-s-peak-jim-thorpe-pa',                                  '2024-11-07-penns-peak-jim-thorpe-pa',                                      '2024-11-07-penns-peak-jim-thorpe-pa'),
    ('2025-01-17-revolution-hall-portland-oregon',                            '2025-01-17-revolution-hall-portland-or',                                   '2025-01-17-revolution-hall-portland-or'),
    ('2025-02-05-meow-wulf-santa-fe-nm',                                      '2025-02-05-meow-wolf-santa-fe-nm',                                         '2025-02-05-meow-wolf-santa-fe-nm')
)
SELECT
  pi.canonical_slug,
  sd.id AS keeper_id,
  se.id AS dup_id
FROM pair_inputs pi
JOIN shows sd ON sd.slug = pi.data_slug
JOIN shows se ON se.slug = pi.empty_slug;

-- Step 1: ratings (polymorphic; rateable_type='Show'). Zero user-overlap
-- across pairs verified — direct UPDATE is safe.
UPDATE ratings r
SET rateable_id = p.keeper_id
FROM _show_dup_pairs p
WHERE r.rateable_type = 'Show'
  AND r.rateable_id = p.dup_id;

-- Step 2: defensive moves of remaining show-scoped relations. Most are
-- no-ops (the empty rows carry zero user data per verification), but we
-- run them so any drift since verification doesn't silently lose data.
UPDATE attendances a   SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE a.show_id = p.dup_id;
UPDATE favorites f     SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE f.show_id = p.dup_id;
UPDATE reviews rv      SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE rv.show_id = p.dup_id;
UPDATE show_photos sp  SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE sp.show_id = p.dup_id;
UPDATE show_youtubes sy SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE sy.show_id = p.dup_id;
UPDATE show_files sf   SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE sf.show_id = p.dup_id;
UPDATE segue_runs sr   SET show_id = p.keeper_id FROM _show_dup_pairs p WHERE sr.show_id = p.dup_id;

-- (Skipping the previous_performance_show_id NULL-out — that column is
-- added by the next migration, so there's nothing to clear here. The next
-- migration computes gap from scratch against the cleaned-up show set.)

-- Step 3: delete the dup row's tracks. They duplicate the keeper's tracks
-- byte-for-byte (verified) and have no annotations (verified).
DELETE FROM tracks t
USING _show_dup_pairs p
WHERE t.show_id = p.dup_id;

-- Step 5: delete the dup show row.
DELETE FROM shows s
USING _show_dup_pairs p
WHERE s.id = p.dup_id;

-- Step 6: rename keeper's slug to canonical. No-op for pairs where the
-- data row already had the canonical name (e.g. 2009-02-26).
UPDATE shows s
SET slug = p.canonical_slug,
    updated_at = NOW()
FROM _show_dup_pairs p
WHERE s.id = p.keeper_id
  AND s.slug IS DISTINCT FROM p.canonical_slug;

-- Step 7: recompute denormalized counts on each keeper. Ratings/reviews
-- counts are likely the most affected (we just merged ratings from the
-- empty row); photos/youtubes typically already correct.
UPDATE shows s SET
  ratings_count       = COALESCE(rc.cnt, 0),
  average_rating      = COALESCE(rc.avg, 0),
  reviews_count       = COALESCE(rvc.cnt, 0),
  show_photos_count   = COALESCE(spc.cnt, 0),
  show_youtubes_count = COALESCE(syc.cnt, 0),
  updated_at          = NOW()
FROM _show_dup_pairs p
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt, AVG(value)::FLOAT AS avg
  FROM ratings WHERE rateable_type='Show' AND rateable_id = p.keeper_id
) rc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM reviews WHERE show_id = p.keeper_id
) rvc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM show_photos WHERE show_id = p.keeper_id
) spc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM show_youtubes WHERE show_id = p.keeper_id
) syc ON TRUE
WHERE s.id = p.keeper_id;

-- (Gap backfill happens in the next migration, which adds the gap+prev columns
-- and computes them against the already-cleaned show set.)

COMMIT;

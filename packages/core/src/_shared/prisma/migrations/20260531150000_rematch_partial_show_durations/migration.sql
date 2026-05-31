-- Re-resolve track durations for every show that is missing at least one track
-- time. The first per-track duration matcher left gaps and, on a handful of
-- transposed / duplicate-heavy shows, bound some tracks to the wrong copy. The
-- improved matcher (LCS alignment plus leading-article / annotation / number /
-- medley title handling) fixes both, but the lazy resolver never overwrites an
-- already-set same-source value, so those shows would otherwise keep their
-- stale durations forever.
--
-- This clears the non-manual track durations on the affected shows and resets
-- their duration_checked_at, so the lazy resolver repopulates each show from
-- scratch with the improved matcher on its next page view. Manual edits are
-- authoritative and are never touched. Fully-timed shows are left as-is. A
-- track the improved matcher still cannot match stays blank until a later
-- improvement (or an admin) fills it.

BEGIN;

-- Snapshot the target shows BEFORE any clear, so every step below targets the
-- same set even though the clears create new NULLs.
CREATE TEMP TABLE _shows_to_rematch ON COMMIT DROP AS
SELECT DISTINCT show_id AS id FROM tracks WHERE duration IS NULL;

-- Clear non-manual durations on those shows. Manual edits win and survive.
UPDATE tracks t
SET duration = NULL, duration_source = NULL
FROM _shows_to_rematch s
WHERE t.show_id = s.id
  AND t.duration_source IS DISTINCT FROM 'manual';

-- Keep the denormalized show total consistent with the now-cleared tracks
-- (NULL when only cleared tracks remain; the surviving manual sum otherwise).
-- The resolver recomputes this again as it refills.
UPDATE shows sh
SET duration = (SELECT SUM(t.duration) FROM tracks t WHERE t.show_id = sh.id)
WHERE sh.id IN (SELECT id FROM _shows_to_rematch);

-- Make the shows eligible for immediate re-resolution by the lazy resolver.
UPDATE shows sh
SET duration_checked_at = NULL
WHERE sh.id IN (SELECT id FROM _shows_to_rematch);

COMMIT;

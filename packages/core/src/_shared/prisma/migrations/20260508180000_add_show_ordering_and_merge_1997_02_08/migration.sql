-- Adds two columns to shows that downstream stats and ordering depend on:
--   * count_for_stats — false for soundchecks, radio sessions, cancelled shows,
--     and late-night Tractorbeam sets. Excluded from gap, timesPlayed,
--     yearlyPlayData, and the shows-by-year stats aggregate.
--   * day_order      — orders shows that share a date. NULL means "no
--     preference", which falls back to a stable id-based tiebreaker.
--
-- Also merges the 1997-02-08 "Middle East" duplicate (Cambridge venue + Boston
-- venue with same date — same actual show split across two records). After the
-- merge, the Boston venue (slug 'the-middle-east') has no shows and is deleted.
--
-- This migration runs FIRST in the show-cleanup chain. The local-only dup
-- cleanup runs next, then the gap backfill last (so gap data is computed
-- against the cleaned + ordered show set in one pass, no rework).

BEGIN;

-- =========================================================================
-- Schema additions
-- =========================================================================

ALTER TABLE shows
  ADD COLUMN count_for_stats BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN day_order INT;

-- =========================================================================
-- count_for_stats backfill: 9 shows that should not contribute to stats.
-- =========================================================================

UPDATE shows SET count_for_stats = FALSE
WHERE slug IN (
  -- One-off side events: soundchecks, radio sessions, impromptu sets,
  -- late-night Tractorbeam sets, cancelled stubs.
  '2019-07-18-montage-mountain-scranton-pa-2',                   -- VIP soundcheck
  '1999-06-19-sshh-festival-tunetown-campgrounds-cherrytree-pa', -- cancelled (van broke down)
  '2001-05-08-liz-wilde-show-portland-or',                       -- radio call-in
  '1999-05-06-in-the-living-room-with-the-dunhams-atlanta-ga',   -- FM broadcast
  '2010-05-27-pearl-street-mall-boulder-co',                     -- impromptu acoustic
  '2011-04-15-sirius-satellite-studios-new-york-city-ny',        -- studio session
  '2013-12-27-sirius-satellite-studios-new-york-city-ny',        -- studio session
  '2019-12-29-sony-hall-new-york-ny',                            -- 2am Tractorbeam set
  -- Cancelled shows: band did not play (weather, illness, family emergency,
  -- 9/11, hurricane Irene, lighting rig collapsed, ticket sales, etc).
  '1997-09-26-cafe-210-west-state-college-pa',
  '1997-11-12-hungry-charlie-s-syracuse-ny',
  '1998-02-20-university-of-maryland-college-park-md',
  '1998-02-24-new-deal-roadhouse-deal-nj',
  '1998-04-03-new-cheers-club-binghamton-ny',
  '1998-04-04-alpha-delta-phi-trinity-college-hartford-ct',
  '1998-04-17-cliffside-inn-harper-s-ferry-wv',
  '1998-05-06-terrapin-station-college-park-md',
  '1999-03-11-unknown-venue-larmie-wy',
  '1999-04-20-higher-ground-s-burlington-vt',
  '1999-05-22-all-good-music-festival-wilmer-s-park-brandywine-md',
  '1999-08-14-feelin-fine-festival-wilmer-s-park-brandywine-md',
  '1999-10-16-pi-kappa-alpha-oxford-ms',
  '1999-10-17-newby-s-memphis-tn',
  '2001-09-11-water-street-music-hall-rochester-ny',
  '2009-01-28-headliners-music-hall-louisville-ky',
  '2009-03-08',
  '2009-04-07-the-catalyst-santa-cruz-ca',
  '2009-04-09-house-of-blues-san-diego-ca',
  '2009-04-10-house-of-blues-west-hollywood-ca',
  '2009-04-11-house-of-blues-west-hollywood-ca',
  '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl',
  -- Pure studio / radio sessions: short, no normal live audience.
  '1999-06-06-in-the-living-room-with-the-dunhams-atlanta-ga',   -- FM broadcast (taped 5/6/99)
  '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny',
  '2007-12-20-sirius-satellite-studios-new-york-city-ny',
  '2008-03-15-olympic-studios-london-u-k',
  '2010-10-25-diamond-riggs-studios-philadelphia-pa',
  '2020-06-22-the-fillmore-philadelphia-pa'
);

-- =========================================================================
-- day_order backfill. The 19 listed slugs are the "earlier" show on their
-- respective dates → day_order=1. The OTHER row sharing the same date gets
-- day_order=2. Pairs not listed (all 90s) keep day_order=NULL and rely on
-- the id tiebreaker downstream — those can be filled in by hand later
-- through the planned admin UI.
-- =========================================================================

UPDATE shows SET day_order = 1
WHERE slug IN (
  '2000-08-19-croton-point-park-croton-on-hudson-ny',
  '2001-05-08-liz-wilde-show-portland-or',
  '1999-05-06-in-the-living-room-with-the-dunhams-atlanta-ga',
  '2002-08-10-tcc-reading-park-norfolk-va',
  '2006-05-26-three-sister-s-park-chillicothe-il-2',
  '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2',
  '2007-04-22-lincoln-park-zoo-chicago-il',
  '2008-05-24-penn-s-landing-philadelphia-pa',
  '2010-03-26-bicentennial-park-miami-fl',
  '2010-05-27-pearl-street-mall-boulder-co',
  '2010-10-31-charlottesville-pavilion-charlottesville-pa',
  '2011-03-27-bicentennial-park-miami-fl',
  '2011-04-15-sirius-satellite-studios-new-york-city-ny',
  '2013-12-27-sirius-satellite-studios-new-york-city-ny',
  '2014-12-29-best-buy-theater-new-york-ny',
  '2015-04-25-cbw-green-at-uvm-burlington-vermont',
  '2016-04-22-centennial-olympic-park-atlanta-ga',
  '2019-12-28-playstation-theater-new-york-ny'
);

-- The other row of each pair → day_order=2.
UPDATE shows SET day_order = 2
WHERE day_order IS NULL
  AND date IN (SELECT date FROM shows WHERE day_order = 1);

-- =========================================================================
-- 1997-02-08 merge: Middle East Cambridge vs The Middle East Boston are the
-- same venue (Middle East is in Cambridge, the Boston row's city was wrong).
-- Cambridge row carries the setlist (6 tracks); Boston row has no tracks but
-- has a useful note "opening for Moon Boot Lover" that should be preserved.
--
-- Resolution: keep Cambridge (id, slug, setlist all intact). Move Boston's
-- attendance + note onto Cambridge. Delete Boston row, then delete the
-- now-orphaned 'the-middle-east' venue.
-- =========================================================================

-- Capture both ids in the session for clarity. (No DO block needed; we use
-- subqueries by slug throughout so each step gates on the slug existing.)

-- Move attendances that don't conflict (attendances has UNIQUE(user_id, show_id),
-- so a user with attendance on both rows would block the UPDATE). Then delete
-- the leftover Boston attendances — they're effective duplicates.
UPDATE attendances a
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE a.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma')
  AND NOT EXISTS (
    SELECT 1 FROM attendances a2
    WHERE a2.user_id = a.user_id
      AND a2.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
  );
DELETE FROM attendances
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- favorites: no unique constraint on (user_id, show_id). Plain UPDATE.
UPDATE favorites
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- reviews: UNIQUE(show_id, user_id). Same conflict-safe pattern.
UPDATE reviews r
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE r.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma')
  AND NOT EXISTS (
    SELECT 1 FROM reviews r2
    WHERE r2.user_id = r.user_id
      AND r2.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
  );
DELETE FROM reviews
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- ratings: polymorphic, no unique constraint. Plain UPDATE.
UPDATE ratings
SET rateable_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE rateable_type = 'Show'
  AND rateable_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- show_photos / show_youtubes: no unique constraint on show_id. Plain UPDATE.
UPDATE show_photos
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

UPDATE show_youtubes
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- show_files: UNIQUE(show_id, file_id). Conflict-safe pattern.
UPDATE show_files sf
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE sf.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma')
  AND NOT EXISTS (
    SELECT 1 FROM show_files sf2
    WHERE sf2.file_id = sf.file_id
      AND sf2.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
  );
DELETE FROM show_files
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- segue_runs: UNIQUE(show_id, track_ids). Conflict-safe pattern.
UPDATE segue_runs sr
SET show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
WHERE sr.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma')
  AND NOT EXISTS (
    SELECT 1 FROM segue_runs sr2
    WHERE sr2.track_ids = sr.track_ids
      AND sr2.show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma')
  );
DELETE FROM segue_runs
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- Fold Boston's note into Cambridge if Cambridge's note is empty.
UPDATE shows
SET notes = 'opening for Moon Boot Lover',
    updated_at = NOW()
WHERE slug = '1997-02-08-middle-east-cambridge-ma'
  AND (notes IS NULL OR notes = '')
  AND EXISTS (SELECT 1 FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

-- Delete Boston's tracks (none in current data; defensive) then the row.
DELETE FROM tracks
WHERE show_id = (SELECT id FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma');

DELETE FROM shows WHERE slug = '1997-02-08-the-middle-east-boston-ma';

-- Recompute denormalized counts on the Cambridge keeper.
UPDATE shows s SET
  ratings_count       = COALESCE(rc.cnt, 0),
  average_rating      = COALESCE(rc.avg, 0),
  reviews_count       = COALESCE(rvc.cnt, 0),
  show_photos_count   = COALESCE(spc.cnt, 0),
  show_youtubes_count = COALESCE(syc.cnt, 0),
  updated_at          = NOW()
FROM (SELECT id FROM shows WHERE slug = '1997-02-08-middle-east-cambridge-ma') keeper
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt, AVG(value)::FLOAT AS avg
  FROM ratings WHERE rateable_type = 'Show' AND rateable_id = keeper.id
) rc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM reviews WHERE show_id = keeper.id
) rvc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM show_photos WHERE show_id = keeper.id
) spc ON TRUE
LEFT JOIN LATERAL (
  SELECT COUNT(*)::INT AS cnt FROM show_youtubes WHERE show_id = keeper.id
) syc ON TRUE
WHERE s.id = keeper.id;

-- Delete the now-orphaned Boston "The Middle East" venue. Only shows.venue_id
-- references venues, so this is safe once the Boston show row is gone.
DELETE FROM venues
WHERE slug = 'the-middle-east'
  AND NOT EXISTS (SELECT 1 FROM shows WHERE venue_id = venues.id);

COMMIT;

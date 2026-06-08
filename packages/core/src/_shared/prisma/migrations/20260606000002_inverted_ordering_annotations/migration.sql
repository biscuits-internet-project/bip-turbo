-- Reduce non-standard inverted/dyslexic ordering annotations to just their section
-- sequence, the same way 20260606000001 did for the dyslexic-flagged ones. The
-- INVERTED / DYSLEXIC flag captures "inverted"/"dyslexic"; what the flag can't
-- express is a non-standard permutation that involves the middle (or a date, peak,
-- "no middle", etc.), so the bare ordering is kept as the annotation text. The pure
-- two-section "ending before beginning" notes are NOT touched here -- they stay
-- marked/deleted by the rest of the backfill.
--
-- Idempotent: keyed by (slug, set, position), each row matches its prior
-- TODELETE/TOEDIT-marked variants and the bare original, so replay/sync converges.

-- 2001-07-05 Mishawaka -- beginning>end
UPDATE "annotations" a SET "desc" = 'beginning>end', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
  AND a."desc" IN ('TODELETE: inverted; (beginning>end)', 'inverted; (beginning>end)', 'beginning>end');

-- 2024-03-13 Empire Live -- end>beginning>middle
UPDATE "annotations" a SET "desc" = 'end>beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2024-03-13-empire-live-albany-ny' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN ('TODELETE: inverted (end>beginning>middle)', 'inverted (end>beginning>middle)', 'end>beginning>middle');

-- 2024-04-06 Longhorn Ballroom -- end>beginning>middle
UPDATE "annotations" a SET "desc" = 'end>beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN ('TODELETE: inverted (end>beginning>middle)', 'inverted (end>beginning>middle)', 'end>beginning>middle');

-- 2015-09-05 Concord Music Hall -- end>beg>mid
UPDATE "annotations" a SET "desc" = 'end>beg>mid', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2015-09-05-concord-music-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN ('TODELETE: inverted (end>beg>mid)', 'inverted (end>beg>mid)', 'end>beg>mid');

-- 2010-06-10 House of Blues Myrtle Beach -- middle; end>beginning (two tracks)
UPDATE "annotations" a SET "desc" = 'middle; end>beginning', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" IN ('TODELETE: inverted (middle; end>beginning)', 'inverted (middle; end>beginning)', 'middle; end>beginning');
UPDATE "annotations" a SET "desc" = 'middle; end>beginning', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND t."set" = 'S2' AND t."position" = 4
  AND a."desc" IN ('TODELETE: inverted (middle; end>beginning)', 'inverted (middle; end>beginning)', 'middle; end>beginning');

-- 2019-04-26 The Fillmore New Orleans -- mid>end>beg
UPDATE "annotations" a SET "desc" = 'mid>end>beg', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3
  AND a."desc" IN ('TODELETE: inverted (mid>end>beg)', 'inverted (mid>end>beg)', 'mid>end>beg');

-- 2016-07-16 Montage Mountain -- peak>intro>beginning
UPDATE "annotations" a SET "desc" = 'peak>intro>beginning', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 4
  AND a."desc" IN ('TODELETE: inverted (peak>intro>beginning)', 'inverted (peak>intro>beginning)', 'peak>intro>beginning');

-- 2003-04-07 Aggie Theatre -- end>beginning>middle (1st-time recurrence dropped; auto-footnoted)
UPDATE "annotations" a SET "desc" = 'end>beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: 1st time inverted; (end>beginning>middle) BECOMES end>beginning>middle',
    'TODELETE: 1st time inverted; (end>beginning>middle)',
    '1st time inverted; (end>beginning>middle)',
    'end>beginning>middle'
  );

-- 2007-10-19 Canopy Club -- end>beginning>middle
UPDATE "annotations" a SET "desc" = 'end>beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: inverted (end>beginning>middle) BECOMES end>beginning>middle',
    'TODELETE: inverted (end>beginning>middle)',
    'inverted (end>beginning>middle)',
    'end>beginning>middle'
  );

-- 2025-07-10 Summer Stage at Tree House -- end>beginning>middle (prior marker was botched)
UPDATE "annotations" a SET "desc" = 'end>beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: inverted (end>beginning>middle) BECOMES TODELETE: end>beginning>middle',
    'TOEDIT: inverted (end>beginning>middle) BECOMES end>beginning>middle',
    'TODELETE: inverted (end>beginning>middle)',
    'inverted (end>beginning>middle)',
    'end>beginning>middle'
  );

-- 2007-11-01 The Palace Theatre -- end>beg>mid
UPDATE "annotations" a SET "desc" = 'end>beg>mid', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-11-01-the-palace-theatre-albany-ny' AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: inverted (end>beg>mid) BECOMES end>beg>mid',
    'TODELETE: inverted (end>beg>mid)',
    'inverted (end>beg>mid)',
    'end>beg>mid'
  );

-- 2024-11-16 State Theater Portland -- end>beg>mid; with teases + jam
UPDATE "annotations" a SET "desc" = 'end>beg>mid; with ‘Dino Baby’ teases + ‘Walk Like An Egyptian’ (The Bangles) jam', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2024-11-16-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN (
    'TOEDIT: inverted (end>beg>mid); with ‘Dino Baby’ teases + ‘Walk Like An Egyptian’ (The Bangles) jam BECOMES with ‘Dino Baby’ teases + ‘Walk Like An Egyptian’ (The Bangles) jam',
    'inverted (end>beg>mid); with ‘Dino Baby’ teases + ‘Walk Like An Egyptian’ (The Bangles) jam',
    'end>beg>mid; with ‘Dino Baby’ teases + ‘Walk Like An Egyptian’ (The Bangles) jam'
  );

-- 2007-01-07 Culture Room -- middle>beginning>end
UPDATE "annotations" a SET "desc" = 'middle>beginning>end', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN (
    'TOEDIT: inverted (middle>beginning>end) BECOMES middle>beginning>end',
    'TODELETE: inverted (middle>beginning>end)',
    'inverted (middle>beginning>end)',
    'middle>beginning>end'
  );

-- 2007-01-07 Culture Room -- middle, end>beginning (two tracks)
UPDATE "annotations" a SET "desc" = 'middle, end>beginning', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: inverted (middle, end>beginning) BECOMES middle, end>beginning',
    'TODELETE: inverted (middle, end>beginning)',
    'inverted (middle, end>beginning)',
    'middle, end>beginning'
  );
UPDATE "annotations" a SET "desc" = 'middle, end>beginning', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN (
    'TOEDIT: inverted (middle, end>beginning) BECOMES middle, end>beginning',
    'TODELETE: inverted (middle, end>beginning)',
    'inverted (middle, end>beginning)',
    'middle, end>beginning'
  );

-- 2008-07-19 Indian Lookout Country Club -- mid>end>beg
UPDATE "annotations" a SET "desc" = 'mid>end>beg', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2
  AND a."desc" IN (
    'TOEDIT: inverted (mid>end>beg) BECOMES mid>end>beg',
    'TODELETE: inverted (mid>end>beg)',
    'inverted (mid>end>beg)',
    'mid>end>beg'
  );

-- 2008-01-17 Boulder Theater -- mid>end>beg
UPDATE "annotations" a SET "desc" = 'mid>end>beg', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 4
  AND a."desc" IN (
    'TOEDIT: inverted (mid>end>beg) BECOMES mid>end>beg',
    'TODELETE: inverted (mid>end>beg)',
    'inverted (mid>end>beg)',
    'mid>end>beg'
  );

-- 2015-02-20 Electric Factory -- mid>end>beg; with tease
UPDATE "annotations" a SET "desc" = 'mid>end>beg; with ‘Rock Candy’ tease', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN (
    'TOEDIT: inverted (mid>end>beg); with ‘Rock Candy’ tease BECOMES with ‘Rock Candy’ tease',
    'inverted (mid>end>beg); with ‘Rock Candy’ tease',
    'mid>end>beg; with ‘Rock Candy’ tease'
  );

-- 2017-05-28 Three Sisters Park -- no middle (last-time recurrence dropped; auto-footnoted)
UPDATE "annotations" a SET "desc" = 'no middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 5
  AND a."desc" IN (
    'TODELETE: inverted (no middle); Last time inverted 7/26/03 (675 shows)',
    'inverted (no middle); Last time inverted 7/26/03 (675 shows)',
    'no middle'
  );

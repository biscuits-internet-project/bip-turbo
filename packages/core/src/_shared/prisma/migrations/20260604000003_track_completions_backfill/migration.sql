-- Backfill cross-show track completions parsed from free-text annotations.
-- Each links the earlier (unfinished) track to the later track that completes
-- it; both resolved by (show slug, set, position). Idempotent via ON CONFLICT.

-- Correction: the 2017-06-03 Red Rocks Hot Air Balloon (S2.5) is the start of a
-- 3-show chain (6/3 -> 9/23 -> 2018-01-13), not directly completed by 1/13.
-- Remove the stale 6/3 -> 1/13 row so the corrected chain links below apply
-- (earlier_track_id is UNIQUE, so the stale row would otherwise block 6/3 -> 9/23).
DELETE FROM "track_completions" tc
USING "tracks" et, "shows" es, "tracks" lt, "shows" ls
WHERE tc."earlier_track_id" = et."id" AND et."show_id" = es."id"
  AND tc."later_track_id" = lt."id" AND lt."show_id" = ls."id"
  AND es."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND et."set" = 'S2' AND et."position" = 5
  AND ls."slug" = '2018-01-13-anthem-washington-d-c' AND lt."set" = 'S2' AND lt."position" = 6;

-- Correction: 2014-02-20 Jigsaw Earth (S1.2) starts a 3-show chain
-- (2/20 -> 2/21 -> 2/22). Remove the stale 2/20 -> 2/22 row so the corrected
-- 2/20 -> 2/21 link below applies (earlier_track_id is UNIQUE).
DELETE FROM "track_completions" tc
USING "tracks" et, "shows" es, "tracks" lt, "shows" ls
WHERE tc."earlier_track_id" = et."id" AND et."show_id" = es."id"
  AND tc."later_track_id" = lt."id" AND lt."show_id" = ls."id"
  AND es."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND et."set" = 'S1' AND et."position" = 2
  AND ls."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND lt."set" = 'S2' AND lt."position" = 8;

INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-17-revolution-hall-portland-or' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2025-01-18-revolution-hall-portland-oregon' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-28-nokia-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2008-12-30-nokia-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2018-01-13-anthem-washington-d-c' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-11-18-4th-b-san-diego-ca' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-11-19-house-of-blues-west-hollywood-ca' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2017-08-24-lockn-infinity-downs-farm-arrington-va' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-05-02-rhythm-and-brews-chattanooga-tn' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-06-05-house-of-blues-cleveland-oh' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2009-06-06-ft-armistead-park-baltimore-md' AND later."set" = 'S2' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-03-12-the-national-richmond-va' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2022-04-09-mission-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-03-30-town-ballroom-buffalo-ny' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2024-04-02-mercury-ballroom-louisville-ky' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-01-01-playstation-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
-- Run Like Hell chain: 8/30 Union Park S1.2 -> 8/31 Concord S1.5 -> 9/28 Mann E1.2,
-- so 9/28 transitively completes both earlier versions. Drop the stale direct
-- 8/30 -> 9/28 link FIRST (earlier_track_id is UNIQUE, so the re-point below would
-- otherwise hit ON CONFLICT DO NOTHING and never move).
DELETE FROM "track_completions" tc
USING "tracks" earlier, "shows" es, "tracks" later, "shows" ls
WHERE tc."earlier_track_id" = earlier."id" AND earlier."show_id" = es."id"
  AND tc."later_track_id" = later."id" AND later."show_id" = ls."id"
  AND es."slug" = '2013-08-30-union-park-chicago-il' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-08-30-union-park-chicago-il' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2013-08-31-concord-music-hall-chicago-il' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-08-31-concord-music-hall-chicago-il' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-02-26-bearsville-theatre-woodstock-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2025-02-27-the-f-m-kirby-center-wilkes-barre-pa' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-07-08-pine-creek-lodge-livingston-mt' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2023-07-13-showbox-seattle-wa' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-08-10-the-clubhouse-east-hampton-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2023-08-13-bottle-cork-dewey-beach-de' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-06-05-house-of-blues-cleveland-oh' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2009-06-06-ft-armistead-park-baltimore-md' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-04-18-electric-factory-philadelphia-pa' AND earlier."set" = 'S3' AND earlier."position" = 8
  AND ls."slug" = '2009-04-24-madison-theater-covington-ky' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND later."set" = 'S3' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-12-27-palace-theater-albany-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2004-12-30-electric-factory-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-06-12-irving-plaza-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2014-06-14-irving-plaza-new-york-ny' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2008-01-16-aggie-theatre-fort-collins-co' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-09-12-ogden-theater-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2014-09-14-ogden-theater-denver-co' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-09-13-ogden-theater-denver-co' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2014-09-14-ogden-theater-denver-co' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-09-12-ogden-theater-denver-co' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2014-09-14-ogden-theater-denver-co' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-10-23-legends-boone-nc' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2007-10-24-warner-theater-washington-dc' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND later."set" = 'S3' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-02-19-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND later."set" = 'S3' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-03-25-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2016-03-26-the-capitol-theater-port-chester-ny' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-07-14-montage-mountain-scranton-pa' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2016-07-15-montage-mountain-scranton-pa' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2001-06-30-greek-theater-berkeley-ca' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-12-27-concord-music-hall-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2014-12-30-best-buy-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1998-12-30-wetlands-preserve-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1998-12-31-silk-city-diner-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2008-04-05-the-palladium-worcester-ma' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-05-06-the-hook-brooklyn-ny' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2022-04-08-mission-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-04-19-metropol-pittsburgh-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-22-the-bay-center-dewey-beach-de' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-18-georgia-theater-athens-ga' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1998-06-04-blind-tiger-greensboro-nc' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '1998-06-05-jack-straw-s-charlotte-nc' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-08-29-thalia-hall-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2024-08-30-thalia-hall-chicago-il' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-01-02-playstation-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-18-the-roxy-atlanta-ga' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2002-10-19-georgia-theater-athens-ga' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-04-16-ogden-theater-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND later."set" = 'S3' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2009-01-22-majestic-theater-madison-wi' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2008-07-25-dfest-tulsa-ok' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-07-crowbar-state-college-pa' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-04-09-trocadero-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-09-trocadero-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '1999-04-10-recher-theatre-towson-md' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-27-the-palladium-worcester-ma' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-02-05-meow-wolf-santa-fe-nm' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2025-02-08-mission-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-04-16-ogden-theater-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2015-04-25-higher-ground-s-burlington-vt' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-09-26-the-fillmore-san-francisco-ca' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2002-09-27-house-of-blues-west-hollywood-ca' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-04-16-ogden-theater-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2015-04-18-ogden-theater-denver-co' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2009-06-26-house-of-blues-atlantic-city-nj' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2002-11-03-pearl-street-northampton-ma' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-20-zydeco-s-birmingham-al' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-10-21-variety-playhouse-atlanta-ga' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-08-21-the-caverns-above-ground-amphitheater-pelham-tn' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-05-07-jack-straw-s-charlotte-nc' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-05-08-ziggy-s-winston-salem-nc' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND later."set" = 'S3' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-04-04-crystal-bay-club-casino-crystal-bay-nv' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2009-04-05-eureka-theater-eureka-ca' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-03-25-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2023-03-31-mission-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-07-15-roseland-theater-portland-or' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2023-07-18-sapphire-palace-at-blue-lake-casino-blue-lake-ca' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-08-21-the-caverns-above-ground-amphitheater-pelham-tn' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2018-12-09-10-mile-music-hall-frisco-colorado' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2018-12-12-now-sapphire-resort-puerto-morelos' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2018-10-20-the-palladium-worcester-ma' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2018-11-24-palace-theater-albany-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2018-05-18-salvage-station-asheville-nc' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2018-05-19-salvage-station-asheville-nc' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-12-29-playstation-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2017-12-31-playstation-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2022-04-08-mission-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-11-iron-horse-music-hall-northampton-ma' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '1999-09-13-crowbar-state-college-pa' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-12-28-the-silo-reading-pa' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2000-12-31-the-palladium-worcester-ma' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-12-27-the-silo-reading-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2000-12-31-the-palladium-worcester-ma' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-12-28-the-palladium-worcester-ma' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2001-12-29-roseland-ballroom-new-york-ny' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-03-08-whisky-a-go-go-los-angeles-ca' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2002-03-09-whisky-a-go-go-los-angeles-ca' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-27-the-palladium-worcester-ma' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2002-12-28-roseland-ballroom-new-york-ny' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-11-state-theater-ithaca-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2003-04-12-webster-theater-hartford-ct' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-07-amazura-ballroom-jamaica-ny' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-12-06-the-roxy-hollywood-ca' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2006-12-07-the-roxy-hollywood-ca' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '1999-10-07-great-american-music-hall-san-francisco-ca' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-13-crowbar-state-college-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-09-14-wilbert-s-cleveland-oh' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-10-the-palladium-worcester-ma' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '1999-09-11-iron-horse-music-hall-northampton-ma' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-02-28-house-of-blues-boston-ma' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2009-02-28-house-of-blues-boston-ma' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-02-28-house-of-blues-boston-ma' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-01-woodmen-of-the-world-hall-eugene-or' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-11-03-house-of-blues-cleveland-oh' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2007-11-04-town-ballroom-buffalo-ny' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-17-alley-katz-richmond-va' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '1999-04-21-stone-coast-brewing-company-portland-me' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-08-25-saw-mill-ski-area-morris-pa' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-08-25-saw-mill-ski-area-morris-pa' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-06-24-mercury-ballroom-louisville-ky' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2002-04-20-barrymore-theater-madison-wi' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S3' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S3' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2002-09-29-house-of-blues-anaheim-ca' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-03-09-stage-ae-pittsburgh-pa' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2024-03-10-jefferson-theater-charlottesville-va' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-07-21-the-roxy-hollywood-ca' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2023-07-22-belly-up-tavern-solana-beach-ca' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-21-senator-theatre-chico-ca' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2025-01-23-the-catalyst-santa-cruz-ca' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-21-senator-theatre-chico-ca' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2025-01-23-the-catalyst-santa-cruz-ca' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2002-09-29-house-of-blues-anaheim-ca' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-02-01-the-fonda-theatre-hollywood-ca' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2024-02-02-observatory-north-park-san-diego-ca' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2020-10-17-yarmouth-drive-in-west-yarmouth-ma' AND later."set" = 'E1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-05-04-the-riverboat-cajun-queen-new-orleans-la' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2003-05-26-penn-s-landing-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-04-fox-theatre-boulder-co' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2004-01-04-the-nation-washington-dc' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-10-engine-room-houston-tx' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2002-10-11-house-of-blues-new-orleans-la' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-29-the-chance-poughkeepsie-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2002-10-30-state-theater-portland-me' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-03-second-stage-alpine-valley-music-theater-east-troy-wi' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2002-08-05-vogue-theater-indianapolis-in' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-23-9-30-club-washington-dc' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2003-04-24-norva-theater-norfolk-va' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-10-29-zydeco-s-birmingham-al' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2003-10-30-the-parish-new-orleans-la' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-17-neighborhood-theater-charlotte-nc' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2008-04-19-georgia-theater-athens-ga' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-25-canopy-club-urbana-il' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2009-01-29-cannery-ballroom-nashville-tn' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2024-11-14-district-music-hall-norwalk-ct' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-11-02-state-theater-ithaca-ny' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2002-11-03-pearl-street-northampton-ma' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2002-11-08-the-rave-milwaukee-wi' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2002-11-01-orpheum-theater-boston-ma' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2016-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-12-07-the-roxy-hollywood-ca' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2006-12-09-the-independent-san-francisco-ca' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-27-nokia-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2008-12-28-nokia-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-22-jupiter-bar-grill-tuscaloosa-al' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2008-04-23-mcalister-auditorium-new-orleans-la' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-11-nokia-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2008-04-12-nokia-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-01-04-the-nation-washington-dc' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2004-01-06-imperial-majesty-regal-empress-the-open-seas-fl' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-06-norva-theater-norfolk-va' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '2002-04-26-memorial-gymnasium-university-of-virginia-charlottesville-va' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-15-trade-music-festival-farm-trade-tn' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2003-08-16-trade-music-festival-farm-trade-tn' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2016-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-12-30-the-tabernacle-atlanta-ga' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-12-29-the-tabernacle-atlanta-ga' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-11-29-georgia-theater-athens-ga' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2001-12-04-ziggys-winston-salem-nc' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-01-15-twilight-tampa-fl' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2004-01-16-culture-room-fort-lauderdale-fl' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt-2' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-11-14-district-music-hall-norwalk-ct' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2024-11-16-state-theater-portland-me' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-05-haymaker-festival-spotsylvania-va' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2002-10-09-tree-s-dallas-tx' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2007-10-17-bogart-s-cincinnati-oh' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-09-higher-ground-s-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-10-26-rams-head-live-baltimore-md' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2007-10-30-chevrolet-theatre-wallingford-ct' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-10-19-canopy-club-urbana-il' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2007-10-20-first-avenue-minneapolis-mn' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-10-26-rams-head-live-baltimore-md' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2007-10-27-the-f-m-kirby-center-wilkes-barre-pa' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '2002-04-15-the-vanderbilt-plainview-ny' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2002-04-15-the-vanderbilt-plainview-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND later."set" = 'E1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND later."set" = 'E1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2024-04-05-the-heights-theater-houston-tx' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-16-palace-theater-gainesville-fl' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2002-10-17-the-moon-tallahassee-fl' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-04-21-lincoln-theater-raleigh-nc' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2006-04-22-neighborhood-theater-charlotte-nc' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-04-18-starr-hill-charlottesville-va' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2006-04-22-neighborhood-theater-charlotte-nc' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-05-05-vic-theatre-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2006-05-06-tom-lee-park-cellular-south-stage-memphis-tn' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-16-palace-theater-gainesville-fl' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '2002-10-18-the-roxy-atlanta-ga' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-11-14-bluebird-bloomington-in' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2005-07-22-artscape-festival-baltimore-md' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2005-07-23-stone-pony-asbury-park-nj' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2005-07-22-artscape-festival-baltimore-md' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2005-07-23-stone-pony-asbury-park-nj' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-26-memorial-gymnasium-university-of-virginia-charlottesville-va' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-12-29-playstation-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2017-12-30-playstation-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-11-04-showplace-theater-buffalo-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2002-11-06-the-odeon-cleveland-oh' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND earlier."set" = 'S3' AND earlier."position" = 1
  AND ls."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-27-nokia-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 9
  AND ls."slug" = '2009-01-16-the-calvin-northampton-ma' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-27-nokia-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 8
  AND ls."slug" = '2009-01-16-the-calvin-northampton-ma' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-19-midtown-ballroom-bend-or' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2025-02-08-mission-ballroom-denver-co' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2002-12-30-electric-factory-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-30-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND later."set" = 'S3' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-01-26-1stbank-center-broomfield-co' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2013-04-25-boulder-theater-boulder-co' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-10-27-rams-head-live-baltimore-md' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-23-canopy-club-urbana-il' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2000-12-31-the-palladium-worcester-ma' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-26-memorial-gymnasium-university-of-virginia-charlottesville-va' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2002-04-11-somerville-theater-somerville-ma' AND later."set" = 'E1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-07-12-bourbon-room-atlantic-city-nj' AND earlier."set" = 'E1' AND earlier."position" = 3
  AND ls."slug" = '2024-07-13-the-national-richmond-va' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-04-23-headliners-music-hall-louisville-ky' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2009-04-24-madison-theater-covington-ky' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2003-07-27-riverwalk-center-breckenridge-co' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-10-the-galaxy-theatre-santa-ana-ca' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2000-10-12-great-american-music-hall-san-francisco-ca' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2002-05-05-music-midtown-atlanta-ga' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-04-21-terminal-west-atlanta-ga' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2016-04-22-terminal-west-atlanta-georgia' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-23-9-30-club-washington-dc' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2003-04-24-norva-theater-norfolk-va' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-23-9-30-club-washington-dc' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2003-04-24-norva-theater-norfolk-va' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-09-28-hub-lawn-penn-state-university-state-college-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2003-09-29-club-tinks-scranton-pa' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2003-08-13-the-nation-washington-dc' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-27-bluebird-bloomington-in' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2000-10-28-michigan-theater-ann-arbor-mi' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-27-bluebird-bloomington-in' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2000-10-28-michigan-theater-ann-arbor-mi' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-13-great-american-music-hall-san-francisco-ca' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2000-10-14-palookaville-santa-cruz-ca' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-12-great-american-music-hall-san-francisco-ca' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-14-palookaville-santa-cruz-ca' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2000-10-18-crystal-ballroom-portland-or' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2009-10-31-auditorium-theater-chicago-il' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-11-27-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-11-28-electric-factory-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-10-28-state-theater-kalamazoo-mi' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2009-10-31-auditorium-theater-chicago-il' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-12-27-nokia-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2009-12-29-nokia-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-12-26-nokia-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2009-12-31-nokia-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-12-26-nokia-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2009-12-31-nokia-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-08-key-club-los-angeles-ca' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-08-amazura-ballroom-jamaica-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-28-recher-theatre-towson-md' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '1999-10-31-hammerstein-ballroom-new-york-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-12-29-nokia-theater-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 8
  AND ls."slug" = '2009-12-31-nokia-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-08-18-irving-plaza-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2016-08-19-irving-plaza-new-york-ny' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2016-08-19-irving-plaza-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-17-revolution-hall-portland-or' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2025-01-18-revolution-hall-portland-oregon' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-12-27-the-silo-reading-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2002-08-09-marrz-theater-wilmington-nc' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-09-marrz-theater-wilmington-nc' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2002-08-10-tcc-reading-park-norfolk-va' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-26-charlotte-city-fest-charlotte-nc' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2003-04-27-the-spot-boone-nc' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-09-03-bb-kings-blues-club-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2004-09-05-webster-theater-hartford-ct' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-01-woodmen-of-the-world-hall-eugene-or' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-10-06-palookaville-santa-cruz-ca' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-14-the-silo-reading-pa' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2002-08-15-kahunaville-wilmington-de' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-14-the-silo-reading-pa' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2002-08-15-kahunaville-wilmington-de' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-14-the-silo-reading-pa' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2002-08-15-kahunaville-wilmington-de' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-14-the-silo-reading-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2002-08-15-kahunaville-wilmington-de' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-16-rumsey-playfield-central-park-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '2002-08-17-webster-theater-hartford-ct' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-11-the-roxy-hollywood-ca' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2000-10-12-great-american-music-hall-san-francisco-ca' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-19-georgia-theater-athens-ga' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-12-30-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2004-12-31-hammerstein-ballroom-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-23-salansky-farms-union-dale-pa' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2002-08-24-salansky-farms-union-dale-pa' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-28-recher-theatre-towson-md' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-10-29-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-20-zydeco-s-birmingham-al' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '1999-10-21-variety-playhouse-atlanta-ga' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2002-11-08-the-rave-milwaukee-wi' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-09-20-irving-plaza-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-02-16-cajun-house-scottsdale-az' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '1999-02-18-monsoon-s-flagstaff-az' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-02-18-monsoon-s-flagstaff-az' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '1999-02-19-legends-lounge-las-vegas-nv' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-18-visulite-theater-charlotte-nc' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2003-08-19-marrz-theater-wilmington-nc' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-09-10-mountain-park-holyoke-ma' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND later."set" = 'S1' AND later."position" = 10
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-06-10-ziggy-s-by-the-sea-atlantic-beach-nc' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '1999-06-11-magnolia-street-pub-spartanburg-sc' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-06-03-recher-theatre-towson-md' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-06-03-recher-theatre-towson-md' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-05-14-stoned-monkey-huntington-wv' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-05-15-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-05-29-martyr-s-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1999-05-30-big-wu-family-reunion-minneapolis-mn' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-05-28-cicero-s-st-louis-mo' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-05-31-a-live-one-chicago-il' AND later."set" = 'S1' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-02-rialto-theater-tucson-az' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2002-10-04-haymaker-festival-spotsylvania-va' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-21-crocodile-rock-allentown-pa' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2003-08-22-the-bay-center-dewey-beach-de' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2017-12-03-breathless-resort-spa-punta-cana-dominican-republic' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-01-18-crowbar-state-college-pa' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '1999-01-19-flapjack-s-pub-paul-s-pancake-house-dillsburg-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-01-19-flapjack-s-pub-paul-s-pancake-house-dillsburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '1999-01-21-the-haunt-ithaca-ny' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-01-19-flapjack-s-pub-paul-s-pancake-house-dillsburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1999-01-21-the-haunt-ithaca-ny' AND later."set" = 'E1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-01-22-tammany-hall-worcester-ma' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-01-27-rec-room-towson-md' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-03-25-small-planet-east-lansing-mi' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '1999-03-27-graffiti-showcase-pittsburgh-pa' AND later."set" = 'E2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-03-17-saddle-creek-bar-omaha-ne' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '1999-03-18-cabooze-on-the-west-bank-minneapolis-mn' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-03-13-starlight-fort-collins-co' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-03-14-quixote-s-true-blue-aurora-co' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-03-14-quixote-s-true-blue-aurora-co' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-03-17-saddle-creek-bar-omaha-ne' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-17-park-west-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '1999-09-18-barrymore-theater-madison-wi' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-09-29-club-tinks-scranton-pa' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2003-09-30-the-funk-box-baltimore-md' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2010-04-17-the-national-richmond-va' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-04-14-charleston-music-hall-charleston-sc' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2010-04-17-the-national-richmond-va' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2009-01-21-newport-music-hall-columbus-oh' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-17-the-calvin-northampton-ma' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2009-01-21-newport-music-hall-columbus-oh' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-05-28-ogden-theater-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-03-fox-theatre-boulder-co' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S3' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S3' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-11-01-orpheum-theater-boston-ma' AND earlier."set" = 'S2' AND earlier."position" = 7
  AND ls."slug" = '2002-11-02-state-theater-ithaca-ny' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2002-11-02-state-theater-ithaca-ny' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-15-trade-music-festival-farm-trade-tn' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2003-08-16-trade-music-festival-farm-trade-tn' AND later."set" = 'S3' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-01-26-1stbank-center-broomfield-co' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2013-01-27-fox-theatre-boulder-co' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-21-crocodile-rock-allentown-pa' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2026-05-23-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND later."set" = 'E1' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-11-08-brooklyn-steel-brooklyn-ny' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2024-11-09-brooklyn-steel-brooklyn-ny' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-23-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND later."set" = 'S3' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S2' AND earlier."position" = 8
  AND ls."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-07-crowbar-state-college-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '1999-04-10-recher-theatre-towson-md' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2019-11-16-the-national-richmond-va' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2019-11-17-the-national-richmond-va' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-10-31-suwannee-music-park-live-oak-fl' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2025-11-02-brooklyn-bowl-nashville-tn' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-07-02-xl-live-harrisburg-pa' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2025-07-05-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2025-07-11-the-strand-theater-providence-ri' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2019-11-22-si-hall-syracuse-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2019-11-23-si-hall-syracuse-ny' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-07-17-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S3' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2025-07-11-the-strand-theater-providence-ri' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-24-ocean-mist-matunick-ri' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '1999-04-25-college-green-brown-university-providence-ri' AND later."set" = 'S1' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-12-27-palace-theater-albany-ny' AND earlier."set" = 'E1' AND earlier."position" = 3
  AND ls."slug" = '2004-12-31-hammerstein-ballroom-new-york-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-17-the-moon-tallahassee-fl' AND earlier."set" = 'S2' AND earlier."position" = 11
  AND ls."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-11-13-elsewhere-brooklyn-ny' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2008-03-23-debaser-malmo-sweden' AND later."set" = 'S1' AND later."position" = 11
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-11-08-930-club-washington-dc' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2025-11-15-brooklyn-steel-brooklyn-ny' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-11-05-jefferson-theater-charlottesville-va' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2025-11-06-norva-theater-norfolk-va' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2025-11-19-higher-ground-south-burlington-vt' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2018-12-09-10-mile-music-hall-frisco-colorado' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2018-12-12-now-sapphire-resort-puerto-morelos' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-04-25-lincoln-theater-raleigh-nc' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2003-04-26-charlotte-city-fest-charlotte-nc' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-02-18-rams-head-live-baltimore-md' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2010-02-19-lupos-heartbreak-hotel-providence-ri' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-02-18-rams-head-live-baltimore-md' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2010-02-19-lupos-heartbreak-hotel-providence-ri' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2008-04-04-lupos-heartbreak-hotel-providence-ri' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-17-the-calvin-northampton-ma' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-08-12-blackthorne-resort-east-durham-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2023-08-13-bottle-cork-dewey-beach-de' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-07-05-930-club-washington-dc' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-09-20-irving-plaza-new-york-ny' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2017-09-21-irving-plaza-new-york-ny' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2011-12-30-auditorium-theater-chicago-il' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2011-12-31-auditorium-theater-chicago-il' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1998-06-04-blind-tiger-greensboro-nc' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1998-06-05-jack-straw-s-charlotte-nc' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1998-12-03-chameleon-club-lancaster-pa' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '1998-12-09-the-roost-dennison-university-granville-oh' AND later."set" = 'S1' AND later."position" = 9
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-11-01-the-caverns-pelham-tn' AND earlier."set" = 'E1' AND earlier."position" = 2
  AND ls."slug" = '2024-11-02-the-caverns-pelham-tn' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-07-16-indian-lookout-country-club-mariaville-ny' AND earlier."set" = 'S1' AND earlier."position" = 7
  AND ls."slug" = '2009-07-17-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-10-30-the-parish-new-orleans-la' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2003-11-01-dave-s-on-dickson-fayetteville-ar' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2001-09-13-the-majestic-detroit-mi' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2011-12-31-auditorium-theater-chicago-il' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2011-12-30-auditorium-theater-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2011-12-31-auditorium-theater-chicago-il' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2002-10-24-the-nation-washington-dc' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2007-07-22-the-independent-san-francisco-ca' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2020-01-03-the-riviera-theater-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2020-01-04-the-riviera-theater-chicago-il' AND later."set" = 'S1' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-12-29-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2004-12-30-electric-factory-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2004-01-04-the-nation-washington-dc' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2004-01-06-imperial-majesty-regal-empress-the-open-seas-fl' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-10-15-twilight-tampa-fl' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2002-10-16-palace-theater-gainesville-fl' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-02-26-higher-ground-south-burlington-vt' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-02-28-house-of-blues-boston-ma' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-09-23-the-lyric-oxford-ms' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2009-09-25-the-tabernacle-atlanta-ga' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-09-26-tennessee-theater-knoxville-tn' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 6
  AND ls."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-02-02-the-fillmore-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-04-27-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2017-04-28-the-capitol-theater-port-chester-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2022-04-08-mission-ballroom-denver-co' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2022-04-09-mission-ballroom-denver-co' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-08-20-camp-bisco-tunetown-campgrounds-cherrytree-pa' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-08-21-camp-bisco-tunetown-campgrounds-cherrytree-pa' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-30-cervantes-masterpiece-ballroom-denver-co' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2003-08-31-cervantes-masterpiece-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-25-gothic-theater-englewood-co' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2002-07-28-double-diamond-aspen-co' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-11-iron-horse-music-hall-northampton-ma' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '1999-09-13-crowbar-state-college-pa' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND later."set" = 'E1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2003-04-03-fox-theatre-boulder-co' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND earlier."set" = 'S3' AND earlier."position" = 1
  AND ls."slug" = '2003-04-03-fox-theatre-boulder-co' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-10-29-wisconsin-union-theater-madison-wi' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2002-08-09-marrz-theater-wilmington-nc' AND earlier."set" = 'S2' AND earlier."position" = 6
  AND ls."slug" = '2002-08-11-brown-s-island-richmond-va' AND later."set" = 'S2' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1999-04-10-recher-theatre-towson-md' AND later."set" = 'S2' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND later."set" = 'S1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND earlier."set" = 'S2' AND earlier."position" = 9
  AND ls."slug" = '2021-05-18-the-fillmore-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2021-12-30-the-fillmore-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2021-12-31-the-fillmore-philadelphia-pa' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2017-06-01-ogden-theater-denver-co' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2023-12-30-franklin-music-hall-philadelphia-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-09-26-tennessee-theater-knoxville-tn' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2019-11-16-the-national-richmond-va' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2019-11-17-the-national-richmond-va' AND later."set" = 'E1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-02-01-the-fonda-theatre-hollywood-ca' AND earlier."set" = 'E1' AND earlier."position" = 1
  AND ls."slug" = '2024-02-02-observatory-north-park-san-diego-ca' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2025-02-01-the-sound-at-del-mar-del-mar-ca' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2024-02-11-fox-theatre-boulder-co' AND earlier."set" = 'S1' AND earlier."position" = 9
  AND ls."slug" = '2025-02-07-boulder-theater-boulder-co' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2020-10-17-yarmouth-drive-in-west-yarmouth-ma' AND earlier."set" = 'S2' AND earlier."position" = 1
  AND ls."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2020-10-23-montage-mountain-scranton-pa' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-03-25-small-planet-east-lansing-mi' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-03-26-blind-pig-ann-arbor-mi' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'E1' AND earlier."position" = 3
  AND ls."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND later."set" = 'S2' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-01-17-the-calvin-northampton-ma' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '2009-01-22-majestic-theater-madison-wi' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S2' AND earlier."position" = 8
  AND ls."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND later."set" = 'E1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND earlier."set" = 'S2' AND earlier."position" = 9
  AND ls."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND later."set" = 'S2' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-08-31-pine-creek-lodge-livingston-mt' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2012-07-05-930-club-washington-dc' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2025-01-26 Crystal Bay E1.1 Twisted in the Road completes the 2025-01-25 S1.4 version
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2025-01-25-crystal-bay-club-casino-crystal-bay-nv' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2025-01-26-crystal-bay-club-casino-crystal-bay-nv' AND later."set" = 'E1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2021-08-28 Backwoods S1.7 Hot Air Balloon completes the 2021-08-21 Northlands S1.2 version
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2021-08-21-northlands-swanzey-nh' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND later."set" = 'S1' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2017-12-31 PlayStation Theater 7-11 (S3.7) + Mindless Dribble (S3.6) complete the 2017-12-28 versions
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-12-28-playstation-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2017-12-31-playstation-theater-new-york-ny' AND later."set" = 'S3' AND later."position" = 7
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-12-28-playstation-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2017-12-31-playstation-theater-new-york-ny' AND later."set" = 'S3' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2017-09-23 Coney Island S1.6 Hot Air Balloon completes the 2017-06-03 Red Rocks S2.5 version
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND earlier."set" = 'S2' AND earlier."position" = 5
  AND ls."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND later."set" = 'S1' AND later."position" = 6
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2016-01-02 PlayStation Theater S2.3 Astronaut completes the 2015-12-05 Dominican Holidaze S1.4 version
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2015-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND earlier."set" = 'S1' AND earlier."position" = 4
  AND ls."slug" = '2016-01-02-playstation-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2014-02-22 Electric Factory S2.8 Jigsaw Earth also completes the 2014-02-21 S2.4 version (completes both 2/20 + 2/21)
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND earlier."set" = 'S2' AND earlier."position" = 4
  AND ls."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 8
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2009-12-27 Nokia S2.5 Rock Candy completes the 2009-12-26 S1.3 version
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2009-12-26-nokia-theater-new-york-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '2009-12-27-nokia-theater-new-york-ny' AND later."set" = 'S2' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2008-05-24 Electric Factory (day_order 2) S2.1 Morph Dusseldorf completes the
-- earlier 2008-05-24 Penn's Landing (day_order 1) S1.2 version (same date, two shows)
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND later."set" = 'S2' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2003-08-31 Cervantes S1.4 Liquid Lazer completes the unfinished 2003-08-12 Tussey
-- Mountain S1.8 Pat and Dex (Liquid Lazer is a section of Pat and Dex)
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND earlier."set" = 'S1' AND earlier."position" = 8
  AND ls."slug" = '2003-08-31-cervantes-masterpiece-ballroom-denver-co' AND later."set" = 'S1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2000-10-18 Crystal Ballroom E1.4 Pat and Dex completes the unfinished
-- 2000-10-17 Crocodile Cafe S1.2 Liquid Lazer (Liquid Lazer is a section of Pat and Dex).
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND earlier."set" = 'S1' AND earlier."position" = 2
  AND ls."slug" = '2000-10-18-crystal-ballroom-portland-or' AND later."set" = 'E1' AND later."position" = 4
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2000-10-18 Crystal Ballroom E1.5 The Devil's Waltz completes the unfinished
-- 2000-10-17 Crocodile Cafe S1.1 Stone.
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND earlier."set" = 'S1' AND earlier."position" = 1
  AND ls."slug" = '2000-10-18-crystal-ballroom-portland-or' AND later."set" = 'E1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 2000-08-19 Wetlands (night) S1.1 Above the Waves completes the unfinished
-- 2000-08-19 Croton Point Park (early) S1.5 version.
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '2000-08-19-croton-point-park-croton-on-hudson-ny' AND earlier."set" = 'S1' AND earlier."position" = 5
  AND ls."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND later."set" = 'S1' AND later."position" = 1
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- Above the Waves chain: 1999-10-08 Key Club S2.2 is continued by the 1999-10-09
-- Legends Lounge S2.3 version, which is in turn completed by the 1999-10-10
-- Legends Lounge S1.3 version. Re-point 10/8 (was -> 10/10) to -> 10/9, and add
-- 10/9 -> 10/10, forming the chain 10/8 -> 10/9 -> 10/10.
DELETE FROM "track_completions" tc
USING "tracks" et, "shows" es
WHERE tc."earlier_track_id" = et."id" AND et."show_id" = es."id"
  AND es."slug" = '1999-10-08-key-club-los-angeles-ca' AND et."set" = 'S2' AND et."position" = 2;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-08-key-club-los-angeles-ca' AND earlier."set" = 'S2' AND earlier."position" = 2
  AND ls."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND later."set" = 'S2' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND later."set" = 'S1' AND later."position" = 3
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 1999-09-18 Barrymore S1.2 Magellan Reprise completes the unfinished
-- 1999-09-17 Park West (Chicago) S2.3 Magellan.
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-09-17-park-west-chicago-il' AND earlier."set" = 'S2' AND earlier."position" = 3
  AND ls."slug" = '1999-09-18-barrymore-theater-madison-wi' AND later."set" = 'S1' AND later."position" = 2
ON CONFLICT ("earlier_track_id") DO NOTHING;

-- 1999-01-22 Tammany Hall E1.5 Liquid Lazer completes the unfinished
-- 1999-01-21 The Haunt (Ithaca) S1.3 Pat and Dex (Liquid Lazer is a section of Pat and Dex).
INSERT INTO "track_completions" ("earlier_track_id", "later_track_id", "updated_at")
SELECT earlier."id", later."id", now()
FROM "tracks" earlier JOIN "shows" es ON es."id" = earlier."show_id"
CROSS JOIN "tracks" later JOIN "shows" ls ON ls."id" = later."show_id"
WHERE es."slug" = '1999-01-21-the-haunt-ithaca-ny' AND earlier."set" = 'S1' AND earlier."position" = 3
  AND ls."slug" = '1999-01-22-tammany-hall-worcester-ma' AND later."set" = 'E1' AND later."position" = 5
ON CONFLICT ("earlier_track_id") DO NOTHING;

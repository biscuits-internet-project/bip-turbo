-- Backfill structured track flags (dyslexic/inverted/unfinished) parsed from
-- free-text annotations. Idempotent: tracks resolved by (show slug, set,
-- position); ON CONFLICT keeps re-application safe after a data resync.

INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1997-12-28-university-concert-hall-college-park-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-01-28-8-x-10-club-baltimore-md' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-01-29-cafe-210-west-state-college-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-18-revolution-hall-portland-oregon' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-16-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-21-senator-theatre-chico-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-13-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-12-09-the-roost-dennison-university-granville-oh' AND t."set" = 'S1' AND t."position" = 12
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-14-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-15-empire-garage-austin-tx' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-08-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-16-aggie-theatre-fort-collins-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-13-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-28-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-19-house-of-blues-west-hollywood-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-08-24-lockn-infinity-downs-farm-arrington-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-02-crystal-ballroom-portland-or' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-09-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-10-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-24-mercury-ballroom-louisville-ky' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-04-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-25-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-05-meow-wolf-santa-fe-nm' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-06-palookaville-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-26-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-28-hub-lawn-penn-state-university-state-college-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-21-senator-theatre-chico-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-26-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-14-district-music-hall-norwalk-ct' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-02-mercury-ballroom-louisville-ky' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-08-19-croton-point-park-croton-on-hudson-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-29-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-13-showbox-seattle-wa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-13-bottle-cork-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-09-marrz-theater-wilmington-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-29-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-27-house-of-blues-west-hollywood-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-02-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-07-crowbar-state-college-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-06-27-the-roxy-new-york-ny' AND t."set" = 'E1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-24-madison-theater-covington-ky' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-15-trancegression-copper-mountain-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-08-25-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-25-lincoln-theater-washington-d-c' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-15-mccarren-park-pool-williamsburg-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-30-chameleon-club-lancaster-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-09-the-revolution-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-10-engine-room-houston-tx' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-21-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-06-27-the-roxy-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-06-27-the-roxy-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-06-27-the-roxy-new-york-ny' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-15-summer-set-music-and-camping-festival-somerset-wi' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-07-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-25-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-24-warner-theater-washington-dc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-04-sherman-theater-stroudsburg-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-01-03-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-06-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-14-palookaville-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-26-fuji-rock-festival-naeba-japan' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-26-fuji-rock-festival-naeba-japan' AND t."set" = 'S1' AND t."position" = 13
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-26-fuji-rock-festival-naeba-japan' AND t."set" = 'S1' AND t."position" = 14
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-06-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-07-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-08-la-zona-rosa-austin-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-08-la-zona-rosa-austin-tx' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-08-la-zona-rosa-austin-tx' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-07-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-24-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-01-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-15-empire-garage-austin-tx' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-07-french-broad-river-brewery-asheville-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-24-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-08-25-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-05-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-03-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-04-sherman-theater-stroudsburg-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-26-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-27-locust-club-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-27-locust-club-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-26-the-vanderbilt-plainview-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-26-the-vanderbilt-plainview-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-26-metro-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-26-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-01-ziggy-s-winston-salem-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-09-terrace-club-princeton-university-princeton-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-16-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-16-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-15-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-11-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-15-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-06-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-06-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-26-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-26-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-27-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-27-concord-music-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-30-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-30-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-16-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-23-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-28-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-24-bottle-cork-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-03-house-of-blues-cleveland-oh' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-31-the-tabernacle-atlanta-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-06-05-westville-music-bowl-new-haven-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-05-haymaker-festival-spotsylvania-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-01-murat-egyptian-room-indianapolis-in' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-29-ventura-theater-ventura-ca' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-26-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-30-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-30-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-16-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-08-whisky-a-go-go-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-15-liberty-hall-lawrence-ks' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-15-liberty-hall-lawrence-ks' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-12-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-03-26-dr-phillips-center-for-the-performing-arts-front-lawn-orlando-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-18-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-18-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-14-the-queen-wilmington-de' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-09-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-20-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-20-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-12-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-12-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-05-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-01-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-05-house-of-blues-cleveland-oh' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-20-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-26-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-05-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-17-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-23-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-20-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-16-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-16-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-03-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-03-house-of-blues-cleveland-oh' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-03-house-of-blues-cleveland-oh' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-10-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-18-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-18-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-28-avalon-ballroom-boston-ma' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-04-showplace-theater-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-04-showplace-theater-buffalo-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-29-ventura-theater-ventura-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-05-lafayette-square-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-20-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-20-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-13-the-tabernacle-atlanta-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-26-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-26-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-12-30-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-19-bearsville-theatre-woodstock-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-19-bearsville-theatre-woodstock-ny' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-26-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-26-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-26-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-19-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-09-18-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-07-rio-theater-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-22-peoria-riverfront-peoria-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-25-infinity-music-hall-hartford-ct' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-30-the-funk-box-baltimore-md' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-04-the-state-theater-state-college-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-26-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-18-palladium-ballroom-dallas-tx' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-26-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-12-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-01-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-04-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-24-the-nation-washington-dc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-04-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-02-rothbury-music-festival-rothbury-mi' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-16-showbox-seattle-wa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-17-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-23-palace-theater-albany-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-12-30-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-28-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-04-showplace-theater-buffalo-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-09-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-23-the-lyric-oxford-ms' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-30-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-22-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-19-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-15-trade-music-festival-farm-trade-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-19-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-19-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-09-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-27-palace-theater-albany-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-28-church-of-universal-love-and-music-acme-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-27-palace-theater-albany-ny' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-25-dfest-tulsa-ok' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-26-the-riverfront-belvedere-louisville-ky' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-01-murat-egyptian-room-indianapolis-in' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-11-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-01-murat-egyptian-room-indianapolis-in' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-01-murat-egyptian-room-indianapolis-in' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-22-belly-up-tavern-solana-beach-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-10-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-04-lafayette-square-buffalo-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-05-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-18-the-roxy-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-03-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-09-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-22-majestic-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-22-si-hall-syracuse-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-03-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-26-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-01-04-the-riviera-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-06-the-sanctuary-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-03-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-02-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-13-roxy-nightclub-boston-ma' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-29-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-25-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-29-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-17-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-21-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-21-the-fillmore-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-13-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-03-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-28-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-10-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-08-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-29-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-09-whisky-a-go-go-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-29-house-of-blues-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-24-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-cbw-green-at-uvm-burlington-vermont' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-cbw-green-at-uvm-burlington-vermont' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-07-crowbar-state-college-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-19-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-19-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-30-house-of-blues-chicago-il' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-19-janus-landing-st-petersburg-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-15-the-vanderbilt-plainview-ny' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-25-gothic-theater-englewood-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-28-double-diamond-aspen-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-09-marrz-theater-wilmington-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-29-house-of-blues-anaheim-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-01-bash-on-ash-tempe-az' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-02-rialto-theater-tucson-az' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-02-rialto-theater-tucson-az' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-11-house-of-blues-new-orleans-la' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-24-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-25-grand-cayman-ballroom-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-25-grand-cayman-ballroom-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-26-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-27-locust-club-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-29-the-chance-poughkeepsie-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-02-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-08-the-rave-milwaukee-wi' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-08-the-rave-milwaukee-wi' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-05-31-moose-river-amphitheatre-lyonsdale-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-03-belly-up-tavern-solana-beach-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-06-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-31-cervantes-masterpiece-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-05-27-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-05-28-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-07-22-artscape-festival-baltimore-md' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-07-24-exit2-nightclub-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-08-27-skye-top-festival-grounds-van-etten-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-31-franklin-music-hall-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-29-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-30-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-30-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-08-27-skye-top-festival-grounds-van-etten-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-12-30-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-12-29-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-02-23-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-02-24-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-03-10-the-revolution-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-15-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-15-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-27-earth-link-live-atlanta-ga' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-28-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-26-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-26-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-08-wakarusa-festival-lawrence-ks' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-16-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-17-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-22-stone-pony-asbury-park-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-22-stone-pony-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-23-stone-pony-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-10-state-theatre-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-11-the-moon-tallahassee-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-09-vic-theatre-chicago-il' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-11-the-moon-tallahassee-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-12-bouckaert-farm-fairburn-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-05-08-joy-theater-new-orleans-la' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-24-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-24-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-25-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-23-legends-boone-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-23-legends-boone-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-13-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-01-dave-s-on-dickson-fayetteville-ar' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-09-vic-theatre-chicago-il' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-23-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-23-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-06-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-08-lincoln-theatre-street-stage-raleigh-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-30-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-28-church-of-universal-love-and-music-acme-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-28-church-of-universal-love-and-music-acme-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-22-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-24-bottle-cork-dewey-beach-de' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-06-ft-armistead-park-baltimore-md' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-05-27-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-06-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-05-house-of-blues-cleveland-oh' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-04-lafayette-square-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-cbw-green-at-uvm-burlington-vermont' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-14-culture-room-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-13-roxy-nightclub-boston-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-05-04-the-riverboat-cajun-queen-new-orleans-la' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-09-wakarusa-festival-lawrence-ks' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-15-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt-2' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt-2' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-12-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-07-pine-creek-lodge-livingston-montana' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-05-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-15-liberty-hall-lawrence-ks' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-25-hi-fi-annex-indianapolis-in' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-01-bash-on-ash-tempe-az' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-03-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-10-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-12-blackthorne-resort-east-durham-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-21-variety-playhouse-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-01-wett-bar-vancouver-bc' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-29-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-25-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-24-madison-theater-covington-ky' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-23-headliners-music-hall-louisville-ky' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-20-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-14-blackthorne-resort-east-durham-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-21-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-21-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-30-the-galaxy-theatre-santa-ana-ca' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-27-seatgeek-stadium-campus-bridgeview-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-27-seatgeek-stadium-campus-bridgeview-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-28-riverfront-live-cincinnati-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-28-riverfront-live-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-08-grand-opera-house-wilmington-de' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-09-southside-stage-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-10-southside-stage-xl-live-harrisburg-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-10-southside-stage-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-26-the-bluestone-columbus-oh' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-07-pine-creek-lodge-livingston-montana' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-19-midtown-ballroom-bend-or' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-19-midtown-ballroom-bend-or' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-10-jefferson-theater-charlottesville-va' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-03-tremont-music-hall-charlotte-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-13-club-laga-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-26-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-04-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-23-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-19-the-eastern-atlanta-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-19-the-eastern-atlanta-ga' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-27-suwannee-music-park-live-oak-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-27-suwannee-music-park-live-oak-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-29-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-11-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-30-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-19-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-19-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-17-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-05-eureka-theater-eureka-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-30-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-07-pine-creek-lodge-livingston-montana' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-06-abayance-bay-marina-rexford-mt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-24-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-03-house-of-blues-cleveland-oh' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-10-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-23-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-29-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-31-cervantes-masterpiece-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-13-great-american-music-hall-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-12-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-12-29-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-12-31-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-12-31-the-riviera-theater-chicago-il' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-18-house-of-blues-cleveland-oh' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-19-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-19-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-19-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-10-southside-stage-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-05-eureka-theater-eureka-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-02-03-palace-theater-albany-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-02-03-palace-theater-albany-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-02-03-palace-theater-albany-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-05-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-04-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-04-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-11-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-12-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-04-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-03-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-03-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-13-starlight-fort-collins-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-25-small-planet-east-lansing-mi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-15-liberty-hall-lawrence-ks' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-18-revolution-hall-portland-oregon' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-11-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-17-alley-katz-richmond-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-09-10-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-09-11-iron-horse-music-hall-northampton-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-08-house-of-blues-dallas-tx' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-01-woodmen-of-the-world-hall-eugene-or' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-08-key-club-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-30-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-04-the-lyric-oxford-ms' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-30-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-04-01-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-04-01-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-04-01-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-04-01-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-13-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-25-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-07-wonderland-forest-lafayette-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-12-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-18-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-18-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-12-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-24-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-21-senator-theatre-chico-ca' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-12-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-06-music-farm-charleston-sc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-11-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-11-hippodrome-theatre-baltimore-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-25-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-05-lafayette-square-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-25-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-26-tennessee-theater-knoxville-tn' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-10-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-11-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-12-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-04-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-02-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-29-wisconsin-union-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-18-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-09-05-concord-music-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-22-the-catalyst-santa-cruz-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-27-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-25-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-25-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-29-thalia-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-12-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-05-norva-theater-norfolk-va' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-04-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-28-house-of-blues-boston-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-02-the-capitol-theater-port-chester-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-11-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-14-charleston-music-hall-charleston-sc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-30-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-25-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-20-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-09-mission-ballroom-denver-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-04-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-06-webster-theater-hartford-ct' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-12-bouckaert-farm-fairburn-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-09-whisky-a-go-go-los-angeles-ca' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-04-ziggys-winston-salem-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-12-bouckaert-farm-fairburn-ga' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-20-penn-s-peak-jim-thorpe-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-13-showbox-seattle-wa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-20-harpa-concert-hall-reykjavik' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-25-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-29-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-10-infinity-music-hall-hartford-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-09-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-09-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-05-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-10-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-26-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-26-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-22-centennial-olympic-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-15-count-basie-theater-red-bank-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-15-count-basie-theater-red-bank-nj' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-16-mulcahy-s-wantagh-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-06-french-broad-river-brewery-asheville-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-26-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-26-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-26-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-08-house-of-blues-dallas-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-06-stubb-s-bar-b-q-austin-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-05-cain-s-ballroom-tulsa-ok' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-16-mulcahy-s-wantagh-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-16-mulcahy-s-wantagh-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-17-mulcahy-s-wantagh-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-17-mulcahy-s-wantagh-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-03-stony-creek-beer-branford-ct' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-22-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-22-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-27-el-rey-theater-los-angeles-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-27-el-rey-theater-los-angeles-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-08-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-18-revolution-hall-portland-oregon' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-03-king-cat-theatre-seattle-wa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-15-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-03-iron-city-birmingham-al' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-13-bottle-cork-dewey-beach-de' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-01-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-09-stage-ae-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-09-17-park-west-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-12-knitting-factory-spokane-wa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-13-showbox-seattle-wa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-19-saint-louis-music-park-maryland-heights-mo' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-03-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-02-xl-live-harrisburg-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-01-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-26-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-21-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-21-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-20-first-avenue-minneapolis-mn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-24-delmar-hall-st-louis-mo' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-24-the-warfield-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-15-empire-garage-austin-tx' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-12-blackthorne-resort-east-durham-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-04-the-lyric-oxford-ms' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-20-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-20-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-20-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-21-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-22-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-10-the-clubhouse-east-hampton-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-23-the-catalyst-santa-cruz-ca' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-23-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-24-the-warfield-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-25-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-05-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-05-the-heights-theater-houston-tx' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-07-belly-up-aspen-aspen-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-06-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-21-schuba-s-chicago-il' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-21-schuba-s-chicago-il' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-27-graffiti-showcase-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-15-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-04-22-centennial-olympic-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-04-22-terminal-west-atlanta-georgia' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-01-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-01-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-18-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-18-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-18-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-19-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-19-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-13-roxy-nightclub-boston-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-27-graffiti-showcase-pittsburgh-pa' AND t."set" = 'E2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-06-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-19-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-03-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-03-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-15-kahunaville-wilmington-de' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-25-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-15-kahunaville-wilmington-de' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-03-08-the-strand-theater-providence-ri' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-20-first-avenue-minneapolis-mn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-22-pabst-theater-milwaukee-wi' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-04-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-04-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-19-dobson-ice-arena-vail-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-27-graffiti-showcase-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-17-the-moon-tallahassee-fl' AND t."set" = 'S2' AND t."position" = 11
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-27-graffiti-showcase-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-16-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-30-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-27-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-01-the-palace-theatre-albany-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-18-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-27-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-10-norva-theater-norfolk-va' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-28-the-palladium-times-square-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-25-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-31-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-08-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-26-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-27-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-07-aggie-theatre-fort-collins-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-07-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-07-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-07-wonderland-forest-lafayette-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-11-16-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-23-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-24-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-01-the-sound-at-del-mar-del-mar-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-white-eagle-hall-jersey-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-27-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-30-franklin-music-hall-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-09-tree-s-dallas-tx' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-15-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-31-franklin-music-hall-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-31-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-25-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-03-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-31-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-30-the-valarium-knoxville-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-29-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-01-the-palace-theatre-albany-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-01-the-fonda-theatre-hollywood-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-05-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-05-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-27-imagine-festival-atlanta-motor-speedway-atlanta-georgia' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-09-09-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-24-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-02-observatory-north-park-san-diego-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-06-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-07-belly-up-aspen-aspen-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-31-the-mayan-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-10-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-16-aggie-theatre-fort-collins-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-23-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-23-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-23-vogue-theater-indianapolis-in' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-22-pabst-theater-milwaukee-wi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-24-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-24-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-30-the-valarium-knoxville-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-30-the-valarium-knoxville-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-30-the-valarium-knoxville-tn' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-17-neighborhood-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-17-neighborhood-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-29-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-16-coolray-field-lawrenceville-ga' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-13-variety-playhouse-atlanta-ga' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-08-13-ski-lodge-berkshire-mountain-music-festival-butternut-ski-basin-great-barrington-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-penn-s-landing-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-08-the-rave-milwaukee-wi' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-03-gem-jam-festival-tucson-az' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-27-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-11-the-orange-peel-asheville-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-03-iron-city-birmingham-al' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-12-brooklyn-bowl-nashville-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-19-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-28-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-28-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-28-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-18-the-roxy-atlanta-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co-vip-afternoon' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-27-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-25-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-30-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-07-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-06-26-mchenry-outdoor-theater-mchenry-il' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-cbw-green-at-uvm-burlington-vermont' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-25-cbw-green-at-uvm-burlington-vermont' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-29-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-01-the-roxy-atlanta-ga' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-01-the-roxy-atlanta-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-27-seatgeek-stadium-campus-bridgeview-il' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-27-seatgeek-stadium-campus-bridgeview-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-28-riverfront-live-cincinnati-oh' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-30-saranac-brewery-utica-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-11-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-18-the-eastern-atlanta-ga' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-18-the-eastern-atlanta-ga' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-08-the-rave-milwaukee-wi' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-10-20-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-21-northlands-swanzey-nh' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-22-majestic-theater-madison-wi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-17-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-17-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-17-the-moon-tallahassee-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-05-26-solshine-music-arts-reverie-chillicothe-il' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-27-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-22-peoria-riverfront-peoria-il' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-21-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-29-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-04-marquee-theatre-tempe-az' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-28-the-intersection-grand-rapids-mi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-01-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-07-the-new-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-18-4th-b-san-diego-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-22-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-03-the-fillmore-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-29-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-05-29-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-10-the-lawn-white-river-state-park-indianapolis-in' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-20-the-orange-peel-asheville-nc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-30-the-valarium-knoxville-tn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-08-lincoln-theatre-street-stage-raleigh-nc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-08-lincoln-theatre-street-stage-raleigh-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-08-lincoln-theatre-street-stage-raleigh-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-21-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-23-vogue-theater-indianapolis-in' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-04-marquee-theatre-tempe-az' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-02-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-31-franklin-music-hall-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-16-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-28-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-25-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-23-mcalister-auditorium-new-orleans-la' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-29-thalia-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-30-thalia-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-26-memorial-gymnasium-university-of-virginia-charlottesville-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-24-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-29-meatcamp-boone-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-29-meatcamp-boone-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-29-meatcamp-boone-nc' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-05-music-midtown-atlanta-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-06-22-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-24-delmar-hall-st-louis-mo' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-24-delmar-hall-st-louis-mo' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-30-the-tabernacle-atlanta-ga' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-02-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-14-district-music-hall-norwalk-ct' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-15-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-14-district-music-hall-norwalk-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-28-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-10-revolution-hall-troy-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-27-the-spot-boone-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-20-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-20-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-10-31-woodmen-of-the-world-hall-eugene-or' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-16-rumsey-playfield-central-park-new-york-ny' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-01-the-fonda-theatre-hollywood-ca' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-08-24-lockn-infinity-downs-farm-arrington-va' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-05-meow-wolf-santa-fe-nm' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-03-gem-jam-festival-tucson-az' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-24-congress-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-24-congress-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-30-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-27-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-11-the-strand-theater-providence-ri' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-30-thalia-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-04-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-14-trancegression-copper-mountain-co' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-18-the-rave-milwaukee-wi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-29-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-05-sony-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-05-sony-hall-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-08-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-08-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-01-19-flapjack-s-pub-paul-s-pancake-house-dillsburg-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-19-saint-louis-music-park-maryland-heights-mo' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-05-meow-wolf-santa-fe-nm' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-10-xl-live-harrisburg-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-03-08-the-strand-theater-providence-ri' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-16-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-20-infinity-music-hall-hartford-ct' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-21-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-25-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-26-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-26-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-01-bash-on-ash-tempe-az' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-17-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-01-bash-on-ash-tempe-az' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-27-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-02-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-07-house-of-blues-houston-tx' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-24-congress-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-23-first-avenue-minneapolis-mn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-11-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-11-hippodrome-theatre-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-23-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-12-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-12-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-13-club-laga-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-13-club-laga-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-30-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-09-the-revolution-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-09-the-revolution-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-13-bouckaert-farm-fairburn-ga' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-18-lupo-s-heartbreak-hotel-providence-ri' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-28-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-17-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-01-the-palace-theatre-albany-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-01-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-01-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-17-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-30-chevrolet-theatre-wallingford-ct' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-30-chevrolet-theatre-wallingford-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-30-chevrolet-theatre-wallingford-ct' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-20-first-avenue-minneapolis-mn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-27-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-23-legends-boone-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-05-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-06-abayance-bay-marina-rexford-mt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-01-04-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-09-pine-creek-lodge-livingston-montana' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-09-pine-creek-lodge-livingston-montana' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-18-sapphire-palace-at-blue-lake-casino-blue-lake-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-18-sapphire-palace-at-blue-lake-casino-blue-lake-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-19-harrah-s-lake-tahoe-stateline-nv' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-19-harrah-s-lake-tahoe-stateline-nv' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-02-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-28-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-19-harrah-s-lake-tahoe-stateline-nv' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-12-starland-ballroom-sayreville-nj' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-12-starland-ballroom-sayreville-nj' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-17-george-s-majestic-fayetteville-ar' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-23-legends-boone-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-19-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-01-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-08-the-fillmore-silver-spring-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-23-debaser-malmo-sweden' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-30-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-01-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-08-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-05-the-heights-theater-houston-tx' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-28-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-22-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-16-culture-room-fort-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-22-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-28-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-17-the-moon-tallahassee-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-23-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-23-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-03-11-langerado-music-festival-sunrise-fl' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-03-10-the-revolution-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-03-10-the-revolution-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-18-starr-hill-charlottesville-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-22-neighborhood-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-18-palladium-ballroom-dallas-tx' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-21-northlands-swanzey-nh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-05-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-06-tom-lee-park-cellular-south-stage-memphis-tn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-17-the-moon-tallahassee-fl' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-08-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-30-cervantes-masterpiece-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-10-the-galaxy-st-louis-mo' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-18-the-roxy-atlanta-ga' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-17-bogart-s-cincinnati-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-14-carling-academy-islington-london-u-k' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-02-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-02-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-04-the-nation-washington-dc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-04-the-nation-washington-dc' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-07-22-artscape-festival-baltimore-md' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-07-22-artscape-festival-baltimore-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-03-09-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-18-salvage-station-asheville-nc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-30-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-05-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-25-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-28-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-29-the-chance-poughkeepsie-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-29-the-chance-poughkeepsie-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-16-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-15-mccarren-park-pool-williamsburg-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-14-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-14-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-20-jake-s-roadhouse-decatur-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-23-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-09-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-01-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-02-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-16-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-02-the-fillmore-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-07-euphoria-music-festival-austin-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-07-euphoria-music-festival-austin-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-07-euphoria-music-festival-austin-tx' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-27-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-16-music-farm-charleston-sc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-25-port-city-music-hall-portland-me' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-08-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-10-30-madison-theater-covington-ky' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-10-31-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-04-marquee-theatre-tempe-az' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-04-marquee-theatre-tempe-az' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-09-stage-ae-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-29-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-27-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-27-the-palladium-worcester-ma' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-25-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-22-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-22-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-10-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-10-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-29-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-29-wisconsin-union-theater-madison-wi' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-22-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-09-tree-s-dallas-tx' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-10-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-09-tree-s-dallas-tx' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-10-engine-room-houston-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-10-engine-room-houston-tx' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-21-capitol-center-for-the-arts-concord-nh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-23-the-lyric-oxford-ms' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-31-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-03-terminal-west-atlanta-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-10-the-galaxy-st-louis-mo' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-26-tammany-hall-worcester-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-24-mercury-ballroom-louisville-ky' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-26-tammany-hall-worcester-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-26-tammany-hall-worcester-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-04-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-06-gothic-theater-englewood-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-12-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-05-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-30-the-tabernacle-atlanta-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-11-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-11-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-01-the-roxy-atlanta-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-01-the-roxy-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-09-09-southside-stage-xl-live-harrisburg-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-26-anthem-washington-d-c' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-29-webster-theater-hartford-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-13-roxy-nightclub-boston-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-07-penns-peak-jim-thorpe-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-08-brooklyn-steel-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-09-brooklyn-steel-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-29-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-16-house-of-blues-boston-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-05-haymaker-festival-spotsylvania-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-05-meow-wolf-santa-fe-nm' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-01-the-fonda-theatre-hollywood-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-26-bearsville-theatre-woodstock-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-01-the-paramount-huntington-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-29-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-23-salansky-farms-union-dale-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-23-salansky-farms-union-dale-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-06-20-electric-forest-rothbury-mi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-06-20-electric-forest-rothbury-mi' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-06-22-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-23-the-lyric-oxford-ms' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-23-the-lyric-oxford-ms' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-23-the-lyric-oxford-ms' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-26-tennessee-theater-knoxville-tn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-30-legends-boone-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-02-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-02-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-12-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-13-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-13-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-09-05-concord-music-hall-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-29-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-29-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-15-pine-creek-lodge-livingston-montana' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-05-haymaker-festival-spotsylvania-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-02-the-caverns-pelham-tn' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-18-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-06-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-04-wonderland-forest-lafayette-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-10-freedom-arts-pavillion-selbyville-de' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-10-freedom-arts-pavillion-selbyville-de' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-12-bourbon-room-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-11-somerville-theater-somerville-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-29-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-12-bourbon-room-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-13-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-18-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-06-22-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-17-st-augustine-amphitheatre-backyard-stage-st-augustine-florida' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-17-st-augustine-amphitheatre-backyard-stage-st-augustine-florida' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-18-revolution-live-ft-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-13-roxy-nightclub-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-02-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-17-mulcahy-s-wantagh-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-17-vogue-theater-indianapolis-in' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-19-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-25-canal-club-richmond-va' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-25-canal-club-richmond-va' AND t."set" = 'E1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-17-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-03-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-03-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-09-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-02-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-07-penns-peak-jim-thorpe-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-08-brooklyn-steel-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-27-the-fillmore-silver-spring-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-27-the-fillmore-silver-spring-md' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-02-music-farm-charleston-sc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-14-college-street-music-hall-new-haven-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-02-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-02-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-01-the-paramount-huntington-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-27-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-07-the-sanctuary-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-07-the-sanctuary-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-24-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-24-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-15-twilight-tampa-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-30-howlin-wolf-new-orleans-la' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-27-riverwalk-center-breckenridge-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-26-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-26-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-27-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-27-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-24-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-31-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-31-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-31-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-01-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-04-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-04-22-terminal-west-atlanta-georgia' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-02-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-24-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-09-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-10-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-12-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-07-amazura-ballroom-jamaica-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-12-great-american-music-hall-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-08-amazura-ballroom-jamaica-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-02-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-28-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-06-dillon-amphitheater-dillon-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-28-the-paramount-huntington-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-31-auditorium-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-31-auditorium-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-31-auditorium-theater-chicago-il' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-21-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-21-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-22-the-catalyst-santa-cruz-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-27-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-28-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-28-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-10-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-11-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-10-engine-room-houston-tx' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-28-church-of-universal-love-and-music-acme-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-28-church-of-universal-love-and-music-acme-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-25-dfest-tulsa-ok' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-10-engine-room-houston-tx' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-11-house-of-blues-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-27-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-06-gothic-theater-englewood-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-06-palookaville-santa-cruz-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-01-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-01-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-28-state-theater-kalamazoo-mi' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-28-state-theater-kalamazoo-mi' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-21-the-fillmore-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-02-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-10-30-madison-theater-covington-ky' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-04-02-crossroads-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1998-04-02-crossroads-new-york-ny' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-09-21-legend-valley-thornville-oh' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-27-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-09-09-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-19-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-08-24-lockn-infinity-downs-farm-arrington-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-09-09-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-04-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 12
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-25-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-18-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-28-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-28-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-30-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-03-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-27-the-fillmore-new-orleans-louisiana' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-10-05-breckenridge-brewery-littleton-colorado' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-13-revolution-live-ft-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-24-palace-theater-albany-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-11-house-of-blues-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-12-30-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-24-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-30-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-01-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-18-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-18-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-20-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-15-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-15-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-15-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-15-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-17-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-24-palace-theater-albany-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-13-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-05-house-of-blues-cleveland-oh' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-17-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-25-lincoln-theater-washington-d-c' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-18-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-18-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-09-09-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-15-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-15-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-19-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-10-tcc-reading-park-norfolk-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-04-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-06-gothic-theater-englewood-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-18-visulite-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-27-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-18-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-20-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-20-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-06-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-06-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-05-belly-up-aspen-aspen-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-24-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-17-st-augustine-amphitheatre-backyard-stage-st-augustine-florida' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-17-st-augustine-amphitheatre-backyard-stage-st-augustine-florida' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-24-cervantes-masterpiece-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-24-cervantes-masterpiece-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-07-amazura-ballroom-jamaica-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-08-the-fillmore-silver-spring-md' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-07-amazura-ballroom-jamaica-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-19-secret-dreams-music-arts-festival-thornville-ohio' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-11-blackthorne-resort-east-durham-ny' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-18-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-26-grand-central-miami-fl' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-25-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-14-charleston-music-hall-charleston-sc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-15-kahunaville-wilmington-de' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-17-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 11
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-17-toad-s-place-new-haven-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-17-toad-s-place-new-haven-ct' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-12-great-american-music-hall-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-08-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-18-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-20-irving-plaza-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-22-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-09-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-05-the-heights-theater-houston-tx' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-08-amazura-ballroom-jamaica-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-13-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-31-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-31-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-08-mission-ballroom-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-19-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-03-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-23-electric-forest-rothbury-mi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-21-crocodile-rock-allentown-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-16-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-26-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-26-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-24-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-09-legends-lounge-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-02-18-monsoon-s-flagstaff-az' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-10-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-30-the-funk-box-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-24-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-05-belly-up-aspen-aspen-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-05-wonderland-forest-lafayette-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-26-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-26-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-27-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-02-19-legends-lounge-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-02-19-legends-lounge-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-12-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-24-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-03-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-13-the-palace-theatre-albany-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-21-crocodile-rock-allentown-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-30-the-funk-box-baltimore-md' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-05-28-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-05-8150-vail-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-11-magnolia-street-pub-spartanburg-sc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-11-16-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-11-17-the-fillmore-auditorium-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-05-lafayette-square-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-11-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND t."set" = 'S1' AND t."position" = 12
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-15-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-21-variety-playhouse-atlanta-ga' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-02-rialto-theater-tucson-az' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-08-la-zona-rosa-austin-tx' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-03-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-29-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-02-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-02-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-29-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-30-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-17-boulder-theater-boulder-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-21-magnet-club-berlin-germany' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-03-08-the-strand-theater-providence-ri' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-03-09-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-21-magnet-club-berlin-germany' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-19-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-19-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-20-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-25-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-20-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-04-21-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-18-salvage-station-asheville-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-15-trade-music-festival-farm-trade-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-04-sherman-theater-stroudsburg-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-10-the-national-richmond-va' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-07-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-08-mission-ballroom-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-30-the-funk-box-baltimore-md' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-29-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-19-salvage-station-asheville-nc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-19-midtown-ballroom-bend-or' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-24-the-warfield-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-26-bearsville-theatre-woodstock-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-21-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-04-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-06-webster-theater-hartford-ct' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-26-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-09-21-legend-valley-thornville-oh' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-09-21-legend-valley-thornville-oh' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-07-the-sanctuary-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-28-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-04-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-12-bouckaert-farm-fairburn-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-19-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-02-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-02-state-theater-ithaca-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-10-19-the-palladium-worcester-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-03-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-03-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-03-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-23-palace-theater-albany-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-24-palace-theater-albany-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-11-24-palace-theater-albany-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-09-10-mile-music-hall-frisco-colorado' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-19-salvage-station-asheville-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-19-salvage-station-asheville-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-08-chameleon-club-lancaster-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-09-05-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-28-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-19-salvage-station-asheville-nc' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-24-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-24-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-05-26-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-12-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-21-magnet-club-berlin-germany' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-12-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-09-10-mile-music-hall-frisco-colorado' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-09-10-mile-music-hall-frisco-colorado' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-06-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-06-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-16-observatory-north-park-san-diego-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-15-sussex-county-live-drive-in-augusta-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-25-lincoln-theater-washington-d-c' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-16-observatory-north-park-san-diego-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-16-observatory-north-park-san-diego-ca' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-24-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-25-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-25-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-07-msc-divina-the-open-seas-miami-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-07-msc-divina-the-open-seas-miami-fl' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-25-lincoln-theater-washington-d-c' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-01-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-09-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-03-19-okeechobee-music-arts-festival-okeechobee-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-03-19-okeechobee-music-arts-festival-okeechobee-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-12-gather-outdoors-stratton-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-18-the-uc-theatre-berkeley-ca' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-05-23-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-07-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-07-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-10-31-suwannee-music-park-live-oak-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-23-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-23-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-15-new-daisy-theatre-memphis-tn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-15-new-daisy-theatre-memphis-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-10-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-17-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-02-02-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-27-the-fillmore-new-orleans-louisiana' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-27-the-fillmore-new-orleans-louisiana' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-17-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-24-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-15-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-05-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-16-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-05-wonderland-forest-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-17-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-23-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-26-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-01-the-funk-box-baltimore-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-30-franklin-music-hall-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-28-the-library-oxford-ms' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-03-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-06-dillon-amphitheater-dillon-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-06-dillon-amphitheater-dillon-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-06-dillon-amphitheater-dillon-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-25-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-25-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-25-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-25-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-07-18-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-10-05-breckenridge-brewery-littleton-colorado' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-11-the-depot-salt-lake-city-ut' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-04-the-nation-washington-dc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-15-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-10-31-suwannee-music-park-live-oak-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-08-26-skye-top-festival-grounds-van-etten-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-14-roxian-theater-mckees-rocks-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-03-pearl-street-northampton-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-03-pearl-street-northampton-ma' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-15-roxian-theater-mckees-rocks-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-16-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-16-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-17-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-17-the-national-richmond-va' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-09-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-11-house-of-blues-orlando-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-28-the-palladium-times-square-new-york-city-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-12-janus-landing-st-petersburg-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-12-janus-landing-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-16-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-07-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-13-elsewhere-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-13-elsewhere-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-18-the-fillmore-minneapolis-mn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-27-college-street-music-hall-new-haven-ct' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-13-the-queen-wilmington-de' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-11-the-strand-theater-providence-ri' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-15-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-16-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-08-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-14-revolution-live-ft-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-09-the-national-richmond-va' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-28-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-28-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-28-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-28-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-06-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-12-30-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-01-04-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-01-04-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-05-27-bb-kings-blues-club-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-06-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-30-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-24-ocean-mist-matunick-ri' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-08-20-camp-bisco-tunetown-campgrounds-cherrytree-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-21-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-08-21-camp-bisco-tunetown-campgrounds-cherrytree-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-02-cafe-tomo-arcata-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-19-bodega-auburn-al' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-08-26-skye-top-festival-grounds-van-etten-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-20-zydeco-s-birmingham-al' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 12
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-28-the-catalyst-santa-cruz-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-01-28-the-catalyst-santa-cruz-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-23-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-17-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-20-harpa-concert-hall-reykjavik' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-03-01-rams-head-live-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-31-roadrunner-boston-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-31-roadrunner-boston-ma' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-31-roadrunner-boston-ma' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-20-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-23-debaser-malmo-sweden' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-03-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-22-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-03-the-lawn-at-surf-hotel-buena-vista-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-03-the-lawn-at-surf-hotel-buena-vista-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-06-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-06-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-02-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-06-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-30-royale-boston-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-30-royale-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-30-royale-boston-ma' AND t."set" = 'S2' AND t."position" = 12
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-05-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-15-brooklyn-steel-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-21-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-21-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-21-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-15-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-15-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-08-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-08-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-08-930-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-04-terminal-west-atlanta-ga' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-17-the-westcott-theater-syracuse-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-21-thalia-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-21-thalia-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-28-district-music-hall-norwalk-ct' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-03-06-suwannee-music-park-live-oak-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-03-06-suwannee-music-park-live-oak-fl' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-05-28-the-conduit-trenton-nj' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-09-05-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-26-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-10-the-clubhouse-east-hampton-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-28-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-03-25-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-05-13-sandwich-high-school-auditorium-east-sandwich-ma' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-27-milestones-rochester-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-17-the-westcott-theater-syracuse-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-05-sony-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-05-sony-hall-new-york-ny' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-18-bearsville-theatre-woodstock-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-10-revolution-hall-troy-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-10-revolution-hall-troy-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-10-revolution-hall-troy-ny' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-03-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-04-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-20-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-20-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-19-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-19-janus-landing-st-petersburg-fl' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-19-janus-landing-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-07-jack-straw-s-charlotte-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-12-28-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-21-stone-coast-brewing-company-portland-me' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-29-the-haunt-ithaca-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-30-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-07-jack-straw-s-charlotte-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-12-31-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-06-27-the-roxy-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-15-twilight-tampa-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-08-25-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-19-janus-landing-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-18-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-30-exit-inn-nashville-tn' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-30-exit-inn-nashville-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-22-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-23-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-23-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-06-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-26-charlotte-city-fest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-28-ziggy-s-winston-salem-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-06-french-broad-river-brewery-asheville-nc' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-05-04-barrymore-theater-madison-wi' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-09-19-janus-landing-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-02-mercury-ballroom-louisville-ky' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-14-the-queen-wilmington-de' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-31-a-live-one-chicago-il' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-06-10-ziggy-s-by-the-sea-atlantic-beach-nc' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-07-wonderland-forest-lafayette-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-21-magnet-club-berlin-germany' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-27-riverwalk-center-breckenridge-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-12-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-13-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-18-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-04-haymaker-festival-spotsylvania-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-04-21-terminal-west-atlanta-ga' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-08-27-skye-top-festival-grounds-van-etten-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-05-washingtons-fort-collins-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-05-washingtons-fort-collins-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-14-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-22-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-13-now-sapphire-resort-puerto-morelos' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-19-lupos-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-19-10-000-lakes-festival-detriot-lakes-mn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-23-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-23-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-23-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-05-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-30-chameleon-club-lancaster-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-05-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-10-state-theatre-st-petersburg-fl' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-05-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-03-25-dr-phillips-center-for-the-performing-arts-front-lawn-orlando-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-11-the-moon-tallahassee-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-13-bouckaert-farm-fairburn-ga' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-03-26-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-07-01-plumas-county-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-07-01-plumas-county-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-19-canopy-club-urbana-il' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-02-01-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-18-the-max-amsterdam' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-25-tipitinas-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-25-tipitinas-new-orleans-la' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-25-tipitinas-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-23-legends-boone-nc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-04-lupos-heartbreak-hotel-providence-ri' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-04-lupos-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-25-toads-place-richmond-richmond-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-03-lupos-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-03-lupos-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-26-charlotte-city-fest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-30-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-30-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-14-the-queen-wilmington-de' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-16-sherman-theater-stroudsburg-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-10-29-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-29-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-29-belly-up-aspen-aspen-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-08-13-bottle-cork-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-21-the-riviera-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-21-harpa-concert-hall-reykjavik' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-21-lincoln-theater-raleigh-nc' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-13-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-21-harpa-concert-hall-reykjavik' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-06-17-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-21-harpa-concert-hall-reykjavik' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-22-harpa-concert-hall-reykjavik' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-08-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-08-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-14-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-03-14-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-22-harpa-concert-hall-reykjavik' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-22-harpa-concert-hall-reykjavik' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-22-harpa-concert-hall-reykjavik' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-05-22-harpa-concert-hall-reykjavik' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-11-revolution-concert-house-boise-id' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-11-revolution-concert-house-boise-id' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-09-21-the-riviera-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-10-06-wonderland-forest-lafayette-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-11-revolution-concert-house-boise-id' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-15-roseland-theater-portland-or' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-15-roseland-theater-portland-or' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-02-orpheum-theater-flagstaff-az' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-27-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-05-cats-cradle-carrboro-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-04-the-state-theater-state-college-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-08-mission-ballroom-denver-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-18-sapphire-palace-at-blue-lake-casino-blue-lake-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-28-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-22-the-bay-center-dewey-beach-de' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-21-crocodile-rock-allentown-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-19-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-28-hub-lawn-penn-state-university-state-college-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-29-best-buy-theater-new-york-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-22-visulite-theater-charlotte-nc' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-11-the-roxy-hollywood-ca' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-21-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-10-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-13-empire-live-albany-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-13-empire-live-albany-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-05-the-heights-theater-houston-tx' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-28-the-paramount-huntington-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-01-the-caverns-pelham-tn' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-08-msc-divina-the-open-seas-miami-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-07-10-mile-music-hall-frisco-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-07-10-mile-music-hall-frisco-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-07-10-mile-music-hall-frisco-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-12-now-sapphire-resort-puerto-morelos' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-12-now-sapphire-resort-puerto-morelos' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-08-mission-ballroom-denver-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-01-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-02-state-theater-ithaca-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-07-the-fillmore-silver-spring-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-28-the-fm-kirby-center-wilkes-barre-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-14-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-10-27-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-28-the-fm-kirby-center-wilkes-barre-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-28-the-fm-kirby-center-wilkes-barre-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-23-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-21-penns-peak-jim-thorpe-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-09-vic-theatre-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-17-coolray-field-lawrenceville-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-07-16-coolray-field-lawrenceville-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-29-georgia-theater-athens-ga' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-30-five-points-south-music-hall-birmingham-al' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-12-28-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-28-cicero-s-st-louis-mo' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-17-the-calvin-northampton-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-02-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-01-the-funk-box-baltimore-md' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-01-the-funk-box-baltimore-md' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-25-3rd-and-lindsley-nashville-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-25-3rd-and-lindsley-nashville-tn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-14-trancegression-copper-mountain-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-12-house-of-blues-boston-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-17-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-25-3rd-and-lindsley-nashville-tn' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-08-20-ford-amphitheater-at-coney-island-boardwalk-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-29-zydeco-s-birmingham-al' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-30-the-parish-new-orleans-la' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-30-the-parish-new-orleans-la' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-20-zydeco-s-birmingham-al' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-19-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-16-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-05-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-05-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-04-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-06-26-house-of-blues-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-23-mcalister-auditorium-new-orleans-la' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-24-congress-theater-chicago-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-01-dave-s-on-dickson-fayetteville-ar' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-05-06-the-hook-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-13-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-13-bonnaroo-music-festival-manchester-tn' AND t."set" = 'S1' AND t."position" = 11
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-28-the-intersection-grand-rapids-mi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-18-crystal-ballroom-portland-or' AND t."set" = 'E1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-04-asheville-brewing-company-asheville-nc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-10-28-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-12-31-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-26-metro-chicago-il' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-11-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-25-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-17-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-07-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-05-music-midtown-atlanta-ga' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-17-crocodile-cafe-seattle-wa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-18-lupo-s-heartbreak-hotel-providence-ri' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-14-the-silo-reading-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-07-euphoria-music-festival-austin-tx' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-02-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-27-stage-ae-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-10-27-brooklyn-bowl-las-vegas-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-07-14-the-pavilion-at-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-12-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-07-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-27-college-street-music-hall-new-haven-ct' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-06-04-candler-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-12-knitting-factory-spokane-wa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-22-si-hall-syracuse-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-24-the-nation-washington-dc' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-24-the-nation-washington-dc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-09-23-ford-amphitheater-at-coney-island-boardwalk-brooklyn-new-york' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-10-29-zydeco-s-birmingham-al' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-25-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-20-first-avenue-minneapolis-mn' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-06-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-06-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-27-the-f-m-kirby-center-wilkes-barre-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-12-state-theater-portland-me' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-07-16-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-26-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-31-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-18-electric-factory-philadelphia-pa' AND t."set" = 'S3' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-03-22-pumpehuset-copenhagen-denmark' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-03-31-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-14-stoned-monkey-huntington-wv' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-05-29-martyr-s-chicago-il' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-16-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-02-28-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-01-16-aggie-theatre-fort-collins-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-14-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-05-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-23-first-avenue-minneapolis-mn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-23-first-avenue-minneapolis-mn' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-03-jupiter-bar-grill-tuscaloosa-al' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-25-port-city-music-hall-portland-me' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-20-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-24-madison-theater-covington-ky' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-16-yarmouth-drive-in-west-yarmouth-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-31-best-buy-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-04-16-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-30-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-01-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-09-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND t."set" = 'E1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-01-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-23-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-08-casino-ballroom-hampton-beach-nh' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-09-the-calvin-northampton-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-29-wisconsin-union-theater-madison-wi' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-11-28-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-02-21-capitol-center-for-the-arts-concord-nh' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-04-01-the-capitol-theater-port-chester-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-12-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-07-ft-armistead-park-baltimore-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-07-ft-armistead-park-baltimore-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-11-innsbrook-pavillion-glen-allen-va' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-11-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-12-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-15-summer-set-music-and-camping-festival-somerset-wi' AND t."set" = 'S1' AND t."position" = 9
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-09-12-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-03-26-dr-phillips-center-for-the-performing-arts-front-lawn-orlando-fl' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-16-music-farm-charleston-sc' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-23-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-24-showtime-at-the-drive-in-frederick-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-28-red-rocks-amphitheater-morrison-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-06-19-columbia-speedway-entertainment-center-cayce-sc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-03-26-dr-phillips-center-for-the-performing-arts-front-lawn-orlando-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-28-the-fillmore-silver-spring-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-04-29-the-capitol-theater-port-chester-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-28-the-fillmore-silver-spring-md' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-14-midtown-ballroom-bend-or' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-12-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-31-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-07-french-broad-river-brewery-asheville-nc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-05-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-10-09-the-revolution-fort-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-17-vogue-theater-indianapolis-in' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-05-23-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-08-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-04-showplace-theater-buffalo-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-10-30-the-f-shed-syracuse-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-18-bearsville-theatre-woodstock-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-09-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-11-somerville-theater-somerville-ma' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-05-27-bb-kings-blues-club-new-york-ny' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-08-the-fillmore-silver-spring-md' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-30-five-points-south-music-hall-birmingham-al' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-27-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-03-29-house-of-blues-chicago-il' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-12-knitting-factory-spokane-wa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-11-infinity-music-hall-hartford-ct' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-11-infinity-music-hall-hartford-ct' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-16-observatory-north-park-san-diego-ca' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-11-infinity-music-hall-hartford-ct' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-12-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-12-house-of-blues-boston-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-13-sherman-theater-stroudsburg-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-18-the-eastern-atlanta-ga' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-07-mishawaka-amphitheater-bellvue-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-31-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-11-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-11-10-irving-plaza-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-05-27-sonar-lounge-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-07-26-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-20-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-08-15-kahunaville-wilmington-de' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-27-el-rey-theater-los-angeles-ca' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-10-the-galaxy-st-louis-mo' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-10-19-georgia-theater-athens-ga' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-27-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-27-starland-ballroom-sayreville-nj' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-01-19-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-08-21-camp-bisco-tunetown-campgrounds-cherrytree-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-11-16-sherman-theater-stroudsburg-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-09-28-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-12-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-12-the-caverns-pelham-tn' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-12-30-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-04-breathless-resort-spa-punta-cana' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-17-saddle-creek-bar-omaha-ne' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-03-14-quixote-s-true-blue-aurora-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2015-12-04-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-12-house-of-blues-boston-ma' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-14-lincoln-theater-raleigh-nc' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-09-03-bb-kings-blues-club-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-18-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-25-hi-fi-annex-indianapolis-in' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-09-13-crowbar-state-college-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-06-28-levitt-pavillion-westport-ct' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-10-the-galaxy-st-louis-mo' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-11-10-the-galaxy-st-louis-mo' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-18-vic-theatre-chicago-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-12-28-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-10-30-first-avenue-minneapolis-mn' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-12-31-roadrunner-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-02-crystal-ballroom-portland-or' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-11-02-crystal-ballroom-portland-or' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1999-04-16-friar-tuck-s-norfolk-va' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-15-the-windjammer-isle-of-palms-sc' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-13-portland-house-of-music-portland-me' AND t."set" = 'S1' AND t."position" = 11
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-01-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-12-31-playstation-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-08-15-trade-music-festival-farm-trade-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-12-30-franklin-music-hall-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-09-27-the-fillmore-charlotte-nc' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-06-04-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-07-14-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S3' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-04-05-the-palladium-worcester-ma' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-08-24-lockn-infinity-downs-farm-arrington-va' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-11-16-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-20-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-20-higher-ground-s-burlington-vt' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2019-11-22-si-hall-syracuse-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-05-8150-vail-co' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-11-state-theater-ithaca-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-15-metropol-pittsburgh-pa' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-16-blind-pig-ann-arbor-mi' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-04-18-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-20-fox-theatre-boulder-co' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-10-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-15-twilight-tampa-fl' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-01-15-twilight-tampa-fl' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-12-30-northern-lights-clifton-park-ny' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-24-town-ballroom-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-25-port-city-music-hall-portland-me' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-28-house-of-blues-boston-ma' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-04-20-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-03-30-town-ballroom-buffalo-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-14-greenfield-lake-amphitheater-wilmington-nc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 8
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-02-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-16-state-theater-portland-me' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-07-13-the-national-richmond-va' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-11-the-strand-theater-providence-ri' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-04-04-house-of-blues-new-orleans-la' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-01-the-sound-at-del-mar-del-mar-ca' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-02-07-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2020-10-30-lafayette-apple-festival-grounds-lafayette-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-11-21-the-caverns-pelham-tn' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-01-22-majestic-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-04-19-crystal-bay-club-casino-crystal-bay-nv' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2003-09-28-hub-lawn-penn-state-university-state-college-pa' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa' AND t."set" = 'E1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-22-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2004-11-26-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 10
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-12-08-9-30-club-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-17-revolution-hall-portland-or' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2005-03-22-melkweg-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-06-08-lincoln-theater-raleigh-nc' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-12-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-12-930-club-washington-dc' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-12-930-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'UNFINISHED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-12-930-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2018-01-12-930-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

-- 2025-09-05 Mishawaka Amphitheater, Bellvue, CO — both Home Again versions are dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

-- 2026-02-08 MSC Divina (The Open Seas), Miami, FL — Rivers is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2026-02-08-msc-divina-the-open-seas-miami-fl' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

-- The Rivers INVERTED flag above changes that song's inverted-recurrence chain
-- (flag_gap / flag_previous_show_id), so queue a recompute from Rivers' first
-- performance. Drained by recompute-pending at deploy time. Idempotent.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'rivers' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-31 Pine Creek Lodge, Livingston, MT — Catalyst is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-31-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;

-- Catalyst's inverted-recurrence chain changed; queue a recompute from its first
-- performance (drained by recompute-pending at deploy). Idempotent.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'catalyst' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-30-pine-creek-lodge-livingston-mt — S1.6 (reactor) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'reactor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-30-pine-creek-lodge-livingston-mt — S2.1 (reactor) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'reactor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-29-pine-creek-lodge-livingston-mt — S1.3 (another-plan-of-attack) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-29-pine-creek-lodge-livingston-mt' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'another-plan-of-attack' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-27-the-complex-salt-lake-city-ut — S1.6 (jigsaw-earth) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-27-the-complex-salt-lake-city-ut — S2.1 (jigsaw-earth) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-27-the-complex-salt-lake-city-ut' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-08-20-ardmore-music-hall-ardmore-pa — S1.2 (7-11) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = '7-11' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-07-11-the-strand-theater-providence-ri — S2.3 (helicopters) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-11-the-strand-theater-providence-ri' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'helicopters' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-07-10-summer-stage-at-tree-house-charlton-ma — S1.5 (crystal-ball) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crystal-ball' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-07-06-white-eagle-hall-jersey-city-nj — S2.3 (jigsaw-earth) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-07-06-white-eagle-hall-jersey-city-nj' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-01-19-midtown-ballroom-bend-or — S1.5 (astronaut) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-19-midtown-ballroom-bend-or' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-01-19-midtown-ballroom-bend-or — S2.1 (astronaut) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-19-midtown-ballroom-bend-or' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-01-18-revolution-hall-portland-oregon — S2.5 (helicopters) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-18-revolution-hall-portland-oregon' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'helicopters' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2025-01-18-revolution-hall-portland-oregon — E1.1 (helicopters) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2025-01-18-revolution-hall-portland-oregon' AND t."set" = 'E1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'helicopters' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-12-27-the-fillmore-silver-spring-md — S2.6 (house-dog-party-favor) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-12-27-the-fillmore-silver-spring-md' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'house-dog-party-favor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-11-21-infinity-music-hall-hartford-ct — S2.5 (save-the-robots) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-11-21-infinity-music-hall-hartford-ct' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'save-the-robots' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-09-15-pine-creek-lodge-livingston-montana — S1.1 (spaga) is beginning_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-15-pine-creek-lodge-livingston-montana' AND t."set" = 'S1' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spaga' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-09-06-dillon-amphitheater-dillon-co — S2.4 (spacebirdmatingcall) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-09-06-dillon-amphitheater-dillon-co' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spacebirdmatingcall' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- Inverted/dyslexic flags recovered from last-time recurrence annotations

-- 2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic — S2.4 (air-song) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto-dominican-republic' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'air-song' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2017-07-15-montage-mountain-scranton-pa — S1.4 (highwire) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'highwire' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-04-19-rox-wilmington-nc — S2.3 (munchkin-invasion) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-04-19-rox-wilmington-nc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'munchkin-invasion' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-08-30-thalia-hall-chicago-il — S1.3 (spraypaint) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-08-30-thalia-hall-chicago-il' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spraypaint' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-12-28-best-buy-theater-new-york-ny — S2.2 (crystal-ball) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crystal-ball' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-01-24-boulder-theater-boulder-co — S1.3 (jigsaw-earth) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2017-06-02-ogden-theater-denver-co — S1.4 (grass-is-green) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-06-02-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'grass-is-green' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-01-24-boulder-theater-boulder-co — S1.5 (42) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = '42' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2022-11-18-the-eastern-atlanta-ga — S1.2 (astronaut) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-11-18-the-eastern-atlanta-ga' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-12-06-the-roxy-hollywood-ca — S2.5 (spraypaint) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spraypaint' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-12-07-the-roxy-hollywood-ca — S2.3 (astronaut) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2023-03-10-the-caverns-pelham-tn — S2.3 (kamaole-sands) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-03-10-the-caverns-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'kamaole-sands' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2007-05-27-electric-factory-philadelphia-pa — S2.6 (spacebirdmatingcall) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spacebirdmatingcall' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2007-11-01-the-palace-theatre-albany-ny — S1.2 (i-man) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2007-11-01-the-palace-theatre-albany-ny' AND t."set" = 'S1' AND t."position" = 2
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'i-man' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2022-08-26-the-intersection-grand-rapids-mi — S2.5 (rock-candy) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2022-08-26-the-intersection-grand-rapids-mi' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'rock-candy' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2014-08-01-9-30-club-washington-dc — S2.3 (spraypaint) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spraypaint' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2016-12-31-the-tabernacle-atlanta-ga — S2.4 (reactor) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2016-12-31-the-tabernacle-atlanta-ga' AND t."set" = 'S2' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'reactor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2024-02-07-belly-up-aspen-aspen-co — S1.5 (the-overture) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2024-02-07-belly-up-aspen-aspen-co' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'the-overture' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2014-03-29-margaret-t-hance-park-phoenix-az — S1.3 (spacebirdmatingcall) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spacebirdmatingcall' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2021-02-05-ardmore-music-hall-ardmore-pa — S1.4 (little-lai) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-02-05-ardmore-music-hall-ardmore-pa' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'little-lai' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2023-07-15-roseland-theater-portland-or — S1.3 (down-to-the-bottom) is inverted
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2023-07-15-roseland-theater-portland-or' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'down-to-the-bottom' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2021-08-28-backwoods-at-mulberry-mountain-ozark-ar — S1.7 (hot-air-balloon) is ending_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar' AND t."set" = 'S1' AND t."position" = 7
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'hot-air-balloon' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2021-05-18-the-fillmore-philadelphia-pa — S1.3 (rock-candy) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2021-05-18-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'rock-candy' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2017-05-28-three-sister-s-park-chillicothe-il — S1.5 (aceetobee) is beginning_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'aceetobee' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2017-05-28-three-sister-s-park-chillicothe-il — S1.5 (aceetobee) is ending_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2017-05-28-three-sister-s-park-chillicothe-il' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'aceetobee' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-12-29-best-buy-theater-new-york-ny — S1.4 (astronaut) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-12-28-best-buy-theater-new-york-ny — S1.4 (mindless-dribble) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'mindless-dribble' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2013-12-27-sirius-satellite-studios-new-york-city-ny — S1.4 (little-shimmy-in-a-conga-line) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'little-shimmy-in-a-conga-line' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- "middle section only" annotations: flag the track MIDDLE_ONLY (set-based, so all
-- such tracks are covered idempotently regardless of show). Recurrence is recomputed
-- per affected song below.
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT DISTINCT a."track_id", 'MIDDLE_ONLY'::track_flag, now()
FROM "annotations" a
WHERE lower(btrim(a."desc")) = 'middle section only'
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), d.since_date
FROM (
  SELECT MIN(s2."date")::date AS since_date
  FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "songs" so ON so."id" = t."song_id"
  JOIN "tracks" t2 ON t2."song_id" = so."id"
  JOIN "shows" s2 ON s2."id" = t2."show_id"
  WHERE lower(btrim(a."desc")) = 'middle section only' AND s2."date" IS NOT NULL
  GROUP BY so."id"
) d
WHERE d.since_date IS NOT NULL
  AND d.since_date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2012-07-12-indian-lookout-country-club-mariaville-ny — S1.4 (aceetobee) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'aceetobee' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2011-01-16-ogden-theater-denver-co — S1.6 (jigsaw-earth) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2010-09-11-bank-of-america-pavilion-boston-ma — S1.4 (astronaut) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'astronaut' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2009-12-30-nokia-theater-new-york-ny — S1.4 (crystal-ball) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crystal-ball' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2009-07-04-plumas-country-fairgrounds-quincy-ca — S1.5 (crickets) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-07-04-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2009-02-14-ogden-theater-denver-co — S2.3 (crickets) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2009-02-14-ogden-theater-denver-co — S2.6 (crickets) is beginning_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2009-02-14-ogden-theater-denver-co — S2.6 (crickets) is ending_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2009-02-14-ogden-theater-denver-co' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2008-12-30-nokia-theater-new-york-ny — S1.4 (run-like-hell) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-12-30-nokia-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'run-like-hell' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2008-06-05-lafayette-square-buffalo-ny — S1.3 (jigsaw-earth) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2008-06-05-lafayette-square-buffalo-ny' AND t."set" = 'S1' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'jigsaw-earth' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-11-10-bogart-s-cincinnati-oh — S2.3 (crickets) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-11-10-bogart-s-cincinnati-oh — S2.6 (crickets) is beginning_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-11-10-bogart-s-cincinnati-oh — S2.6 (crickets) is ending_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND t."set" = 'S2' AND t."position" = 6
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'crickets' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-08-26-hunter-mountain-ski-lodge-hunter-ny — S2.1 (house-dog-party-favor) is beginning_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'BEGINNING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S2' AND t."position" = 1
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'house-dog-party-favor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-08-26-hunter-mountain-ski-lodge-hunter-ny — S2.3 (house-dog-party-favor) is ending_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'ENDING_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'house-dog-party-favor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2006-08-26-hunter-mountain-ski-lodge-hunter-ny — S2.5 (house-dog-party-favor) is middle_only
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'MIDDLE_ONLY'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S2' AND t."position" = 5
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'house-dog-party-favor' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

-- 2000-10-18-crystal-ballroom-portland-or — E1.4 (pat-and-dex) is dyslexic
INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'DYSLEXIC'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2000-10-18-crystal-ballroom-portland-or' AND t."set" = 'E1' AND t."position" = 4
ON CONFLICT ("track_id", "flag") DO NOTHING;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'pat-and-dex' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");

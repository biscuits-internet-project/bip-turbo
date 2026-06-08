-- Guest sit-ins missed by the original performer backfill because they use
-- the "with <Name> (<instrument>)" form (instrument in parens, no "on"),
-- which the parser read as a band name. Creates the not-yet-seeded guests,
-- adds per-track present=true deltas + instrument bridge rows (resolved by
-- slug / (slug,set,position) / instrument slug, all ON CONFLICT DO NOTHING),
-- and marks the source annotations TODELETE for the hand-verified two-step.

-- New guest musicians
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Warren Haynes', 'warren-haynes', 'Gov''t Mule, The Allman Brothers Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Bill Kreutzmann', 'bill-kreutzmann', 'Grateful Dead', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mickey Hart', 'mickey-hart', 'Grateful Dead', (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Kris Myers', 'kris-myers', 'Umphrey''s McGee', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Alita Moses', 'alita-moses', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Kanika Moore', 'kanika-moore', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Matteo Scammell', 'matteo-scammell', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;

-- Per-track sit-in deltas + instruments
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-02-07-house-of-blues-houston-tx' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'warren-haynes'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2009-02-07-house-of-blues-houston-tx' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'warren-haynes'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 11 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 11 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 11 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 11 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'alita-moses'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'kris-myers'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'kris-myers'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'kris-myers'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'kris-myers'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'karina-rykman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'karina-rykman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'kanika-moore'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'kanika-moore'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'matteo-scammell'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'matteo-scammell'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'matteo-scammell'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'matteo-scammell'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Mark consumed annotations (separate hand-verified delete follows)
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (keyboards) and Darren Shearer (drums) of The New Deal.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-03-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Jamie Shields (keyboards) and Darren Shearer (drums) of The New Deal.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Warren Haynes (guitar)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-02-07-house-of-blues-houston-tx' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Warren Haynes (guitar)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 10 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill Kreutzmann (drums) and Mickey Hart (percussion)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 11 AND btrim(a."desc") = 'with Bill Kreutzmann (drums) and Mickey Hart (percussion)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-05-14-merriweather-post-pavilion-columbia-md' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton (Guitar) and Bill Kreutzman (Drums)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Alita Moses (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Alita Moses (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Alita Moses (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Alita Moses (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Alita Moses (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Alita Moses (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Alita Moses (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Alita Moses (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Alita Moses (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 9 AND btrim(a."desc") = 'with Alita Moses (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Guitar)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton (Guitar)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Guitar)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2021-07-09-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton (Guitar)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joel Cummins (keys), Kris Myers (drums) and Brendan Bayliss  (guitar) of Umphrey''s McGee', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Joel Cummins (keys), Kris Myers (drums) and Brendan Bayliss  (guitar) of Umphrey''s McGee'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joel Cummins (keys), Kris Myers (drums) and Brendan Bayliss  (guitar) of Umphrey''s McGee', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2022-06-12-lake-champlain-exposition-essex-junction-vt' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'with Joel Cummins (keys), Kris Myers (drums) and Brendan Bayliss  (guitar) of Umphrey''s McGee'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Karina Rykman (bass)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2023-05-06-mahalia-jackson-theater-new-orleans-la' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Karina Rykman (bass)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Kanika Moore (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2023-06-07-the-windjammer-isle-of-palms-sc' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Kanika Moore (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erin Boyd (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Erin Boyd (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erin Boyd (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Erin Boyd (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matteo Scammell (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Matteo Scammell (vocals)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matteo Scammell (vocals)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND btrim(a."desc") = 'with Matteo Scammell (vocals)'
);

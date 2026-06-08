-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-track sit-in/sat-out deltas (whole-show overrides expand to every track).
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 13 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 13 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tony'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'congas'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tony'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'vernon-reid'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'vernon-reid'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jack'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jack'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'jack'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'jack'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-06-18-plantation-club-worcester-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'dan-brown'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1998-06-18-plantation-club-worcester-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'dan-brown'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jeff-light'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jeff-light'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tk-kyan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tk-kyan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'banjo'
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'banjo'
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'banjo'
WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tony-furtado'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'vic-vucheck'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'flute'
WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'vic-vucheck'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'vic-vucheck'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'flute'
WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'vic-vucheck'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'oteil-burbridge'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'brett-joseph'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'brett-joseph'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'carol-wade'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'carol-wade'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'john-kim'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'violin'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'john-kim'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'clayton-belknap'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'clayton-belknap'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-stites'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-stites'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-stites'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-stites'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'meredith-motley'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'meredith-motley'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'anthony-rogers-wright'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-13-sandwich-high-school-auditorium-east-sandwich-ma' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-13-sandwich-high-school-auditorium-east-sandwich-ma' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'rob-derhak'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'rob-derhak'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'rob-derhak'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jim-loughlin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jim-loughlin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'les-claypool'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 3 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 3 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 3 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-10-23-the-bottleneck-lawrence-ks' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'matt-pierce'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'flute'
WHERE s."slug" = '2000-10-23-the-bottleneck-lawrence-ks' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'matt-pierce'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'adam-william-davis'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'adam-william-davis'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'meredith-motley'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'meredith-motley'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'beatbox'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S3' AND t."position" = 7 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S3' AND t."position" = 7 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'E1' AND t."position" = 4 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'E1' AND t."position" = 4 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-17-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-17-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'gabriel-polomo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'gabriel-polomo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-23-canopy-club-urbana-il' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-23-canopy-club-urbana-il' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'steve-molitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'steve-molitz'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-08-02-park-west-chicago-il' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2002-08-02-park-west-chicago-il' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'paul-norman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'mouth-fluegel'
WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-08-24-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'govinda-meyer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'flute'
WHERE s."slug" = '2002-08-24-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'govinda-meyer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'robbie-gennett'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'robbie-gennett'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-05-27-bb-kings-blues-club-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'joe-stapleton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2003-05-27-bb-kings-blues-club-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'joe-stapleton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-07-06-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'john-whooley'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2003-07-06-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'john-whooley'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jeff-waful'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jeff-waful'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-11-29-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dan-brantigan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2003-11-29-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'dan-brantigan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'reid-genauer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'reid-genauer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'erica-lynn-gruenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'stanton-moore'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'stanton-moore'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-dillon'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jay-lane'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'jay-lane'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'darren-pujalet'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-mckay'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-mckay'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-mckay'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-mckay'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-09-05-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'dan-brantigan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2004-09-05-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'dan-brantigan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'travis-tritt'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-05-28-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2005-05-28-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-07-24-exit2-nightclub-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-07-24-exit2-nightclub-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'danny-riser'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'brian-griffin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jim-riordan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jim-riordan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jim-riordan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jim-riordan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-03-20-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-03-20-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-05-26-three-sister-s-park-chillicothe-il-2' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-05-26-three-sister-s-park-chillicothe-il-2' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-05-28-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-05-28-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'flute'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'elliot-levin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'scott-metzger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'brock-butler'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'brock-butler'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'brock-butler'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'brock-butler'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dan-lebowitz'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-08-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 4 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-08-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 4 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-10-15-new-daisy-theatre-memphis-tn' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'aaron-goldberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-10-15-new-daisy-theatre-memphis-tn' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'aaron-goldberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'david-northrup'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'david-northrup'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'marco-benevento'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'marco-benevento'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'keller-williams'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dean-tovey'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dean-tovey'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'violin'
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'violin'
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'violin'
WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'ann-marie-calhoun'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-03-14-carling-academy-islington-london-u-k' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-03-14-carling-academy-islington-london-u-k' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'john-lee'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'john-lee'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'eric-wortham'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'eric-wortham'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-06-11-innsbrook-pavillion-glen-allen-va' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-06-11-innsbrook-pavillion-glen-allen-va' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'david-murphy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'ruu-campbell'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'ruu-campbell'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'chris-barron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'chris-barron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'marco-benevento'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'marco-benevento'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'john-medeski'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'john-medeski'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 5 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 5 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'ned-scott'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'ned-scott'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2 AND mu."slug" = 'kj-sawka'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2 AND mu."slug" = 'kj-sawka'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'jamie-shields'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-barron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-barron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dirty-harry'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dirty-harry'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tuphace'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'dirty-harry'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'dirty-harry'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
-- 2010-03-16 TLA: add missed sit-ins (Tom Hamilton guitar, Rocco + Mackenzie Eddy vocals).
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Rocco', 'rocco', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mackenzie Eddy', 'mackenzie-eddy', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 11 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 12 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 12 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'rocco'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'rocco'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'joe-zarick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'mike-carter'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-04-17-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-17-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'don-cheegro'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'darren-shearer'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'johnny-rabb'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jeremy-salken'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jeremy-salken'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jeremy-salken'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jeremy-salken'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'greg-sherrod'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'greg-sherrod'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'scotty-zwang'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'scotty-zwang'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'dominic-lalli'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mutlu-onaral'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'mutlu-onaral'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'natalie-cressman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trombone'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'natalie-cressman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jen-hartswick'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jen-hartswick'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'scotty-zwang'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'scotty-zwang'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'ed-mann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vibraphone'
WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'ed-mann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2016-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-12-03-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2017-12-03-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2018-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'holly-bowling'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'piano'
WHERE s."slug" = '2018-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'holly-bowling'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'benny-bloom'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'benny-bloom'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'benny-bloom'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'benny-bloom'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2021-09-26-brooklyn-mirage-brooklyn-comes-alive-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'shira-elias'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2021-09-26-brooklyn-mirage-brooklyn-comes-alive-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'shira-elias'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'al-schnier'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-01-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'karina-rykman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2023-02-01-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'karina-rykman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'zach-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'zach-brownstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'eli-winderman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'eli-winderman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2023-02-04-anthem-washington-d-c' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'snacktime'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2023-12-02-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2023-12-02-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'adam-deitch'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-09-stage-ae-pittsburgh-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'eli-winderman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2024-03-09-stage-ae-pittsburgh-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'eli-winderman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2026-05-07 Viva El Gonzo — Goose members sit in on Helicopters (S1.3)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Rick Mitarotonda', 'rick-mitarotonda', 'Goose', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Peter Anspach', 'peter-anspach', 'Goose', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Cotter Ellis', 'cotter-ellis', 'Goose', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;

-- Rick Mitarotonda on guitar
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'rick-mitarotonda'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'rick-mitarotonda'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Peter Anspach on keys
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'peter-anspach'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'peter-anspach'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Cotter Ellis on drums
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'cotter-ellis'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'cotter-ellis'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2026-02-06 Miami Beach Bandshell — Matisyahu sings One Day (E1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2026-02-06-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2026-02-06-miami-beach-bandshell-miami-beach-fl' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'matisyahu'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2024-07-20 Great South Bay — Erin Boyd guest vocals on S1.3–S1.6
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Erin Boyd', 'erin-boyd', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'erin-boyd'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2024-04-06 Longhorn Ballroom — Cloudchord guitar sit-in on Spaga's Last Stand (E1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'cloudchord'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2017-12-02 Breathless Resort — horn sit-ins on Let's Dance (S1.2)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'gabe-mervine'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'gabe-mervine'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'drew-sayers'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'drew-sayers'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2016-02-06 The Fillmore — Swift Technique horns on Suspicious Minds (S1.5) + Touch Me (S1.6)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Swift Technique', 'swift-technique', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-02-06-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2017-02-03 The Fillmore — Swift Technique horns on Give It to Me Baby (S1.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2017-02-03-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'swift-technique'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2016-01-02 PlayStation Theater — Philly Stray Horns on horns, whole of Set 1 (S1.1–S1.7)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Philly Stray Horns', 'philly-stray-horns', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2016-01-02-playstation-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2015-10-31 Crouse-Hinds — Philly Stray Horns on horns across the funk set (S2.1,2,4,5,6,7,9,10)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york' AND t."set" = 'S2' AND t."position" = 10 AND mu."slug" = 'philly-stray-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2015-04-18 Ogden Theater — Tom Hamilton on guitar + vocals: One More Saturday Night (S1.1), Shakedown Street (E1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2015-04-18-ogden-theater-denver-co' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2015-04-17 Red Rocks — Grateful Dead drummers + Tom Hamilton sit in for all of Set 2 (S2.1–S2.9)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 8 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 9 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2014-07-31 9:30 Club — Kreutzmann (drums) + Hart (percussion) on all of Set 2 + encore
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'bill-kreutzmann'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'mickey-hart'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2011-01-21 Mayan Holidaze — Ryan Stasik (Umphrey's McGee) replaces Brownstein on bass for On Time (E1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2010-12-31 Tower Theater — Sam Altman on drums for S2/S3/encore (removed from lineup; Johnny Rabb drums S1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S3' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2010-12-30 Tower Theater — Sam Altman sits out the 3 tracks Johnny Rabb drummed (E1.1, S2.1, S2.2)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2010-10-31 Jefferson Theater — Simon Green (Bonobo) replaces Brownstein on bass: 2nd Big Happy (S1.7) + Mindless Dribble (S1.8)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'simon-green'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2010-05-08 Wellmont — stripped-down Jon-on-guitar tracks: Tom Hamilton + Chris Michetti sit out (S1.5, S1.6, S2.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- Correction: remove the mis-parsed Jon Gutwillig present=true deltas on the
-- 2010-05-08 Wellmont stripped-down tracks (he's a lineup member; "on guitar
-- only" meant the OTHERS sat out, captured as the Tom/Chris sat-outs above).
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2010-05-08-wellmont-theater-montclair-nj'
  AND mu."slug" = 'jon-gutwillig'
  AND ((t."set" = 'S1' AND t."position" IN (5,6)) OR (t."set" = 'S2' AND t."position" = 5));
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2010-05-08-wellmont-theater-montclair-nj'
  AND mu."slug" = 'jon-gutwillig'
  AND ((t."set" = 'S1' AND t."position" IN (5,6)) OR (t."set" = 'S2' AND t."position" = 5));

-- 2010-05-07 Paper Mill Island — Tom + Chris (whole-show guitar) sit out Story of the World (S1.5) + Save the Robots (S2.6)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- Correction: remove the mis-parsed Jon Gutwillig present=true deltas on the
-- 2010-05-07 stripped-down tracks (lineup member; "on guitar only" meant Tom/Chris sat out).
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny'
  AND mu."slug" = 'jon-gutwillig'
  AND ((t."set" = 'S1' AND t."position" = 5) OR (t."set" = 'S2' AND t."position" = 6));
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny'
  AND mu."slug" = 'jon-gutwillig'
  AND ((t."set" = 'S1' AND t."position" = 5) OR (t."set" = 'S2' AND t."position" = 6));

-- 2010-03-21 Brooklyn Bowl — Mackenzie Eddy guest vocals on Quad D (S2.7)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 7 AND mu."slug" = 'mackenzie-eddy'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2009-11-27 Electric Factory — Curren$y guest vocals on Uber Glue (S2.1)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Curren$y', 'curreny', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-11-27-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'curreny'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2009-11-27-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'curreny'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2009-12-12 Caribbean Holidaze — Curren$y guest vocals on Park Ave (S1.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'curreny'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'curreny'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2009-07-18 Indian Lookout — Allen Aucoin sits out the guest-drummer tracks (Sam Altman S1.10, KJ Sawka S3.2)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 10 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2008-11-03 Highline Ballroom — Stanton Moore guest drums on Home Again (S1.3)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'stanton-moore'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'stanton-moore'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2007-12-31 Tweeter Center — Antibalas Horns on Morph Dusseldorf (S1.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'antibalas-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'antibalas-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2007-12-31 Tweeter Center — Antibalas Horns on Wanna Be Startin' Somethin' (S1.6)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'antibalas-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'antibalas-horns'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Correction: Antibalas Horns was fanned onto every 2007-12-31 Tweeter Center
-- track by a mis-parse; they only played Morph Dusseldorf (S1.5) + Wanna Be
-- Startin' Somethin' (S1.6). Remove from all other tracks.
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj'
  AND mu."slug" = 'antibalas-horns'
  AND NOT (t."set" = 'S1' AND t."position" IN (5,6));
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj'
  AND mu."slug" = 'antibalas-horns'
  AND NOT (t."set" = 'S1' AND t."position" IN (5,6));

-- 2007-12-28 Hammerstein — Tom Hamilton: guitar on 1st Caterpillar (S1.2), vocals on Where the Streets Have No Name (S1.3)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2007-12-15 Caribbean Holidaze — Joe Russo guest drums on Jigsaw Earth (S1.3), D'yer Mak'er (S1.4), Confrontation (S1.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2007-07-22 The Independent — Trevor Garrod + Steve Molitz on keys, Morph Dusseldorf (S1.4)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'trevor-garrod'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'trevor-garrod'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'steve-molitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'steve-molitz'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Correction: Trevor Garrod + Steve Molitz were fanned onto every 2007-07-22 The
-- Independent track by a mis-parse; they only guested on Morph Dusseldorf (S1.4).
-- Remove from all other tracks.
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-07-22-the-independent-san-francisco-ca'
  AND mu."slug" IN ('trevor-garrod', 'steve-molitz')
  AND NOT (t."set" = 'S1' AND t."position" = 4);
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-07-22-the-independent-san-francisco-ca'
  AND mu."slug" IN ('trevor-garrod', 'steve-molitz')
  AND NOT (t."set" = 'S1' AND t."position" = 4);

-- 2007-04-22 Vic Theatre — Magner's birthday jam (S2.5): Ryan Stasik on bass; Brendan Bayliss guitar only.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Correction: remove Brendan Bayliss's mis-parsed bass instrument on this track (keep guitar).
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu, "instruments" i
WHERE tmi."track_musician_id" = tm."id" AND tmi."instrument_id" = i."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss' AND i."slug" = 'bass';

-- 2007-01-06 The Open Seas — Brendan Bayliss + Jake Cinninger (vocals+guitar) only on I've Got a Feeling (E1.2)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Correction: Brendan Bayliss + Jake Cinninger were fanned onto every 2007-01-06 track; remove from all but E1.2.
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl'
  AND mu."slug" IN ('brendan-bayliss','jake-cinninger')
  AND NOT (t."set" = 'E1' AND t."position" = 2);
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl'
  AND mu."slug" IN ('brendan-bayliss','jake-cinninger')
  AND NOT (t."set" = 'E1' AND t."position" = 2);

-- 2006-12-30 Electric Factory — Simon Posford (Hallucinogen) guest on S1.1-S1.4 (instrument unknown)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2006-11-04 Sonar Lounge — Moshi-Drum Jam (S2.2) is Aron/Allen/Shawn; Jon + Marc sit out
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2006-11-01 State Theater Ithaca — Moshi-Drum Jam (S2.3): Jon + Marc sit out
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2006-10-31 Orpheum — Boston Symphony Orchestra Choir on vocals (S1.2-5, S2.3, S2.5, S2.6)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Boston Symphony Orchestra Choir', 'boston-symphony-orchestra-choir', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 3 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'boston-symphony-orchestra-choir'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2006-09-23 Patrick Gym — Shawn Hennessey (whole-show percussion) sits out Little Lai (S1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2006-08-26 Hunter Mountain — Simon Posford guest on Gamma Goblins (S1.8, instrument unknown)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND t."set" = 'S1' AND t."position" = 8 AND mu."slug" = 'simon-posford'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2005-11-19 Borgata — Allen Aucoin guest drums on Munchkin Invasion (E1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2005-04-26 Theater at MSG — David Northrup played the whole show on drums
-- (now in the show lineup), so remove the redundant per-track delta on S1.2.
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "tracks" t, "shows" s, "musicians" mu
WHERE tmi."track_musician_id" = tm."id"
  AND tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'david-northrup';
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'david-northrup';

-- Correction: 2005-04-26 Theater at MSG — Sam Altman is removed from this show
-- entirely (not in lineup), so his per-track sat-out deltas are meaningless. Remove them.
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND mu."slug" = 'sam-altman';

-- 2005-03-22 Melkweg — Brendan Bayliss (guitar) + Joel Cummins (keys) on Home Again (S1.9)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-03-22-melkweg-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2005-03-22-melkweg-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-03-22-melkweg-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2005-03-22-melkweg-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 9 AND mu."slug" = 'joel-cummins'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2004-05-09 Starland — Mike Greenfield guest percussion on Basis (S2.1), Kitchen Mitts (S2.2), Shem-Rah Boo (S2.4), 2nd Crickets (S2.5)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 4 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2004-05-09-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2003-09-29 Club Tinks — Where Do the Children Play? without Aron Magner + Sam Altman (S1.7)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- 2003-08-16 Trade Music Festival — DJ Mauricio on Roland MC-505, Crickets (S3.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2003-08-16-trade-music-festival-farm-trade-tn' AND t."set" = 'S3' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2003-08-16-trade-music-festival-farm-trade-tn' AND t."set" = 'S3' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2001-11-02 Crystal Ballroom — DJ Mauricio on Roland MC-505, Jam (S1.1)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-11-02-crystal-ballroom-portland-or' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'roland-mc-505'
WHERE s."slug" = '2001-11-02-crystal-ballroom-portland-or' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-mauricio'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2001-09-02 Wetlands — big guest Jam (S2.2). Seed new guests, then add 8 deltas.
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Tom McKee', 'tom-mckee', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Pauly Ethnic', 'pauly-ethnic', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Rick Lowenberg', 'rick-lowenberg', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Clay Parnell', 'clay-parnell', 'Brothers Past', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-mckee'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'tom-mckee'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'pauly-ethnic'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'pauly-ethnic'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'john-kim'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'violin'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'john-kim'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'rick-lowenberg'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'rick-lowenberg'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'clay-parnell'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'clay-parnell'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Tom McKee is from Brothers Past.
UPDATE "musicians" SET "known_from" = 'Brothers Past', "updated_at" = now()
WHERE "slug" = 'tom-mckee';

-- Consolidate the Paul/Pauly Herron duplicate: "Pauly Herron" (pauly-herron) is
-- the canonical record (has historical deltas); fix its name to "Paul Herron".
UPDATE "musicians" SET "name" = 'Paul Herron', "updated_at" = now()
WHERE "slug" = 'pauly-herron';

-- Remove the duplicate paul-herron record this migration mistakenly created
-- (its only track delta was re-pointed to pauly-herron above).
DELETE FROM "track_musician_instruments" tmi
USING "track_musicians" tm, "musicians" mu
WHERE tmi."track_musician_id" = tm."id" AND tm."musician_id" = mu."id" AND mu."slug" = 'paul-herron';
DELETE FROM "track_musicians" tm
USING "musicians" mu
WHERE tm."musician_id" = mu."id" AND mu."slug" = 'paul-herron';
DELETE FROM "musicians" WHERE "slug" = 'paul-herron';

-- known_from for 2001-09-02 Wetlands Jam guests.
UPDATE "musicians" SET "known_from" = 'Conscious Underground', "updated_at" = now() WHERE "slug" = 'pauly-ethnic';
UPDATE "musicians" SET "known_from" = 'The Ally', "updated_at" = now() WHERE "slug" = 'john-kim';
UPDATE "musicians" SET "known_from" = 'Brothers Past', "updated_at" = now() WHERE "slug" = 'rick-lowenberg';

-- 2001-06-28 Roseland — whole-show guests Stanley Jordan (guitar) + DJ Logic (turntables)
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Stanley Jordan', 'stanley-jordan', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'DJ Logic', 'dj-logic', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'turntables'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'stanley-jordan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'stanley-jordan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-logic'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'dj-logic'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'stanley-jordan'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'stanley-jordan'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'dj-logic'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'dj-logic'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'john-popper'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'harmonica'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'john-popper'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'john-popper'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'harmonica'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'john-popper'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2001-04-09 Lee's Palace, Ducks and Geese Are Free (E1.1): beatbox/rap number.
-- Jon (Barber), Aron, and guest Eric Bernstein on beatbox; Marc on rap.
-- Remove the redundant explicit Sam-on-drums delta (drums is his assumed default).
INSERT INTO "instruments" ("name", "slug", "updated_at")
SELECT 'rap', 'rap', now() ON CONFLICT ("slug") DO NOTHING;
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1
  AND mu."slug" = 'sam-altman';
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'beatbox'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'beatbox'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'beatbox'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'eric-bernstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'rap'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2000-08-19 Wetlands S1.7 Run Like Hell: the "Electron" guest lineup.
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'DJ Stich', 'dj-stich', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'turntables'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dj-stich'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'turntables'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'dj-stich'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'pauly-herron'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'joe-russo'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2000-07-12 Crowbar: Jordan Crisman sat in on bass and vocals for the entire
-- show (all tracks), elevating to a show-level guest note.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND mu."slug" = 'jordan-crisman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2000-06-22 Irving Plaza S1.3 Have a Cigar: Jim Loughlin on percussion.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jim-loughlin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'jim-loughlin'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- 2000-03-11 Wetlands E1.1 I-Man: Sam and Jon are core members, not guests;
-- remove the erroneous present=true deltas (cascade clears their instruments).
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'E1' AND t."position" = 1
  AND mu."slug" IN ('sam-altman', 'jon-gutwillig');

-- 1998-05-21 Wetlands S1.3 Blue Monk: remove the erroneous "without Marc" delta.
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '1998-05-21-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 3
  AND mu."slug" = 'marc-brownstein' AND tm."present" = false;

-- 1998-04-16 8x10 Club S1.5 Awol's Blues: remove the erroneous "without Aron" delta.
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '1998-04-16-8-x-10-club-baltimore-md' AND t."set" = 'S1' AND t."position" = 5
  AND mu."slug" = 'aron-magner' AND tm."present" = false;

-- 1998-02-13 The Next Decade S1.5 Run Like Hell: Barber-on-keys (Magner stepped
-- away during the intro) stays as a free-text annotation, not a structured delta.
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '1998-02-13-the-next-decade-oakland-pa' AND t."set" = 'S1' AND t."position" = 5
  AND mu."slug" = 'jon-gutwillig';

-- 1997-10-31 Phi Sigma Kappa S2.1 Jam: remove the erroneous Sam-on-keys delta.
DELETE FROM "track_musicians" tm
USING "tracks" t, "shows" s, "musicians" mu
WHERE tm."track_id" = t."id" AND t."show_id" = s."id" AND tm."musician_id" = mu."id"
  AND s."slug" = '1997-10-31-phi-sigma-kappa-university-of-pennsylvania-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1
  AND mu."slug" = 'sam-altman';

-- 1997-06-28 E Stage Further Festival: Johnny Zula on percussion for the whole
-- show (all tracks), elevating to a show-level guest note.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1997-06-28-e-stage-further-festival-sony-entertainment-center-camden-nj' AND mu."slug" = 'johnny-zula'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '1997-06-28-e-stage-further-festival-sony-entertainment-center-camden-nj' AND mu."slug" = 'johnny-zula'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

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
WHERE s."slug" = '1997-10-31-phi-sigma-kappa-university-of-pennsylvania-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-10-31-phi-sigma-kappa-university-of-pennsylvania-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-02-13-the-next-decade-oakland-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1998-02-13-the-next-decade-oakland-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-04-16-8-x-10-club-baltimore-md' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '1998-05-21-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
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
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'djembe'
WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
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
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
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
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
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
SELECT t."id", mu."id", false, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'sam-altman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
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
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jake-cinninger'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jake-cinninger'
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
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'brendan-bayliss'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
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
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND mu."slug" = 'trevor-garrod'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND mu."slug" = 'trevor-garrod'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND mu."slug" = 'steve-molitz'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND mu."slug" = 'steve-molitz'
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
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'antibalas-horns'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'antibalas-horns'
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
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S2' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 5 AND mu."slug" = 'jon-gutwillig'
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
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocoder'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND t."set" = 'S1' AND t."position" = 7 AND mu."slug" = 'aron-magner'
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
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocoder'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'aron-magner'
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
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND mu."slug" = 'natalie-cressman'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trombone'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND mu."slug" = 'natalie-cressman'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND mu."slug" = 'jen-hartswick'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'trumpet'
WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND mu."slug" = 'jen-hartswick'
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
WHERE s."slug" = '2017-11-17-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocoder'
WHERE s."slug" = '2017-11-17-the-fillmore-auditorium-denver-co' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND mu."slug" = 'gabe-mervine'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND mu."slug" = 'gabe-mervine'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND mu."slug" = 'drew-sayers'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'horns'
WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND mu."slug" = 'drew-sayers'
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
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'allen-aucoin'
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
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'allen-aucoin'
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
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'allen-aucoin'
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
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'allen-aucoin'
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
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'allen-aucoin'
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
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keytar'
WHERE s."slug" = '2024-03-29-webster-hall-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keytar'
WHERE s."slug" = '2024-04-06-longhorn-ballroom-dallas-tx' AND t."set" = 'E1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-14-greenfield-lake-amphitheater-wilmington-nc' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocoder'
WHERE s."slug" = '2024-07-14-greenfield-lake-amphitheater-wilmington-nc' AND t."set" = 'S1' AND t."position" = 1 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2024-07-15-the-windjammer-isle-of-palms-sc' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'aron-magner'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocoder'
WHERE s."slug" = '2024-07-15-the-windjammer-isle-of-palms-sc' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'aron-magner'
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

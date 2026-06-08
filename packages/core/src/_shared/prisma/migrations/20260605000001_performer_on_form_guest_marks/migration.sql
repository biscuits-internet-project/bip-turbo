-- Retire the standard "with <Name> on <instrument>" guest annotations whose
-- performer data the original backfill already captured as track deltas, plus
-- the one clean missed guest (Chris Michetti, 2010-03-19, a trailing-space
-- match failure). Trim-robust matcher; capped at the verified checkpoint
-- (2023-02-02). The actual delete ships as a separate forward migration.

-- Missed guest: Chris Michetti on guitar (build delta, then mark)
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 2 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 3 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 5 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now() FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 6 AND mu."slug" = 'chris-michetti'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);

-- Annotations already backed by a track delta
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 10 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 13 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Tony from Fathead on congas.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'With Tony from Fathead on congas.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Vernon Reid of Living Colour on guitar.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'With Vernon Reid of Living Colour on guitar.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-20-silk-city-diner-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 8 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Elliot Levin on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-07-26-lion-s-den-new-york-ny' AND t."set" = 'S2' AND t."position" = 9 AND btrim(a."desc") = 'With Elliot Levin on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Russo on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Joe Russo on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jack from Planet 22 on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'With Jack from Planet 22 on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jack from Planet 22 on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1997-10-23-cafe-210-west-state-college-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'With Jack from Planet 22 on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Barber on keys during intro as Magner ran to the bathtoom.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-02-13-the-next-decade-oakland-pa' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'With Barber on keys during intro as Magner ran to the bathtoom.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Russo on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Joe Russo on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Russo on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Joe Russo on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Russo on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Joe Russo on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-07-24-exit2-nightclub-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Dan Brown on saxophone.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-06-18-plantation-club-worcester-ma' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Dan Brown on saxophone.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jeff on trumpet and TK on saxophone from Foxtrot Zulu.  Barber also joined John Scofield, John Medeski, Chris Wood, and Charlie Hunter for their encore.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'With Jeff on trumpet and TK on saxophone from Foxtrot Zulu.  Barber also joined John Scofield, John Medeski, Chris Wood, and Charlie Hunter for their encore.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Tony Furtado on banjo.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'With Tony Furtado on banjo.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Tony Furtado on banjo.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'With Tony Furtado on banjo.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Tony Furtado on banjo.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1998-10-28-higher-ground-s-burlington-vt' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'With Tony Furtado on banjo.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Clayton Belknap on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-15-recher-theatre-towson-md' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Clayton Belknap on bass'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on the Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on the Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on the Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on the Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Carol Wade on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Carol Wade on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Bill Stites on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Bill Stites on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Bill Stites on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-21-middle-east-cambridge-ma' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'With Bill Stites on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Meredith Motley on vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'With Meredith Motley on vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-29-trocadero-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'With Anthony Rogers-Wright of the Arthur Dent Foundation on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With DJ Mauricio on the Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'With DJ Mauricio on the Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Marc Brownstein on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 3 AND btrim(a."desc") = 'With Marc Brownstein on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on percusison', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Mike Greenfield on percusison'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on percusison', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Mike Greenfield on percusison'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on percusison', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Mike Greenfield on percusison'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on percusison', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'with Mike Greenfield on percusison'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dan Brantigan on trumpet.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-09-05-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Dan Brantigan on trumpet.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Eric Bernstein on beatbox.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'With Eric Bernstein on beatbox.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Erica Lynn Gruenberg on vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND t."set" = 'S3' AND t."position" = 7 AND btrim(a."desc") = 'With Erica Lynn Gruenberg on vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Northrup (Travis Tritt Band) on drums; without Sammy', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with David Northrup (Travis Tritt Band) on drums; without Sammy'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Rob Derhak (moe.) on bass & vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Rob Derhak (moe.) on bass & vocals'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: with Jordan Crisman (Cantus) on bass  No second jam in House Dog BECOMES No second jam in House Dog', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-20-all-good-festival-buffalo-gap-camping-ground-capon-bridge-wv' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") IN (
    'with Jordan Crisman (Cantus) on bass  No second jam in House Dog',
    'TODELETE: with Jordan Crisman (Cantus) on bass  No second jam in House Dog'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-04-crocodile-rock-allentown-pa' AND t."set" = 'E1' AND t."position" = 4 AND btrim(a."desc") = 'with Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Al Schnier (moe.) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-06-11-innsbrook-pavillion-glen-allen-va' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Al Schnier (moe.) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Northrup (Travis Tritt Band) on drums; without Sammy', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with David Northrup (Travis Tritt Band) on drums; without Sammy'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Travis Tritt on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Travis Tritt on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (The New Deal) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Jamie Shields (The New Deal) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with John Whooley (Estradasphere) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-07-06-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with John Whooley (Estradasphere) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Segued out of Mauricio''s set.  With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'Segued out of Mauricio''s set.  With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Stanton Moore of Galactic on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Stanton Moore of Galactic on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dan Bratigan (T.E.R.A.) on trumpet', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-11-29-webster-theater-hartford-ct' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Dan Bratigan (T.E.R.A.) on trumpet'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Stapleton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-05-27-bb-kings-blues-club-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Joe Stapleton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Marc and Jon only with Marc on acoustic guitar & Jon on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-09-29-club-tinks-scranton-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'Marc and Jon only with Marc on acoustic guitar & Jon on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Mike Dillon of Les Claypool''s Flying Frog Brigade on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jay Lane of Les Claypool''s Flying Frog Brigade on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Jay Lane of Les Claypool''s Flying Frog Brigade on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Pujalet of Particle on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Darren Pujalet of Particle on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Pujalet of Particle on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Darren Pujalet of Particle on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Pujalet of Particle on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-01-12-imperial-majesty-regal-empress-the-open-seas-fl' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Darren Pujalet of Particle on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Northrup (Travis Tritt Band) on drums; without Sammy', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with David Northrup (Travis Tritt Band) on drums; without Sammy'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Travis Tritt on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-04-26-the-theater-at-msg-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Travis Tritt on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-23-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Al Schnier (moe.) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2022-10-01-saranac-brewery-utica-ny' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Al Schnier (moe.) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (The New Deal) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Jamie Shields (The New Deal) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (The New Deal) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-12-30-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Jamie Shields (The New Deal) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield (The Ally) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Greenfield (The Ally) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield (The Ally) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Mike Greenfield (The Ally) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield (The Ally) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Mike Greenfield (The Ally) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield (The Ally) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Mike Greenfield (The Ally) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jim Riordan (Cosmos Sunshine Band) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Jim Riordan (Cosmos Sunshine Band) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jim Riordan (Cosmos Sunshine Band) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Jim Riordan (Cosmos Sunshine Band) on drums'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: Perfume version (Honky Tonk style); with Sam Altman on drums BECOMES Perfume version (Honky Tonk style)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 10 AND btrim(a."desc") IN (
    'Perfume version (Honky Tonk style); with Sam Altman on drums',
    'TODELETE: Perfume version (Honky Tonk style); with Sam Altman on drums'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dom Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Dom Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dom Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Dom Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matisyahu on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'S3' AND t."position" = 5 AND btrim(a."desc") = 'with Matisyahu on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dom Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Dom Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dom Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Dom Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dom Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Dom Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with John Lee (Caveman) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-04-15-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with John Lee (Caveman) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen Aucoin (Skydog Gypsy) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Allen Aucoin (Skydog Gypsy) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen Aucoin (Skydog Gypsy) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Allen Aucoin (Skydog Gypsy) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen Aucoin (Skydog Gypsy) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Allen Aucoin (Skydog Gypsy) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen Aucoin (Skydog Gypsy) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-19-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Allen Aucoin (Skydog Gypsy) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (the New Deal) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-05-28-penn-s-landing-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Jamie Shields (the New Deal) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Aaron Goldberg (Skydog) on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-10-15-new-daisy-theatre-memphis-tn' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Aaron Goldberg (Skydog) on bass'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dominic Lolli (of Big Gigantic) on saxaphone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Dominic Lolli (of Big Gigantic) on saxaphone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matisyahu on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Matisyahu on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on the Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on the Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Meredith Motley on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Meredith Motley on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar/vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton on guitar/vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar/vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton on guitar/vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jake Cinninger (Umphrey''s McGee) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-03-14-carling-academy-islington-london-u-k' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Jake Cinninger (Umphrey''s McGee) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Gabe Mervine and Drew Sayers (The Motet) on horns', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-12-02-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Gabe Mervine and Drew Sayers (The Motet) on horns'
);
UPDATE "annotations" SET "desc" = 'TODELETE: Sammy on bass. With DJ Mauricio on Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-04-22-keene-state-college-keene-nh' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'Sammy on bass. With DJ Mauricio on Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with KJ Sawka on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 2 AND btrim(a."desc") = 'with KJ Sawka on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With DJ Mauricio on the Roland MC-505.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'With DJ Mauricio on the Roland MC-505.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Les Claypool of Primus on bass and vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'With Les Claypool of Primus on bass and vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Marc Brownstein on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-07-12-crowbar-state-college-pa' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'With Marc Brownstein on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dominic Lalli (Big Gigantic) on Saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Dominic Lalli (Big Gigantic) on Saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill McKay (Leftover Salmon) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Bill McKay (Leftover Salmon) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Bill McKay (Leftover Salmon) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2004-07-10-marvin-s-mountaintop-masontown-wv' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Bill McKay (Leftover Salmon) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Eric Wortham on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-05-24-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Eric Wortham on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Les Claypool of Primus on bass and vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'With Les Claypool of Primus on bass and vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erica Lynn Gruenberg on vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Erica Lynn Gruenberg on vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jordan Crisman of Cantus on bass.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-05-19-zollman-s-pavilion-buffalo-creek-music-festival-lexington-va' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'With Jordan Crisman of Cantus on bass.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ned Scott (The Egg) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-12-31-nokia-theater-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Ned Scott (The Egg) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Jim Loughlin from moe. on percussion.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'With Jim Loughlin from moe. on percussion.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Les Claypool of Primus on bass and vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-06-22-irving-plaza-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'With Les Claypool of Primus on bass and vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ruu (Younger Brother Live Band) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-07-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Ruu (Younger Brother Live Band) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Sam Altman on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Sam Altman on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 8 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Murphy (STS9) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with David Murphy (STS9) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Murphy (STS9) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-03-08-seminole-indian-reservation-big-cypress-fl' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with David Murphy (STS9) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jeremy (Big Gigantic) on Drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Jeremy (Big Gigantic) on Drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Shira Elias (Turkuaz) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2021-09-26-brooklyn-mirage-brooklyn-comes-alive-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Shira Elias (Turkuaz) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Gabriel Polomo on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Gabriel Polomo on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jeff Waful on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Jeff Waful on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ann Marie Calhoun on violin', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Ann Marie Calhoun on violin'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tuphace on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Tuphace on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tuphace on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-12-27-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Tuphace on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matisyahu on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-29-hammerstein-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Matisyahu on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-10-25-state-theater-falls-church-va' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mutlu Onaral on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Mutlu Onaral on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Scott Metzger (RANA, Particle) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-05-28-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Scott Metzger (RANA, Particle) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-02-04-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With Erica Lynn Gruenberg on vocals.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-12-31-hammerstein-ballroom-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'With Erica Lynn Gruenberg on vocals.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-14-caribbean-holidaze-runaway-bay-jamaica' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: With John Kim of the Ally on violin.', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-03-11-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'With John Kim of the Ally on violin.'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2022-06-19-mann-center-for-the-performing-arts-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Robbie Gennett (Rudy) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-10-16-palace-theater-gainesville-fl' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Robbie Gennett (Rudy) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dominic Lalli (Big Gigantic) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Dominic Lalli (Big Gigantic) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-05-26-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-05-27-maine-state-pier-portland-me' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss (Umphrey''s McGee) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-12-03-breathless-resort-spa-punta-cana-dominican-republic' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Brendan Bayliss (Umphrey''s McGee) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2017-07-15-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S3' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hamilton on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-07-17-montage-mountain-scranton-pa' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-17-newport-music-hall-columbus-oh' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-23-canopy-club-urbana-il' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-20-barrymore-theater-madison-wi' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss (Umphrey''s McGee) on guitar and vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2018-12-15-holidaze-now-sapphire-puerto-morelos-mexico' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Brendan Bayliss (Umphrey''s McGee) on guitar and vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Holly Bowling (as Leora) on piano', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2018-12-31-the-fillmore-philadelphia-pa' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Holly Bowling (as Leora) on piano'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen and Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Allen and Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen and Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Allen and Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen and Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Allen and Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen and Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Allen and Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen and Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-07-20-montage-mountain-scranton-pa' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Allen and Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Simon Green on bass (Bonobo)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2009-12-29-nokia-theater-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Simon Green on bass (Bonobo)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss (Umphrey''s McGee) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Brendan Bayliss (Umphrey''s McGee) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dan Lebowitz (ALO) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Dan Lebowitz (ALO) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dan Lebowitz (ALO) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Dan Lebowitz (ALO) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dan Lebowitz (ALO) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Dan Lebowitz (ALO) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-05-9-30-club-washington-dc' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Al Schnier of (Moe.) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Al Schnier of (Moe.) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brenden Bayliss (Umphrey’s McGee) on guitar (2nd jam only)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Brenden Bayliss (Umphrey’s McGee) on guitar (2nd jam only)'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brandan Bayliss (Umphrey’s McGee) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Brandan Bayliss (Umphrey’s McGee) on vocals'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: Magner''s birthday jam, with Ryan Stasik & Brendan Bayliss on bass/guitar (Umphrey''s McGee) BECOMES Magner''s birthday jam', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") IN (
    'Magner''s birthday jam, with Ryan Stasik & Brendan Bayliss on bass/guitar (Umphrey''s McGee)',
    'TODELETE: Magner''s birthday jam, with Ryan Stasik & Brendan Bayliss on bass/guitar (Umphrey''s McGee)'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-08-pearl-street-northampton-ma' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: with Matisyahu on vocals (Shema Yisrael) BECOMES (Shema Yisrael)', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") IN (
    'with Matisyahu on vocals (Shema Yisrael)',
    'TODELETE: with Matisyahu on vocals (Shema Yisrael)'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Trevor Garrod (Tea Leaf Green) and Steve Molitz (Particle) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-07-22-the-independent-san-francisco-ca' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Trevor Garrod (Tea Leaf Green) and Steve Molitz (Particle) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Rabb (BioDiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-08-18-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Johnny Rabb (BioDiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Simon Posford on guitar and Zach Velmer (Soundtribe Sector 9) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-08-17-indian-lookout-country-club-mariaville-ny' AND t."set" = 'S3' AND t."position" = 4 AND btrim(a."desc") = 'with Simon Posford on guitar and Zach Velmer (Soundtribe Sector 9) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with David Northrup (Travis Tritt Band) on drums; without Allen', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-10-16-cannery-ballroom-nashville-tn' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with David Northrup (Travis Tritt Band) on drums; without Allen'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brock Butler (Perpetual Groove) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Brock Butler (Perpetual Groove) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar and Joe Russo (The Duo) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Allen on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Allen on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Al Schnier (Moe.) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-12-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Al Schnier (Moe.) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joel Cummins (Umphrey''s McGee) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Joel Cummins (Umphrey''s McGee) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Keller Williams on vocals/guitar & Antibalas horns', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Keller Williams on vocals/guitar & Antibalas horns'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Dean Tovey (Skydog Gypsy) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Dean Tovey (Skydog Gypsy) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Sam Altman on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-30-electric-factory-philadelphia-pa' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Sam Altman on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss (Umphrey''s McGee) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-03-20-the-max-amsterdam-holland' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Brendan Bayliss (Umphrey''s McGee) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Al Schnier of (Moe.) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-13-paramount-theater-asbury-park-nj' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Al Schnier of (Moe.) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss (Umphrey''s McGee) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-05-26-three-sister-s-park-chillicothe-il-2' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Brendan Bayliss (Umphrey''s McGee) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Elliot Levin (Sun Ra Arkestra) on flute', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Elliot Levin (Sun Ra Arkestra) on flute'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hammilton (Brothers Past) on Guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hammilton (Brothers Past) on Guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hammilton (Brothers Past) on Guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'with Tom Hammilton (Brothers Past) on Guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Scott Metzger (RANA) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Scott Metzger (RANA) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Scott Metzger (RANA) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Scott Metzger (RANA) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Danny Riser on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Danny Riser on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Danny Riser on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Danny Riser on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Danny Riser on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Danny Riser on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Danny Riser on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Danny Riser on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Shawn Hennessey on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Shawn Hennessey on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Shawn Hennessey on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Shawn Hennessey on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brian Griffin on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-11-18-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Brian Griffin on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfield on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2005-09-13-spirit-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Greenfield on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Murph (Sound Tribe Sector 9) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Murph (Sound Tribe Sector 9) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Murph (Sound Tribe Sector 9) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-07-03-rothbury-music-festival-rothbury-mi' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Murph (Sound Tribe Sector 9) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Keller Williams on vocals and acoustic guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-08-11-tussey-mountain-amphitheater-boalsburg-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Keller Williams on vocals and acoustic guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-27-city-centerfest-charlotte-nc' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ann Marie Calhoun on violin', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Ann Marie Calhoun on violin'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brock Butler (Perpetual Groove) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Brock Butler (Perpetual Groove) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brendan Bayliss and Jake Cinninger (Umphrey''s McGee) on vocals/guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND t."set" = 'E1' AND t."position" = 2 AND btrim(a."desc") = 'with Brendan Bayliss and Jake Cinninger (Umphrey''s McGee) on vocals/guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jake Cinninger (Umphrey''s McGee) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Jake Cinninger (Umphrey''s McGee) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jake Cinninger (Umphrey''s McGee) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Jake Cinninger (Umphrey''s McGee) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ann Marie Calhoun on violin', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-02-29-starland-ballroom-sayreville-nj' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Ann Marie Calhoun on violin'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-24-headliners-music-hall-louisville-ky' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-19-royal-oak-theater-detroit-mi' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Don Cheegro on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-04-17-the-national-richmond-va' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Don Cheegro on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jon Gutwillig on guitar only', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Jon Gutwillig on guitar only'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: with Adam William Davis on vocals while crew smashes pumpkins on stage with a tire iron. Eric Bernstein on guitar while Barber smashes BECOMES crew smashes pumpkins on stage and while Barber joins in', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-10-31-trax-charlottesville-va' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") IN (
    'with Adam William Davis on vocals while crew smashes pumpkins on stage with a tire iron. Eric Bernstein on guitar while Barber smashes',
    'TODELETE: with Adam William Davis on vocals while crew smashes pumpkins on stage with a tire iron. Eric Bernstein on guitar while Barber smashes'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 8 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erica Lynn Gruenberg on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Erica Lynn Gruenberg on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Matt Pierce (Lake Trout) on flute', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-10-23-the-bottleneck-lawrence-ks' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Matt Pierce (Lake Trout) on flute'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-03-water-street-music-hall-rochester-ny' AND t."set" = 'S2' AND t."position" = 9 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfeld (The Ally) on drums, without Sam', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Greenfeld (The Ally) on drums, without Sam'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Reid Genauer (Strangefolk) on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Reid Genauer (Strangefolk) on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brett Joseph (Fat Mama) on saxophone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-10-10-legends-lounge-las-vegas-nv' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Brett Joseph (Fat Mama) on saxophone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jon Gutwillig on guitar only', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Jon Gutwillig on guitar only'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Paul Norman on turntables', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-08-02-park-west-chicago-il' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with DJ Paul Norman on turntables'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Natalie Cressman & Jen Hartswick (Trey Anastasio Band) on trombone & trumpet', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-03-05-suwannee-music-park-live-oak-florida' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Natalie Cressman & Jen Hartswick (Trey Anastasio Band) on trombone & trumpet'
);
UPDATE "annotations" SET "desc" = 'TOEDIT: with Jordan Crisman (dressed in gorilla suit) on bass for part of jam BECOMES with Jordan Crisman (dressed in gorilla suit) for part of jam', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-04-06-norva-theater-norfolk-va' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") IN (
    'with Jordan Crisman (dressed in gorilla suit) on bass for part of jam',
    'TODELETE: with Jordan Crisman (dressed in gorilla suit) on bass for part of jam',
    'TOEDIT: with Jordan Crisman (dressed in gorilla suit) on bass for part of jam BECOMES with Jordan Crisman (dressed in gorilla suit)'
  )
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Steve Molitz (Particle) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-05-03-tipitina-s-new-orleans-la' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Steve Molitz (Particle) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Keller Williams on mouth fluegel', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-08-11-brown-s-island-richmond-va' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Keller Williams on mouth fluegel'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Barron on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Chris Barron on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Marco Benevento on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Marco Benevento on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with John Medeski on keys and Stanton Moore on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2008-11-03-highline-ballroom-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with John Medeski on keys and Stanton Moore on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Scotty Zwang (Dopapod) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Scotty Zwang (Dopapod) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Ed Mann (Frank Zappa) on vibraphone', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-09-10-great-north-music-and-arts-fest-minot-me' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Ed Mann (Frank Zappa) on vibraphone'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jon Gutwillig on guitar only', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Jon Gutwillig on guitar only'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jon Gutwillig on guitar only', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Jon Gutwillig on guitar only'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jon Gutwillig on guitar only', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Jon Gutwillig on guitar only'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Brenden Bayliss (Umphrey''s McGee) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Brenden Bayliss (Umphrey''s McGee) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Adam Deitch (Pretty Lights) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Adam Deitch (Pretty Lights) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 5 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 6 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'S2' AND t."position" = 7 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Darren Shearer (The New Deal) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Darren Shearer (The New Deal) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Mitchetti (Raq) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Chris Mitchetti (Raq) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Johnny Raab (Biodiesel) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Johnny Raab (Biodiesel) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Zarick (Indobox) on guitar/vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Joe Zarick (Indobox) on guitar/vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Zarick (Indobox) on guitar/vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with Joe Zarick (Indobox) on guitar/vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Joe Zarick (Indobox) on guitar/vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-19-house-of-blues-boston-ma' AND t."set" = 'S1' AND t."position" = 9 AND btrim(a."desc") = 'with Joe Zarick (Indobox) on guitar/vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Carter (Indobox) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Mike Carter (Indobox) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Carter (Indobox) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Mike Carter (Indobox) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Carter (Indobox) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Mike Carter (Indobox) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Chris Michetti (RAQ) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Chris Michetti (RAQ) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Tom Hamilton (Brothers Past) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Tom Hamilton (Brothers Past) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Carter (Indobox) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'E1' AND t."position" = 1 AND btrim(a."desc") = 'with Mike Carter (Indobox) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Carter (Indobox) on guitar', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Mike Carter (Indobox) on guitar'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Scotty Zwang (Dopapod) on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2015-02-20-electric-factory-philadelphia-pa' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Scotty Zwang (Dopapod) on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erica Lynn Gruenberg on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 3 AND btrim(a."desc") = 'with Erica Lynn Gruenberg on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Erica Lynn Gruenberg on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Erica Lynn Gruenberg on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Mauricio on turntables and the Roland MC-505', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S1' AND t."position" = 8 AND btrim(a."desc") = 'with DJ Mauricio on turntables and the Roland MC-505'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with DJ Mauricio on turntables and the Roland MC-505', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-26-saw-mill-ski-area-morris-pa' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with DJ Mauricio on turntables and the Roland MC-505'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Mike Greenfeld (The Ally) on drums, without Sam', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-12-29-slipper-room-new-york-city-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Mike Greenfeld (The Ally) on drums, without Sam'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Jamie Shields (The New Deal) on keyboards', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2003-11-26-avalon-ballroom-boston-ma' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Jamie Shields (The New Deal) on keyboards'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Pauly Herron on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Pauly Herron on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Pauly Herron on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 1 AND btrim(a."desc") = 'with Pauly Herron on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Pauly Herron on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 3 AND btrim(a."desc") = 'with Pauly Herron on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Pauly Herron on percussion', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Pauly Herron on percussion'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Govinda Meyer (aka Flute Girl) on flute', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2002-08-24-salansky-farms-union-dale-pa' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Govinda Meyer (aka Flute Girl) on flute'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Vic Vucheck on flute', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Vic Vucheck on flute'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Vic Vucheck on flute', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-02-26-last-day-saloon-san-francisco-ca' AND t."set" = 'S2' AND t."position" = 4 AND btrim(a."desc") = 'with Vic Vucheck on flute'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Oteil Burbridge (Allman Brothers Band) on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 4 AND btrim(a."desc") = 'with Oteil Burbridge (Allman Brothers Band) on bass'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Oteil Burbridge (Allman Brothers Band) on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-06-03-recher-theatre-towson-md' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Oteil Burbridge (Allman Brothers Band) on bass'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Oteil Burbridge (Allman Brothers Band) on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '1999-06-05-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Oteil Burbridge (Allman Brothers Band) on bass'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Marco Benevento (The Duo) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2007-12-15-caribbean-holidaze-runaway-bay' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Marco Benevento (The Duo) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Simon Posford (Hallucinogen) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2016-12-03-dominican-holidaze-breathless-punta-cana-resort-spa-carretera-uvero-alto' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Simon Posford (Hallucinogen) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Benny Bloom (Lettuce) on trumpet', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 5 AND btrim(a."desc") = 'with Benny Bloom (Lettuce) on trumpet'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Benny Bloom (Lettuce) on trumpet', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2019-04-26-the-fillmore-new-orleans-la' AND t."set" = 'S1' AND t."position" = 6 AND btrim(a."desc") = 'with Benny Bloom (Lettuce) on trumpet'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Greg Sherrod on vocals', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND t."set" = 'S1' AND t."position" = 2 AND btrim(a."desc") = 'with Greg Sherrod on vocals'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Zach Brownstein on drums', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 1 AND btrim(a."desc") = 'with Zach Brownstein on drums'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Eli Winderman (Dopapod) on keys', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2023-02-02-higher-ground-south-burlington-vt' AND t."set" = 'S2' AND t."position" = 2 AND btrim(a."desc") = 'with Eli Winderman (Dopapod) on keys'
);
UPDATE "annotations" SET "desc" = 'TODELETE: with Karina Rykman on bass', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2023-02-01-higher-ground-south-burlington-vt' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Karina Rykman on bass'
);

-- 2000-08-19 Wetlands S1.7 Run Like Hell: named Electron guests are now structured
-- track deltas; keep a prose residual noting the rest of the project's lineup.
UPDATE "annotations" SET "desc" = 'TOEDIT: with Electron (DJ Stich on turntables, Pauly Herron on percussion, Tom Hamilton (Brothers Past) on guitar, and Joe Russo (Fat Mama) on drums) BECOMES with the rest of Electron', "updated_at" = now()
WHERE "id" IN (
  SELECT a."id" FROM "annotations" a
  JOIN "tracks" t ON t."id" = a."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  WHERE s."slug" = '2000-08-19-wetlands-preserve-new-york-ny' AND t."set" = 'S1' AND t."position" = 7 AND btrim(a."desc") = 'with Electron (DJ Stich on turntables, Pauly Herron on percussion, Tom Hamilton (Brothers Past) on guitar, and Joe Russo (Fat Mama) on drums)'
);

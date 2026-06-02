-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-show lineups, shows dated 2010..2011.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-23-the-f-m-kirby-center-wilkes-barre-pa' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-07-paper-mill-island-amphitheater-baldwinsville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'tom-hamilton'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-08-wellmont-theater-montclair-nj' AND mu."slug" = 'chris-michetti'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-27-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-27-pearl-street-mall-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-28-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-05-29-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-02-beaumont-club-kansas-city-mo' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-03-wakarusa-festival-mulberry-river-mountain-ranch-ozark-ar' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-04-bamajam-music-festival-enterprise-al' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-05-ft-armistead-park-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-08-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-09-the-windjammer-isle-of-palms-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-10-house-of-blues-myrtle-beach-sc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-11-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-06-12-bonnaroo-music-festival-manchester-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-07-15-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-07-16-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-07-17-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-08-25-bottle-cork-dewey-beach-de' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-08-26-lincoln-theater-raleigh-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-08-27-suwannee-music-park-live-oak-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-08-28-verizon-wireless-amphitheatre-at-encore-park-alpharetta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-08-29-the-tabernacle-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-01-busters-billiards-backroom-lexington-ky' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-02-house-of-blues-cleveland-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-03-congress-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-04-apache-pass-rockdale-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-05-union-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-07-the-state-theater-state-college-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-08-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-09-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-10-mountain-park-holyoke-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-11-bank-of-america-pavilion-boston-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-09-18-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-25-diamond-riggs-studios-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-28-norva-theater-norfolk-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-29-hampton-coliseum-hampton-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-30-thomas-wolfe-auditorium-asheville-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-31-charlottesville-pavilion-charlottesville-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-10-31-jefferson-theater-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-27-terminal-5-new-york-ny' AND mu."slug" = 'mike-greenfield'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-28-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-29-terminal-5-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-30-tower-theater-upper-darby-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2010-12-31-tower-theater-upper-darby-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-13-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-14-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-15-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-16-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-21-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'ryan-stasik'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-22-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-01-23-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-03-27-bicentennial-park-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-03-27-grand-central-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-04-14-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-04-15-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-04-15-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-04-16-sherman-theater-stroudsburg-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-05-26-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-05-27-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-05-28-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-07-02-emu-music-fest-snowmass-village-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-07-07-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-07-08-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-07-09-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-11-verizon-wireless-music-center-noblesville-in' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-12-dte-energy-music-theatre-clarkston-mi' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-13-first-niagara-pavilion-burgettstown-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-14-pnc-bank-arts-center-holmdel-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-16-verizon-wireless-amphitheatre-charlotte-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

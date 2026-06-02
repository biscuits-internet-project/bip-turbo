-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-show lineups, shows dated 2000..2001.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-12-27-the-silo-reading-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-12-28-the-silo-reading-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-12-29-the-vanderbilt-plainview-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-12-30-the-vanderbilt-plainview-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2000-12-31-the-palladium-worcester-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-17-waterloo-park-south-by-southwest-austin-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-22-palookaville-santa-cruz-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-23-house-of-blues-west-hollywood-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-24-belly-up-tavern-solana-beach-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-27-rialto-theater-tucson-az' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-28-cajun-house-scottsdale-az' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-29-the-paramount-santa-fe-nm' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-30-gothic-theater-englewood-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-03-31-fox-theatre-boulder-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-01-fox-theatre-boulder-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-03-mississippi-nights-st-louis-mo' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-04-barrymore-theater-madison-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-05-house-of-blues-chicago-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-06-the-rave-milwaukee-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-07-the-majestic-detroit-mi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-10-the-marquee-at-the-tralf-buffalo-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-12-pearl-street-northampton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-13-lowell-auditorium-lowell-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-14-roseland-ballroom-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-15-electric-factory-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-16-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-18-the-odeon-cleveland-oh' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-19-metropol-pittsburgh-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-20-9-30-club-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-21-9-30-club-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-22-norva-theater-norfolk-va' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-24-asheville-music-zone-asheville-nc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-25-music-farm-charleston-sc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-26-the-roxy-atlanta-ga' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-27-five-points-south-music-hall-birmingham-al' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-04-28-howlin-wolf-new-orleans-la' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-01-fitzgerald-s-houston-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-02-gypsy-tea-room-dallas-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-03-la-zona-rosa-austin-tx' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-05-zephyr-club-salt-lake-city-ut' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-07-wild-duck-music-hall-eugene-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-08-liz-wilde-show-portland-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-08-crystal-ballroom-portland-or' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-09-showbox-seattle-wa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-05-11-the-fillmore-san-francisco-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-06-09-cooper-river-stadium-camden-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-06-27-lisa-klein-s-house-cherry-hill-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'john-popper'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'harmonica'
WHERE s."slug" = '2001-06-28-roseland-ballroom-new-york-ny' AND mu."slug" = 'john-popper'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-06-29-gathering-of-the-vibes-red-hook-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-06-30-greek-theater-berkeley-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-07-04-levelz-steamboat-springs-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-07-05-mishawaka-amphitheater-bellvue-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-07-07-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-07-22-saratoga-performing-arts-center-saratoga-springs-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-08-08-the-boom-boom-room-san-francisco-ca' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-08-25-kahunaville-wilmington-de' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-08-26-kahunaville-wilmington-de' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-02-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-04-toad-s-place-new-haven-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-05-avalon-ballroom-boston-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-06-higher-ground-s-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-07-saratoga-winners-cohoes-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-08-webster-theater-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-09-state-theater-new-brunswick-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-11-water-street-music-hall-rochester-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-12-newport-music-hall-columbus-oh' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-13-the-majestic-detroit-mi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-14-the-rave-milwaukee-wi' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-15-vic-theatre-chicago-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-16-canopy-club-urbana-il' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-18-cabooze-minneapolis-mn' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-19-union-bar-iowa-city-ia' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2001-09-21-gothic-theater-englewood-co' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-show lineups, shows dated 2006..2007.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-07-01-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-07-02-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-07-14-marvin-s-mountaintop-masontown-wv' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-08-05-hutchinson-field-in-grant-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-08-16-100-1-wdst-radio-woodstock-studio-woodstock-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-08-24-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-08-25-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-10-19-the-stundent-pavillion-at-washington-lee-university-lexington-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-10-31-orpheum-theater-boston-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-11-01-state-theater-ithaca-ny' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-11-02-water-street-music-hall-rochester-ny' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-03-the-calvin-northampton-ma' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'percussion'
WHERE s."slug" = '2006-11-04-sonar-lounge-baltimore-md' AND mu."slug" = 'shawn-hennessey'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-08-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-09-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-10-bogart-s-cincinnati-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-11-newport-music-hall-columbus-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-12-house-of-blues-cleveland-oh' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-14-bluebird-bloomington-in' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-15-the-blue-note-columbia-mo' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-16-canopy-club-urbana-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-17-grenada-theatre-lawrence-ks' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-18-the-fillmore-auditorium-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-19-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-21-the-new-daisy-theater-memphis-tn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-22-variety-playhouse-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-24-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-11-25-hammerstein-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-04-house-of-blues-san-diego-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-06-the-roxy-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-07-the-roxy-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-08-the-independent-san-francisco-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-09-the-independent-san-francisco-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-28-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa-2' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-30-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2006-12-31-tweeter-center-at-the-waterfront-camden-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-01-04-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-01-06-the-open-seas-msc-opera-ft-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-01-07-culture-room-fort-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-02-15-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-02-16-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-02-17-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-03-09-the-revolution-fort-lauderdale-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-03-10-langerado-music-festival-sunrise-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-03-24-olympic-center-lake-placid-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-04-20-ontourage-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-04-22-lincoln-park-zoo-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-04-22-vic-theatre-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-04-27-gramercy-theatre-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-16-lupo-s-heartbreak-hotel-providence-ri' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-17-higher-ground-south-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-18-higher-ground-s-burlington-vt' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-19-the-calvin-northampton-ma' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-20-town-ballroom-buffalo-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-21-mr-small-s-funhouse-pittsburgh-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-24-highline-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-25-highline-ballroom-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-26-penn-s-landing-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-05-27-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-08-sonar-lounge-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-09-ft-armistead-park-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-26-chameleon-club-lancaster-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-27-charlottesville-amphitheatre-charlottesville-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-28-ntelos-wireless-pavilion-portsmouth-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-29-lincoln-theatre-street-stage-raleigh-nc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-06-30-masquerade-music-park-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-01-pompano-beach-amphitheatre-pompano-beach-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-07-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-08-plumas-country-fairgrounds-quincy-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-10-house-of-blues-west-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-11-house-of-blues-san-diego-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2007-07-13-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-show lineups, shows dated 2011..2014.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-18-jiffy-lube-live-bristow-va' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-19-susquehanna-bank-center-camden-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-21-nikon-at-jones-beach-amphitheatre-wantagh-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-23-aarons-amphitheatre-at-lakewood-atlanta-ga' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-24-1-800-ask-gary-amphitheatre-tampa-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-25-klipsch-amphitheatre-bayfront-park-miami-fl' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-27-cynthia-woods-mitchell-pavilion-the-woodlands-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-28-gexa-energy-pavilion-dallas-tx' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-08-30-hard-rock-casino-presents-the-pavilion-albuquerque-mn' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-09-02-cricket-wireless-amphitheatre-chula-vista-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-09-03-shoreline-amphitheatre-mountain-view-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-09-04-palladium-hollywood-ca' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-09-05-house-of-blues-las-vegas-nv' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-09-10-the-gorge-george-wa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-12-30-auditorium-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2011-12-31-auditorium-theater-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-01-27-now-sapphire-resort-puerto-morelos' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-01-28-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-01-29-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-05-930-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-06-house-of-blues-atlantic-city-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-07-starland-ballroom-sayreville-nj' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-07-14-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-10-04-baltimore-soundstage-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-10-05-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-10-06-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-17-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-18-dreams-tulum-resort-spa-tulum' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-20-dreams-tulum-resort-spa-tulum-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2012-12-31-the-theater-at-msg-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-01-24-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-01-25-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-01-26-1stbank-center-broomfield-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-01-27-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-04-25-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-04-26-boulder-theater-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-04-27-red-rocks-amphitheater-morrison-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-07-11-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-07-12-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-07-13-indian-lookout-country-club-mariaville-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-08-30-union-park-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-08-31-concord-music-hall-chicago-il' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-09-26-baltimore-soundstage-baltimore-md' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-09-27-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-16-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-18-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-19-mayan-holidaze-now-sapphire-resort-puerto-morelos-mexico' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-26-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-27-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-28-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-29-best-buy-theater-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2013-12-31-the-theater-at-madison-square-garden-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-01-23-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-01-24-ogden-theater-denver-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-01-25-1stbank-center-broomfield-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-01-26-fox-theatre-boulder-co' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-02-20-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-02-21-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-02-22-electric-factory-philadelphia-pa' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-03-29-margaret-t-hance-park-phoenix-az' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-06-12-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-06-13-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-06-14-irving-plaza-new-york-ny' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '2014-08-02-seaside-park-bridgeport-ct' AND mu."slug" = 'allen-aucoin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

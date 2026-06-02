-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- Per-show lineups, shows dated 1995..1997.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-02-11-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-04-01-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-09-16-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-10-23-unknown-location' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-11-09-unknown-location' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa-2' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-01-4000-pine-street-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-02-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-09-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-10-unknown-venue-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-11-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1995-12-31-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-02-08-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-02-13-campus-grille-temple-university-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-03-02-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-03-04-j-c-dobb-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-03-21-trocadero-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-03-23-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-03-30-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-04-18-penn-rocks-univerisity-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-04-19-zeta-psi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-04-20-alpha-delta-pi-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-04-25-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-05-10-silk-city-diner-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-05-18-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-05-25-nate-s-farm-canton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-05-30-doc-watson-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-06-05-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-07-04-doc-watson-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-07-05-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-07-06-sam-adams-brewhouse-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-08-07-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-08-14-grog-and-tankard-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-09-06-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-09-12-fraternity-house-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-09-21-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-10-21-downtime-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-11-26-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-12-06-irvine-auditorium-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-12-14-lion-s-den-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-12-27-new-music-cafe-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1996-12-28-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-01-17-blarney-stone-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-01-30-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-01-cabaloosa-new-paltz-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-04-slade-hall-university-of-vermont-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-05-club-metronome-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-06-valentine-s-albany-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-08-middle-east-cambridge-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-13-r-t-s-oaklyn-nj' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'elliot-levin'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'saxophone'
WHERE s."slug" = '1997-02-21-middle-east-philadelphia-pa' AND mu."slug" = 'elliot-levin'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-22-grog-and-tankard-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-02-28-phi-sigma-delta-sigma-penn-state-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-01-cafe-210-west-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-07-grape-street-pub-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-20-lion-s-den-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-21-cabaloosa-new-paltz-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-22-valentine-s-albany-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-23-stone-coast-brewing-company-portland-me' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-25-p-b-finnian-s-plattsburgh-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-26-club-toast-burlington-vt' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-27-ocean-mist-matunick-ri' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-28-7-willow-street-port-chester-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-03-29-cavanaugh-s-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-10-husky-blues-university-of-connecticut-hartford-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-11-the-levee-fairfield-university-fairfield-ct' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-12-iron-horse-music-hall-northampton-ma' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-19-spring-fling-frat-party-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-21-pi-kappa-alpha-university-of-pennsylvania-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-25-wetlands-preserve-new-york-ny' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-04-26-electric-factory-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-05-09-cafe-210-west-state-college-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-05-10-blue-terrapin-elizabethtown-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-05-13-fundos-del-mundos-washington-dc' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-05-14-theater-of-the-living-arts-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'keys'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'aron-magner'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'bass'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'vocals'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'marc-brownstein'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_id", "musician_id") DO NOTHING;
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'drums'
WHERE s."slug" = '1997-05-16-pontiac-grille-philadelphia-pa' AND mu."slug" = 'sam-altman'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

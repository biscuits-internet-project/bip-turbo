-- Seed a 'midi' instrument, then change Jon Gutwillig's 2010-04-25 Webster Theater
-- lineup instrument from guitar to midi (keep vocals).
INSERT INTO "instruments" ("name", "slug", "created_at", "updated_at")
SELECT 'midi', 'midi', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "instruments" WHERE "slug" = 'midi');

-- Remove Jon's guitar lineup-instrument for this show.
DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';

-- Add Jon's midi lineup-instrument for this show.
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-25-webster-theater-hartford-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

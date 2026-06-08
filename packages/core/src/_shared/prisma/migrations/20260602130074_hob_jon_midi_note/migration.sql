-- 2010-04-24 House of Blues: Jon Gutwillig on midi (not guitar) for the show, and
-- trim the show note now that the lineup caveat is structured performer data.
DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';

INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-24-house-of-blues-atlantic-city-nj' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

UPDATE "shows"
SET "notes" = 'The New Deal opened.', "updated_at" = now()
WHERE "slug" = '2010-04-24-house-of-blues-atlantic-city-nj'
  AND "notes" = 'The New Deal opened, entire show with Tom Hamilton and Chris Michetti on guitar and Jon on MIDI.';

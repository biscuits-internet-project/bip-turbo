-- April 2010 run: Jon Gutwillig on midi (not guitar) for each show, and trim each
-- show note to just the opener (the Tom/Chris-guitar + Jon-MIDI lineup caveat is
-- now structured performer data).

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-21-the-jefferson-theater-charlottesville-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'John Lee & the J.L.e opened.', "updated_at" = now() WHERE "slug" = '2010-04-21-the-jefferson-theater-charlottesville-va';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-20-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-20-9-30-club-washington-dc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'Jason Fraticelli and the Wet Dreams opened.', "updated_at" = now() WHERE "slug" = '2010-04-20-9-30-club-washington-dc';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-18-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-18-norva-theater-norfolk-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = '', "updated_at" = now() WHERE "slug" = '2010-04-18-norva-theater-norfolk-va';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-17-the-national-richmond-va' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-17-the-national-richmond-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'DJ T-Bone opened.', "updated_at" = now() WHERE "slug" = '2010-04-17-the-national-richmond-va';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-16-the-national-richmond-va' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-16-the-national-richmond-va' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'John Lee & the J.L.e opened.', "updated_at" = now() WHERE "slug" = '2010-04-16-the-national-richmond-va';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-15-lincoln-theater-raleigh-nc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'SCi Fi opened.', "updated_at" = now() WHERE "slug" = '2010-04-15-lincoln-theater-raleigh-nc';

DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-14-charleston-music-hall-charleston-sc' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';
INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-14-charleston-music-hall-charleston-sc' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;
UPDATE "shows" SET "notes" = 'M.O. Theory and DJ Kidsmeal opened.', "updated_at" = now() WHERE "slug" = '2010-04-14-charleston-music-hall-charleston-sc';

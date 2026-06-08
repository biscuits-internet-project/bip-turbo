-- 2010-04-22 Klein Memorial Auditorium: Jon Gutwillig on midi (not guitar) for the
-- show. The whole note is the lineup caveat (now structured), so clear it.
DELETE FROM "show_musician_instruments" smi
USING "show_musicians" sm, "shows" s, "musicians" mu, "instruments" i
WHERE smi."show_musician_id" = sm."id" AND smi."instrument_id" = i."id"
  AND sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'jon-gutwillig' AND i."slug" = 'guitar';

INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'midi'
WHERE s."slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct' AND mu."slug" = 'jon-gutwillig'
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

UPDATE "shows"
SET "notes" = '', "updated_at" = now()
WHERE "slug" = '2010-04-22-the-klein-memorial-auditorium-bridgeport-ct'
  AND "notes" = 'Entire show with Tom Hamilton and Chris Michetti on guitar and Jon on MIDI.';

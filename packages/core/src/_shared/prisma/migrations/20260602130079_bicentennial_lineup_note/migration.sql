-- 2010-03-26 Bicentennial Park (Ultra): Jon was already absent; add Tom Hamilton
-- + Chris Michetti on guitar (whole-show), then strip the now-structured lineup
-- line from the show note, leaving the festival context.
INSERT INTO "show_musicians" ("show_id", "musician_id", "updated_at")
SELECT s."id", mu."id", now() FROM "shows" s, "musicians" mu
WHERE s."slug" = '2010-03-26-bicentennial-park-miami-fl' AND mu."slug" IN ('tom-hamilton','chris-michetti')
ON CONFLICT ("show_id", "musician_id") DO NOTHING;

INSERT INTO "show_musician_instruments" ("show_musician_id", "instrument_id", "updated_at")
SELECT sm."id", i."id", now() FROM "show_musicians" sm
  JOIN "shows" s ON s."id" = sm."show_id"
  JOIN "musicians" mu ON mu."id" = sm."musician_id"
  JOIN "instruments" i ON i."slug" = 'guitar'
WHERE s."slug" = '2010-03-26-bicentennial-park-miami-fl' AND mu."slug" IN ('tom-hamilton','chris-michetti')
ON CONFLICT ("show_musician_id", "instrument_id") DO NOTHING;

UPDATE "shows"
SET "notes" = regexp_replace(
      "notes",
      'Whole show without Jon Gutwillig\. Chris Michetti of RAQ and Tom Hamilton of Brothers Past on guitar\. <br>\s*',
      ''
    ),
    "updated_at" = now()
WHERE "slug" = '2010-03-26-bicentennial-park-miami-fl'
  AND "notes" LIKE '%Whole show without Jon Gutwillig. Chris Michetti of RAQ and Tom Hamilton of Brothers Past on guitar.%';

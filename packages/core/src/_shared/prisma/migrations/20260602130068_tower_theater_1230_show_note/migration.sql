-- The "Sam Altman on drums except where noted" caveat is now structured performer
-- data (lineup + per-track sat-outs), so trim the show note to just the opener.
UPDATE "shows"
SET "notes" = 'Shpongle opened.', "updated_at" = now()
WHERE "slug" = '2010-12-30-tower-theater-upper-darby-pa'
  AND "notes" = 'Shpongle opened, Sam Altman on drums except where noted.';

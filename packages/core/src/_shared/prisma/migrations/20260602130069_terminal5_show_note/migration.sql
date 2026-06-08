-- The "Sam Altman on drums for both sets" caveat is structured performer data,
-- so trim the show note to just the opener.
UPDATE "shows"
SET "notes" = 'The Crystal Method opened.', "updated_at" = now()
WHERE "slug" = '2010-12-29-terminal-5-new-york-ny'
  AND "notes" = 'The Crystal Method opened, Sam Altman on drums for both sets.';

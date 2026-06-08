-- Clear the show note (Mike Greenfield drums caveat, structured in the lineup).
UPDATE "shows"
SET "notes" = '', "updated_at" = now()
WHERE "slug" = '2004-01-15-twilight-tampa-fl'
  AND "notes" = 'With Mike Greenfield on drums.';

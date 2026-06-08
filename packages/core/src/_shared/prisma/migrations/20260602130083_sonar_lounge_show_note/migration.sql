-- Shawn Hennessey on percussion is structured performer data (show lineup), so
-- clear the show note that only restated it.
UPDATE "shows"
SET "notes" = '', "updated_at" = now()
WHERE "slug" = '2006-11-04-sonar-lounge-baltimore-md'
  AND "notes" = 'With Shawn Hennessey on percussion';

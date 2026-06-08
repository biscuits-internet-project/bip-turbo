-- Clear the show note (Shawn Hennessey lineup caveat).
UPDATE "shows"
SET "notes" = '', "updated_at" = now()
WHERE "slug" = '2006-11-03-the-calvin-northampton-ma'
  AND "notes" = 'With Shawn Hennessey on percussion and backup guitar';

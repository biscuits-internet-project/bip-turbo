-- Strip the "Mike Greenfield on drums for the show" line (structured in the
-- lineup) from the note, leaving the benefit-concert billing.
UPDATE "shows"
SET "notes" = regexp_replace("notes", '\s*<br>\s*Mike Greenfield on drums for the show\s*$', ''),
    "updated_at" = now()
WHERE "slug" = '2004-01-17-culture-room-fort-lauderdale-fl'
  AND "notes" LIKE '%Mike Greenfield on drums for the show%';

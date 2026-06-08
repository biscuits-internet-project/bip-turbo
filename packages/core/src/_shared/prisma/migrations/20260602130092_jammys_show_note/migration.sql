-- Strip the "Entire set with Mike Greenfield on drums" line from the show note.
UPDATE "shows"
SET "notes" = regexp_replace("notes", '\s*Entire set with Mike Greenfield on drums\.\s*$', ''),
    "updated_at" = now()
WHERE "slug" = '2004-03-16-the-theater-at-madison-square-garden-new-york-ny'
  AND "notes" LIKE '%Entire set with Mike Greenfield on drums.%';

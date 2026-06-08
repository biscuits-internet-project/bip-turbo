-- Strip the "With Mike Greenfeld on drums" line (structured in the lineup) from
-- the note, leaving the benefit-concert billing.
UPDATE "shows"
SET "notes" = regexp_replace("notes", '\s*With Mike Greenfeld on drums\.\s*$', ''),
    "updated_at" = now()
WHERE "slug" = '2004-01-16-culture-room-fort-lauderdale-fl'
  AND "notes" LIKE '%With Mike Greenfeld on drums.%';

-- Shawn Hennessey's whole-show-except-Little-Lai percussion is structured now
-- (lineup + Little Lai sat-out), so strip that line from the note, leaving the opener.
UPDATE "shows"
SET "notes" = regexp_replace(
      "notes",
      '\s*<br>\s*With the exception of Little Lai, enitre show with Shawn Hennessey on percussion\s*$',
      ''
    ),
    "updated_at" = now()
WHERE "slug" = '2006-09-23-patrick-gymnasium-university-of-vermont-burlington-vt'
  AND "notes" LIKE '%With the exception of Little Lai, enitre show with Shawn Hennessey on percussion%';

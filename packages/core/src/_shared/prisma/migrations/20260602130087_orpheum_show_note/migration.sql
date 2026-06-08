-- Strip the "With Shawn Hennessey on percussion and backup guitar" lineup line
-- (structured now) from the show note, leaving the Masquerade Ball billing.
UPDATE "shows"
SET "notes" = regexp_replace(
      "notes",
      '\s*<br>\s*With Shawn Hennessey on percussion and backup guitar\s*$',
      ''
    ),
    "updated_at" = now()
WHERE "slug" = '2006-10-31-orpheum-theater-boston-ma'
  AND "notes" LIKE '%With Shawn Hennessey on percussion and backup guitar%';

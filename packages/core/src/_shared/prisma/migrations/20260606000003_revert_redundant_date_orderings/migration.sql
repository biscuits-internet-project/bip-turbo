-- Two dyslexic "ending first, beginning <date>" notes are redundant with the
-- track_completions cross-show links that already connect the versions across dates,
-- so they were pulled back out of the kept-bare set (20260606000002) and returned to
-- the TODELETE bucket for the deletion pass. Idempotent: keyed by (slug, set,
-- position), matches the bare, original, and TODELETE-marked variants.

-- 2010-10-27 Rams Head Live -- redundant with completion link
UPDATE "annotations" a SET "desc" = 'TODELETE: dyslexic (ending first, beginning 10/30)', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2010-10-27-rams-head-live-baltimore-md' AND t."set" = 'E1' AND t."position" = 2
  AND a."desc" IN ('ending first, beginning 10/30', 'dyslexic (ending first, beginning 10/30)', 'TODELETE: dyslexic (ending first, beginning 10/30)');

-- 2002-11-07 Blind Pig -- redundant with completion link
UPDATE "annotations" a SET "desc" = 'TODELETE: dyslexic (ending first, beginning 11/8)', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2002-11-07-blind-pig-ann-arbor-mi' AND t."set" = 'S1' AND t."position" = 3
  AND a."desc" IN ('ending first, beginning 11/8', 'dyslexic (ending first, beginning 11/8)', 'TODELETE: dyslexic (ending first, beginning 11/8)');

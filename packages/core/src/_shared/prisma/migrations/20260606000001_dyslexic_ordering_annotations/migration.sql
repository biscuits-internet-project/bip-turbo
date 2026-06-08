-- Reduce non-standard dyslexic ordering annotations to just their section sequence.
-- "dyslexic" itself is captured by the DYSLEXIC track flag; what the flag can't
-- express is a non-standard 3-section permutation (end>begin>middle, etc.), so the
-- bare ordering is kept as the annotation text. Idempotent: keyed by (slug, set,
-- position), matches the prior TODELETE/TOEDIT-marked variants as well as the bare
-- original, so replay/sync converges on the final text.

-- 2001-03-31 Fox Theatre — Jigsaw Earth end>begin>middle
UPDATE "annotations" a SET "desc" = 'end>begin>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 5
  AND a."desc" IN ('TODELETE: dyslexic (end>begin>middle)', 'dyslexic (end>begin>middle)', 'end>begin>middle');
UPDATE "annotations" a SET "desc" = 'end>begin>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 1
  AND a."desc" IN ('TODELETE: dyslexic (end>begin>middle)', 'dyslexic (end>begin>middle)', 'end>begin>middle');
UPDATE "annotations" a SET "desc" = 'end>begin>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN ('TODELETE: dyslexic (end>begin>middle)', 'dyslexic (end>begin>middle)', 'end>begin>middle');

-- 2001-03-31 Fox Theatre — M-E-M-P-H-I-S middle>begin>end
UPDATE "annotations" a SET "desc" = 'middle>begin>end', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN ('TODELETE: dyslexic (middle>begin>end)', 'dyslexic (middle>begin>end)', 'middle>begin>end');
UPDATE "annotations" a SET "desc" = 'middle>begin>end', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 5
  AND a."desc" IN ('TODELETE: dyslexic (middle>begin>end)', 'dyslexic (middle>begin>end)', 'middle>begin>end');
UPDATE "annotations" a SET "desc" = 'middle>begin>end', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2001-03-31-fox-theatre-boulder-co' AND t."set" = 'S2' AND t."position" = 7
  AND a."desc" IN ('TODELETE: dyslexic (middle>begin>end)', 'dyslexic (middle>begin>end)', 'middle>begin>end');

-- 2007-07-17 The Blue Note — Jigsaw Earth ending first, then beginning>middle
UPDATE "annotations" a SET "desc" = 'ending first, then beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN ('TODELETE: dyslexic (ending first, then beginning>middle)', 'dyslexic (ending first, then beginning>middle)', 'ending first, then beginning>middle');
UPDATE "annotations" a SET "desc" = 'ending first, then beginning>middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2007-07-17-the-blue-note-columbia-mo' AND t."set" = 'S2' AND t."position" = 4
  AND a."desc" IN ('TODELETE: dyslexic (ending first, then beginning>middle)', 'dyslexic (ending first, then beginning>middle)', 'ending first, then beginning>middle');

-- 2016-04-21 Terminal West — Basis For a Day middle>ending (REVIEWED ZONE)
UPDATE "annotations" a SET "desc" = 'middle>ending', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2016-04-21-terminal-west-atlanta-ga' AND t."set" = 'S1' AND t."position" = 4
  AND a."desc" IN ('TODELETE: dyslexic (middle>ending)', 'dyslexic (middle>ending)', 'middle>ending');

-- 2021-04-02 The Caverns — Save the Robots end, beginning, middle (REVIEWED ZONE)
UPDATE "annotations" a SET "desc" = 'end, beginning, middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S1' AND t."position" = 5
  AND a."desc" IN ('TODELETE: dyslexic (end, beginning, middle)', 'dyslexic (end, beginning, middle)', 'end, beginning, middle');
UPDATE "annotations" a SET "desc" = 'end, beginning, middle', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 1
  AND a."desc" IN ('TODELETE: dyslexic (end, beginning, middle)', 'dyslexic (end, beginning, middle)', 'end, beginning, middle');
UPDATE "annotations" a SET "desc" = 'end, beginning, middle; with ‘Basis For a Day’ tease', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id" AND t."show_id" = s."id"
  AND s."slug" = '2021-04-02-the-caverns-above-ground-amphitheater-pelham-tn' AND t."set" = 'S2' AND t."position" = 3
  AND a."desc" IN (
    'TOEDIT: dyslexic (end, beginning, middle); with ‘Basis For a Day’ tease BECOMES with ‘Basis For a Day’ tease',
    'dyslexic (end, beginning, middle); with ‘Basis For a Day’ tease',
    'end, beginning, middle; with ‘Basis For a Day’ tease'
  );

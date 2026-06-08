-- "Moshi-Fameus Jam" is a composed piece (the kind-model 'original'), not a
-- free improvisation.
UPDATE "songs"
SET "kind" = 'original', "updated_at" = now()
WHERE "slug" = 'moshi-fameus-jam';

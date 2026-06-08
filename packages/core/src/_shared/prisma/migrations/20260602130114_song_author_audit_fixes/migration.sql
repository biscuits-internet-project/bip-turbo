-- Song author/kind audit fixes.

-- Price of Sand has no known external source; treat it as a band original.
UPDATE "songs"
SET "kind" = 'original', "updated_at" = now()
WHERE "slug" = 'price-of-sand';

-- Expand the Tchaikovsky author to his full name and attribute Dance of the
-- Sugar Plum Fairies (from The Nutcracker) to him.
UPDATE "authors"
SET "name" = 'Pyotr Ilyich Tchaikovsky', "updated_at" = now()
WHERE "slug" = 'tchaikovsky';
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'tchaikovsky'),
    "updated_at" = now()
WHERE "slug" = 'dance-of-the-sugar-plum-fairies';

-- Remove two 0-play duplicate songs wrongly authored to the band; the correctly
-- attributed versions (Ramin Djawadi / Johann Strauss II) already carry the plays.
DELETE FROM "songs"
WHERE "slug" IN ('game-of-thrones-theme', 'the-blue-danube-2')
  AND NOT EXISTS (SELECT 1 FROM "tracks" t WHERE t."song_id" = "songs"."id");

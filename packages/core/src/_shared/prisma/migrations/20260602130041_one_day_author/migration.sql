-- Attribute "One Day" (a cover) to Matisyahu.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Matisyahu', 'matisyahu', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'matisyahu');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'matisyahu'),
    "updated_at" = now()
WHERE "slug" = 'one-day';

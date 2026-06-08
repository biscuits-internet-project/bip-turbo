-- "Hide and Seek" is a cover by Imogen Heap (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Imogen Heap', 'imogen-heap', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'imogen-heap');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'imogen-heap'),
    "updated_at" = now()
WHERE "slug" = 'hide-and-seek';

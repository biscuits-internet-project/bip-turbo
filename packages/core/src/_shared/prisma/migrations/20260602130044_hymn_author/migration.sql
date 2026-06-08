-- Attribute "Hymn" (a cover) to Charlotte de Witte.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Charlotte de Witte', 'charlotte-de-witte', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'charlotte-de-witte');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'charlotte-de-witte'),
    "updated_at" = now()
WHERE "slug" = 'hymn';

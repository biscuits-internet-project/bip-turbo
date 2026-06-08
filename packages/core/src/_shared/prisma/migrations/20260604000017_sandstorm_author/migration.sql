-- "Sandstorm" is a cover by Darude.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Darude', 'darude', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'darude');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'darude'),
    "kind" = 'cover',
    "updated_at" = now()
WHERE "slug" = 'sandstorm';

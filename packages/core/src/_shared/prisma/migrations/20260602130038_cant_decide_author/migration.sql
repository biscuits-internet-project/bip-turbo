-- Attribute "Can't Decide" to Max Dean, Luke Dean, & Locky.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Max Dean, Luke Dean, & Locky', 'max-dean-luke-dean-locky', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'max-dean-luke-dean-locky');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'max-dean-luke-dean-locky'),
    "updated_at" = now()
WHERE "slug" = 'cant-decide';

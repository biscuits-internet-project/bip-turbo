-- Attribute "Cheers Theme" (a cover) to Gary Portnoy.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Gary Portnoy', 'gary-portnoy', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'gary-portnoy');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'gary-portnoy'),
    "updated_at" = now()
WHERE "slug" = 'cheers-theme';

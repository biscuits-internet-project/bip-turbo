-- "Fletch Theme" is a cover by Harold Faltermeyer.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Harold Faltermeyer', 'harold-faltermeyer', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'harold-faltermeyer');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'harold-faltermeyer'),
    "updated_at" = now()
WHERE "slug" = 'fletch-theme';

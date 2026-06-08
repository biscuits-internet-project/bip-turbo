-- "Super Mario Bros. Overworld Theme" is a cover by Koji Kondo.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Koji Kondo', 'koji-kondo', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'koji-kondo');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'koji-kondo'),
    "updated_at" = now()
WHERE "slug" = 'super-mario-bros-overworld-theme';

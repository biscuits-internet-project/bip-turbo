-- "Korobeiniki" is a traditional Russian folk song. Point it at a specific
-- author rather than the shared generic "Traditional" row (4 other songs use it).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'traditional Russian folk song', 'traditional-russian-folk-song', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'traditional-russian-folk-song');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'traditional-russian-folk-song'),
    "updated_at" = now()
WHERE "slug" = 'korobeiniki';

-- "Super Mario Bros. Underworld Theme" is a cover by Koji Kondo.
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'koji-kondo'),
    "updated_at" = now()
WHERE "slug" = 'super-mario-bros-underworld-theme';

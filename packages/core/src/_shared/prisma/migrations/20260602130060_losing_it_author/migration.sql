-- "Losing It" is a cover by Fisher (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Fisher', 'fisher', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'fisher');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'fisher'),
    "updated_at" = now()
WHERE "slug" = 'losing-it';

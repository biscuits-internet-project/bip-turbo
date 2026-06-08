-- "Boom" is a cover by Tiësto & Sevenn (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Tiësto & Sevenn', 'tiesto-sevenn', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'tiesto-sevenn');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'tiesto-sevenn'),
    "updated_at" = now()
WHERE "slug" = 'boom';

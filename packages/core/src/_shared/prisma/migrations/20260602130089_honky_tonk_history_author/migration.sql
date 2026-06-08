-- "Honky-Tonk History" is a cover by Travis Tritt (was The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Travis Tritt', 'travis-tritt', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'travis-tritt');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'travis-tritt'),
    "updated_at" = now()
WHERE "slug" = 'honky-tonk-history';

-- "Game of Thrones Theme" is a cover by Ramin Djawadi (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Ramin Djawadi', 'ramin-djawadi', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'ramin-djawadi');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'ramin-djawadi'),
    "updated_at" = now()
WHERE "slug" = 'game-of-thrones-theme-2';

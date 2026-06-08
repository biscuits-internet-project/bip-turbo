-- "Also Sprach Zarathustra" is a cover by Richard Strauss (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Richard Strauss', 'richard-strauss', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'richard-strauss');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'richard-strauss'),
    "updated_at" = now()
WHERE "slug" = 'also-sprach-zarathustra';

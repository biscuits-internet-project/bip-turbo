-- "Show Me Love" is a cover by Robin S.; "The Bells" is a cover by Jeff Mills.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Robin S.', 'robin-s', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'robin-s');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Jeff Mills', 'jeff-mills', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'jeff-mills');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'robin-s'),
    "kind" = 'cover',
    "updated_at" = now()
WHERE "slug" = 'show-me-love';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'jeff-mills'),
    "updated_at" = now()
WHERE "slug" = 'the-bells';

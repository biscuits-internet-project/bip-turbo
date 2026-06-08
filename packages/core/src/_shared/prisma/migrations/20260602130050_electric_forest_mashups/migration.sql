-- Two 2025-06-21 Electric Forest mashups get structured mashup attribution.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Shpongle', 'the-disco-biscuits-and-shpongle', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-shpongle');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Madonna', 'the-disco-biscuits-and-madonna', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-madonna');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-shpongle'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'the-great-abyss-x-lsd';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-madonna'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'tricycle-x-like-a-prayer-2';

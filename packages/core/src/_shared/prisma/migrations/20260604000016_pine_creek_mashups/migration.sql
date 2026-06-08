-- 2024-09-13 Pine Creek mashups: three mashups, one with an added external collaborator.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Dom Dolla', 'the-disco-biscuits-and-dom-dolla', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-dom-dolla');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'tourists-rocket-ship-x-on-time';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-dom-dolla'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'girl-x-times-square';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'konkrete-x-floodlights';

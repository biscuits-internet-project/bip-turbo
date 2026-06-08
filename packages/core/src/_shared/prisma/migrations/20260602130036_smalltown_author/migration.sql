-- Attribute "Smalltown" to the Herman Cattaneo & Audio Junkies remix.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Herman Cattaneo & Audio Junkies remix of the original by Monkey Safari', 'herman-cattaneo-audio-junkies-remix-of-the-original-by-monkey-safari', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'herman-cattaneo-audio-junkies-remix-of-the-original-by-monkey-safari');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'herman-cattaneo-audio-junkies-remix-of-the-original-by-monkey-safari'),
    "updated_at" = now()
WHERE "slug" = 'smalltown';

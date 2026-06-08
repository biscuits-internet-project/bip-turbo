-- "Manic Depression" is a cover by Jimi Hendrix.
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'jimi-hendrix'),
    "updated_at" = now()
WHERE "slug" = 'manic-depression';

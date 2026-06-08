-- "Language" is a cover by Porter Robinson.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Porter Robinson', 'porter-robinson', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'porter-robinson');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'porter-robinson'),
    "kind" = 'cover',
    "updated_at" = now()
WHERE "slug" = 'language';

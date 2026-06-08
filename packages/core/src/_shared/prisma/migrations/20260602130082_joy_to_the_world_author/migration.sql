-- "Joy to the World" is a cover; attribute it to Isaac Watts.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Isaac Watts', 'isaac-watts', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'isaac-watts');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'isaac-watts'),
    "updated_at" = now()
WHERE "slug" = 'joy-to-the-world';

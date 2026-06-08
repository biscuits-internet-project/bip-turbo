-- Hail to the Chief is James Sanderson's; attribute it from Traditional.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'James Sanderson', 'james-sanderson', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'james-sanderson');
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'james-sanderson'),
    "updated_at" = now()
WHERE "slug" = 'hail-to-the-chief';

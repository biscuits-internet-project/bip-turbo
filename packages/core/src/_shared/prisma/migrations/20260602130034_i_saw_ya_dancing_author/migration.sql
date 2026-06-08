-- Attribute "I Saw Ya Dancing" to Tractorbeam and mark it as an original (not a cover).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Tractorbeam', 'tractorbeam', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'tractorbeam');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'tractorbeam'),
    "cover" = false,
    "updated_at" = now()
WHERE "slug" = 'i-saw-ya-dancing';

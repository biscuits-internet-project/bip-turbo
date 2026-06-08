-- Attribute "Better Off Alone" to Alice Deejay.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Alice Deejay', 'alice-deejay', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'alice-deejay');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'alice-deejay'),
    "updated_at" = now()
WHERE "slug" = 'better-off-alone';

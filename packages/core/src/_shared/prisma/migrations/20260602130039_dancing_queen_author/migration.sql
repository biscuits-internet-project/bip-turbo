-- Attribute "Dancing Queen" to ABBA.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'ABBA', 'abba', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'abba');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'abba'),
    "updated_at" = now()
WHERE "slug" = 'dancing-queen';

-- Attribute "In This Bih'" to Chris Lorenzo.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Chris Lorenzo', 'chris-lorenzo', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'chris-lorenzo');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'chris-lorenzo'),
    "updated_at" = now()
WHERE "slug" = 'in-this-bih';

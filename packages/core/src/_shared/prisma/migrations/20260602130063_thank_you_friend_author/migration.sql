-- "Thank You for Being a Friend" is a cover by Andrew Gold; retitle with its
-- well-known Golden Girls theme subtitle. Slug is left unchanged.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Andrew Gold', 'andrew-gold', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'andrew-gold');

UPDATE "songs"
SET "title" = 'Thank You for Being a Friend (Theme from The Golden Girls)',
    "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'andrew-gold'),
    "updated_at" = now()
WHERE "slug" = 'thank-you-for-being-a-friend';

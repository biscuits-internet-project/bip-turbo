-- "The Moon" is a cover by Hiroshige Tonomura (was attributed to Nintendo); add
-- its origin note.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Hiroshige Tonomura', 'hiroshige-tonomura', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'hiroshige-tonomura');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'hiroshige-tonomura'),
    "notes" = 'from the ‘Duck Tales’ NES video game during the final level where you travel to the moon',
    "updated_at" = now()
WHERE "slug" = 'the-moon';

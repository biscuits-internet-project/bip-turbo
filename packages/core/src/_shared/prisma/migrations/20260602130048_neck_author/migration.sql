-- "Neck" is a cover by Mau P; DJ Brownie Remix.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Mau P; DJ Brownie Remix', 'mau-p-dj-brownie-remix', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'mau-p-dj-brownie-remix');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'mau-p-dj-brownie-remix'),
    "kind" = 'cover',
    "updated_at" = now()
WHERE "slug" = 'neck';

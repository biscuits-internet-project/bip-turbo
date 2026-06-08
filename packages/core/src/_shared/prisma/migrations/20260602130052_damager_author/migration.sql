-- "Damager" is a cover by Sammy Virji & Interplanetary Criminal (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Sammy Virji & Interplanetary Criminal', 'sammy-virji-interplanetary-criminal', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'sammy-virji-interplanetary-criminal');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'sammy-virji-interplanetary-criminal'),
    "updated_at" = now()
WHERE "slug" = 'damager';

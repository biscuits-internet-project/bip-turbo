-- Batch song attributions: one mashup + three covers.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Kaskade', 'the-disco-biscuits-and-kaskade', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-kaskade');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Fred again.. & Baby Keem', 'fred-again-baby-keem', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'fred-again-baby-keem');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Kx5', 'kx5', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'kx5');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Katy Perry', 'katy-perry', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'katy-perry');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-kaskade'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'lake-shore-drive-x-meditation-to-the-groove';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'fred-again-baby-keem'),
    "updated_at" = now()
WHERE "slug" = 'leavemealone';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'kx5'),
    "updated_at" = now()
WHERE "slug" = 'escape';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'katy-perry'),
    "updated_at" = now()
WHERE "slug" = 'firework';

-- 2025-06-12 Bonnaroo song attributions: two mashups + one cover.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Nostalgix & Scruffizer', 'the-disco-biscuits-and-nostalgix-scruffizer', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-nostalgix-scruffizer');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'The Disco Biscuits and Eliza Rose & Interplanetary Criminal', 'the-disco-biscuits-and-eliza-rose-interplanetary-criminal', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-eliza-rose-interplanetary-criminal');
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Sub Focus featuring bbyclose', 'sub-focus-featuring-bbyclose', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'sub-focus-featuring-bbyclose');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-nostalgix-scruffizer'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'bombs-x-lockdown';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits-and-eliza-rose-interplanetary-criminal'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'dino-baby-x-b-o-t-a';

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'sub-focus-featuring-bbyclose'),
    "updated_at" = now()
WHERE "slug" = 'on-and-on';

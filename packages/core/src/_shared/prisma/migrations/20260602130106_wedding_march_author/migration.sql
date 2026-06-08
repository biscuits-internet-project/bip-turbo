-- The Wedding March is Felix Mendelssohn's; attribute it from Traditional.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Felix Mendelssohn', 'felix-mendelssohn', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'felix-mendelssohn');
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'felix-mendelssohn'),
    "updated_at" = now()
WHERE "slug" = 'the-wedding-march';

-- "The Blue Danube" is a cover by Johann Strauss II (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Johann Strauss II', 'johann-strauss-ii', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'johann-strauss-ii');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'johann-strauss-ii'),
    "updated_at" = now()
WHERE "slug" = 'the-blue-danube';

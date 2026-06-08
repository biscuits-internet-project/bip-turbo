-- Attribute "La Noche" to Chris Lake, Skrillex, & Anita B. Queen.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Chris Lake, Skrillex, & Anita B. Queen', 'chris-lake-skrillex-anita-b-queen', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'chris-lake-skrillex-anita-b-queen');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'chris-lake-skrillex-anita-b-queen'),
    "updated_at" = now()
WHERE "slug" = 'la-noche';

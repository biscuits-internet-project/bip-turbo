-- "Mission Impossible Theme" is a cover by Lalo Schifrin (was mis-attributed to The Disco Biscuits).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Lalo Schifrin', 'lalo-schifrin', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'lalo-schifrin');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'lalo-schifrin'),
    "updated_at" = now()
WHERE "slug" = 'mission-impossible-theme';

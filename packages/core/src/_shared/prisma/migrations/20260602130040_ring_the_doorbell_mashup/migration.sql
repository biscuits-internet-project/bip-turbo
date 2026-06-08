-- Mark "Ring the Doorbell Twice x Day 'N' Nite" as a mashup by Tractorbeam & Kid Cudi.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Tractorbeam & Kid Cudi', 'tractorbeam-kid-cudi', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'tractorbeam-kid-cudi');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'tractorbeam-kid-cudi'),
    "kind" = 'mashup',
    "updated_at" = now()
WHERE "slug" = 'ring-the-doorbell-twice-x-day-n-nite';

-- Drumz is an improvisation (a drum jam), not a composed original.
UPDATE "songs"
SET "kind" = 'improvisation', "updated_at" = now()
WHERE "slug" = 'drumz';

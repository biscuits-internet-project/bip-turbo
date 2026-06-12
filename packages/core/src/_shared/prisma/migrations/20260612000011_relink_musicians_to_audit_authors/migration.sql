-- Re-run the musician->author slug match. The cover audit (…000008) created
-- author rows for musicians like Jamie Shields, Mike Greenfield, and Darren
-- Shearer AFTER the original slug-link migration (…000004) ran, so those
-- musicians were left unlinked and their names route to the author page
-- instead of their musician page. Idempotent: only fills NULL author_id.
UPDATE "musicians" m
SET "author_id" = (SELECT "id" FROM "authors" a WHERE a."slug" = m."slug" ORDER BY a."created_at" LIMIT 1),
    "updated_at" = now()
WHERE m."author_id" IS NULL
  AND EXISTS (SELECT 1 FROM "authors" a WHERE a."slug" = m."slug");

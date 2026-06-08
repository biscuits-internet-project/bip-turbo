-- Jordan Crisman's whole-show bass/vocals sit-in is now a structured guest;
-- drop the redundant free-text show note.
UPDATE "shows"
SET "notes" = NULL, "updated_at" = now()
WHERE "slug" = '2000-07-12-crowbar-state-college-pa'
  AND "notes" = 'Entire show with Jordan Crisman on bass and vocals.';

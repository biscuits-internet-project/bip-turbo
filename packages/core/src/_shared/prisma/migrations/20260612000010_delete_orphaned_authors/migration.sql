-- Delete authors no longer credited on any song (and not linked to a musician).
-- The cover audit reassigned many covers to their performing artist, orphaning
-- the old writer rows (Traditional, Jerry Garcia, the Dancing in the Street
-- writers, etc.). Runs after the audit migrations so those are truly orphaned.
DELETE FROM "authors" a
WHERE NOT EXISTS (SELECT 1 FROM "song_authors" sa WHERE sa."author_id" = a."id")
  AND NOT EXISTS (SELECT 1 FROM "musicians" m WHERE m."author_id" = a."id");

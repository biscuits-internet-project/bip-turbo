-- Seed song_authors from the existing single-author FK. One position-0 row per song.
INSERT INTO "song_authors" ("song_id", "author_id", "position", "created_at", "updated_at")
SELECT s."id", s."author_id", 0, now(), now()
FROM "songs" s
WHERE s."author_id" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "song_authors" sa
    WHERE sa."song_id" = s."id" AND sa."author_id" = s."author_id"
  );

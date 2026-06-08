-- Add a note to the 1st Mindless Dribble (S2.2) at 2001-09-01 Wetlands: its jam
-- became the song "Strobelights and Martinis". Idempotent via NOT EXISTS.
INSERT INTO "annotations" ("id", "track_id", "desc", "created_at", "updated_at")
SELECT gen_random_uuid(), t."id", 'with jam that will become "Strobelights and Martinis"', now(), now()
FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2001-09-01-wetlands-preserve-new-york-ny' AND t."set" = 'S2' AND t."position" = 2
  AND NOT EXISTS (
    SELECT 1 FROM "annotations" a
    WHERE a."track_id" = t."id" AND a."desc" = 'with jam that will become "Strobelights and Martinis"'
  );

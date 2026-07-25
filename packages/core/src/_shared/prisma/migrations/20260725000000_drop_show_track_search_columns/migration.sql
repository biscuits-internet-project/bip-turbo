-- Drop the shows/tracks search columns, completing the retirement started in
-- 20260723000000_fix_venue_search_text_and_retire_show_track_search_triggers.
--
-- That migration removed the triggers and build functions that maintained these
-- columns, and removed the matching fields from the Show and Track models, but
-- deliberately left the columns in place for one deploy. The entrypoint runs
-- `prisma migrate deploy` inside the new container before it serves, while Kamal
-- keeps the previous container answering requests until the new one passes its
-- healthcheck. Prisma enumerates every scalar column by name, so dropping these
-- in that same deploy would have made the still-running old container fail every
-- show and track read with "column does not exist". The client that shipped with
-- the previous deploy no longer selects them, so they can go now.
--
-- Nothing reads these columns: search resolves songs and venues first and then
-- matches shows on venue_id, song_id and search_date_match(date), rebuilding
-- neighbouring song titles from joins, and there is no track search path.
--
-- Postgres records a DROP COLUMN in the catalog rather than rewriting the table,
-- so this is fast on tracks despite its size, and any index over the dropped
-- columns (shows_search_vector_idx, tracks_search_text_trgm_idx and friends,
-- where the original CREATE INDEX statements did run) goes with them.
ALTER TABLE "shows" DROP COLUMN IF EXISTS "search_text",
                    DROP COLUMN IF EXISTS "search_vector";
ALTER TABLE "tracks" DROP COLUMN IF EXISTS "search_text",
                     DROP COLUMN IF EXISTS "search_vector";

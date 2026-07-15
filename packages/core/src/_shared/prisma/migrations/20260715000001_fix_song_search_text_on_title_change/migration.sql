-- Keep songs.search_text in step with the title when a song is renamed.
--
-- update_song_search_fields is a BEFORE INSERT OR UPDATE trigger, but it built
-- its value with build_song_search_text(NEW.id), which re-SELECTs the title from
-- the songs table. During a BEFORE UPDATE the table still holds the pre-update
-- row, so a rename wrote the OLD title into search_text and the song stayed
-- unsearchable under its new name until some later UPDATE happened to re-fire
-- the trigger. Renaming "Caves Of The East x Something About Us" to its correct
-- casing left search_text on the old string; "Thank You for Being a Friend"
-- carries the same staleness from an earlier retitle.
--
-- NEW.title is the incoming value, so read it directly. build_song_search_text
-- keeps its id-based signature for backfills, where the row is committed and the
-- re-read is correct.
CREATE OR REPLACE FUNCTION update_song_search_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := COALESCE(NEW.title, '');
  NEW.search_vector := to_tsvector('english', NEW.search_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Repair the rows the old trigger left behind. The corrected trigger recomputes
-- both columns from NEW.title, so this re-states the same values it derives.
UPDATE "songs"
SET "search_text" = "title",
    "search_vector" = to_tsvector('english', COALESCE("title", '')),
    "updated_at" = now()
WHERE "search_text" IS DISTINCT FROM "title";

-- AlterTable
ALTER TABLE "shows" ADD COLUMN     "search_text" TEXT,
ADD COLUMN     "search_vector" tsvector;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "search_text" TEXT,
ADD COLUMN     "search_vector" tsvector;

-- CreateIndex
CREATE INDEX "shows_date_idx" ON "shows"("date");

-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Function to build comprehensive show search text
CREATE OR REPLACE FUNCTION build_show_search_text(show_id UUID) 
RETURNS TEXT AS $$
DECLARE
  search_content TEXT;
  venue_info TEXT;
  setlist_info TEXT;
BEGIN
  -- Get venue information (name, city, state, country)
  SELECT 
    COALESCE(v.name, '') || ' ' || 
    COALESCE(v.city, '') || ' ' || 
    COALESCE(v.state, '') || ' ' ||
    COALESCE(v.country, '')
  INTO venue_info
  FROM shows s
  LEFT JOIN venues v ON s.venue_id = v.id
  WHERE s.id = build_show_search_text.show_id;
  
  -- Get complete setlist with songs, annotations, and segues
  SELECT string_agg(
    song.title || 
    COALESCE(' ' || t.note, '') ||
    CASE 
      WHEN t.segue = '>' THEN ' > ' || next_song.title
      ELSE ''
    END,
    ' ' ORDER BY t.position
  )
  INTO setlist_info
  FROM tracks t
  JOIN songs song ON t.song_id = song.id
  LEFT JOIN tracks next_track ON t.next_track_id = next_track.id
  LEFT JOIN songs next_song ON next_track.song_id = next_song.id
  WHERE t.show_id = build_show_search_text.show_id;
  
  -- Combine all searchable content
  SELECT 
    s.date || ' ' ||
    COALESCE(venue_info, '') || ' ' ||
    COALESCE(setlist_info, '')
  INTO search_content
  FROM shows s
  WHERE s.id = build_show_search_text.show_id;
  
  RETURN search_content;
END;
$$ LANGUAGE plpgsql;

-- Function to build comprehensive track search text
CREATE OR REPLACE FUNCTION build_track_search_text(track_id UUID)
RETURNS TEXT AS $$
DECLARE
  search_content TEXT;
BEGIN
  SELECT 
    song.title || ' ' ||
    COALESCE(t.note, '') || ' ' ||
    COALESCE(t.set, '') || ' ' ||
    -- Add position context
    CASE 
      WHEN t.position = 1 THEN 'opener '
      WHEN t.position = (SELECT MAX(position) FROM tracks tr WHERE tr.show_id = t.show_id AND tr.set = t.set) THEN 'closer '
      ELSE ''
    END ||
    -- Add segue information
    COALESCE('segue ' || t.segue, '') || ' ' ||
    -- Add neighboring songs for context
    COALESCE(prev_song.title, '') || ' ' ||
    COALESCE(next_song.title, '') || ' ' ||
    -- Include annotations
    COALESCE(ann.desc, '')
  INTO search_content
  FROM tracks t
  JOIN songs song ON t.song_id = song.id
  LEFT JOIN tracks prev_track ON t.previous_track_id = prev_track.id
  LEFT JOIN songs prev_song ON prev_track.song_id = prev_song.id
  LEFT JOIN tracks next_track ON t.next_track_id = next_track.id
  LEFT JOIN songs next_song ON next_track.song_id = next_song.id
  LEFT JOIN annotations ann ON ann.track_id = t.id
  WHERE t.id = build_track_search_text.track_id;
  
  RETURN search_content;
END;
$$ LANGUAGE plpgsql;

-- Function to handle multiple date formats in search
CREATE OR REPLACE FUNCTION search_date_match(show_date TEXT, query TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  normalized_query TEXT;
  query_date DATE;
  year_part TEXT;
BEGIN
  normalized_query := LOWER(TRIM(query));
  
  -- Direct date match (YYYY-MM-DD format)
  IF show_date = normalized_query THEN
    RETURN TRUE;
  END IF;
  
  -- Try to parse various date formats
  BEGIN
    -- Handle formats like: 12/30/99, 12-30-99, 12.30.99
    IF normalized_query ~ '^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2}$' THEN
      -- Extract the year part
      year_part := SUBSTRING(normalized_query FROM '\d{2}$');
      -- Add century for 2-digit years (assume 20xx for 00-30, 19xx for 31-99)
      IF year_part::INT <= 30 THEN
        normalized_query := REGEXP_REPLACE(normalized_query, '(\d{1,2})[/\-\.](\d{1,2})[/\-\.](\d{2})$', '20\3-\1-\2');
      ELSE
        normalized_query := REGEXP_REPLACE(normalized_query, '(\d{1,2})[/\-\.](\d{1,2})[/\-\.](\d{2})$', '19\3-\1-\2');
      END IF;
      query_date := normalized_query::DATE;
      
    -- Handle formats like: 12/30/1999, 12-30-1999
    ELSIF normalized_query ~ '^\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{4}$' THEN
      normalized_query := REGEXP_REPLACE(normalized_query, '(\d{1,2})[/\-\.](\d{1,2})[/\-\.](\d{4})$', '\3-\1-\2');
      query_date := normalized_query::DATE;
      
    -- Handle formats like: "dec 30 1999", "december 30, 1999"
    ELSIF normalized_query ~ '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)' THEN
      query_date := normalized_query::DATE;
      
    -- Handle formats like: "30 dec 1999"
    ELSIF normalized_query ~ '^\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)' THEN
      query_date := normalized_query::DATE;
      
    ELSE
      -- Try PostgreSQL's date parser as last resort
      query_date := normalized_query::DATE;
    END IF;
    
    -- Compare parsed date with show date
    RETURN show_date::DATE = query_date;
    
  EXCEPTION WHEN OTHERS THEN
    -- If date parsing fails, try partial matching
    -- Handle partial dates like "december 1999" or "12/99"
    IF normalized_query ~ '^\d{1,2}[/\-]\d{2,4}$' THEN
      -- Month/Year search
      RETURN show_date LIKE '%' || SUBSTR(normalized_query, 1, 2) || '%';
    ELSIF normalized_query ~ '^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*\d{4}$' THEN
      -- "December 1999" style - check if show is in that month
      RETURN show_date::DATE >= (normalized_query || ' 01')::DATE 
         AND show_date::DATE <= ((normalized_query || ' 01')::DATE + INTERVAL '1 month - 1 day');
    ELSE
      -- Fallback to pattern matching
      RETURN show_date ILIKE '%' || normalized_query || '%';
    END IF;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to search shows with multiple songs, considering proximity
CREATE OR REPLACE FUNCTION search_shows_with_songs(
  search_songs TEXT[], 
  is_segue BOOLEAN DEFAULT FALSE
) 
RETURNS TABLE(
  show_id UUID,
  show_date TEXT,
  venue_name TEXT,
  match_score INTEGER,
  match_details TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH track_positions AS (
    -- Get all tracks with their positions and song titles
    SELECT 
      t.show_id,
      t.id as track_id,
      t.position,
      t.set,
      s.title as song_title,
      t.segue,
      t.next_track_id,
      LOWER(s.title) as song_lower
    FROM tracks t
    JOIN songs s ON t.song_id = s.id
  ),
  matched_tracks AS (
    -- Find tracks matching our search songs
    SELECT 
      tp.*,
      array_position(search_songs, 
        (SELECT ss FROM unnest(search_songs) ss 
         WHERE LOWER(ss) = tp.song_lower 
            OR tp.song_lower LIKE '%' || LOWER(ss) || '%'
         LIMIT 1)
      ) as search_position
    FROM track_positions tp
    WHERE EXISTS (
      SELECT 1 FROM unnest(search_songs) AS ss
      WHERE tp.song_lower LIKE '%' || LOWER(ss) || '%'
    )
  ),
  show_matches AS (
    SELECT 
      mt.show_id,
      -- Calculate proximity score based on track positions
      CASE 
        WHEN is_segue AND array_length(search_songs, 1) = 2 THEN
          -- For segue searches, check if songs are adjacent with segue marker
          CASE
            WHEN EXISTS (
              SELECT 1 FROM matched_tracks mt1
              JOIN matched_tracks mt2 ON mt1.next_track_id = mt2.track_id
              WHERE mt1.show_id = mt.show_id
                AND mt1.segue = '>'
                AND mt1.search_position = 1
                AND mt2.search_position = 2
            ) THEN 100  -- Perfect segue match
            WHEN MIN(ABS(mt2.position - mt1.position)) = 1 THEN 80  -- Adjacent but no segue
            WHEN MIN(ABS(mt2.position - mt1.position)) <= 3 THEN 60  -- Very close
            WHEN MIN(ABS(mt2.position - mt1.position)) <= 5 THEN 40  -- Same set usually
            ELSE 20  -- In same show but far apart
          END
        ELSE
          -- For multi-song (non-segue) search
          CASE
            WHEN COUNT(DISTINCT mt.song_lower) = array_length(search_songs, 1) 
                 AND (MAX(mt.position) - MIN(mt.position)) = array_length(search_songs, 1) - 1 THEN 90  -- All consecutive
            WHEN COUNT(DISTINCT mt.song_lower) = array_length(search_songs, 1)
                 AND (MAX(mt.position) - MIN(mt.position)) <= array_length(search_songs, 1) + 2 THEN 70  -- Close together
            WHEN COUNT(DISTINCT mt.song_lower) = array_length(search_songs, 1)
                 AND (MAX(mt.position) - MIN(mt.position)) <= array_length(search_songs, 1) * 2 THEN 50  -- Somewhat close
            WHEN COUNT(DISTINCT mt.song_lower) = array_length(search_songs, 1) THEN 30  -- All in same show
            ELSE 10  -- Partial match
          END
      END as proximity_score,
      -- Build match details showing positions and sets
      STRING_AGG(
        mt.song_title || ' (pos ' || mt.position || ', ' || mt.set || ')',
        ' → ' ORDER BY mt.position
      ) as match_details
    FROM matched_tracks mt
    LEFT JOIN matched_tracks mt1 ON mt.show_id = mt1.show_id AND mt1.search_position = 1
    LEFT JOIN matched_tracks mt2 ON mt.show_id = mt2.show_id AND mt2.search_position = 2
    GROUP BY mt.show_id
    HAVING COUNT(DISTINCT mt.song_lower) >= 
      CASE WHEN is_segue THEN array_length(search_songs, 1) ELSE 1 END
  )
  SELECT 
    sm.show_id,
    s.date as show_date,
    v.name as venue_name,
    sm.proximity_score as match_score,
    sm.match_details
  FROM show_matches sm
  JOIN shows s ON sm.show_id = s.id
  LEFT JOIN venues v ON s.venue_id = v.id
  ORDER BY sm.proximity_score DESC, s.date DESC;
END;
$$ LANGUAGE plpgsql;

-- Create search indexes
CREATE INDEX IF NOT EXISTS shows_search_vector_idx ON shows USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS tracks_search_vector_idx ON tracks USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS shows_search_text_trgm_idx ON shows USING GIN(search_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tracks_search_text_trgm_idx ON tracks USING GIN(search_text gin_trgm_ops);

-- Auto-update show search fields on insert/update
CREATE OR REPLACE FUNCTION update_show_search_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := build_show_search_text(NEW.id);
  NEW.search_vector := to_tsvector('english', NEW.search_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER show_search_fields_trigger
BEFORE INSERT OR UPDATE ON shows
FOR EACH ROW EXECUTE FUNCTION update_show_search_fields();

-- Auto-update track search fields on insert/update
CREATE OR REPLACE FUNCTION update_track_search_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := build_track_search_text(NEW.id);
  NEW.search_vector := to_tsvector('english', NEW.search_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_search_fields_trigger
BEFORE INSERT OR UPDATE ON tracks
FOR EACH ROW EXECUTE FUNCTION update_track_search_fields();

-- Update show search when tracks change
CREATE OR REPLACE FUNCTION update_show_search_on_track_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE shows 
    SET search_text = build_show_search_text(OLD.show_id),
        search_vector = to_tsvector('english', build_show_search_text(OLD.show_id))
    WHERE id = OLD.show_id;
    RETURN OLD;
  ELSE
    UPDATE shows 
    SET search_text = build_show_search_text(NEW.show_id),
        search_vector = to_tsvector('english', build_show_search_text(NEW.show_id))
    WHERE id = NEW.show_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_change_update_show_search
AFTER INSERT OR UPDATE OR DELETE ON tracks
FOR EACH ROW EXECUTE FUNCTION update_show_search_on_track_change();

-- Update track search when annotations change
CREATE OR REPLACE FUNCTION update_track_search_on_annotation_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE tracks 
    SET search_text = build_track_search_text(OLD.track_id),
        search_vector = to_tsvector('english', build_track_search_text(OLD.track_id))
    WHERE id = OLD.track_id;
    RETURN OLD;
  ELSE
    UPDATE tracks 
    SET search_text = build_track_search_text(NEW.track_id),
        search_vector = to_tsvector('english', build_track_search_text(NEW.track_id))
    WHERE id = NEW.track_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER annotation_change_update_track_search
AFTER INSERT OR UPDATE OR DELETE ON annotations
FOR EACH ROW EXECUTE FUNCTION update_track_search_on_annotation_change();

-- Update shows when venue changes
CREATE OR REPLACE FUNCTION update_shows_on_venue_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE shows 
  SET search_text = build_show_search_text(id),
      search_vector = to_tsvector('english', build_show_search_text(id))
  WHERE venue_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER venue_change_update_shows_search
AFTER UPDATE ON venues
FOR EACH ROW EXECUTE FUNCTION update_shows_on_venue_change();

-- Batch update functions for development
CREATE OR REPLACE FUNCTION rebuild_all_show_search()
RETURNS void AS $$
DECLARE
  show_record RECORD;
  updated_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting rebuild of all show search data...';
  
  FOR show_record IN SELECT id FROM shows
  LOOP
    UPDATE shows 
    SET search_text = build_show_search_text(show_record.id),
        search_vector = to_tsvector('english', build_show_search_text(show_record.id))
    WHERE id = show_record.id;
    
    updated_count := updated_count + 1;
    
    -- Log progress every 100 shows
    IF updated_count % 100 = 0 THEN
      RAISE NOTICE 'Updated % shows...', updated_count;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Completed! Updated % total shows.', updated_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rebuild_all_track_search()
RETURNS void AS $$
DECLARE
  track_record RECORD;
  updated_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'Starting rebuild of all track search data...';
  
  FOR track_record IN SELECT id FROM tracks
  LOOP
    UPDATE tracks 
    SET search_text = build_track_search_text(track_record.id),
        search_vector = to_tsvector('english', build_track_search_text(track_record.id))
    WHERE id = track_record.id;
    
    updated_count := updated_count + 1;
    
    -- Log progress every 500 tracks
    IF updated_count % 500 = 0 THEN
      RAISE NOTICE 'Updated % tracks...', updated_count;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Completed! Updated % total tracks.', updated_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rebuild_all_search_data()
RETURNS void AS $$
BEGIN
  RAISE NOTICE 'Starting full search data rebuild...';
  
  -- Disable triggers temporarily for performance
  ALTER TABLE shows DISABLE TRIGGER show_search_fields_trigger;
  ALTER TABLE tracks DISABLE TRIGGER track_search_fields_trigger;
  ALTER TABLE tracks DISABLE TRIGGER track_change_update_show_search;
  
  -- Rebuild tracks first (since shows depend on track data)
  PERFORM rebuild_all_track_search();
  
  -- Then rebuild shows
  PERFORM rebuild_all_show_search();
  
  -- Re-enable triggers
  ALTER TABLE shows ENABLE TRIGGER show_search_fields_trigger;
  ALTER TABLE tracks ENABLE TRIGGER track_search_fields_trigger;
  ALTER TABLE tracks ENABLE TRIGGER track_change_update_show_search;
  
  RAISE NOTICE 'Full search data rebuild complete!';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rebuild_search_for_date_range(start_date TEXT, end_date TEXT)
RETURNS void AS $$
DECLARE
  show_count INTEGER;
  track_count INTEGER;
BEGIN
  -- Update tracks for shows in date range
  WITH affected_shows AS (
    SELECT id FROM shows 
    WHERE date >= start_date AND date <= end_date
  )
  UPDATE tracks t
  SET search_text = build_track_search_text(t.id),
      search_vector = to_tsvector('english', build_track_search_text(t.id))
  FROM affected_shows s
  WHERE t.show_id = s.id;
  
  GET DIAGNOSTICS track_count = ROW_COUNT;
  
  -- Update shows in date range
  UPDATE shows
  SET search_text = build_show_search_text(id),
      search_vector = to_tsvector('english', build_show_search_text(id))
  WHERE date >= start_date AND date <= end_date;
  
  GET DIAGNOSTICS show_count = ROW_COUNT;
  
  RAISE NOTICE 'Updated % shows and % tracks for dates % to %', 
    show_count, track_count, start_date, end_date;
END;
$$ LANGUAGE plpgsql;
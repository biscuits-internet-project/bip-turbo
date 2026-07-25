-- Keep venues.search_text in step with the row, and retire the shows/tracks
-- search triggers that maintain columns nothing reads.
--
-- update_venue_search_fields is a BEFORE INSERT OR UPDATE trigger, but it built
-- its value with build_venue_search_text(NEW.id), which re-SELECTs the row from
-- the venues table. A BEFORE trigger's own row is not visible to that read, so
-- an INSERT stored NULL (the venue never entered the search corpus at all) and a
-- rename stored the pre-rename string. 760 of 802 venues held NULL; the 42
-- populated rows were the ones 20260611000000_fix_venue_title_casing renamed,
-- left on the pre-casing text.
--
-- A venue with NULL search_text was still reachable by the LOWER(name) and
-- LOWER(city) LIKE branches of the venue search, so exact and substring lookups
-- kept working. What did not work was anything routed through search_text: a
-- query spanning two of the columns ("Higher Ground South Burlington", which is
-- a substring of neither name nor city), a non-contiguous phrase, a misspelling,
-- or a venue's spelled-out state.
--
-- The fix mirrors 20260715000001_fix_song_search_text_on_title_change, but the
-- text is built from four columns rather than one, so rather than inline the
-- expression into the trigger (where it could drift from the id-based function
-- that backfills and verification both use) the body moves into a row-typed
-- overload. The trigger passes NEW; the id-based signature is a wrapper over the
-- same body, so the two can never disagree.
CREATE OR REPLACE FUNCTION build_venue_search_text(v venues)
RETURNS TEXT AS $$
BEGIN
  RETURN TRIM(
    COALESCE(v.name, '') || ' ' ||
    COALESCE(v.city, '') || ' ' ||
    CASE
      WHEN v.state IS NOT NULL THEN v.state
      WHEN UPPER(v.country) != 'USA' THEN COALESCE(v.country, '')
      ELSE ''
    END
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Returns NULL when no venue has this id, as the id-based callers expect.
CREATE OR REPLACE FUNCTION build_venue_search_text(p_venue_id uuid)
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT build_venue_search_text(v) INTO result FROM venues v WHERE v.id = p_venue_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION update_venue_search_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_text := build_venue_search_text(NEW);
  NEW.search_vector := to_tsvector('english', NEW.search_text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Repair the rows the old trigger left behind. Matched by the staleness
-- predicate rather than by id, and re-runnable: the corrected trigger derives
-- the same two values from NEW, so a second run updates nothing. updated_at is
-- deliberately left alone, since this repairs a derived index rather than
-- editing the venue.
UPDATE "venues" AS v
SET "search_text" = build_venue_search_text(v."id"),
    "search_vector" = to_tsvector('english', build_venue_search_text(v."id"))
WHERE v."search_text" IS DISTINCT FROM build_venue_search_text(v."id");

-- shows.search_text / tracks.search_text have no readers. Show search resolves
-- songs and venues first and then matches shows on venue_id, song_id and
-- search_date_match(date), rebuilding neighbouring song titles from joins; there
-- is no track search at all. Maintaining them cost a multi-join string_agg on
-- every write to the two largest tables, so the triggers go now.
--
-- The columns themselves stay for one deploy. Kamal keeps the previous container
-- serving until the new one passes its healthcheck, and this entrypoint runs
-- migrations before the new server listens, so for that window a client
-- generated against the old schema is still issuing queries. Prisma enumerates
-- every scalar column by name, so dropping these out from under it turns every
-- show and track read into "column does not exist". Removing the fields from
-- schema.prisma in this deploy stops the new client selecting them; a follow-up
-- migration drops the columns once nothing in flight references them.
DROP TRIGGER IF EXISTS trigger_update_show_search_fields ON "shows";
DROP TRIGGER IF EXISTS trigger_update_track_search_fields ON "tracks";

DROP FUNCTION IF EXISTS update_show_search_fields();
DROP FUNCTION IF EXISTS update_track_search_fields();
DROP FUNCTION IF EXISTS build_show_search_text(uuid);
DROP FUNCTION IF EXISTS build_track_search_text(uuid);

-- 20250912050000_add_all_search_columns_and_indexes declares these, and they
-- back both predicates in the venue and song search. Restated here for the two
-- entities that still have search columns: a database whose early history was
-- baselined rather than executed (the fresh-machine restore path in
-- packages/core/CLAUDE.md) records that migration as applied without ever
-- creating the indexes, leaving those searches on a sequential scan. IF NOT
-- EXISTS makes this a no-op wherever the originals did get built.
CREATE INDEX IF NOT EXISTS "venues_search_vector_idx" ON "venues" USING GIN("search_vector");
CREATE INDEX IF NOT EXISTS "venues_search_text_trgm_idx" ON "venues" USING GIN("search_text" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "songs_search_vector_idx" ON "songs" USING GIN("search_vector");
CREATE INDEX IF NOT EXISTS "songs_search_text_trgm_idx" ON "songs" USING GIN("search_text" gin_trgm_ops);

-- The single-author FK is superseded by song_authors. Runs last, after code stops reading it.
ALTER TABLE "songs" DROP CONSTRAINT IF EXISTS "fk_songs_authors_author_id";
ALTER TABLE "songs" DROP COLUMN IF EXISTS "author_id";

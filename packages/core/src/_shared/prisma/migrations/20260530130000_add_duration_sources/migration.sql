-- Canonical lookup table for Track.duration provenance, plus an FK from
-- tracks.duration_source so only known sources can be stored (no loose
-- strings, no typos). The natural key is the source name the app writes.

CREATE TABLE "duration_sources" (
  "name" VARCHAR NOT NULL,
  "description" VARCHAR,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  CONSTRAINT "duration_sources_pkey" PRIMARY KEY ("name")
);

INSERT INTO "duration_sources" ("name", "description") VALUES
  ('nugs', 'Official nugs.net release (authoritative)'),
  ('archive', 'Averaged from archive.org audience recordings (estimate)'),
  ('manual', 'Entered or corrected by an admin');

ALTER TABLE "tracks"
  ADD CONSTRAINT "fk_tracks_duration_source"
  FOREIGN KEY ("duration_source") REFERENCES "duration_sources"("name")
  ON DELETE NO ACTION ON UPDATE NO ACTION;

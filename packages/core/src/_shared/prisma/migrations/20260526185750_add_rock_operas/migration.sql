-- CreateTable
CREATE TABLE "rock_operas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "short_name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "rock_operas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rock_opera_performances" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "rock_opera_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rock_opera_performances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rock_operas_slug_unique" ON "rock_operas"("slug");

-- CreateIndex
CREATE INDEX "rock_opera_performances_rock_opera_id_idx" ON "rock_opera_performances"("rock_opera_id");

-- CreateIndex
CREATE UNIQUE INDEX "rock_opera_performances_show_rock_opera_unique" ON "rock_opera_performances"("show_id", "rock_opera_id");

-- AddForeignKey
ALTER TABLE "rock_opera_performances" ADD CONSTRAINT "fk_rock_opera_performances_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "rock_opera_performances" ADD CONSTRAINT "fk_rock_opera_performances_rock_operas_rock_opera_id" FOREIGN KEY ("rock_opera_id") REFERENCES "rock_operas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Seed the three known rock operas.
INSERT INTO "rock_operas" ("slug", "name", "short_name", "updated_at")
VALUES
  ('hot-air-balloon',           'The Hot Air Balloon',       'HAB', NOW()),
  ('chemical-warfare-brigade',  'Chemical Warfare Brigade',  'CWB', NOW()),
  ('revolution-in-motion',      'Revolution In Motion',      'RIM', NOW());

-- Seed the 16 known full performances. For each (date, slug) tuple we
-- resolve the matching count_for_stats=true Disco Biscuits show. If 0 or
-- 2+ shows match (e.g. same-day late-night/Tractorbeam sets, or the show
-- hasn't been synced locally yet), we RAISE NOTICE and skip so the admin
-- can finish via the show edit UI rather than risk a silent mis-tag.
DO $$
DECLARE
  band_uuid UUID;
  show_uuid UUID;
  opera_uuid UUID;
  match_count INT;
  performance TEXT[];
  performances CONSTANT TEXT[][] := ARRAY[
    ARRAY['1998-12-31', 'hot-air-balloon'],
    ARRAY['1999-01-24', 'hot-air-balloon'],
    ARRAY['1999-03-04', 'hot-air-balloon'],
    ARRAY['1999-05-11', 'hot-air-balloon'],
    ARRAY['1999-06-12', 'hot-air-balloon'],
    ARRAY['1999-10-23', 'hot-air-balloon'],
    ARRAY['2004-01-17', 'hot-air-balloon'],
    ARRAY['2007-10-31', 'hot-air-balloon'],
    ARRAY['2018-12-31', 'hot-air-balloon'],
    ARRAY['2000-12-30', 'chemical-warfare-brigade'],
    ARRAY['2001-04-26', 'chemical-warfare-brigade'],
    ARRAY['2002-11-06', 'chemical-warfare-brigade'],
    ARRAY['2003-11-28', 'chemical-warfare-brigade'],
    ARRAY['2009-06-03', 'chemical-warfare-brigade'],
    ARRAY['2026-05-24', 'chemical-warfare-brigade'],
    ARRAY['2024-03-29', 'revolution-in-motion']
  ];
BEGIN
  SELECT id INTO band_uuid FROM bands WHERE slug = 'the-disco-biscuits';
  IF band_uuid IS NULL THEN
    RAISE NOTICE 'Skipping rock opera performance seed: no band with slug=the-disco-biscuits';
    RETURN;
  END IF;

  FOREACH performance SLICE 1 IN ARRAY performances LOOP
    SELECT COUNT(*) INTO match_count
    FROM shows
    WHERE date = performance[1] AND band_id = band_uuid AND count_for_stats = true;

    IF match_count = 0 THEN
      RAISE NOTICE 'No matching show for date=% rock_opera=%; tag manually after sync.',
        performance[1], performance[2];
      CONTINUE;
    END IF;

    IF match_count > 1 THEN
      RAISE NOTICE 'Multiple matching shows for date=% rock_opera=%; tag manually to pick the right one.',
        performance[1], performance[2];
      CONTINUE;
    END IF;

    SELECT id INTO show_uuid
    FROM shows
    WHERE date = performance[1] AND band_id = band_uuid AND count_for_stats = true;

    SELECT id INTO opera_uuid FROM rock_operas WHERE slug = performance[2];

    INSERT INTO rock_opera_performances (show_id, rock_opera_id)
    VALUES (show_uuid, opera_uuid)
    ON CONFLICT (show_id, rock_opera_id) DO NOTHING;
  END LOOP;
END $$;

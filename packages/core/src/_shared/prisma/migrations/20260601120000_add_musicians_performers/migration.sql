-- Structured performers: an admin-managed list of musicians and instruments,
-- a per-show lineup bridge, and per-track sit-in/sat-out deltas. Purely
-- additive; nothing references these tables yet.

-- CreateTable
CREATE TABLE "instruments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musicians" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "default_instrument_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "musicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_musicians" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "musician_id" UUID NOT NULL,
    "instrument_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "show_musicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_musicians" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "track_id" UUID NOT NULL,
    "musician_id" UUID NOT NULL,
    "present" BOOLEAN NOT NULL,
    "instrument_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "track_musicians_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "instruments_slug_unique" ON "instruments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "musicians_slug_unique" ON "musicians"("slug");

-- CreateIndex
CREATE INDEX "musicians_slug_idx" ON "musicians"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "show_musicians_show_musician_unique" ON "show_musicians"("show_id", "musician_id");

-- CreateIndex
CREATE INDEX "show_musicians_musician_id_idx" ON "show_musicians"("musician_id");

-- CreateIndex
CREATE UNIQUE INDEX "track_musicians_track_musician_unique" ON "track_musicians"("track_id", "musician_id");

-- CreateIndex
CREATE INDEX "track_musicians_musician_id_idx" ON "track_musicians"("musician_id");

-- CreateIndex
CREATE INDEX "track_musicians_track_id_idx" ON "track_musicians"("track_id");

-- AddForeignKey
ALTER TABLE "musicians" ADD CONSTRAINT "fk_musicians_default_instrument_id" FOREIGN KEY ("default_instrument_id") REFERENCES "instruments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_musicians" ADD CONSTRAINT "fk_show_musicians_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_musicians" ADD CONSTRAINT "fk_show_musicians_musicians_musician_id" FOREIGN KEY ("musician_id") REFERENCES "musicians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_musicians" ADD CONSTRAINT "fk_show_musicians_instruments_instrument_id" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_musicians" ADD CONSTRAINT "fk_track_musicians_tracks_track_id" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_musicians" ADD CONSTRAINT "fk_track_musicians_musicians_musician_id" FOREIGN KEY ("musician_id") REFERENCES "musicians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_musicians" ADD CONSTRAINT "fk_track_musicians_instruments_instrument_id" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- Seed the canonical instrument vocabulary and the founding/current musicians:
-- the four Marlon-era members (with default instruments) plus the former
-- drummers Sam Altman and Allen Aucoin, who are deliberately NOT part of the
-- default lineup. ON CONFLICT keeps this idempotent and non-destructive to
-- later admin edits.
INSERT INTO "instruments" ("name", "slug", "updated_at") VALUES
  ('Drums', 'drums', now()),
  ('Bass', 'bass', now()),
  ('Guitar', 'guitar', now()),
  ('Keys', 'keys', now()),
  ('Vocals', 'vocals', now()),
  ('Percussion', 'percussion', now())
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "musicians" ("name", "slug", "default_instrument_id", "updated_at")
SELECT m.name, m.slug, i.id, now()
FROM (VALUES
  ('Jon Gutwillig', 'jon-gutwillig', 'guitar'),
  ('Marc Brownstein', 'marc-brownstein', 'bass'),
  ('Aron Magner', 'aron-magner', 'keys'),
  ('Marlon Lewis', 'marlon-lewis', 'drums'),
  ('Sam Altman', 'sam-altman', 'drums'),
  ('Allen Aucoin', 'allen-aucoin', 'drums')
) AS m(name, slug, instrument_slug)
JOIN "instruments" i ON i.slug = m.instrument_slug
ON CONFLICT ("slug") DO NOTHING;

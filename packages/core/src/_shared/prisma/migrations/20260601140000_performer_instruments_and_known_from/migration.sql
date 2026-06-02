-- Evolve the performer model (the add_musicians_performers tables, already in
-- prod) for the Phase 3 backfill:
--   * musicians.known_from — free-text "where you'd know this artist" descriptor.
--   * Replace the single instrument_id on show_musicians / track_musicians with
--     join tables, so one appearance can list several instruments (a sit-in on
--     guitar + vocals). The single-FK columns hold no data yet in prod.
--   * Display the keyboards instrument as "Keyboards" (slug stays "keys").

ALTER TABLE "musicians" ADD COLUMN "known_from" VARCHAR;

-- Drop the single-instrument FK columns (empty: no performer data exists yet).
ALTER TABLE "show_musicians" DROP CONSTRAINT "fk_show_musicians_instruments_instrument_id";
ALTER TABLE "show_musicians" DROP COLUMN "instrument_id";
ALTER TABLE "track_musicians" DROP CONSTRAINT "fk_track_musicians_instruments_instrument_id";
ALTER TABLE "track_musicians" DROP COLUMN "instrument_id";

-- CreateTable: instruments a lineup musician played on a show (1+ per appearance)
CREATE TABLE "show_musician_instruments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_musician_id" UUID NOT NULL,
    "instrument_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "show_musician_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: instruments a musician played on a track delta (1+ per appearance)
CREATE TABLE "track_musician_instruments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "track_musician_id" UUID NOT NULL,
    "instrument_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "track_musician_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "show_musician_instruments_unique" ON "show_musician_instruments"("show_musician_id", "instrument_id");
CREATE INDEX "show_musician_instruments_instrument_id_idx" ON "show_musician_instruments"("instrument_id");
CREATE UNIQUE INDEX "track_musician_instruments_unique" ON "track_musician_instruments"("track_musician_id", "instrument_id");
CREATE INDEX "track_musician_instruments_instrument_id_idx" ON "track_musician_instruments"("instrument_id");

-- AddForeignKey
ALTER TABLE "show_musician_instruments" ADD CONSTRAINT "fk_show_musician_instruments_show_musician_id" FOREIGN KEY ("show_musician_id") REFERENCES "show_musicians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "show_musician_instruments" ADD CONSTRAINT "fk_show_musician_instruments_instrument_id" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "track_musician_instruments" ADD CONSTRAINT "fk_track_musician_instruments_track_musician_id" FOREIGN KEY ("track_musician_id") REFERENCES "track_musicians"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "track_musician_instruments" ADD CONSTRAINT "fk_track_musician_instruments_instrument_id" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Display name only; slug "keys" is unchanged.
UPDATE "instruments" SET "name" = 'Keyboards', "updated_at" = now() WHERE "slug" = 'keys';

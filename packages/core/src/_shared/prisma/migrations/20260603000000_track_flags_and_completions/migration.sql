-- Structured per-track performance markers (dyslexic/inverted/unfinished) and
-- directed cross-show "completes" links. Backs the setlist filters and the
-- completes/completed-by footnotes; backfilled from free-text annotations in
-- later migrations.

-- CreateEnum
CREATE TYPE "track_flag" AS ENUM ('DYSLEXIC', 'INVERTED', 'UNFINISHED');

-- CreateTable
CREATE TABLE "track_flags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "track_id" UUID NOT NULL,
    "flag" "track_flag" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "track_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_completions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "earlier_track_id" UUID NOT NULL,
    "later_track_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "track_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "track_flags_flag_idx" ON "track_flags"("flag");

-- CreateIndex
CREATE UNIQUE INDEX "track_flags_track_flag_unique" ON "track_flags"("track_id", "flag");

-- CreateIndex
CREATE UNIQUE INDEX "track_completions_earlier_track_unique" ON "track_completions"("earlier_track_id");

-- CreateIndex
CREATE INDEX "track_completions_later_track_id_idx" ON "track_completions"("later_track_id");

-- AddForeignKey
ALTER TABLE "track_flags" ADD CONSTRAINT "fk_track_flags_tracks_track_id" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_completions" ADD CONSTRAINT "fk_track_completions_earlier_track_id" FOREIGN KEY ("earlier_track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_completions" ADD CONSTRAINT "fk_track_completions_later_track_id" FOREIGN KEY ("later_track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

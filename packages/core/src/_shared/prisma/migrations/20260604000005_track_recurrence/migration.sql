-- Recurrence of a track's flags and segue shape: how many stats-shows since the
-- song was last played carrying each flag / in each segue shape, and which show
-- that was. Flag recurrence rides two columns on the existing track_flags row;
-- segue recurrence is a narrow bridge keyed by (track, kind). Both are derived
-- by the stats rebuild, so this migration only adds structure (no data).

-- CreateEnum
CREATE TYPE "segue_recurrence_kind" AS ENUM ('STANDALONE', 'NOT_SEGUED_IN', 'NOT_SEGUED_OUT');

-- AlterTable
ALTER TABLE "track_flags" ADD COLUMN "flag_gap" INTEGER;
ALTER TABLE "track_flags" ADD COLUMN "flag_previous_show_id" UUID;

-- CreateTable
CREATE TABLE "track_segue_recurrence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "track_id" UUID NOT NULL,
    "kind" "segue_recurrence_kind" NOT NULL,
    "gap" INTEGER,
    "previous_show_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "track_segue_recurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "track_flags_flag_previous_show_id_idx" ON "track_flags"("flag_previous_show_id");

-- CreateIndex
CREATE UNIQUE INDEX "track_segue_recurrence_track_kind_unique" ON "track_segue_recurrence"("track_id", "kind");

-- CreateIndex
CREATE INDEX "track_segue_recurrence_previous_show_id_idx" ON "track_segue_recurrence"("previous_show_id");

-- AddForeignKey
ALTER TABLE "track_flags" ADD CONSTRAINT "fk_track_flags_previous_show_id" FOREIGN KEY ("flag_previous_show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_segue_recurrence" ADD CONSTRAINT "fk_track_segue_recurrence_track_id" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_segue_recurrence" ADD CONSTRAINT "fk_track_segue_recurrence_previous_show_id" FOREIGN KEY ("previous_show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

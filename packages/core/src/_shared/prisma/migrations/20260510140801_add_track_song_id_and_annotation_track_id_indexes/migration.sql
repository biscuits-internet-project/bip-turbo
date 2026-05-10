-- CreateIndex
CREATE INDEX "annotations_track_id_idx" ON "annotations"("track_id");

-- CreateIndex
CREATE INDEX "tracks_song_id_idx" ON "tracks"("song_id");

-- CreateIndex
CREATE INDEX "tracks_previous_performance_show_id_idx" ON "tracks"("previous_performance_show_id");

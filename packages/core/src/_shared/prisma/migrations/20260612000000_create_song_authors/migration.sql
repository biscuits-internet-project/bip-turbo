-- Many-to-many join between songs and authors, replacing the single songs.author_id FK.
CREATE TABLE "song_authors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "song_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
    CONSTRAINT "song_authors_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "song_authors_song_author_unique" ON "song_authors" ("song_id", "author_id");
CREATE INDEX "song_authors_song_id_idx" ON "song_authors" ("song_id");
CREATE INDEX "song_authors_author_id_idx" ON "song_authors" ("author_id");

ALTER TABLE "song_authors"
    ADD CONSTRAINT "fk_song_authors_song_id" FOREIGN KEY ("song_id") REFERENCES "songs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "song_authors"
    ADD CONSTRAINT "fk_song_authors_author_id" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

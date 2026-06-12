-- Link a musician to their author row so a musician page can list songs they wrote.
ALTER TABLE "musicians" ADD COLUMN "author_id" UUID;
CREATE INDEX "musicians_author_id_idx" ON "musicians" ("author_id");
ALTER TABLE "musicians"
    ADD CONSTRAINT "fk_musicians_author_id" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

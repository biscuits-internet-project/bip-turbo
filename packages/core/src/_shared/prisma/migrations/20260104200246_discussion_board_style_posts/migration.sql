/*
  Warnings:

  - You are about to drop the column `reaction_count` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `reactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "fk_reactions_posts_post_id";

-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "fk_reactions_users_user_id";

-- DropIndex
DROP INDEX "posts_reaction_count_idx";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "reaction_count",
ADD COLUMN     "downvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" VARCHAR(300),
ADD COLUMN     "upvote_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vote_score" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "reactions";

-- CreateTable
CREATE TABLE "votes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vote_type" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "votes_post_id_idx" ON "votes"("post_id");

-- CreateIndex
CREATE INDEX "votes_user_id_idx" ON "votes"("user_id");

-- CreateIndex
CREATE INDEX "votes_vote_type_idx" ON "votes"("vote_type");

-- CreateIndex
CREATE UNIQUE INDEX "votes_post_id_user_id_unique" ON "votes"("post_id", "user_id");

-- CreateIndex
CREATE INDEX "posts_vote_score_idx" ON "posts"("vote_score");

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "fk_votes_posts_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "fk_votes_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

/*
  Warnings:

  - A unique constraint covering the columns `[user_id,rateable_id,rateable_type]` on the table `ratings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ratings_user_id_rateable_id_rateable_type_unique" ON "ratings"("user_id", "rateable_id", "rateable_type");

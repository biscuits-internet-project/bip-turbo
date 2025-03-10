/*
  Warnings:

  - A unique constraint covering the columns `[show_id,user_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reviews_show_id_user_id_key" ON "reviews"("show_id", "user_id");

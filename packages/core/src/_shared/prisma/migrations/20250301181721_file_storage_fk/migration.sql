/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `blog_posts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "blog_posts" ALTER COLUMN "slug" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_unique" ON "blog_posts"("slug");

-- AddForeignKey
ALTER TABLE "active_storage_attachments" ADD CONSTRAINT "fk_active_storage_attachments_active_storage_blobs_blob_id" FOREIGN KEY ("blob_id") REFERENCES "active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "path" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "size" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_post_files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blog_post_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "blog_post_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "files_user_id_idx" ON "files"("user_id");

-- CreateIndex
CREATE INDEX "blog_post_files_blog_post_id_idx" ON "blog_post_files"("blog_post_id");

-- CreateIndex
CREATE INDEX "blog_post_files_file_id_idx" ON "blog_post_files"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_files_blog_post_id_file_id_unique" ON "blog_post_files"("blog_post_id", "file_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "fk_files_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_post_files" ADD CONSTRAINT "fk_blog_post_files_blog_post_id" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_post_files" ADD CONSTRAINT "fk_blog_post_files_file_id" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

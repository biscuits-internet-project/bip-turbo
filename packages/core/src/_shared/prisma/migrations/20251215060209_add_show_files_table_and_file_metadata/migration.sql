-- AlterTable
ALTER TABLE "files" ADD COLUMN     "metadata" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "show_files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "show_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "show_files_show_id_idx" ON "show_files"("show_id");

-- CreateIndex
CREATE INDEX "show_files_file_id_idx" ON "show_files"("file_id");

-- CreateIndex
CREATE INDEX "show_files_user_id_idx" ON "show_files"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "show_files_show_id_file_id_unique" ON "show_files"("show_id", "file_id");

-- AddForeignKey
ALTER TABLE "show_files" ADD CONSTRAINT "fk_show_files_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_files" ADD CONSTRAINT "fk_show_files_file_id" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_files" ADD CONSTRAINT "fk_show_files_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

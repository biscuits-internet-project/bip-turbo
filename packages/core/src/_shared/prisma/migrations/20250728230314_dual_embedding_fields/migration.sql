/*
  Warnings:

  - You are about to drop the column `embedding` on the `search_indexes` table. All the data in the column will be lost.
  - Added the required column `embedding_small` to the `search_indexes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "search_indexes" DROP COLUMN "embedding",
ADD COLUMN     "embedding_large" vector(3072),
ADD COLUMN     "embedding_small" vector(1536) NOT NULL,
ADD COLUMN     "model_used" VARCHAR NOT NULL DEFAULT 'text-embedding-3-small';

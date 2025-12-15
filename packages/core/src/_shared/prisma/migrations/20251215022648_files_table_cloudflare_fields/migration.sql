-- DropIndex
DROP INDEX "shows_search_text_trgm_idx";

-- DropIndex
DROP INDEX "shows_search_vector_idx";

-- DropIndex
DROP INDEX "songs_search_text_trgm_idx";

-- DropIndex
DROP INDEX "songs_search_vector_idx";

-- DropIndex
DROP INDEX "tracks_search_text_trgm_idx";

-- DropIndex
DROP INDEX "tracks_search_vector_idx";

-- DropIndex
DROP INDEX "venues_search_text_trgm_idx";

-- DropIndex
DROP INDEX "venues_search_vector_idx";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "cloudflare_id" VARCHAR,
ADD COLUMN     "variants" JSONB DEFAULT '{}';

-- CreateIndex
CREATE INDEX "files_cloudflare_id_idx" ON "files"("cloudflare_id");

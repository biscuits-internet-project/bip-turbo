-- AlterTable
ALTER TABLE "search_indexes" ADD COLUMN     "index_strategy" VARCHAR NOT NULL DEFAULT 'date_venue';

-- CreateIndex
CREATE INDEX "search_indexes_index_strategy_idx" ON "search_indexes"("index_strategy");

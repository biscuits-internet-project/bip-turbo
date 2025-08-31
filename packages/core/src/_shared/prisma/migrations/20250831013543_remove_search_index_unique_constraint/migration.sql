-- DropIndex
DROP INDEX "search_indexes_entity_type_entity_id_key";

-- CreateIndex
CREATE INDEX "search_indexes_entity_id_idx" ON "search_indexes"("entity_id");

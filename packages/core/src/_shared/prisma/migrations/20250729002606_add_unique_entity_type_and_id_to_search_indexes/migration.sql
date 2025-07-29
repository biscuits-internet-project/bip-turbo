/*
  Warnings:

  - A unique constraint covering the columns `[entity_type,entity_id]` on the table `search_indexes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "search_indexes_entity_type_entity_id_key" ON "search_indexes"("entity_type", "entity_id");

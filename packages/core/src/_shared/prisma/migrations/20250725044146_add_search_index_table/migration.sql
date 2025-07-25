-- CreateTable
CREATE TABLE "search_indexes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity_type" VARCHAR NOT NULL,
    "entity_id" UUID NOT NULL,
    "display_text" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" vector(3072) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_indexes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "search_indexes_entity_type_idx" ON "search_indexes"("entity_type");

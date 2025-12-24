-- CreateTable
CREATE TABLE "memory_metrics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR,
    "heap_used" INTEGER NOT NULL,
    "heap_total" INTEGER NOT NULL,
    "external" INTEGER NOT NULL,
    "rss" INTEGER NOT NULL,
    "request_method" VARCHAR,
    "request_url" VARCHAR,
    "heap_used_bytes" BIGINT,
    "heap_total_bytes" BIGINT,
    "memory_delta" INTEGER,
    "gc_count" INTEGER,
    "gc_duration" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memory_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "memory_metrics_created_at_idx" ON "memory_metrics"("created_at");

-- CreateIndex
CREATE INDEX "memory_metrics_label_idx" ON "memory_metrics"("label");

-- CreateIndex
CREATE INDEX "memory_metrics_request_url_idx" ON "memory_metrics"("request_url");

-- CreateIndex
CREATE INDEX "memory_metrics_memory_delta_idx" ON "memory_metrics"("memory_delta");

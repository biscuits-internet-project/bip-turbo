-- CreateTable
CREATE TABLE "stats_recompute_requests" (
    "id" UUID NOT NULL,
    "since_date" DATE NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stats_recompute_requests_pkey" PRIMARY KEY ("id")
);

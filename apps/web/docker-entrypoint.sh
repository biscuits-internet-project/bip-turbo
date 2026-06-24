#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/packages/core

# Recovery for the partially-failed PR #158 backfill deploy. Two bugs each left a
# migration marked failed in prod, which then blocks every later migration with
# P3009: a mis-ordered migration that referenced a not-yet-created table (fixed by
# renumbering), and a recompute-enqueue that inserted a NULL since_date (fixed by a
# HAVING guard). A failed Prisma migration is always a fully rolled-back transaction
# (no partial data), so clearing the failed row simply lets the corrected migration
# re-apply on the next deploy. Clears ANY still-failed (finished_at IS NULL) row so
# the cascade resolves without manual `migrate resolve` against prod.
# Idempotent: a no-op on every healthy deploy. Remove this block once prod is healthy.
bun prisma db execute \
  --config=src/_shared/prisma/prisma.config.ts \
  --stdin <<'SQL' || echo "Stale-migration cleanup skipped (no failed row, or already recovered)"
DELETE FROM "_prisma_migrations" WHERE "finished_at" IS NULL;
SQL

bun prisma migrate deploy \
  --schema=src/_shared/prisma/schema.prisma \
  --config=src/_shared/prisma/prisma.config.ts

echo "Recomputing pending stats..."
bun run scripts/recompute-pending.ts

echo "Recomputing ratings (deploy-time backfill; no-op when unchanged)..."
bun run scripts/recompute-ratings.ts

cd /app/apps/web
exec "$@"

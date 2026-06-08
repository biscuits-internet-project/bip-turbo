#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/packages/core

# One-time recovery for the failed deploy of PR #158: the
# 20260602130030_retire_migrated_annotations migration referenced track_completions
# before that table existed (its timestamp sorted before the migration that creates
# it), so it failed mid-apply on prod and rolled back. Prisma records that failure and
# then blocks every later migration with P3009. The migration has since been renumbered
# to run after its dependencies, so the stale failed row must be cleared before deploy.
# Idempotent: matches only a still-failed (finished_at IS NULL) row, so it is a no-op on
# every healthy deploy. Safe to delete this block once prod has migrated past it.
bun prisma db execute \
  --config=src/_shared/prisma/prisma.config.ts \
  --stdin <<'SQL' || echo "Stale-migration cleanup skipped (no failed row, or already recovered)"
DELETE FROM "_prisma_migrations"
WHERE "migration_name" = '20260602130030_retire_migrated_annotations'
  AND "finished_at" IS NULL;
SQL

bun prisma migrate deploy \
  --schema=src/_shared/prisma/schema.prisma \
  --config=src/_shared/prisma/prisma.config.ts

echo "Recomputing pending stats..."
bun run scripts/recompute-pending.ts

cd /app/apps/web
exec "$@"

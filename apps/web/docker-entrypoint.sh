#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/packages/core
bun prisma migrate deploy \
  --schema=src/_shared/prisma/schema.prisma \
  --config=src/_shared/prisma/prisma.config.ts

echo "Recomputing pending stats..."
bun run scripts/recompute-pending.ts

cd /app/apps/web
exec "$@"

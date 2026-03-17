#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/packages/core
bun prisma migrate deploy \
  --schema=src/_shared/prisma/schema.prisma \
  --config=src/_shared/prisma/prisma.config.ts

cd /app/apps/web
exec "$@"

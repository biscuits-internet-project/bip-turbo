#!/bin/sh
set -e

echo "Starting database migrations..."
cd /app/packages/core || { echo "Failed to change directory"; exit 1; }
echo "Current directory: $(pwd)"
echo "Database URL exists: $(test -n "$DATABASE_URL" && echo "yes" || echo "no")"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

# Run the migration
pnpm migrate || { echo "Migration failed"; exit 1; }
echo "Migrations completed successfully." 
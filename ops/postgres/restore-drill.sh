#!/bin/bash
#
# Prove the newest R2 backup restores. Run as root on the host, quarterly and
# before any risky database change:
#   /usr/local/bin/bip-postgres-restore-drill.sh
#
# Pulls the newest bip-*.dump from R2 (not the local copy: the R2 one is what we
# would have after losing the server), restores it into a throwaway container,
# and diffs exact per-table row counts against the live database. Rows written
# since the dump show up as differences, so run it soon after the nightly backup
# or read the diff with that in mind.
#
# Exit 0 only when the counts match.

set -euo pipefail

REMOTE=r2:bip-postgres-backups
LIVE=bip-web-postgres
DRILL=bip-restore-drill
IMAGE=pgvector/pgvector:pg18
COUNTS_SQL=/usr/local/share/bip-postgres/table-counts.sql

say() { echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') $*"; }

tmp=$(mktemp -d)
cleanup() { docker rm -f "$DRILL" > /dev/null 2>&1 || true; rm -rf "$tmp"; }
trap cleanup EXIT

latest=$(rclone lsf "$REMOTE" --include 'bip-*.dump' | sort | tail -1)
[ -n "$latest" ] || { say "ERROR: no bip-*.dump in $REMOTE"; exit 1; }
say "latest: $latest"
rclone copyto "$REMOTE/$latest" "$tmp/drill.dump"

# No published port, and a memory cap: this runs next to production on a small host.
docker run -d --name "$DRILL" --memory 512m -e POSTGRES_USER=bip -e POSTGRES_PASSWORD=drill \
  -e POSTGRES_DB=bip "$IMAGE" > /dev/null
for _ in $(seq 1 30); do
  # The entrypoint restarts the server once after init, so require two good probes.
  docker exec "$DRILL" pg_isready -U bip -q && sleep 2 && docker exec "$DRILL" pg_isready -U bip -q && break
  sleep 1
done

say "restoring"
docker exec -i "$DRILL" pg_restore -U bip -d bip --no-owner --exit-on-error < "$tmp/drill.dump"

docker exec -i "$DRILL" psql -U bip -d bip -At < "$COUNTS_SQL" > "$tmp/drill.txt"
docker exec -i "$LIVE" psql -U bip -d bip -At < "$COUNTS_SQL" > "$tmp/live.txt"

say "drill: $(wc -l < "$tmp/drill.txt") tables, live: $(wc -l < "$tmp/live.txt") tables"
if diff "$tmp/live.txt" "$tmp/drill.txt"; then
  say "PASS: row counts match"
else
  say "FAIL: row counts differ (lines above: < live, > restored)"
  exit 1
fi

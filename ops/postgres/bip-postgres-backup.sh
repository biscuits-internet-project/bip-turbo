#!/bin/bash
#
# Nightly dump of the bip Postgres database, kept on the host and copied off it.
# Installed at /usr/local/bin/bip-postgres-backup.sh, run by root from
# /etc/cron.d/bip-postgres-backup. Modeled on dipstick-backup.sh on the same host.
#
# pg_dump runs inside the bip-web-postgres container, so the client always matches
# the server version and no password is needed (the image trusts its local socket).
#
# Every dump is checked three ways before anything is rotated away, so a bad night
# never replaces a good one:
#   - pg_restore --list counts TABLE DATA entries, rejecting the wrong database or
#     a fresh one with no tables;
#   - a size floor rejects a database whose tables exist but are empty;
#   - a full pg_restore to /dev/null reads every data block. --list alone reads
#     only the table of contents, which pg_dump writes before any data, so a dump
#     cut off halfway (disk full, killed process) passes it.
#
# The local copy protects against a bad migration or an accidental delete. The R2
# copy protects against losing the server, which the local one cannot, so the
# upload happens after local verification, never instead of it.
#
# Exit codes: 0 good on both, 2 good locally but not on R2, 1 no good dump.
# A Honeybadger check-in is pinged only on 0, so a missed night or a broken upload
# both surface as a missed check-in.

set -uo pipefail

CONTAINER=bip-web-postgres
DB_NAME=${DB_NAME:-bip}
DEST=${DEST:-/var/backups/bip-postgres}
REMOTE=${REMOTE:-r2:bip-postgres-backups}
KEEP_DAYS=14
KEEP_DAYS_REMOTE=90
# public has 30+ tables today; a dump listing fewer is not the database we protect.
MIN_TABLES=30
# Today's dump is 18 MB. Well under that means the tables are there but the rows are not.
MIN_BYTES=$((5 * 1024 * 1024))
ENV_FILE=${ENV_FILE:-/etc/bip-postgres-backup.env}

HONEYBADGER_CHECKIN_URL=""
# shellcheck source=/dev/null
[ -r "$ENV_FILE" ] && . "$ENV_FILE"

mkdir -p "$DEST"
chmod 700 "$DEST"
stamp=$(date -u +%Y-%m-%dT%H%M)
snap="$DEST/${DB_NAME}-$stamp.dump"

say() { echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') $*"; }

if ! docker exec "$CONTAINER" pg_dump -U bip -d "$DB_NAME" -Fc > "$snap"; then
  say "ERROR: pg_dump failed"
  rm -f "$snap"
  exit 1
fi

if [ ! -s "$snap" ]; then
  say "ERROR: pg_dump produced an empty file"
  rm -f "$snap"
  exit 1
fi

tables=$(docker exec -i "$CONTAINER" pg_restore --list < "$snap" 2>/dev/null | grep -c ' TABLE DATA ')
if ! [ "$tables" -ge "$MIN_TABLES" ] 2>/dev/null; then
  say "ERROR: dump lists ${tables:-0} TABLE DATA entries (want >= $MIN_TABLES); refusing to keep it"
  rm -f "$snap"
  exit 1
fi

local_size=$(stat -c %s "$snap")
if [ "$local_size" -lt "$MIN_BYTES" ]; then
  say "ERROR: dump is $local_size bytes (want >= $MIN_BYTES); refusing to keep it"
  rm -f "$snap"
  exit 1
fi

if ! docker exec -i "$CONTAINER" pg_restore -f /dev/null < "$snap" 2>/dev/null; then
  say "ERROR: dump does not read back in full (truncated or corrupt); refusing to keep it"
  rm -f "$snap"
  exit 1
fi

say "ok: $snap ($(du -h "$snap" | cut -f1), $tables tables)"

# Only prune once a good dump is on disk.
removed=$(find "$DEST" -name "${DB_NAME}-*.dump" -mtime +$KEEP_DAYS -print -delete | wc -l)
[ "$removed" -gt 0 ] && say "pruned $removed local dump(s) older than $KEEP_DAYS days"

# --- off the host --------------------------------------------------------------

remote_ok=0
rclone copyto "$snap" "$REMOTE/$(basename "$snap")" --retries 3 2>&1 | grep -v '^$'

# Trust the remote's own view of the object rather than rclone's exit code; a
# truncated upload is the failure worth catching, and only a size check sees it.
remote_size=$(rclone size "$REMOTE/$(basename "$snap")" --json 2>/dev/null \
  | sed -n 's/.*"bytes":\([0-9]*\).*/\1/p')

if [ "$remote_size" = "$local_size" ]; then
  say "uploaded: $REMOTE/$(basename "$snap") ($remote_size bytes, matches local)"
  remote_ok=1
else
  say "ERROR: upload not verified (local ${local_size}, remote '${remote_size:-none}')"
fi

if [ "$remote_ok" = 1 ]; then
  # Same rule as locally: only prune after a good one has landed.
  rclone delete "$REMOTE" --include '*.dump' --min-age "${KEEP_DAYS_REMOTE}d" 2>/dev/null
  say "remote: $(rclone ls "$REMOTE" 2>/dev/null | wc -l) dump(s)"
fi

say "local: $(find "$DEST" -name "${DB_NAME}-*.dump" | wc -l) dump(s), $(du -sh "$DEST" | cut -f1)"

[ "$remote_ok" = 1 ] || exit 2

if [ -n "$HONEYBADGER_CHECKIN_URL" ]; then
  curl -fsS --max-time 10 "$HONEYBADGER_CHECKIN_URL" > /dev/null \
    || say "WARN: Honeybadger check-in ping failed"
fi
exit 0

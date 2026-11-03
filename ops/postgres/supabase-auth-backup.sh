#!/bin/bash
#
# Weekly dump of Supabase's auth schema (user accounts, identities, sessions).
# Supabase Auth still holds every login, and the free plan keeps no backups, so
# this is the only copy outside Supabase. Installed at
# ~/bin/supabase-auth-backup.sh for the deploy user and run from its crontab.
#
# pg_dump runs in a throwaway pgvector/pgvector:pg18 container (the image the
# nightly backup already uses), so the host needs no Postgres client. The
# connection string comes from ~/.config/bip-supabase-auth.env (mode 600, one
# line: DATABASE_URL=...) via --env-file, which keeps it off the command line.
#
# Same checks as bip-postgres-backup.sh: TABLE DATA count, size floor, full
# read-back. Nothing is pruned until a dump passes all three.
#
# Exit codes: 0 good on both, 2 good locally but not on R2, 1 no good dump.

set -uo pipefail

IMAGE=pgvector/pgvector:pg18
URL_FILE=${URL_FILE:-$HOME/.config/bip-supabase-auth.env}
DEST=${DEST:-$HOME/backups/supabase-auth}
REMOTE=${REMOTE:-r2:bip-postgres-backups}
KEEP_DAYS=28
# auth has 26 tables today.
MIN_TABLES=20
# Today's dump is 5 MB, most of it audit log.
MIN_BYTES=$((1024 * 1024))

say() { echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') $*"; }

[ -r "$URL_FILE" ] || { say "ERROR: $URL_FILE missing"; exit 1; }

mkdir -p "$DEST"
chmod 700 "$DEST"
snap="$DEST/supabase-auth-$(date -u +%Y-%m-%dT%H%M).dump"
fail() { say "ERROR: $*; refusing to keep it"; rm -f "$snap"; exit 1; }

docker run --rm --env-file "$URL_FILE" "$IMAGE" \
  sh -c 'pg_dump -Fc -n auth "$DATABASE_URL"' > "$snap" || fail "pg_dump failed"
[ -s "$snap" ] || fail "pg_dump produced an empty file"

tables=$(docker run --rm -i "$IMAGE" pg_restore --list < "$snap" 2>/dev/null | grep -c ' TABLE DATA ')
[ "$tables" -ge "$MIN_TABLES" ] 2>/dev/null || fail "dump lists ${tables:-0} TABLE DATA entries (want >= $MIN_TABLES)"

local_size=$(stat -c %s "$snap")
[ "$local_size" -ge "$MIN_BYTES" ] || fail "dump is $local_size bytes (want >= $MIN_BYTES)"

docker run --rm -i "$IMAGE" pg_restore -f /dev/null < "$snap" 2>/dev/null \
  || fail "dump does not read back in full (truncated or corrupt)"

say "ok: $snap ($(du -h "$snap" | cut -f1), $tables tables)"

removed=$(find "$DEST" -name 'supabase-auth-*.dump' -mtime +$KEEP_DAYS -print -delete | wc -l)
[ "$removed" -gt 0 ] && say "pruned $removed local dump(s) older than $KEEP_DAYS days"

# R2 pruning (90 days, every *.dump) is done by the nightly bip-postgres-backup.sh.
rclone copyto "$snap" "$REMOTE/$(basename "$snap")" --retries 3 2>&1 | grep -v '^$'
remote_size=$(rclone size "$REMOTE/$(basename "$snap")" --json 2>/dev/null \
  | sed -n 's/.*"bytes":\([0-9]*\).*/\1/p')

if [ "$remote_size" = "$local_size" ]; then
  say "uploaded: $REMOTE/$(basename "$snap") ($remote_size bytes, matches local)"
else
  say "ERROR: upload not verified (local ${local_size}, remote '${remote_size:-none}')"
  exit 2
fi

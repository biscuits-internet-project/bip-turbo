# Production Postgres

Prod runs on the Hetzner VPS (`5.161.124.129`) as the Kamal accessory `bip-web-postgres`, using `pgvector/pgvector:pg18`. Its data lives on the named volume `bip-web-postgres-data`, mounted at `/var/lib/postgresql`. The app reaches it as `bip-web-postgres:5432` on the `kamal` network. Port 5432 is published on the host's `127.0.0.1` only. For a local `psql`, open a tunnel: `ssh -i ~/.ssh/hetzner_deploy -N -L 55432:127.0.0.1:5432 deploy@5.161.124.129`.

| File | What it is |
|---|---|
| `bip-postgres-backup.sh` | Nightly dump, verify, keep 14 days in `~deploy/backups/bip-postgres`, copy to `r2:bip-postgres-backups`, keep 90 days there |
| `bip-postgres-backup.cron` | deploy's crontab, 03:45 UTC (10:45 PM EST) |
| `restore-drill.sh` | Restores the newest R2 dump into a throwaway container and diffs row counts with live |
| `table-counts.sql` | Exact row count per `public` table; every restore check diffs its output |
| `prepare-database.sql` | **Drops** `bip` and recreates it empty with the `vector`, `pg_trgm` and `unaccent` extensions |

## Install the backups (deploy user, once)

Everything runs as `deploy`: it is in the docker group, and cron, rclone and the dumps all live in its home directory. No root needed.

The R2 key is a token limited to the `bip-postgres-backups` bucket (Object Read & Write), stored in Doppler `bip/prd_hetzner` as `R2_BACKUP_ACCESS_KEY_ID` and `R2_BACKUP_SECRET_ACCESS_KEY`. These commands write deploy's rclone config without printing the key:

```bash
h() { ssh -i ~/.ssh/hetzner_deploy deploy@5.161.124.129 "$@"; }
doppler run -p bip -c prd_hetzner --only-secrets R2_BACKUP_ACCESS_KEY_ID,R2_BACKUP_SECRET_ACCESS_KEY,R2_ACCOUNT_ID -- sh -c '
  printf "[r2]\ntype = s3\nprovider = Cloudflare\naccess_key_id = %s\nsecret_access_key = %s\nendpoint = https://%s.r2.cloudflarestorage.com\nno_check_bucket = true\n" \
    "$R2_BACKUP_ACCESS_KEY_ID" "$R2_BACKUP_SECRET_ACCESS_KEY" "$R2_ACCOUNT_ID"' \
  | h 'umask 077; mkdir -p ~/.config/rclone && cat > ~/.config/rclone/rclone.conf'
h 'rclone lsf r2:bip-postgres-backups && echo reachable'
```

Install the scripts and the cron entry. `crontab` replaces deploy's whole crontab, which is fine because it had none before this:

```bash
scp -i ~/.ssh/hetzner_deploy ops/postgres/bip-postgres-backup.sh ops/postgres/restore-drill.sh \
    ops/postgres/bip-postgres-backup.cron ops/postgres/table-counts.sql deploy@5.161.124.129:/tmp/
h 'mkdir -p ~/bin ~/backups ~/.local/share/bip-postgres
  install -m 755 /tmp/bip-postgres-backup.sh ~/bin/bip-postgres-backup.sh
  install -m 755 /tmp/restore-drill.sh ~/bin/bip-postgres-restore-drill.sh
  install -m 644 /tmp/table-counts.sql ~/.local/share/bip-postgres/table-counts.sql
  crontab /tmp/bip-postgres-backup.cron && crontab -l | tail -1
  rm /tmp/bip-postgres-backup.sh /tmp/restore-drill.sh /tmp/bip-postgres-backup.cron /tmp/table-counts.sql'
```

**Honeybadger check-in:** in Honeybadger, open the project's Check-Ins and add "bip postgres backup", Simple, every 1 day, 2-hour grace. Then:

```bash
h 'umask 077; echo "HONEYBADGER_CHECKIN_URL=<check-in URL>" > ~/.config/bip-postgres-backup.env'
```

## Check it works

Run it with cron's bare environment, so a PATH problem shows up now and not at 03:45:

```bash
h 'env -i HOME=$HOME PATH=/usr/local/bin:/usr/bin:/bin ~/bin/bip-postgres-backup.sh; echo exit=$?'
```

Expected:
- `ok:` listing 42 tables;
- `uploaded: … matches local`;
- `exit=0`;
- a ping on the check-in.

Then check that it refuses an empty database:

```bash
h 'DB_NAME=postgres ~/bin/bip-postgres-backup.sh; echo exit=$?'
```

Expected: `ERROR: dump lists 0 TABLE DATA entries`, then `exit=1`. No `postgres-*.dump` file is left in `~/backups/bip-postgres`.

The log is `~/backups/bip-postgres-backup.log`.

## Restore drill (quarterly)

```bash
h ~/bin/bip-postgres-restore-drill.sh
```

`PASS: row counts match` means the newest R2 dump is restorable. Rows written since that dump show up as differences, so run it soon after the nightly backup (03:45 UTC, 10:45 PM EST). Run it at a quiet hour: the drill container's 512m sits on top of the other memory caps.

## Restore prod from a backup

1. Run `mise exec ruby -- kamal app maintenance`.
2. On the host as deploy, pick a dump: from `~/backups/bip-postgres/`, or fetch one with `rclone copyto r2:bip-postgres-backups/<file> /tmp/<file>`.
3. Recreate an empty `bip` database. Don't use `prepare-database.sql` here: a nightly dump is the whole database and creates its own extensions.
   ```bash
   docker exec bip-web-postgres psql -U bip -d postgres -v ON_ERROR_STOP=1 \
     -c 'DROP DATABASE IF EXISTS bip WITH (FORCE)' -c 'CREATE DATABASE bip OWNER bip'
   ```
4. Run `docker exec -i bip-web-postgres pg_restore -U bip -d bip --no-owner --exit-on-error < <file>`. The drill runs this same command against a fresh database.
5. Run `mise exec ruby -- kamal app live`.

## Upgrades

- **Minor (18.x):** `pg18` tracks the newest 18.x. Run `mise exec ruby -- kamal accessory reboot postgres` at a quiet hour. Reboot pulls the image first, so it picks up the new 18.x. The database is down for about 10 seconds, and the data is untouched. If the new image also bumped pgvector, run `docker exec bip-web-postgres psql -U bip -d bip -c 'ALTER EXTENSION vector UPDATE'`.
- **Major (19):** dump, boot `pgvector/pgvector:pg19` on a new volume, restore, switch `DATABASE_URL` and boot the app. These are the same steps as the cutover in `docs/runbooks/postgres-cutover.md`.
- **Host OS:** the Sunday 04:00 UTC root cron runs `apt upgrade` and `docker system prune -f`. Neither touches the Postgres container or its named volume.

## Memory

The container is capped at 768m with `shared_buffers=256MB` (`config/deploy.yml`). If `free -m` shows less than 500 MB available under normal load, move to the next Hetzner size up instead of lowering the caps.

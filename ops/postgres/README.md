# Production Postgres

Prod runs on the Hetzner VPS (`5.161.124.129`) as the Kamal accessory `bip-web-postgres`, using `pgvector/pgvector:pg18`. Its data lives on the named volume `bip-web-postgres-data`, mounted at `/var/lib/postgresql`. The app reaches it as `bip-web-postgres:5432` on the `kamal` network. Port 5432 is published on the host's `127.0.0.1` only. For a local `psql`, open a tunnel: `ssh -i ~/.ssh/hetzner_deploy -N -L 55432:127.0.0.1:5432 deploy@5.161.124.129`.

| File | What it is |
|---|---|
| `bip-postgres-backup.sh` | Nightly dump, verify, keep 14 days in `/var/backups/bip-postgres`, copy to `r2:bip-postgres-backups`, keep 90 days there |
| `bip-postgres-backup.cron` | Root cron entry, 03:45 UTC |
| `restore-drill.sh` | Restores the newest R2 dump into a throwaway container and diffs row counts with live |
| `table-counts.sql` | Exact row count per `public` table; every restore check diffs its output |
| `prepare-database.sql` | **Drops** `bip` and recreates it empty with the `vector`, `pg_trgm` and `unaccent` extensions |

## Install the backups (root, once)

```bash
scp ops/postgres/bip-postgres-backup.sh ops/postgres/restore-drill.sh \
    ops/postgres/bip-postgres-backup.cron ops/postgres/table-counts.sql root@5.161.124.129:/tmp/
ssh root@5.161.124.129 '
  install -m 755 /tmp/bip-postgres-backup.sh /usr/local/bin/bip-postgres-backup.sh
  install -m 755 /tmp/restore-drill.sh /usr/local/bin/bip-postgres-restore-drill.sh
  install -D -m 644 /tmp/table-counts.sql /usr/local/share/bip-postgres/table-counts.sql
  install -m 644 /tmp/bip-postgres-backup.cron /etc/cron.d/bip-postgres-backup
  rm /tmp/bip-postgres-backup.sh /tmp/restore-drill.sh /tmp/bip-postgres-backup.cron /tmp/table-counts.sql
  rclone lsd r2: | grep bip-postgres-backups'
```

If the last line prints nothing, root's `r2:` token can't see the bucket. Make an R2 API token with Object Read & Write on `bip-postgres-backups`, and add it to `/root/.config/rclone/rclone.conf` as a second remote. Then point `REMOTE` in the script at that remote.

**Honeybadger check-in:** in Honeybadger, open the project's Check-Ins and add "bip postgres backup", Simple, every 1 day, 2-hour grace. Then:

```bash
ssh root@5.161.124.129 'umask 077; echo "HONEYBADGER_CHECKIN_URL=<check-in URL>" > /etc/bip-postgres-backup.env'
```

## Check it works (root)

```bash
ssh root@5.161.124.129 '/usr/local/bin/bip-postgres-backup.sh; echo exit=$?'
```

Expected:
- an `ok:` line listing 42 tables;
- an `uploaded: … matches local` line;
- `exit=0`;
- a ping on the check-in.

Then check that it refuses an empty database:

```bash
ssh root@5.161.124.129 'DB_NAME=postgres /usr/local/bin/bip-postgres-backup.sh; echo exit=$?'
```

Expected: `ERROR: dump lists 0 TABLE DATA entries`, then `exit=1`, and no `postgres-*.dump` file left in `/var/backups/bip-postgres`.

## Restore drill (root, quarterly)

```bash
ssh root@5.161.124.129 /usr/local/bin/bip-postgres-restore-drill.sh
```

`PASS: row counts match` means the newest R2 dump is restorable. Rows written since that dump show up as differences, so run it soon after 03:45 UTC.

## Restore prod from a backup

1. Run `mise exec ruby -- kamal app maintenance`.
2. As root, pick a dump: from `/var/backups/bip-postgres/`, or fetch one with `rclone copyto r2:bip-postgres-backups/<file> /tmp/<file>`.
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

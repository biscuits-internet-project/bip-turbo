# Postgres: Supabase → Hetzner — Design

**Date:** 2026-04-20, revised 2026-11-03
**Status:** Approved for implementation planning
**Scope:** Move the app's Postgres database off Supabase and onto the Hetzner VPS that already runs the web app and Redis via Kamal 2.

## Goal

Stop paying $25/month for Supabase Pro. Auth and Storage stay on Supabase, on the free plan.

## Scope

**In scope:**
- Postgres 18 with pgvector on the existing VPS (`5.161.124.129`) as a Kamal accessory.
- Move the `public` schema (every Prisma-managed table, including `_prisma_migrations`) from Supabase to it.
- Nightly backups, kept on the host and copied to Cloudflare R2.
- A restore drill before cutover.
- Point `DATABASE_URL` at the new database and redeploy.
- After a 30-day rollback window, downgrade the Supabase project to the free plan.

**Out of scope:**
- Supabase Auth (`auth.*`) and Storage (`storage.*`) stay where they are.
- PgBouncer, WAL archiving, point-in-time recovery, replicas.
- Local development. `make db-restore` and the local Supabase stack keep working as they do.
- coaching-tree's database.

## Facts this design rests on

Checked 2026-11-03:

| | |
|---|---|
| Supabase Postgres | 15.8; 345 MB in total: `public` 248 MB, `auth` 37 MB, `storage` 248 kB with no stored files; 1,497 auth users |
| Extensions the app needs | `vector`, `pg_trgm`, `unaccent` (created by migrations with no `SCHEMA` clause). Which schema each lives in on prod is checked in plan Task 1. |
| App connection | `DATABASE_URL` in Doppler `bip/prd_hetzner` points at Supabase's IPv4 session pooler. Prisma pool is capped at 5 connections (`packages/core/src/_shared/prisma/client.ts`). |
| VPS | 3 vCPU, 3.7 GB RAM (about 1.4 GB available, 661 MB swap in use), 52 GB of 75 GB disk free, Ubuntu 24.04. Runs bip-web (capped at 1536m), redis (512mb), coaching-tree and its Postgres, dipstick, monarch-mcp, kamal-proxy. |
| Host maintenance | Root cron runs `apt upgrade` plus `docker system prune -f` Sundays at 04:00 UTC. Prune does not touch named volumes or running containers. |
| Existing backup pattern | `/usr/local/bin/dipstick-backup.sh` (root cron): snapshot, verify, keep 14 days locally, copy to R2 via the root `r2:` rclone remote, keep 90 days there. |
| Stale accessory | A `bip-web-postgres` container from April (`postgres:18-alpine`) holds an unused April copy of the data. Its `config/deploy.yml` entry mounts `/var/lib/postgresql/data`, but PG 18 images keep data in `/var/lib/postgresql/18/docker`, so the data sits in an anonymous volume that a container recreate would orphan. |
| Writes outside the app | The hourly and weekly cron jobs call the app over HTTP (`.github/workflows/cron-jobs.yml`), so Kamal maintenance mode stops them too. |
| Kamal | 2.11, which has `kamal app maintenance` / `kamal app live`. |

## Architecture

```
Hetzner VPS (5.161.124.129)
├── bip-web            Kamal app
├── bip-web-redis      Kamal accessory (existing)
├── bip-web-postgres   Kamal accessory: pgvector/pgvector:pg18
└── root cron          /usr/local/bin/bip-postgres-backup.sh, nightly
```

- **Image:** `pgvector/pgvector:pg18`, the official Postgres image with pgvector added. `pg_trgm` and `unaccent` ship with Postgres.
- **Data:** named Docker volume `bip-web-postgres-data` mounted at `/var/lib/postgresql`, which covers PG 18's `18/docker` data directory and leaves room for a future `19/docker` next to it.
- **Network:** the web container reaches it as `bip-web-postgres:5432` on Kamal's Docker network. Port 5432 is published on `127.0.0.1` only, for SSH tunnels.
- **Memory:** container capped at 768m, `shared_buffers=256MB`, `max_connections=50`. If available memory drops below 500 MB after cutover, move to the next Hetzner size up (the user approved this).
- **Roles:** one role `bip` owns the `bip` database. Dump and restore use `--no-owner --no-acl`, so Supabase's roles are not needed.

New `DATABASE_URL`: `postgresql://bip:<POSTGRES_PASSWORD>@bip-web-postgres:5432/bip`. `POSTGRES_PASSWORD` is already in Doppler and `.kamal/secrets`.

## Cutover

The app goes into Kamal maintenance mode, so no writes land on Supabase after the dump starts. 345 MB dumps and restores in a few minutes.

1. Maintenance mode on. kamal-proxy serves our own `config/error_pages/503.html` (set with `error_pages_path`), a self-contained page saying the site is moving and will be back in a few minutes.
2. `pg_dump -Fc -n public --no-owner --no-acl` from Supabase with a PG 18 client.
3. Restore into a freshly created `bip` database that already has the three extensions.
4. Compare exact row counts for every `public` table on both sides. Any difference stops the cutover.
5. Save the Supabase URL in Doppler as `SUPABASE_DATABASE_URL` (rollback), set `DATABASE_URL` to the new value, boot the app, maintenance mode off.
6. Smoke test: log in, load a show and a song, search, post a rating and see the row in the new database.

The full command list lives in `docs/runbooks/postgres-cutover.md`.

### Rollback

Set `DATABASE_URL` back to `SUPABASE_DATABASE_URL` and boot the app. Writes made on Hetzner after cutover do not exist on Supabase, so a rollback later than the first hour needs a data-only dump from Hetzner restored into Supabase first. The Supabase copy stays untouched for 30 days.

## Backups

A root cron script on the host, modeled on `dipstick-backup.sh`:

- Nightly at 03:45 UTC: `docker exec bip-web-postgres pg_dump -Fc` of the whole `bip` database into `/var/backups/bip-postgres/`.
- Verify before keeping: `pg_restore --list` must read the file and list at least 30 `TABLE DATA` entries.
- Keep 14 days on the host, prune only after a good dump.
- Copy to `r2:bip-postgres-backups`, confirm the remote size matches, keep 90 days there.
- On full success, ping a Honeybadger check-in. A missed check-in emails the user. Exit 2 means the local copy is good but R2 failed.

Disk: a compressed dump is roughly 100 MB, so 14 local copies take about 1.4 GB of the 52 GB free.

**Restore drill:** pull the newest dump from R2, restore it into a throwaway `pgvector/pgvector:pg18` container, compare row counts with the live database. Run before cutover and then quarterly.

**Auth data:** the Supabase free plan has no backups. Before downgrading, add a weekly `pg_dump -n auth` of Supabase to the same script so the 1,497 auth users are covered.

## Upgrades

- **Minor versions** (18.1 → 18.2): the `pg18` tag tracks the latest minor. `kamal accessory reboot postgres` pulls it and restarts. Data is untouched. About 10 seconds of database downtime, so do it in a quiet hour.
- **Major versions** (18 → 19): dump, boot a `pg19` image on a new volume, restore, switch. The same steps as this cutover, with the backup as the safety net.
- **OS:** the weekly `apt upgrade` covers the host. Postgres does not run on the host, so apt never touches it.

## After cutover

- `make db-dump-prod` reads prod through `DATABASE_URL`, which will name a Docker-internal host. Change it to dump over SSH with `docker exec bip-web-postgres pg_dump`.
- After 30 days with no rollback: drop the old `public` tables on Supabase, downgrade the project to the free plan, delete `SUPABASE_DATABASE_URL`.
- Free projects pause after 7 days without activity. Regular logins count as activity, but this needs watching for the first weeks.

## Risks

| Risk | Mitigation |
|---|---|
| Extensions live in Supabase's `extensions` schema, so restored columns reference `extensions.vector` | Plan Task 1 checks. The new database creates each extension in the same schema prod uses. |
| A Supabase-side trigger on `auth.users` writes into `public` and would keep writing to the old database | Plan Task 1 lists triggers on `auth.*` and `public` functions that reference other schemas. |
| Server disk dies | Nightly R2 copy. Worst case: lose 24 hours of data and take about 15 minutes to restore. |
| A backup quietly stops running | Honeybadger check-in alerts when a night is missed. |
| Memory pressure on a shared 3.7 GB host | Container memory cap. Measure after cutover, and resize the server if needed. |
| Container recreate loses data | The named volume covers the real data directory. Plan Task 2 proves this by rebooting the accessory and checking that a test database survives. |

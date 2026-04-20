# Postgres: Supabase → Hetzner — Design

**Date:** 2026-04-20
**Status:** Approved for implementation planning
**Scope:** Move the app's transactional Postgres database off Supabase and onto the Hetzner VPS that already runs the web app and Redis via Kamal 2.

## Goal

Stop paying for and depending on Supabase for the transactional database. Keep everything else on Supabase unchanged.

## Scope

**In scope:**
- Stand up Postgres 18 on the existing Hetzner VPS (`5.161.124.129`) as a Kamal accessory.
- Migrate all `public.*` schema data (every Prisma-managed table) from Supabase Postgres to the new Hetzner Postgres.
- Nightly `pg_dump` backups to Cloudflare R2 with 14-day retention.
- One-time restore drill before declaring the migration complete.
- Update `DATABASE_URL` + related secrets in Doppler and redeploy.

**Explicitly out of scope:**
- Supabase Auth stays on Supabase. `auth.*` schema is not migrated.
- Supabase Storage stays on Supabase. `storage.*` schema is not migrated.
- No PgBouncer / connection pooling changes.
- No WAL archiving, point-in-time recovery, or streaming replicas.
- No change to local development workflow (`supabase start` keeps working).
- No change to coaching-tree's database (different project, different owner, different VPS tenant).
- Updating the GitHub Actions deploy workflow off Fly.io (known-stale per project memory; separate issue).

## Context

- App already deployed on a Hetzner VPS (`5.161.124.129`) via Kamal 2, sharing the box with `coaching-tree`.
- Current accessories: `bip-web-redis`.
- Current `DATABASE_URL` points at Supabase's **session pooler** (IPv4) because the direct Supabase endpoint is IPv6-only and the Docker host can't reach it. Moving Postgres onto the same VPS eliminates that constraint.
- Supabase is also used for Auth (routes under `apps/web/app/routes/auth/*`) and Storage (avatars via `file-service.ts`, blog images bucket). A `packages/core/scripts/sync-supabase-users.ts` syncs Supabase `auth.users` → the app's `public.users`. That sync continues to work unchanged because Auth stays on Supabase and the sync writes into Postgres (which will just be a different Postgres after cutover).
- ORM is Prisma 7. Schema at `packages/core/src/_shared/prisma/schema.prisma`. All tables live in `public`. The schema uses `gen_random_uuid()` (built into PG 13+, no extra extension needed) and one `autoincrement` on `audits.id`.
- DB size: **287 MB**. Dump + restore runs in under a minute.

## Architecture

Two new Kamal accessories on the existing VPS — a Postgres server and a nightly backup job — reached over Kamal's Docker network:

```
Hetzner VPS (5.161.124.129)
├── bip-web              (Kamal app)
├── bip-web-redis        (Kamal accessory — existing)
└── bip-web-postgres     (Kamal accessory — NEW)
└── bip-web-backup       (Kamal accessory — NEW, nightly cron)
```

**Properties:**
- Postgres 18, official image (`postgres:18` or `postgres:18-alpine`). Version choice is deliberate even though Supabase is on an older major — `pg_dump --format=custom` handles cross-major restores cleanly as long as the **client** matches the target version.
- Data persisted to a Kamal-managed named volume: `bip-web-postgres-data:/var/lib/postgresql/data`.
- Port 5432 is **not** exposed to the public internet. The web container reaches it by hostname `bip-web-postgres` over Kamal's Docker network. Host-local access (for ops) bound to `127.0.0.1:5432` so `ssh -L 5432:localhost:5432 deploy@5.161.124.129` works for remote `psql` sessions.
- No PgBouncer. Single web container + 287 MB of data does not need pooling. Revisit if/when it becomes a bottleneck.
- Superuser/role model: one application role `bip` owns everything in `public`. `--no-owner --no-acl` on both dump and restore means the restore doesn't try to recreate Supabase-specific roles (`supabase_admin`, `anon`, `authenticated`, etc.) that don't exist on the new cluster.

### New `DATABASE_URL`

```
postgres://bip:<password>@bip-web-postgres:5432/bip
```

Password generated at deploy time, stored in Doppler (`bip/prd_hetzner`), never committed.

### Secrets (Doppler `bip/prd_hetzner`)

**New:**
- `DATABASE_URL` (updated to new value)
- `POSTGRES_PASSWORD` (for initializing the Postgres accessory)
- `R2_BACKUP_ACCESS_KEY_ID`
- `R2_BACKUP_SECRET_ACCESS_KEY`
- `R2_BACKUP_BUCKET` (e.g., `bip-postgres-backups`)
- `R2_BACKUP_ENDPOINT` (R2 S3-compatible endpoint URL)

**Unchanged:** all Supabase Auth / Storage secrets (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_URL`).

## Migration / cutover procedure

Total expected duration of the customer-visible window: **under 5 minutes** for 287 MB. Runbook is linear and scheduled (not zero-downtime).

### Pre-cutover (no user impact; days before)

1. Add the `bip-web-postgres` accessory to `config/deploy.yml`. Deploy.
2. Add `bip` role and empty `bip` database to the new Postgres.
3. **Dry-run migration:** run `pg_dump` from Supabase against the new Hetzner DB (while app still points at Supabase). Verify:
   - Row counts per table match source.
   - A handful of spot-check queries return sensible data.
   - No extension or permission errors during restore.
4. Build and deploy the `bip-web-backup` accessory. Run the backup job manually once. Confirm the dump lands in R2.
5. **Day-one restore drill:** pull the R2 dump to a scratch Postgres, restore it, row-count-verify against the live Hetzner DB. Script this as `scripts/restore-drill.sh` so it's repeatable quarterly.
6. Truncate the dry-run DB so it's empty for the real cutover.

### Cutover (scheduled low-traffic window)

1. (Optional) Enable a maintenance page, or accept a brief 502 window — caller's choice on the day.
2. `pg_dump --format=custom --no-owner --no-acl --schema=public` from Supabase to a local file.
3. `pg_restore --no-owner --no-acl` into `bip-web-postgres` over SSH tunnel.
4. Verification:
   - Row counts on high-signal tables: `users`, `shows`, `tracks`, `ratings`, `attendances`, `annotations`.
   - `SELECT MAX(updated_at) FROM ratings` equals source.
   - Sequences: confirm `SELECT last_value FROM audits_id_seq` (the only autoincrement) is > the max `id` in `audits`.
5. Update `DATABASE_URL` in Doppler to the new value. Run `kamal env push && kamal app boot` (or `kamal deploy` if cleaner).
6. Smoke test against production:
   - Log in (exercises Supabase Auth → `public.users` read).
   - Load a song page (read-heavy).
   - Load "On This Day" (recently built feature).
   - Load the all-timers tab on a song page.
   - Post a rating (write); confirm the row lands in Hetzner Postgres.
7. Remove maintenance page if used.

### Post-cutover

- Monitor for 24–48h: Honeybadger, Kamal logs, Cloudflare analytics.
- Keep the Supabase Postgres untouched (paused or read-only) for **~30 days** as rollback insurance. Do not delete the Supabase project; Auth and Storage still live there.
- After 30 days of stability: no action required. Supabase project stays for Auth/Storage; only the DB side of it has been retired.

### Rollback

If smoke tests fail or something goes sideways post-cutover:
1. Revert `DATABASE_URL` in Doppler to the Supabase value.
2. `kamal env push && kamal app boot`.
3. Investigate offline.

Rollback window is essentially instant because the Supabase DB was taken effectively read-only during the cutover (maintenance mode or zero-writes window). No write divergence to reconcile.

## Backup design

Nightly `pg_dump` to Cloudflare R2, 14-day retention enforced by an R2 lifecycle rule.

### Accessory: `bip-web-backup`

- Off-the-shelf base: `prodrigestivill/postgres-backup-local` (or a minimal custom image on `postgres:18-alpine` + `rclone`). Final choice deferred to implementation — off-the-shelf preferred if it supports R2 via S3-compatible endpoint and PG 18 client.
- Crontab: daily at **04:15 UTC** (low traffic).
- Dump format: `pg_dump --format=custom --no-owner --no-acl --schema=public` against `bip-web-postgres` over Docker network.
- Output object key: `YYYY/MM/DD/bip-YYYYMMDDHHMM.dump`.
- Destination bucket: `bip-postgres-backups` in Cloudflare R2.
- Credentials: bucket-scoped R2 access key (write-only to this one bucket) injected via Doppler.

### Retention

**Lifecycle rule on the R2 bucket**, not on the job: delete objects older than 14 days. This makes retention immune to a misbehaving or non-running cron.

### Monitoring

- **Backup health check** — a second, weekly cron (on the same accessory or the web container, TBD at implementation time). Lists the R2 bucket, confirms the newest object is <36h old, exits non-zero if not. Honeybadger catches the non-zero exit.
- No PagerDuty / external uptime integration; excessive for a fan site.

### Explicitly not doing

- No GPG / application-layer encryption on the dump. R2 server-side encryption is sufficient. Revisit if we ever add data subject to specific regulations.
- No cross-region bucket replication. R2 durability is adequate.
- No incremental / WAL-based backups.

## Local development

**No changes.** Developers continue to run `supabase start`, which spins up a local Supabase stack including Postgres. That local Postgres stays the dev database; Prisma still targets it. The flow documented in `packages/core/CLAUDE.md` (start → `db-load-data-dump` → `prisma migrate deploy`) continues to work unchanged.

Rationale: developers still need the local Supabase stack for Auth and Storage emulation, which aren't changing. Ripping Postgres out of that stack would add dev-setup complexity to solve a problem that doesn't exist.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| VPS disk failure → total data loss | Nightly R2 backups + restore drill. Worst-case RPO: 24h. Worst-case RTO: time to restore 287 MB (<10 min) + time to redeploy (<5 min). |
| VPS is shared with `coaching-tree`; a runaway query could starve it of resources | Accepted risk. Traffic profile doesn't warrant a second VPS. Revisit if load grows. |
| Extension dependencies in the Supabase DB not present on vanilla Postgres | Surfaced by the dry-run restore (step 3 of pre-cutover). Schema audit indicates only `pgcrypto`/built-ins are needed. |
| Role/ACL differences between Supabase and vanilla Postgres | `--no-owner --no-acl` on dump and restore; app role `bip` owns everything in the new cluster. |
| R2 credentials leak | Bucket-scoped, write-only credentials. Worst case: attacker writes garbage into the backup bucket. Detected by the weekly health check reading object sizes. Rotation is a one-command Doppler update. |
| Cutover smoke test misses a regression | 30-day Supabase rollback window. Revert `DATABASE_URL` and investigate. |

## Open implementation questions (resolve when writing the plan, not now)

- **Backup image choice:** off-the-shelf (`prodrigestivill/postgres-backup-local`) vs. a minimal custom image with `rclone`. Off-the-shelf preferred if PG 18 + R2 both supported.
- **Cutover dump tooling:** Docker one-shot (`docker run --rm postgres:18 pg_dump ...`) vs. local `postgresql@18` from Homebrew. Docker one-shot is likely cleaner because it guarantees the client version.
- **Exact Supabase Postgres version** at cutover time — for awareness only; does not affect correctness given the client version is pinned to 18 and we use `--format=custom`.
- **Kamal accessory declaration:** whether the backup job is a separate accessory or a sidecar crontab inside the Postgres accessory. Separate accessory is cleaner (SRP) but is an extra moving part.

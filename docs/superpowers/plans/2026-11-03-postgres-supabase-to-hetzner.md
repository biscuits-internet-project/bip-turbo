# Postgres: Supabase → Hetzner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the `public` schema from Supabase to a pgvector Postgres 18 Kamal accessory on the Hetzner VPS, with nightly verified backups to R2.

**Architecture:** Replace the stale `bip-web-postgres` accessory with `pgvector/pgvector:pg18` on a named volume at `/var/lib/postgresql`. Back it up with a root host-cron script modeled on `/usr/local/bin/dipstick-backup.sh`. Cut over during Kamal maintenance mode with a `pg_dump -n public` restore, then repoint `DATABASE_URL`.

**Tech Stack:** Kamal 2.11 (`mise exec ruby -- kamal`), Docker, PostgreSQL 18, pgvector, rclone (root's `r2:` remote), Doppler `bip/prd_hetzner`, Honeybadger check-ins.

**Spec:** [`docs/superpowers/specs/2026-04-20-postgres-supabase-to-hetzner-design.md`](../specs/2026-04-20-postgres-supabase-to-hetzner-design.md)

## Global Constraints

- Ask the user before every command that reads or writes the prod database (Supabase or Hetzner), and before removing or rebooting any accessory.
- Never print secrets. Pass them through `doppler run` or environment variables. Never echo `DATABASE_URL`.
- Dumps contain personal data. Keep them in `../data/` on the laptop or `/var/backups/bip-postgres/` on the host, never in the repo. Delete ad-hoc copies when the step is done.
- Postgres client version for every dump and restore is 18: use `pgvector/pgvector:pg18` in Docker, never the laptop's `pg_dump`.
- Port 5432 is published only on `127.0.0.1`.
- The deploy user has no sudo and root SSH is not available. Ruling 2026-11-03: everything, backups included, runs as deploy (docker group), with a token limited to the bucket in deploy's rclone config.
- Times in reports are US Eastern.
- PR 1 holds Tasks 2–6, including 5b. PR 2 holds Task 8's repo changes. Link PRs as `[#N](url)`. The user merges.

## Review Focus

1. **Extension schema.** If prod has `vector` in an `extensions` schema, the dump references `extensions.vector` and the restore fails on every embedding column. Task 1 finds out; Task 3 Step 1 creates extensions to match.
2. **Writes that bypass the app.** A Supabase trigger on `auth.users` that writes `public.users` would keep writing to the old database after cutover. Task 1 lists them; any hit stops the plan for a design change.
3. **Silent backup failure.** A dump that runs but is empty, or an upload that truncates. Task 4's script rejects dumps with fewer than 30 `TABLE DATA` entries and compares remote size with local size; Task 4 Step 5 proves the rejection by pointing it at an empty database.
4. **Data loss on container recreate.** Task 2 Step 5 reboots the accessory and checks that a scratch database survives.
5. **Writes during the cutover window.** Task 7 enables maintenance mode before the dump, and Step 3 confirms the site and the cron endpoint return the maintenance response.

---

### Task 1: Read-only audit of prod (Supabase)

**Files:** none. Results go into the PR 1 description and decide Task 3 Step 1.

- [ ] **Step 1: Ask the user for permission to run these read-only queries against prod**

- [ ] **Step 2: Run them through `doppler run -p bip -c prd_hetzner -- docker run --rm -e DATABASE_URL pgvector/pgvector:pg18 psql "$DATABASE_URL" -At -c '<query>'`**

```sql
-- a. extension schemas
SELECT extname, extnamespace::regnamespace FROM pg_extension ORDER BY 1;
-- b. public columns whose type lives outside public/pg_catalog
SELECT table_name, column_name, udt_schema, udt_name FROM information_schema.columns
WHERE table_schema = 'public' AND udt_schema NOT IN ('public', 'pg_catalog');
-- c. non-internal triggers on auth.* and storage.*
SELECT tgrelid::regclass, tgname, tgfoid::regproc FROM pg_trigger
WHERE NOT tgisinternal AND tgrelid::regclass::text ~ '^(auth|storage)\.';
-- d. public functions that reference another schema
SELECT proname FROM pg_proc WHERE pronamespace = 'public'::regnamespace
AND prosrc ~ '\m(auth|storage|extensions)\.';
-- e. RLS policies on public
SELECT tablename, policyname, roles FROM pg_policies WHERE schemaname = 'public';
```

- [ ] **Step 3: Record the decision**

- (a) and (b) decide Task 3 Step 1. If `vector`, `pg_trgm` or `unaccent` sit in `extensions`, the new database gets `CREATE SCHEMA extensions` and the extension created there, and `ALTER DATABASE bip SET search_path = "$user", public, extensions`.
- Any row from (c) whose function writes to `public`, or any row from (d): stop and bring it to the user.
- Rows from (e) restore harmlessly only if they name roles that exist. Policies naming `anon`, `authenticated` or `service_role` would fail the restore. If there are any, add `CREATE ROLE <name> NOLOGIN` for each to Task 3 Step 1.

---

### Task 2: Replace the stale accessory (PR 1)

**Files:**
- Modify: `config/deploy.yml` (the `accessories.postgres` block)

**Interfaces:**
- Produces: container `bip-web-postgres`, database `bip`, role `bip`, reachable as `bip-web-postgres:5432` from the app and `127.0.0.1:5432` on the host.

- [ ] **Step 1: Edit `accessories.postgres`**

Set `image: pgvector/pgvector:pg18`. Replace `directories:` with `volumes: - bip-web-postgres-data:/var/lib/postgresql`. Add `options: memory: 768m` next to the existing `shm-size: 256m`, and `cmd: postgres -c shared_buffers=256MB -c max_connections=50`. Keep `port`, `env` and `host` as they are. Add a comment explaining that PG 18 keeps data in `/var/lib/postgresql/18/docker`, so mounting `/var/lib/postgresql/data` loses it on recreate.

- [ ] **Step 2: Ask the user, then remove the stale accessory**

It holds only the April copy, which nothing reads. Run `mise exec ruby -- kamal accessory remove postgres`, then `docker volume ls -qf dangling=true` over SSH. Ask before deleting the orphaned anonymous volume (`684ed029…`).

- [ ] **Step 3: Boot**

Run `mise exec ruby -- kamal accessory boot postgres`.

- [ ] **Step 4: Verify**

```bash
ssh -i ~/.ssh/hetzner_deploy deploy@5.161.124.129 '
  docker exec bip-web-postgres psql -U bip -d bip -Atc "SHOW server_version; SHOW shared_buffers;
    SELECT name FROM pg_available_extensions WHERE name IN ('"'vector','pg_trgm','unaccent'"') ORDER BY 1;"
  docker inspect bip-web-postgres --format "{{range .Mounts}}{{.Type}}:{{.Name}}->{{.Destination}} {{end}}"'
```

Expected: `18.x`, `256MB`, `pg_trgm`/`unaccent`/`vector`, and `volume:bip-web-postgres-data->/var/lib/postgresql`. No anonymous volume.

- [ ] **Step 5: Persistence check**

Run `docker exec bip-web-postgres createdb -U bip persist_check`, then `kamal accessory reboot postgres`. Then `psql -U bip -Atc "SELECT 1 FROM pg_database WHERE datname='persist_check'"` must print `1`. Finish with `dropdb -U bip persist_check`.

- [ ] **Step 6: Commit** `config/deploy.yml` with the message "Run Postgres accessory on pgvector with its data on a named volume".

---

### Task 3: Dry-run migration into Hetzner (PR 1)

**Files:**
- Create: `ops/postgres/table-counts.sql`: one query that returns `table_name|exact_count` for every `public` base table, ordered by name. It builds the counts with `query_to_xml(format('SELECT count(*) FROM public.%I', table_name), …)`. Tasks 3, 5 and 7 all use it.
- Create: `ops/postgres/prepare-database.sql`: drops and recreates `bip` (connect to `postgres` to run it), then creates the three extensions in the schemas Task 1 found, plus any roles Task 1 Step 3 requires.

- [ ] **Step 1: Write both SQL files and commit them**

- [ ] **Step 2: Ask the user, then prepare the database**

Run `prepare-database.sql` on the server via `docker exec -i bip-web-postgres psql -U bip -d postgres -v ON_ERROR_STOP=1 < ops/postgres/prepare-database.sql`.

- [ ] **Step 3: Ask the user, then dump Supabase**

```bash
doppler run -p bip -c prd_hetzner -- docker run --rm -e DATABASE_URL -v "$(cd ../data && pwd):/out" \
  pgvector/pgvector:pg18 sh -c 'pg_dump -Fc -n public --no-owner --no-acl -f /out/supabase-dryrun.dump "$DATABASE_URL"'
```

- [ ] **Step 4: Restore**

Pipe the file over SSH into `docker exec -i bip-web-postgres pg_restore --no-owner --no-acl -U bip -d bip`. Capture stderr to `../data/restore-dryrun.log`. The only acceptable error is `schema "public" already exists` (plus `extension … already exists` if the dump carries extensions). Any other error fails the step.

- [ ] **Step 5: Compare counts**

Run `table-counts.sql` on Supabase (after asking the user) and on Hetzner, and `diff` the two outputs. Expected: no differences.

- [ ] **Step 6: Run the app against it**

Open `ssh -L 55432:127.0.0.1:5432`. Run `prisma migrate status` against `postgresql://bip:$POSTGRES_PASSWORD@localhost:55432/bip`; expected: "Database schema is up to date". Then start the web app locally with that URL as `DATABASE_URL` and load:
- a show page;
- `/songs`;
- `/shows/year/1999?q=tractor`;
- a song search from the header.

Report what each returned.

- [ ] **Step 7: Leave the dry-run data in place** for Task 4. Delete `../data/supabase-dryrun.dump`.

---

### Task 4: Nightly backup script (PR 1)

**Files:**
- Create: `ops/postgres/bip-postgres-backup.sh`
- Create: `ops/postgres/bip-postgres-backup.cron`: `45 3 * * * root /usr/local/bin/bip-postgres-backup.sh >> /var/log/bip-postgres-backup.log 2>&1`
- Create: `ops/postgres/README.md`: install steps, the restore drill, upgrades (copy the spec's Upgrades section).

**Interfaces:**
- Consumes: container `bip-web-postgres` (Task 2); root rclone remote `r2:`; optional `/etc/bip-postgres-backup.env` (mode 600) holding `HONEYBADGER_CHECKIN_URL`.
- Produces: `/var/backups/bip-postgres/bip-<UTC stamp>.dump` and `r2:bip-postgres-backups/bip-<UTC stamp>.dump`. Exit 0 means good on both, 2 means good locally but not on R2, 1 means no good dump.

- [ ] **Step 1: Write the script**

Follow `dipstick-backup.sh` line for line in structure: `set -uo pipefail`, a `say` helper, `DEST=/var/backups/bip-postgres`, `REMOTE=r2:bip-postgres-backups`, `KEEP_DAYS=14`, `KEEP_DAYS_REMOTE=90`.
- Dump with `docker exec bip-web-postgres pg_dump -U bip -d bip -Fc > "$snap"`. Use a non-zero exit or an empty file to delete the snapshot and exit 1.
- Verify by streaming the file into `docker exec -i bip-web-postgres pg_restore --list`. Exit 1 unless it lists at least `MIN_TABLES=30` `TABLE DATA` lines.
- Prune local copies, then upload, compare sizes and prune remote, as dipstick does.
- On exit 0, `curl -fsS --max-time 10 "$HONEYBADGER_CHECKIN_URL"` if the variable is set.
- Header comment: why each check exists, in the same voice as dipstick's.

- [ ] **Step 2: Lint**

Run `shellcheck ops/postgres/bip-postgres-backup.sh`. Expected: no findings.

- [ ] **Step 3: (root) Install**

The user creates the bucket with `rclone mkdir r2:bip-postgres-backups`. If the `r2:` key is limited to the dipstick bucket, they make a new R2 token instead. Then they copy the script to `/usr/local/bin/` (mode 755) and the cron file to `/etc/cron.d/bip-postgres-backup`. They create a Honeybadger check-in ("bip postgres backup", every 1 day, 2-hour grace) and put its URL in `/etc/bip-postgres-backup.env`.

- [ ] **Step 4: (root) Run it once against the dry-run data**

Expected:
- exit 0;
- an `ok:` line with the size;
- an `uploaded: … matches local` line;
- the Honeybadger check-in shows a ping.

- [ ] **Step 5: Prove the empty-dump guard**

Run the script with the container's database switched to an empty one. Give the script `DB_NAME` (default `bip`) for this, then run `DB_NAME=postgres /usr/local/bin/bip-postgres-backup.sh` as root. Expected: exit 1, an error naming the `TABLE DATA` count, and no new file kept.

- [ ] **Step 6: Commit** the script, cron file and README.

---

### Task 5: Restore drill (PR 1)

**Files:**
- Create: `ops/postgres/restore-drill.sh`: runs on the host as root. It fetches the newest object from `r2:bip-postgres-backups` into a temp dir and starts `pgvector/pgvector:pg18` as `bip-restore-drill` with `--memory 512m` and no published port. It restores the dump, runs `table-counts.sql` against the drill database and the live database, and `diff`s them. A `trap` removes the container and the temp file. Exit 0 only when the diff is empty.

- [ ] **Step 1: Write it and run shellcheck**
- [ ] **Step 2: (root) Run it.** Expected: an empty diff, exit 0, and no `bip-restore-drill` container left (`docker ps -a`).
- [ ] **Step 3: Commit.** Add "quarterly: run restore-drill.sh" to `ops/postgres/README.md`.

---

### Task 5b: Maintenance page (PR 1)

During `kamal app maintenance`, kamal-proxy answers every request with a 503. Without a page of our own, visitors get the proxy's generic page. Kamal 2.11 reads `error_pages_path` (relative to the repo root, where `kamal` runs), copies any `4xx.html`/`5xx.html` from it to the host on each deploy, and the proxy serves `503.html` in maintenance mode.

**Files:**
- Create: `config/error_pages/503.html`
- Modify: `config/deploy.yml`: top-level `error_pages_path: config/error_pages`

- [ ] **Step 1: Write `503.html`**

The page is fully self-contained: inline CSS, no external fonts, images or scripts, because the app is down while it is served. Use the site's dark palette from `apps/web/app/styles.css`: background `hsl(240 10% 3.9%)`, text near-white, heading in brand purple `hsl(267 90% 70%)`. It is readable on a phone (viewport meta, centered, max-width ~32rem).
- Title and heading: "Biscuits Internet Project".
- Body copy: "We're moving the database to a new home. The site will be back in a few minutes."
- Below that, render the proxy's message with `{{ .Message }}` so `kamal app maintenance --message "..."` can add a line on the day.
- No `prefers-color-scheme` handling. One palette only.

- [ ] **Step 2: Add `error_pages_path` to `config/deploy.yml`**

Add a one-line comment: "served by kamal-proxy during `kamal app maintenance`".

- [ ] **Step 3: Check the page locally**

Open the file in a browser at desktop and phone widths and screenshot both. `{{ .Message }}` shows up as literal text here, which is expected.

- [ ] **Step 4: Verify on prod after PR 1 merges and deploys**

Maintenance mode briefly takes the site down. Ask the user and pick a quiet minute. Run `mise exec ruby -- kamal app maintenance --message "Test, back in a moment"`, then `curl -s https://discobiscuits.net/ | grep -c "new home"`; expected `1`, and the test message appears. Then run `mise exec ruby -- kamal app live` and confirm `/` returns 200. If the message renders as literal `{{ .Message }}`, remove that line from the page.

- [ ] **Step 5: Commit** both files with the message "Add a maintenance page for kamal app maintenance".

---

### Task 6: Cutover runbook, docs, PR 1

**Files:**
- Create: `docs/runbooks/postgres-cutover.md`: Task 7's steps as copy-paste commands.
- Modify: `packages/core/CLAUDE.md:53`: it still says to hand-author migrations and apply them with `migrate deploy` on drift, which contradicts the "Use `make migrate`" section below it. Replace that sentence with a pointer to the section.

- [ ] **Step 1: Write the runbook**
- [ ] **Step 2: Fix the CLAUDE.md line**
- [ ] **Step 3: Commit, push, open PR 1**

The description covers the accessory fix, the backups and the runbook. Task 1's findings are summarized without naming anything exploitable. List what was driven in Tasks 2–5 and what was seen.

---

### Task 7: Cutover (scheduled, user present)

**Files:** none. Doppler changes only.

- [ ] **Step 1: Pre-flight**

Last night's backup logged exit 0, and `restore-drill.sh` passed within the past day. PR 1 is merged.

- [ ] **Step 2: Reset the target**

Ask the user, then run `prepare-database.sql` again so `bip` is empty with its extensions.

- [ ] **Step 3: Maintenance on**

Run `mise exec ruby -- kamal app maintenance --message "Started at <time> EST."`. `curl -sI https://discobiscuits.net/` returns 503 and serves the Task 5b page. `POST /api/cron/recompute-ratings` also returns 503.

- [ ] **Step 4: Dump, restore, compare**

Repeat Task 3 Steps 3–5 with the file named `cutover.dump`. Any count difference means: run `kamal app live` and stop.

- [ ] **Step 5: Switch Doppler**

Copy the current `DATABASE_URL` into a new `SUPABASE_DATABASE_URL` secret. Set `DATABASE_URL` to `postgresql://bip:<POSTGRES_PASSWORD>@bip-web-postgres:5432/bip`. Use `doppler secrets set` with the value built from `doppler secrets get POSTGRES_PASSWORD --plain` inside one shell, so nothing prints.

- [ ] **Step 6: Boot**

Run `mise exec ruby -- kamal app boot`, then `mise exec ruby -- kamal app live`. The boot log shows `migrate deploy` reporting no pending migrations.

- [ ] **Step 7: Smoke test**

- log in;
- load a show page and a song page;
- run a header search;
- post a rating, then confirm it in Hetzner: `SELECT max(updated_at) FROM ratings` matches the time you posted it.

Check Honeybadger for new errors. Any failure: run the spec's rollback.

- [ ] **Step 8: Back up**

Run the backup script once **(root)**. Expected: exit 0.

- [ ] **Step 9: Memory**

Run `free -m` and `docker stats --no-stream`. If `available` is under 500 MB, tell the user and recommend the next Hetzner size up.

- [ ] **Step 10: Clean up.** Delete `../data/cutover.dump`.

---

### Task 8: Follow-ups (PR 2, then +30 days)

**Files:**
- Modify: `Makefile` (`db-dump-prod`): replace the `pg_dump "$DATABASE_URL"` call with `ssh -i ~/.ssh/hetzner_deploy deploy@5.161.124.129 docker exec bip-web-postgres pg_dump -U bip -d bip -Fc --data-only -n public` using the same `--exclude-table-data` flags, written to `$(PROD_DATA_PATH)`.
- Modify: `ops/postgres/bip-postgres-backup.sh`: on Sundays, also dump the Supabase `auth` schema from `SUPABASE_DATABASE_URL` (read from `/etc/bip-postgres-backup.env`) into `/var/backups/bip-postgres/auth-<stamp>.dump` and R2, with the same verify, prune and upload steps.

- [ ] **Step 1: Change `db-dump-prod`**

Run `make db-dump-prod`, then `make db-restore`. Expected: the restore succeeds, and the local site shows a show from the past week.

- [ ] **Step 2: Add the auth dump, shellcheck it, (root) reinstall it, and run it once.** Expected: an `auth-*.dump` file whose `pg_restore --list` contains `TABLE DATA auth users`.

- [ ] **Step 3: Open PR 2.** Update the memory note `project_hetzner_migration.md`.

- [ ] **Step 4: At +30 days, after asking the user**

Drop the app tables from Supabase's `public` schema, then downgrade the Supabase project to the free plan (the user does this in the dashboard). Then delete `SUPABASE_DATABASE_URL` from Doppler. The auth dump keeps working because it reads its own copy of the URL in `/etc/bip-postgres-backup.env`.

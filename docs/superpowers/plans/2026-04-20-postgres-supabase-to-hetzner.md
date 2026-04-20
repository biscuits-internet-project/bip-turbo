# Postgres: Supabase → Hetzner — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Spec:** [`docs/superpowers/specs/2026-04-20-postgres-supabase-to-hetzner-design.md`](../specs/2026-04-20-postgres-supabase-to-hetzner-design.md)

**Goal:** Move the app's transactional Postgres off Supabase and onto the Hetzner VPS as a Kamal accessory, with nightly R2 backups and a one-command restore path.

**Architecture:** Two new Kamal accessories on the existing Hetzner VPS — `bip-web-postgres` (PG 18) and `bip-web-backup` (nightly `pg_dump` + upload to Cloudflare R2). Supabase Auth and Storage remain untouched. Only `public.*` moves.

**Tech Stack:** Kamal 2, Docker, PostgreSQL 18, Cloudflare R2 (S3-compatible), Doppler, `pg_dump`/`pg_restore`, `aws-cli` for R2 uploads, shell (sh/bash).

## Execution model

This plan is ops/infra, not code. Task pattern is **change → apply → verify → commit**, not TDD. Steps remain bite-sized (one action each). Every task ends in a commit (or explicit "no commit needed").

## File inventory

**New files:**
- `docker/postgres-backup/Dockerfile` — custom backup image
- `docker/postgres-backup/backup.sh` — dump + upload script
- `docker/postgres-backup/healthcheck.sh` — weekly backup freshness check
- `docker/postgres-backup/crontab` — cron schedule inside the container
- `scripts/restore-drill.sh` — one-shot drill that pulls latest R2 dump and restores to a scratch container
- `docs/runbooks/postgres-cutover.md` — exact-command runbook for the cutover window

**Modified files:**
- `config/deploy.yml` — adds `bip-web-postgres` and `bip-web-backup` accessories
- `.kamal/secrets` — fetches new secrets from Doppler

**No changes required to:**
- `packages/core/src/_shared/prisma/schema.prisma` — schema stays identical
- Any app code — only the `DATABASE_URL` secret value changes
- `supabase/config.toml` — local dev unchanged
- `docker-compose.yaml` — local dev unchanged

## Conventions used in this plan

- `$VPS = deploy@5.161.124.129` — the Hetzner host
- `$SUPABASE_DB_URL` — current Supabase `DATABASE_URL` (session pooler). Fetch from Doppler: `doppler secrets get DATABASE_URL --plain -p bip -c prd_hetzner`
- `$NEW_DB_URL = postgres://bip:<POSTGRES_PASSWORD>@bip-web-postgres:5432/bip`
- All `kamal` commands run from the repo root as `mise exec ruby -- kamal <...>`
- Assume the working tree is clean before starting; commit after every task

---

## Phase 1: Prep (no user impact)

### Task 1: Provision Cloudflare R2 bucket and API token

**Files:** None (external — Cloudflare dashboard).

- [ ] **Step 1: Create the R2 bucket**

In the Cloudflare dashboard → R2 → Create bucket:
- Name: `bip-postgres-backups`
- Location: Automatic
- Default storage class: Standard

- [ ] **Step 2: Add a 14-day object expiration lifecycle rule**

Bucket → Settings → Object lifecycle rules → Add rule:
- Rule name: `expire-14d`
- Apply to: All objects
- Action: Delete objects 14 days after creation

- [ ] **Step 3: Create a bucket-scoped API token**

R2 → Manage R2 API tokens → Create API token:
- Token name: `bip-postgres-backups-rw`
- Permissions: Object Read & Write
- Specify bucket: `bip-postgres-backups`

Capture the Access Key ID, Secret Access Key, and the S3 endpoint URL (of the form `https://<account-id>.r2.cloudflarestorage.com`).

- [ ] **Step 4: Verify from laptop with aws-cli**

```bash
AWS_ACCESS_KEY_ID="<key>" \
AWS_SECRET_ACCESS_KEY="<secret>" \
aws s3 ls s3://bip-postgres-backups/ \
  --endpoint-url https://<account-id>.r2.cloudflarestorage.com
```

Expected: empty output, exit code 0.

- [ ] **Step 5: No commit** (nothing changed in the repo).

---

### Task 2: Add new secrets to Doppler

**Files:** None in repo — Doppler console only.

- [ ] **Step 1: Generate a Postgres password**

```bash
openssl rand -base64 32 | tr -d '/+=' | head -c 32
```

- [ ] **Step 2: Add secrets to Doppler `bip/prd_hetzner`**

Via dashboard or CLI (`doppler secrets set NAME=value -p bip -c prd_hetzner`). Add:

- `POSTGRES_PASSWORD` — from Step 1
- `R2_BACKUP_ACCESS_KEY_ID` — from Task 1 Step 3
- `R2_BACKUP_SECRET_ACCESS_KEY` — from Task 1 Step 3
- `R2_BACKUP_BUCKET` — `bip-postgres-backups`
- `R2_BACKUP_ENDPOINT` — `https://<account-id>.r2.cloudflarestorage.com`

**Do not yet update `DATABASE_URL`.** That happens during cutover (Task 12).

- [ ] **Step 3: Verify from laptop**

```bash
doppler secrets get POSTGRES_PASSWORD R2_BACKUP_BUCKET --plain -p bip -c prd_hetzner
```

Expected: the values you set.

- [ ] **Step 4: No commit** (Doppler changes only).

---

### Task 3: Add Postgres accessory to Kamal config

**Files:**
- Modify: `config/deploy.yml`
- Modify: `.kamal/secrets`

- [ ] **Step 1: Add `postgres` accessory to `config/deploy.yml`**

In the `accessories:` block (after the existing `redis:` entry), add:

```yaml
  postgres:
    image: postgres:18-alpine
    host: 5.161.124.129
    port: "127.0.0.1:5432:5432"
    env:
      clear:
        POSTGRES_USER: bip
        POSTGRES_DB: bip
      secret:
        - POSTGRES_PASSWORD
    directories:
      - bip-web-postgres-data:/var/lib/postgresql/data
    options:
      shm-size: 256m
```

The `127.0.0.1:5432:5432` binding publishes the port only on localhost of the VPS (SSH-tunnel access for ops, not public internet).

- [ ] **Step 2: Extend `.kamal/secrets` to fetch `POSTGRES_PASSWORD`**

Add `POSTGRES_PASSWORD` to the secret list on line 1 and add an extract line:

```bash
POSTGRES_PASSWORD=$(kamal secrets extract POSTGRES_PASSWORD $SECRETS)
```

- [ ] **Step 3: Boot the Postgres accessory**

```bash
mise exec ruby -- kamal accessory boot postgres
```

Expected: Kamal pulls `postgres:18-alpine`, starts the container, logs show `database system is ready to accept connections`.

- [ ] **Step 4: Verify it's running**

```bash
ssh $VPS "docker ps --filter name=bip-web-postgres --format '{{.Names}} {{.Status}}'"
```

Expected: `bip-web-postgres Up <time>`.

- [ ] **Step 5: Verify psql connects from inside the container**

```bash
ssh $VPS "docker exec bip-web-postgres psql -U bip -d bip -c 'SELECT version();'"
```

Expected: a PG 18 version string.

- [ ] **Step 6: Commit**

```bash
git add config/deploy.yml .kamal/secrets
git commit -m "Add Postgres 18 Kamal accessory on Hetzner"
```

---

### Task 4: Verify the `bip` role and database are usable

The official `postgres` image auto-creates the role + DB from `POSTGRES_USER` / `POSTGRES_DB` / `POSTGRES_PASSWORD` on first boot. This task confirms that and nothing else.

**Files:** None.

- [ ] **Step 1: Confirm role exists with expected privileges**

```bash
ssh $VPS "docker exec bip-web-postgres psql -U bip -d bip -c '\du bip'"
```

Expected: a row for `bip` with `Create DB` among its attributes (from the image default).

- [ ] **Step 2: Confirm the `bip` DB is empty and uses `public` schema**

```bash
ssh $VPS "docker exec bip-web-postgres psql -U bip -d bip -c '\dt public.*'"
```

Expected: `Did not find any relations.`

- [ ] **Step 3: Confirm the web container can reach the Postgres container by hostname**

```bash
ssh $VPS "docker exec bip-web psql postgres://bip:\$POSTGRES_PASSWORD@bip-web-postgres:5432/bip -c 'SELECT 1;'"
```

If the web container doesn't have `psql`, use `bip-web-redis` container with a busybox shell and a TCP check instead:

```bash
ssh $VPS "docker exec bip-web-redis sh -c 'nc -zv bip-web-postgres 5432'"
```

Expected: `open` / `succeeded`.

- [ ] **Step 4: No commit** (verification only).

---

### Task 5: Dry-run migration (dump Supabase → restore Hetzner)

Point: before building the backup pipeline, prove the dump/restore path works end-to-end against the new DB while the app is still happily pointing at Supabase.

**Files:** None.

- [ ] **Step 1: Fetch the Supabase DB URL from Doppler**

```bash
export SUPABASE_DB_URL="$(doppler secrets get DATABASE_URL --plain -p bip -c prd_hetzner)"
```

- [ ] **Step 2: Dump Supabase to a local file using a PG 18 client in Docker**

```bash
docker run --rm \
  -e SUPABASE_DB_URL \
  -v "$(pwd):/out" \
  postgres:18-alpine \
  sh -c 'pg_dump --format=custom --no-owner --no-acl --schema=public \
         "$SUPABASE_DB_URL" > /out/supabase-dryrun.dump'
```

Expected: file `supabase-dryrun.dump` (~50–150 MB compressed) appears in the repo root. Do **not** commit it; it contains user data.

- [ ] **Step 3: Copy the dump to the VPS**

```bash
scp supabase-dryrun.dump $VPS:/tmp/
```

- [ ] **Step 4: Restore into the Hetzner Postgres**

```bash
ssh $VPS "docker exec -i bip-web-postgres pg_restore \
  --no-owner --no-acl -U bip -d bip --verbose < /tmp/supabase-dryrun.dump"
```

Expected: `pg_restore` completes with errors acceptable only for Supabase-specific roles/extensions (e.g., `role \"supabase_admin\" does not exist`) — those are silenced by `--no-owner --no-acl` for ownership lines but you may still see NOTICEs. Actual data rows must restore cleanly.

- [ ] **Step 5: Row-count verification against Supabase**

Run against both sides and compare:

```bash
# Against Supabase
docker run --rm -e SUPABASE_DB_URL postgres:18-alpine \
  psql "$SUPABASE_DB_URL" -At -c "
    SELECT table_name, (xpath('/row/c/text()',
      query_to_xml(format('SELECT count(*) c FROM %I', table_name), true, true, '')))[1]::text
    FROM information_schema.tables
    WHERE table_schema='public' ORDER BY table_name;" > /tmp/supabase-counts.txt

# Against Hetzner
ssh $VPS "docker exec bip-web-postgres psql -U bip -d bip -At -c \"
    SELECT table_name, (xpath('/row/c/text()',
      query_to_xml(format('SELECT count(*) c FROM %I', table_name), true, true, '')))[1]::text
    FROM information_schema.tables
    WHERE table_schema='public' ORDER BY table_name;\"" > /tmp/hetzner-counts.txt

diff /tmp/supabase-counts.txt /tmp/hetzner-counts.txt
```

Expected: `diff` exits 0 (no differences).

- [ ] **Step 6: Spot-check a few tables visually**

```bash
ssh $VPS "docker exec bip-web-postgres psql -U bip -d bip -c '
  SELECT COUNT(*) AS users FROM users;
  SELECT COUNT(*) AS shows FROM shows;
  SELECT COUNT(*) AS tracks FROM tracks;
  SELECT COUNT(*) AS ratings FROM ratings;
  SELECT MAX(updated_at) AS latest_rating FROM ratings;'"
```

Record these numbers. They're the target for the real cutover.

- [ ] **Step 7: Clean up the dump file**

```bash
rm supabase-dryrun.dump
ssh $VPS "rm /tmp/supabase-dryrun.dump"
```

- [ ] **Step 8: Leave the dry-run data in the Hetzner DB for now**

It'll be used by Task 7 to test the backup job. It will be truncated in Task 11 before the real cutover.

- [ ] **Step 9: No commit** (ops-only; artifacts deleted).

---

### Task 6: Build the postgres-backup Docker image

**Files:**
- Create: `docker/postgres-backup/Dockerfile`
- Create: `docker/postgres-backup/backup.sh`
- Create: `docker/postgres-backup/healthcheck.sh`
- Create: `docker/postgres-backup/crontab`

- [ ] **Step 1: Write the Dockerfile**

`docker/postgres-backup/Dockerfile`:

```dockerfile
FROM postgres:18-alpine

RUN apk add --no-cache aws-cli

COPY backup.sh /usr/local/bin/backup.sh
COPY healthcheck.sh /usr/local/bin/healthcheck.sh
COPY crontab /etc/crontabs/root

RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/healthcheck.sh \
    && mkdir -p /var/log && touch /var/log/backup.log /var/log/healthcheck.log

CMD ["sh", "-c", "printenv | grep -E '^(DATABASE_URL_BACKUP|R2_)' > /etc/backup.env && crond -f -l 2"]
```

- [ ] **Step 2: Write `backup.sh`**

`docker/postgres-backup/backup.sh`:

```bash
#!/bin/sh
set -eu

. /etc/backup.env

TIMESTAMP=$(date -u +%Y%m%d%H%M)
YEAR_PATH=$(date -u +%Y/%m/%d)
DUMP_FILE="/tmp/bip-${TIMESTAMP}.dump"

echo "[$(date -u)] backup starting" >&2

pg_dump --format=custom --no-owner --no-acl --schema=public \
  "$DATABASE_URL_BACKUP" > "$DUMP_FILE"

SIZE=$(stat -c%s "$DUMP_FILE")
echo "[$(date -u)] dump complete ($SIZE bytes)" >&2

AWS_ACCESS_KEY_ID="$R2_BACKUP_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_BACKUP_SECRET_ACCESS_KEY" \
aws s3 cp "$DUMP_FILE" \
  "s3://${R2_BACKUP_BUCKET}/${YEAR_PATH}/bip-${TIMESTAMP}.dump" \
  --endpoint-url "$R2_BACKUP_ENDPOINT"

rm -f "$DUMP_FILE"
echo "[$(date -u)] backup complete" >&2
```

- [ ] **Step 3: Write `healthcheck.sh`**

`docker/postgres-backup/healthcheck.sh`:

```bash
#!/bin/sh
set -eu

. /etc/backup.env

LATEST=$(AWS_ACCESS_KEY_ID="$R2_BACKUP_ACCESS_KEY_ID" \
  AWS_SECRET_ACCESS_KEY="$R2_BACKUP_SECRET_ACCESS_KEY" \
  aws s3api list-objects-v2 \
    --bucket "$R2_BACKUP_BUCKET" \
    --endpoint-url "$R2_BACKUP_ENDPOINT" \
    --query 'sort_by(Contents, &LastModified)[-1].LastModified' \
    --output text)

if [ -z "$LATEST" ] || [ "$LATEST" = "None" ]; then
  echo "[$(date -u)] HEALTHCHECK FAIL: bucket is empty" >&2
  exit 1
fi

LATEST_EPOCH=$(date -d "$LATEST" +%s)
NOW_EPOCH=$(date -u +%s)
AGE_HOURS=$(( (NOW_EPOCH - LATEST_EPOCH) / 3600 ))

echo "[$(date -u)] latest backup is ${AGE_HOURS}h old (${LATEST})" >&2

if [ "$AGE_HOURS" -gt 36 ]; then
  echo "[$(date -u)] HEALTHCHECK FAIL: latest backup older than 36h" >&2
  exit 1
fi

echo "[$(date -u)] HEALTHCHECK OK" >&2
```

- [ ] **Step 4: Write the crontab**

`docker/postgres-backup/crontab`:

```
15 4 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1
30 5 * * 1 /usr/local/bin/healthcheck.sh >> /var/log/healthcheck.log 2>&1
```

Daily backup at 04:15 UTC. Weekly healthcheck Monday 05:30 UTC.

- [ ] **Step 5: Build the image locally**

```bash
cd docker/postgres-backup
docker build --platform=linux/amd64 -t doncote/bip-web-backup:latest .
cd ../..
```

Expected: image builds cleanly.

- [ ] **Step 6: Push to Docker Hub**

```bash
docker push doncote/bip-web-backup:latest
```

- [ ] **Step 7: Commit**

```bash
git add docker/postgres-backup/
git commit -m "Add postgres-backup Docker image for nightly R2 uploads"
```

---

### Task 7: Add backup accessory to Kamal config and verify

**Files:**
- Modify: `config/deploy.yml`
- Modify: `.kamal/secrets`

- [ ] **Step 1: Add `backup` accessory to `config/deploy.yml`**

After the `postgres:` accessory, add:

```yaml
  backup:
    image: doncote/bip-web-backup:latest
    host: 5.161.124.129
    env:
      secret:
        - DATABASE_URL_BACKUP
        - R2_BACKUP_ACCESS_KEY_ID
        - R2_BACKUP_SECRET_ACCESS_KEY
        - R2_BACKUP_BUCKET
        - R2_BACKUP_ENDPOINT
```

**Why `DATABASE_URL_BACKUP` (not `DATABASE_URL`):** during Phase 1 the app's `DATABASE_URL` still points at Supabase. The backup accessory must target the new Hetzner Postgres from the start, so it gets its own, independently-scoped env var. The backup scripts from Task 6 already read `$DATABASE_URL_BACKUP`.

- [ ] **Step 2: Extend `.kamal/secrets` to fetch the new secrets and derive `DATABASE_URL_BACKUP`**

Add to the secret fetch list on line 1: `R2_BACKUP_ACCESS_KEY_ID R2_BACKUP_SECRET_ACCESS_KEY R2_BACKUP_BUCKET R2_BACKUP_ENDPOINT` (`POSTGRES_PASSWORD` was added in Task 3).

Then append these lines:

```bash
R2_BACKUP_ACCESS_KEY_ID=$(kamal secrets extract R2_BACKUP_ACCESS_KEY_ID $SECRETS)
R2_BACKUP_SECRET_ACCESS_KEY=$(kamal secrets extract R2_BACKUP_SECRET_ACCESS_KEY $SECRETS)
R2_BACKUP_BUCKET=$(kamal secrets extract R2_BACKUP_BUCKET $SECRETS)
R2_BACKUP_ENDPOINT=$(kamal secrets extract R2_BACKUP_ENDPOINT $SECRETS)
DATABASE_URL_BACKUP="postgres://bip:${POSTGRES_PASSWORD}@bip-web-postgres:5432/bip"
```

- [ ] **Step 3: Boot the backup accessory**

```bash
mise exec ruby -- kamal accessory boot backup
```

Expected: container running, `crond` idle.

- [ ] **Step 4: Trigger a manual backup run**

```bash
ssh $VPS "docker exec bip-web-backup /usr/local/bin/backup.sh"
```

Expected:
- "backup starting" / "dump complete" / "backup complete" lines on stderr
- Exit code 0

- [ ] **Step 5: Verify the object landed in R2**

```bash
AWS_ACCESS_KEY_ID="$(doppler secrets get R2_BACKUP_ACCESS_KEY_ID --plain -p bip -c prd_hetzner)" \
AWS_SECRET_ACCESS_KEY="$(doppler secrets get R2_BACKUP_SECRET_ACCESS_KEY --plain -p bip -c prd_hetzner)" \
aws s3 ls s3://bip-postgres-backups/ --recursive \
  --endpoint-url "$(doppler secrets get R2_BACKUP_ENDPOINT --plain -p bip -c prd_hetzner)"
```

Expected: one object under `YYYY/MM/DD/bip-YYYYMMDDHHMM.dump` sized ~50–150 MB.

- [ ] **Step 6: Trigger the healthcheck manually to sanity-check it**

```bash
ssh $VPS "docker exec bip-web-backup /usr/local/bin/healthcheck.sh"
```

Expected: `HEALTHCHECK OK` with the age of the backup just created.

- [ ] **Step 7: Commit**

```bash
git add config/deploy.yml .kamal/secrets
git commit -m "Add backup accessory for nightly R2 dumps"
```

---

### Task 8: Write and execute the restore drill

**Files:**
- Create: `scripts/restore-drill.sh`

- [ ] **Step 1: Write `scripts/restore-drill.sh`**

```bash
#!/usr/bin/env bash
# Pulls the most recent R2 backup and restores it into a scratch
# Postgres container. Compares row counts against the live Hetzner DB.
# Requires: doppler CLI, docker, aws-cli.

set -euo pipefail

SCRATCH_NAME="bip-restore-drill-$$"
TMP_DUMP="$(mktemp -t bip-drill.XXXXXX.dump)"
trap 'docker rm -f "$SCRATCH_NAME" >/dev/null 2>&1 || true; rm -f "$TMP_DUMP"' EXIT

echo "==> fetching R2 credentials from Doppler"
export AWS_ACCESS_KEY_ID="$(doppler secrets get R2_BACKUP_ACCESS_KEY_ID --plain -p bip -c prd_hetzner)"
export AWS_SECRET_ACCESS_KEY="$(doppler secrets get R2_BACKUP_SECRET_ACCESS_KEY --plain -p bip -c prd_hetzner)"
R2_BUCKET="$(doppler secrets get R2_BACKUP_BUCKET --plain -p bip -c prd_hetzner)"
R2_ENDPOINT="$(doppler secrets get R2_BACKUP_ENDPOINT --plain -p bip -c prd_hetzner)"

echo "==> finding latest backup"
LATEST_KEY=$(aws s3api list-objects-v2 \
  --bucket "$R2_BUCKET" \
  --endpoint-url "$R2_ENDPOINT" \
  --query 'sort_by(Contents, &LastModified)[-1].Key' \
  --output text)
echo "    latest: $LATEST_KEY"

echo "==> downloading to $TMP_DUMP"
aws s3 cp "s3://$R2_BUCKET/$LATEST_KEY" "$TMP_DUMP" \
  --endpoint-url "$R2_ENDPOINT"

echo "==> starting scratch Postgres 18 container"
docker run --rm -d \
  --name "$SCRATCH_NAME" \
  -e POSTGRES_PASSWORD=scratch \
  -e POSTGRES_USER=bip \
  -e POSTGRES_DB=bip \
  postgres:18-alpine >/dev/null

echo "==> waiting for scratch Postgres to accept connections"
for _ in $(seq 1 30); do
  if docker exec "$SCRATCH_NAME" pg_isready -U bip >/dev/null 2>&1; then break; fi
  sleep 1
done

echo "==> restoring dump"
docker exec -i "$SCRATCH_NAME" pg_restore \
  --no-owner --no-acl -U bip -d bip < "$TMP_DUMP"

echo "==> row counts (scratch DB)"
docker exec "$SCRATCH_NAME" psql -U bip -d bip -c "
  SELECT 'users'::text, COUNT(*) FROM users UNION ALL
  SELECT 'shows', COUNT(*) FROM shows UNION ALL
  SELECT 'tracks', COUNT(*) FROM tracks UNION ALL
  SELECT 'ratings', COUNT(*) FROM ratings UNION ALL
  SELECT 'attendances', COUNT(*) FROM attendances;"

echo "==> restore drill passed"
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x scripts/restore-drill.sh
```

- [ ] **Step 3: Run the drill**

```bash
./scripts/restore-drill.sh
```

Expected: Downloads the latest backup, restores into a scratch container, prints row counts that match what you recorded in Task 5 Step 6, cleans up the container.

- [ ] **Step 4: Commit**

```bash
git add scripts/restore-drill.sh
git commit -m "Add restore-drill script for quarterly backup verification"
```

---

### Task 9: Write the cutover runbook

**Files:**
- Create: `docs/runbooks/postgres-cutover.md`

- [ ] **Step 1: Write the runbook**

```markdown
# Runbook: Postgres cutover from Supabase to Hetzner

Source of truth for the actual cutover window. Update after each rehearsal.

## Pre-flight (day before)

- [ ] Re-run the restore drill: `./scripts/restore-drill.sh` — passes
- [ ] Confirm backup accessory is healthy: `ssh deploy@5.161.124.129 "docker exec bip-web-backup /usr/local/bin/healthcheck.sh"` — `HEALTHCHECK OK`
- [ ] Confirm the dry-run data has been truncated from the Hetzner DB (Task 11 of implementation plan):
      `ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c 'SELECT COUNT(*) FROM users;'"` — returns 0
- [ ] Announce the maintenance window if you're doing one

## Cutover

1. **(Optional) Enable maintenance page**. If you have one; otherwise accept a brief 502 window.

2. **Fetch secrets**:
   ```bash
   export SUPABASE_DB_URL="$(doppler secrets get DATABASE_URL --plain -p bip -c prd_hetzner)"
   export PG_PW="$(doppler secrets get POSTGRES_PASSWORD --plain -p bip -c prd_hetzner)"
   ```

3. **Dump Supabase**:
   ```bash
   docker run --rm -e SUPABASE_DB_URL -v "$(pwd):/out" postgres:18-alpine \
     sh -c 'pg_dump --format=custom --no-owner --no-acl --schema=public \
            "$SUPABASE_DB_URL" > /out/cutover.dump'
   ```

4. **Ship to VPS and restore**:
   ```bash
   scp cutover.dump deploy@5.161.124.129:/tmp/
   ssh deploy@5.161.124.129 "docker exec -i bip-web-postgres pg_restore \
     --no-owner --no-acl -U bip -d bip --verbose < /tmp/cutover.dump"
   ```

5. **Verify row counts match Supabase**. Save Supabase counts first, then Hetzner:
   ```bash
   # Supabase
   docker run --rm -e SUPABASE_DB_URL postgres:18-alpine \
     psql "$SUPABASE_DB_URL" -At -c "
       SELECT table_name, (xpath('/row/c/text()',
         query_to_xml(format('SELECT count(*) c FROM %I', table_name), true, true, '')))[1]::text
       FROM information_schema.tables
       WHERE table_schema='public' ORDER BY table_name;" > /tmp/supabase-counts.txt

   # Hetzner
   ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -At -c \"
       SELECT table_name, (xpath('/row/c/text()',
         query_to_xml(format('SELECT count(*) c FROM %I', table_name), true, true, '')))[1]::text
       FROM information_schema.tables
       WHERE table_schema='public' ORDER BY table_name;\"" > /tmp/hetzner-counts.txt

   diff /tmp/supabase-counts.txt /tmp/hetzner-counts.txt
   ```
   Expected: `diff` exits 0.

6. **Check sequence on `audits`**:
   ```bash
   ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c '
     SELECT MAX(id) AS max_id FROM audits;
     SELECT last_value FROM audits_id_seq;'"
   ```
   If `last_value < max_id`, bump it:
   ```bash
   ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c \
     \"SELECT setval('audits_id_seq', (SELECT MAX(id) FROM audits));\""
   ```

7. **Update `DATABASE_URL` in Doppler** to the Hetzner value:
   ```bash
   doppler secrets set \
     DATABASE_URL="postgres://bip:${PG_PW}@bip-web-postgres:5432/bip" \
     -p bip -c prd_hetzner
   ```

8. **Push new env and restart app**:
   ```bash
   mise exec ruby -- kamal env push
   mise exec ruby -- kamal app restart
   ```

9. **Smoke test** (browser + a few CLI checks):
   - Log in at https://discobiscuits.net/auth/login (exercises Supabase Auth + Hetzner `public.users` read)
   - Load any song page
   - Load "On This Day"
   - Load an all-timers tab on a song page
   - Post a rating from your account
   - Confirm the rating lands in Hetzner:
     ```bash
     ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c \
       'SELECT user_id, track_id, value, updated_at FROM ratings ORDER BY updated_at DESC LIMIT 3;'"
     ```

10. **Clean up local dump**:
    ```bash
    rm cutover.dump
    ssh deploy@5.161.124.129 "rm /tmp/cutover.dump"
    ```

11. **Remove maintenance page** (if used).

## Rollback

If smoke tests fail:

1. Revert `DATABASE_URL` in Doppler back to the Supabase session pooler URL.
2. `mise exec ruby -- kamal env push && mise exec ruby -- kamal app restart`.
3. Investigate offline. Supabase still has the authoritative data because the app never took writes against Hetzner between steps 1 (maintenance) and 9 (smoke test) — worst case, any writes made during smoke test land in Hetzner and are lost on rollback; acceptable.

## Post-cutover (within 24–48h)

- Monitor Honeybadger for any DB-adjacent errors.
- Watch `docker logs bip-web` for connection issues.
- Trigger an on-demand backup from the new DB to prove the pipeline works against production data:
  ```bash
  ssh deploy@5.161.124.129 "docker exec bip-web-backup /usr/local/bin/backup.sh"
  ```

## Post-cutover (+30 days)

- Confirm no reasons to roll back have materialized.
- Pause the Supabase Postgres project (but do **not** delete — Supabase Auth + Storage still need the project).
- Close this migration.
```

- [ ] **Step 2: Commit**

```bash
git add docs/runbooks/postgres-cutover.md
git commit -m "Add Postgres cutover runbook"
```

---

### Task 10: Rehearse the cutover

Dry-run the cutover runbook against a scratch DB to make sure every command in it actually works verbatim. This catches typos in the runbook before the real event.

**Files:** None.

- [ ] **Step 1: Spin up a scratch Postgres container on your laptop**

```bash
docker run --rm -d --name bip-rehearsal \
  -e POSTGRES_USER=bip -e POSTGRES_PASSWORD=rehearsal -e POSTGRES_DB=bip \
  -p 55432:5432 postgres:18-alpine
```

- [ ] **Step 2: Walk the runbook against scratch**

Execute steps 2–6 and step 9's verification SQL, substituting `bip-web-postgres` with `localhost:55432` and local credentials. Goal: every command in the runbook works as written.

- [ ] **Step 3: Fix any typos or broken commands in the runbook**

If any commands fail for reasons other than "it's a scratch not the VPS," fix `docs/runbooks/postgres-cutover.md` and commit:

```bash
git add docs/runbooks/postgres-cutover.md
git commit -m "Fix cutover runbook issues found in rehearsal"
```

- [ ] **Step 4: Tear down scratch**

```bash
docker rm -f bip-rehearsal
```

---

## Phase 2: Cutover (scheduled event)

> These tasks must be executed sequentially, in one sitting, during the chosen maintenance window. Do not start Task 11 without intending to follow through Task 13 within ~1 hour.

### Task 11: Truncate the dry-run data from Hetzner

**Files:** None.

- [ ] **Step 1: Truncate all `public` tables on Hetzner DB**

Inside the Postgres container:

```bash
ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c \"
  DO \\\$\\\$
  DECLARE r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname='public') LOOP
      EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
  END\\\$\\\$;\""
```

- [ ] **Step 2: Verify empty**

```bash
ssh deploy@5.161.124.129 "docker exec bip-web-postgres psql -U bip -d bip -c \
  'SELECT COUNT(*) FROM users;'"
```

Expected: `0`.

- [ ] **Step 3: No commit** (ops only).

---

### Task 12: Execute the cutover

**Files:** None in repo. Doppler value for `DATABASE_URL` changes.

- [ ] **Step 1: Execute every step in `docs/runbooks/postgres-cutover.md` → "Cutover" section**

Check each step off as you go in the runbook. Do not skip verification (step 5).

- [ ] **Step 2: If smoke tests fail → execute Rollback section**

Then stop this plan, investigate, reschedule.

- [ ] **Step 3: If smoke tests pass → continue to Task 13**

- [ ] **Step 4: No commit** (runbook already committed; Doppler change is not in repo).

---

### Task 13: Post-cutover monitoring and housekeeping

**Files:** None.

- [ ] **Step 1: Trigger an on-demand backup against production data**

```bash
ssh deploy@5.161.124.129 "docker exec bip-web-backup /usr/local/bin/backup.sh"
```

Expected: exits 0; new object appears in R2 with today's date.

- [ ] **Step 2: Set a calendar reminder for +30 days**

Title: "bip-turbo: pause Supabase Postgres (cutover retention window complete)"

- [ ] **Step 3: Watch Honeybadger for 24–48h**

No dashboard command needed — just observe. Any DB-related error class spike → act on it. Rollback is still available until the Supabase DB is paused.

- [ ] **Step 4: After ~30 days, pause Supabase Postgres**

In the Supabase dashboard → Project Settings → Pause project. Do **not** delete the project — Supabase Auth + Storage live in it.

- [ ] **Step 5: Close out**

Update the "Hetzner migration" project memory note to reflect that DB now lives on Hetzner and the `DATABASE_URL` note about session pooler is obsolete.

---

## Completion criteria

- [ ] Postgres 18 running as `bip-web-postgres` accessory, persisted to `bip-web-postgres-data` volume
- [ ] Nightly backups landing in `s3://bip-postgres-backups/YYYY/MM/DD/`, expired after 14 days
- [ ] Weekly healthcheck passing
- [ ] `scripts/restore-drill.sh` exists and passes end-to-end
- [ ] `docs/runbooks/postgres-cutover.md` walks through cutover with exact commands
- [ ] `DATABASE_URL` in Doppler points at Hetzner
- [ ] App is up and functioning normally against Hetzner DB
- [ ] Supabase Postgres paused (at +30 days); Supabase Auth + Storage untouched

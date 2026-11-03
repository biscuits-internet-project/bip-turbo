# Runbook: Postgres cutover from Supabase to Hetzner

The site is down for about 5 minutes. The dry run on 2026-11-03 took 11 s to dump and 4 s to restore 18 MB. Run every command from the repo root. Background is in `ops/postgres/README.md` and the design in `docs/superpowers/specs/2026-04-20-postgres-supabase-to-hetzner-design.md`.

```bash
h() { ssh -i ~/.ssh/hetzner_deploy deploy@5.161.124.129 "$@"; }
```

## Pre-flight

- [ ] Last night's backup succeeded: `h tail -3 backups/bip-postgres-backup.log` ends with no `ERROR`, and the Honeybadger check-in is green.
- [ ] Run the restore drill within the past day: `h bin/bip-postgres-restore-drill.sh` prints `PASS: row counts match`.
- [ ] Commit `config/error_pages/503.html` on `main` and deploy, so the maintenance page is on the host.
- [ ] Pick a quiet hour that isn't the top of the hour (the ratings cron runs at :00).

## Cutover

0. **Pause auto-deploys.** A merge to `main` during the window would boot a new container against Supabase.
   ```bash
   gh workflow disable deploy.yml
   ```

1. **Reset the target.** This **drops** the dry-run copy and recreates it empty with the extensions.
   ```bash
   h 'docker exec -i bip-web-postgres psql -U bip -d postgres -v ON_ERROR_STOP=1' < ops/postgres/prepare-database.sql
   ```

2. **Maintenance on.**
   ```bash
   mise exec ruby -- kamal app maintenance --message "Started at $(TZ=America/New_York date '+%-I:%M %p %Z')."
   curl -s -o /dev/null -w '%{http_code}\n' "https://discobiscuits.net/?mx=$RANDOM"   # 503
   curl -s "https://discobiscuits.net/?mx=$RANDOM" | grep -c "new home"                # 1
   curl -s -o /dev/null -w '%{http_code}\n' -X POST https://discobiscuits.net/api/cron/recompute-ratings   # 503
   sleep 30   # let requests already in flight finish (proxy response_timeout is 30s)
   ```

3. **Dump Supabase** with a PG 18 client:
   ```bash
   D=$(cd ../data && pwd)
   doppler run -p bip -c prd_hetzner -- sh -c 'docker run --rm -e DATABASE_URL -v "'"$D"':/out" pgvector/pgvector:pg18 \
     sh -c "pg_dump -Fc -n public --no-owner --no-acl -f /out/cutover.dump \"\$DATABASE_URL\""'
   ```

4. **Restore.** The only acceptable error is `schema "public" already exists`.
   ```bash
   h 'docker exec -i bip-web-postgres pg_restore --no-owner --no-acl -U bip -d bip' < ../data/cutover.dump 2> ../data/cutover-restore.log
   grep '^pg_restore: error' ../data/cutover-restore.log
   ```

5. **Compare row counts.** The `diff` must print nothing.
   ```bash
   doppler run -p bip -c prd_hetzner -- sh -c 'docker run --rm -i -e DATABASE_URL pgvector/pgvector:pg18 sh -c "psql \"\$DATABASE_URL\" -At -v ON_ERROR_STOP=1"' \
     < ops/postgres/table-counts.sql > /tmp/counts-supabase.txt
   h 'docker exec -i bip-web-postgres psql -U bip -d bip -At -v ON_ERROR_STOP=1' < ops/postgres/table-counts.sql > /tmp/counts-hetzner.txt
   diff /tmp/counts-supabase.txt /tmp/counts-hetzner.txt && echo MATCH
   ```
   If anything differs: `mise exec ruby -- kamal app live`, stop, and investigate. Supabase is still live and nothing has switched.

6. **Switch Doppler.** Keep the Supabase URL for rollback and build the new one. `secrets set` echoes values, so its output goes to `/dev/null`. The rollback copy is written only if `DATABASE_URL` still points at Supabase, so re-running this step after a failed boot can't overwrite it with the Hetzner URL. The password is URL-safe (checked 2026-11-03), so it needs no encoding.
   ```bash
   doppler run -p bip -c prd_hetzner --only-secrets DATABASE_URL,POSTGRES_PASSWORD -- sh -c '
     case "$DATABASE_URL" in
       *supabase*) doppler secrets set -p bip -c prd_hetzner SUPABASE_DATABASE_URL="$DATABASE_URL" > /dev/null ;;
       *) echo "DATABASE_URL already switched; keeping the existing SUPABASE_DATABASE_URL" ;;
     esac &&
     doppler secrets set -p bip -c prd_hetzner DATABASE_URL="postgresql://bip:${POSTGRES_PASSWORD}@bip-web-postgres:5432/bip" > /dev/null'
   doppler secrets get DATABASE_URL -p bip -c prd_hetzner --plain | sed -E 's#//[^@]*@#//<creds>@#'   # ...@bip-web-postgres:5432/bip
   ```

7. **Boot on the new database**, then go live.
   ```bash
   mise exec ruby -- kamal app boot      # log shows "No pending migrations to apply"
   mise exec ruby -- kamal app live
   gh workflow enable deploy.yml
   ```

8. **Smoke test:**
   - log in at https://discobiscuits.net/auth/login;
   - load a show page and a song page;
   - search from the header;
   - rate a show, then confirm the new row landed on Hetzner:
     ```bash
     h "docker exec bip-web-postgres psql -U bip -d bip -Atc 'SELECT max(updated_at) FROM ratings'"   # UTC, no zone
     ```
   - Honeybadger shows no new errors.

9. **Back up right away:** `h bin/bip-postgres-backup.sh`. Expected: exit 0.

10. **Memory:** run `h 'free -m; docker stats --no-stream'`. If `available` is under 500 MB, plan a resize to the next Hetzner size up.

11. **Clean up:** `rm ../data/cutover.dump ../data/cutover-restore.log /tmp/counts-*.txt`.

## Rollback

```bash
mise exec ruby -- kamal app maintenance --message "Rolling back."
doppler run -p bip -c prd_hetzner --only-secrets SUPABASE_DATABASE_URL -- sh -c '
  case "$SUPABASE_DATABASE_URL" in
    *supabase*) doppler secrets set -p bip -c prd_hetzner DATABASE_URL="$SUPABASE_DATABASE_URL" > /dev/null && echo switched ;;
    *) echo "SUPABASE_DATABASE_URL does not point at Supabase; restore it from Doppler version history first" ;;
  esac'
mise exec ruby -- kamal app boot
mise exec ruby -- kamal app live
gh workflow enable deploy.yml
```

**Writes made on Hetzner after step 7 are dropped.** Supabase still holds the data as it was at step 3. In the first hour that usually means a few ratings and attendances, which is acceptable. Later than that, don't use this block as written: keep maintenance on and work out a merge first. A plain data-only dump from Hetzner can't be restored over Supabase, because every existing row's primary key would collide.

## Afterwards

- Change `make db-dump-prod` to dump over SSH. After step 6, `DATABASE_URL` names a host only the Docker network can resolve.
- At +30 days with no rollback: add the weekly Supabase `auth` dump to the backup script, drop the app tables from Supabase `public`, downgrade Supabase to the free plan, then delete `SUPABASE_DATABASE_URL` from Doppler.

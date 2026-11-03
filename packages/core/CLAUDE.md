# Core Package (`packages/core/`)

## Architecture

- **Repository Pattern**: Each domain has a repository (e.g., `show-repository.ts`) and service (e.g., `show-service.ts`)
- **Database**: Prisma client with PostgreSQL, schema at `src/_shared/prisma/schema.prisma`
- **Services**: Business logic layer that uses repositories
- **Container**: Dependency injection container at `src/_shared/container.ts`

## Database Access Rules

- Always use the repository pattern — don't access Prisma client directly in services
- Database queries are centralized in repository classes
- Use the dependency injection container for service instantiation

## Rating aggregates MUST dedupe (one human, one vote)

Some users rated under several accounts (case/space username variants, re-registrations after the
rewrite). Any *shared* aggregate over the `ratings` table — average, count, distribution histogram,
calibrated score — MUST collapse those duplicate accounts to a single most-recent vote per person,
or the number silently disagrees with everything else on the page (e.g. a histogram summing to 20
next to a "18 ratings" label).

- **Never** compute a shared rating aggregate with a raw `db.rating.groupBy` / `_avg` / `_count` /
  `AVG(...)`. Those count alias accounts twice.
- Per-rateable aggregates source their rows from `RatingService.dedupedRatingsFor(...)` (the single
  deduped fetch). Bulk paths run the same `dedupeRatings` rule (in `rating-service.ts`) over their
  multi-rateable fetch. The rule itself lives in exactly one function — don't reinline it.
- **Dedup is universal** (simple *and* calibrated views). It is NOT the same as bad-faith **bomber
  exclusion**, which shapes ONLY the calibrated score — never the displayed average/count or the
  histogram.
- Scope: aggregate-only. A user's own ratings *history* (their profile) is never deduped — it lists
  that account's literal votes.

## Prisma 7 Configuration

Prisma 7 removed `url` from the `datasource` block in schema files. Use `prisma.config.ts` instead.

- Config file: `src/_shared/prisma/prisma.config.ts`
- All prisma scripts need `--config=./src/_shared/prisma/prisma.config.ts` (NOT `--schema`)
- The schema path is defined inside `prisma.config.ts` as `schema: "./schema.prisma"` (relative to config file)

## Package-Specific Commands

```bash
bun prisma:generate       # Generate Prisma client
bun prisma:migrate:dev    # Run migrations
bun prisma:studio         # Open Prisma Studio
```

## Schema and data changes go through migrations ONLY

Never mutate schema or data outside a migration (local or prod) — see the root `CLAUDE.md`. `db-query`/`db-execute` are read-only inspection tools. Schema edits: change `schema.prisma`, then `make migrate`; on drift, see "Use `make migrate`" below. Seed/backfill data ships as idempotent `INSERT ... ON CONFLICT DO NOTHING` inside a migration, never a runtime script.

## A BEFORE trigger reads its own row from `NEW`, never with a re-SELECT

A `BEFORE INSERT OR UPDATE ... FOR EACH ROW` trigger cannot see its own row in the
table yet. A body that computes a derived column by calling a helper which
re-SELECTs that table silently stores the wrong value: on INSERT the row does not
exist, so the helper returns NULL; on UPDATE it returns the *pre-update* value, so
a rename never reaches the derived column.

This shipped four times. `update_{song,venue,show,track}_search_fields` all did
`NEW.search_text := build_<entity>_search_text(NEW.id)`, which left 760 of 802
venues with a NULL `search_text` — invisible to the trigram and full-text branches
of the venue search — and every renamed row stuck on its old name.

- Source own-row columns from `NEW` directly.
- When the derived value also needs *joined* data (another table's columns), keep
  the id-based lookup for the joined part only, or move the whole body into a
  row-typed overload the trigger can pass `NEW` to. Precedent:
  `build_venue_search_text(v venues)` holds the logic and
  `build_venue_search_text(uuid)` wraps it, so the trigger and the backfill /
  verification query cannot drift apart.
- A related-row edit does NOT fire the dependent table's trigger. Renaming a venue
  leaves its shows' derived text stale. Either accept it, or do not denormalize.
- **Verify with the definition, not by eyeball:**
  `SELECT count(*) FROM <table> WHERE <col> IS DISTINCT FROM build_<entity>(id)`
  must return 0 after any fix.

**When you fix a shared SQL pattern, fix every sibling that copied it.** The songs
trigger was fixed alone in `20260715000001` and the other three kept the bug for
another nine days. `pg_proc` is greppable, so one query finds them all:
`SELECT proname FROM pg_proc WHERE prosrc LIKE '%NEW.id%';`

## Use `make migrate`; keep `schema.prisma` and the migrations in sync

`make migrate` (`prisma migrate dev`) is the local workflow. It replays every migration into a shadow DB and diffs the result against `schema.prisma`, so it is the only thing that catches drift. `migrate deploy` never compares the two.

- **Anything a hand-written migration creates must also be declared in `schema.prisma`**: indexes (including GIN / `gin_trgm_ops`, via `@@index([...(ops: raw("gin_trgm_ops"))], type: Gin, map: "...")`), column names (`@map`), and database defaults. Otherwise the next `migrate dev` generates SQL to undo it. Precedent: `20251215022648` silently dropped the song/venue search indexes this way, and `20260723000000` had to recreate them.
- **Read the SQL `migrate dev` generates before committing it.** An unexpected `DROP INDEX`, `DROP COLUMN` or `ALTER ... DROP DEFAULT` means the schema is missing something; fix the schema, not the migration.
- **When `migrate dev` says an applied migration was modified, or your history doesn't match disk, rebuild instead of patching:** `make db-restore` resets to the migrations and reloads the prod dump (`make db-dump-prod` takes a fresh one).
- Check for drift without touching your DB: `prisma migrate diff --from-config-datasource --to-schema src/_shared/prisma/schema.prisma --script` against a freshly migrated database should print an empty migration.


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

Never mutate schema or data outside a migration (local or prod) — see the root `CLAUDE.md`. `db-query`/`db-execute` are read-only inspection tools. Schema edits: change `schema.prisma`, then migrate. If `migrate dev` wants to reset the dev DB on drift, hand-author the `migration.sql` and apply with `bun run prisma:migrate:deploy`. Seed/backfill data ships as idempotent `INSERT ... ON CONFLICT DO NOTHING` inside a migration, never a runtime script.

## ALWAYS apply migrations locally with `deploy`, NEVER `migrate dev` / `make migrate`

The local DB is a prod restore whose `_prisma_migrations` history diverges from disk: migrations were renumbered (the `…130xxx` → `…000xxx` reshuffle), leaving orphan rows recorded under old names. `prisma migrate dev` (which `make migrate` runs) reads that as drift, spins up a shadow DB to replay the whole history, trips a data-migration failure mid-replay (e.g. the `stats_recompute_requests` NULL-row insert), and then wants to **reset the dev DB — wiping the restored prod data**. It does this in the shadow DB and aborts, so the real DB usually survives, but it never accomplishes anything and the error is a red herring.

Use `bun run prisma:migrate:deploy` (or `make migrate-deploy`) instead. `deploy` applies only pending migrations matched by name and ignores the orphan rows — it's the only safe local apply path. The status warning "migrations from the database are not found locally" is the expected pre-existing divergence, not a problem you introduced.

**Re-stamping an unmerged migration you edited after it was already applied locally** (checksum now mismatches): `prisma migrate resolve --rolled-back` refuses (it only rolls back *failed* migrations), and `migrate dev` will try to reset. Instead delete its bookkeeping row and re-deploy the (idempotent) SQL:

```bash
# from packages/core
echo "DELETE FROM \"_prisma_migrations\" WHERE \"migration_name\" = '<dir_name>';" > /tmp/restamp.sql
doppler run -- bunx prisma db execute --file /tmp/restamp.sql --config=./src/_shared/prisma/prisma.config.ts
bun run prisma:migrate:deploy   # re-runs the migration, records the new checksum
```

Editing `_prisma_migrations` (Prisma's own bookkeeping) is migration repair, not the forbidden domain-data mutation; the migration SQL must be idempotent (`ON CONFLICT DO NOTHING` / `WHERE NOT EXISTS`) so the re-run is a no-op on data.

## Local DB Setup (Fresh Machine)

1. `supabase start` (or `make db-start`)
2. `make db-load-data-dump` (loads prod data)
3. Fix table ownership: tables get owned by `supabase_admin` but Prisma connects as `postgres`. Run `ALTER TABLE ... OWNER TO postgres` for all public tables.
4. `prisma migrate deploy` to apply pending migrations (use `deploy` not `dev` to skip drift check)
5. If a migration fails, mark it rolled back with `prisma migrate resolve --rolled-back <name>`, then retry deploy.
6. Empty migration directories (no `migration.sql`) will block all migrations — delete them.

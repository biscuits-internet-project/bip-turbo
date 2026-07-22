# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ALWAYS USE MAKE COMMANDS

**USE MAKE COMMANDS WHENEVER POSSIBLE** — they handle environment setup and proper execution paths.

## Common Development Commands

**Setup and Installation:**
```bash
bun install                           # Install all dependencies
doppler setup                         # Set up environment variables
make db-generate                      # Generate Prisma client
```

**Development:**
```bash
bun run dev                          # Start development server (all apps)
make web                             # Start only web app in dev mode
make dev                             # Same as bun run dev
```

**Building and Type Checking:**
```bash
bun run build                        # Build all apps and packages
bun run typecheck                    # Type check apps/web only
bun run typecheck:all                # Type check all packages
make tc                              # Shorthand for typecheck:all (ALWAYS run from root)
```

**Code Quality:**
```bash
bun run lint                         # Lint all code with Biome
make lint                            # Same as bun run lint
```

**Formatting:** The whole repo is Biome-formatted and CI fails on unformatted files (`bun run format:check`). Run `bun run format` (`make format-all`) to format everything, or `make format FILES="file1.ts file2.tsx"` to fix just the files you touched. Biome handles formatting, import sorting, and lint fixes — never use Prettier or other formatters.

**Testing:**
```bash
bun run test                         # Run all tests
make test                            # Same as bun run test
cd apps/web && bun run test:watch    # Watch mode
```

Test files are colocated with source: `*.test.{ts,tsx}`. Shared test helpers live in `apps/web/test/test-utils.tsx` (import via `@test/*` alias, e.g. `import { setup } from "@test/test-utils"`).

**Skip tests the typechecker covers — but "type-covered" means the shape is checkable, not the behavior.** Don't test helper signatures, argument counts, or type-enforced shapes. DO test behavior the typechecker can't see: conditional rendering (what appears under which props/state), formatting and derivation branches (e.g. em-dash vs value), edge cases, and user interactions — plus wiring assertions where a value must thread from the right source. A component that renders differently by props, or a function with a branch, still needs a test even though its types check. Don't let "skip type-covered" bleed into "skip behavioral."

**Git Hooks:**
Custom hooks live in `.githooks/`. Enable them once per clone:
```bash
git config core.hooksPath .githooks
```
- `pre-commit` runs `bun run lint`
- `pre-push` runs `bun run typecheck:all && bun run test`

Bypass a single hook with `--no-verify` (e.g. `git push --no-verify` for WIP branches).

**Database Operations:**
```bash
make migrate                         # Run Prisma migrations in dev
make migrate-create                  # Create new migration
make db-restore                      # Reset database and restore prod data via pg_restore
make db-studio                       # Open Prisma Studio
make db-introspect                   # Introspect database schema
make db-execute FILE=file.sql        # Execute SQL file against local database
make db-query SQL="SELECT * FROM t"  # Execute SQL query against local database
```

## CRITICAL: Schema and data changes go through migrations ONLY

**Never alter the database schema or insert/update/delete data outside a Prisma migration** — not via `db-query`/`db-execute`, not via a script, not by hand in Studio. This applies to local AND prod. The only exception is repairing a broken/failed migration (e.g. `migrate resolve`).

- **Never edit a migration that has run in production.** Migrations are immutable once deployed; the recorded checksum means an edit silently never re-runs in prod and desyncs history. To change something an applied migration created (drop a column, alter a table, fix seeded data), write a NEW forward migration. Only an unmerged, never-deployed migration may be edited in place.
- **Migration timestamps MUST respect dependency order — prod applies them strictly in name (timestamp) order, from scratch.** A migration that references a table, column, enum value, or marked/seeded row created by another migration MUST have a LATER timestamp than the one that creates it. This bites when you author a migration late but give it an EARLY timestamp to slot it chronologically among existing data migrations (e.g. a `…130040` mashup migration that writes `song.kind`, a column created by `…20260604000000_song_kind`): on dev it works because migrations are applied incrementally on top of an already-migrated DB, but on a fresh prod deploy it runs *before* its dependency and fails (`42P01 relation … does not exist`, `column … does not exist`), which then blocks every later migration with `P3009`. When adding a migration that depends on schema/data from another, give it a timestamp strictly greater than that dependency, and sanity-check by listing `ls packages/core/src/_shared/prisma/migrations` and confirming each referenced object is created by an earlier-sorting entry. If a deploy already failed this way, clear the stale failed `_prisma_migrations` row (the deploy entrypoint does this idempotently) and renumber the offending migrations after their dependencies.
- Schema change (column, table, index, constraint): edit `schema.prisma`, create a new migration, apply it. If `migrate dev` reports drift and wants to reset the dev DB (which would wipe restored prod data), hand-author the `migration.sql` under `packages/core/src/_shared/prisma/migrations/<timestamp>_<name>/` and apply with `bun run prisma:migrate:deploy` (deploy skips the drift check).
- Seed/reference/backfill data: ship it as idempotent `INSERT ... ON CONFLICT DO NOTHING` SQL inside a migration (precedent: the musicians/instruments seed), NOT a runtime script. Prod has no arbitrary-script lever; a migration is the only thing that runs there.
- **NEVER match rows in a data migration by hardcoded row `id` (uuid). Match by a stable natural key — `slug` for songs/venues/etc., `(show slug, set, position)` for tracks, slug for authors/musicians/instruments — and resolve foreign keys via a slug subquery (`SET author_id = (SELECT id FROM authors WHERE slug = '…')`).** Row ids are assigned per-environment and differ between the local prod-restore (where backfill lists are usually audited) and prod. A `WHERE "id" IN ('uuid', …)` that doesn't match on prod **fails silently — 0 rows updated, no error** — so the migration deploys "successfully" while doing nothing, and the bug only surfaces later as wrong data (precedent: `20260604000000_song_kind` set `kind='improvisation'` by id, so the jams fell through to `'original'` on prod and rendered bogus "debut (original)" footnotes; fixed by re-applying by slug in `20260608000000`). When you must enumerate an explicit auditable set, enumerate slugs, not ids.
- **Dedup an aggregate INSERT with `HAVING`, never `WHERE ... NOT EXISTS`.** A pattern like `INSERT ... SELECT gen_random_uuid(), MIN("date")::date FROM "shows" WHERE ... AND NOT EXISTS (...)` looks idempotent but is a NULL-row bug: the `NOT EXISTS` filters the *pre-aggregation* rows, so once the target row already exists the set is emptied and the aggregate (`MIN`) evaluates to `NULL`, inserting one bogus `(uuid, NULL)` row that trips a NOT NULL constraint. Put the dedup in a `HAVING` clause (evaluated after aggregation) with an explicit `MIN(...) IS NOT NULL AND MIN(...) NOT IN (SELECT ...)` so it inserts zero rows instead. This has bitten the `stats_recompute_requests` enqueue twice.
- `db-query`/`db-execute` are for READ-ONLY inspection. Do not use them to mutate.

## Project Architecture

This is a **monorepo** using **pnpm workspaces** with **Bun** as the runtime:

- **`apps/web/`**: React Router v7 frontend application with Radix UI components
- **`packages/core/`**: Database access, services, and core business logic with Prisma ORM
- **`packages/domain/`**: Domain models and shared types using Zod validation

### Technology Stack
- **Runtime**: Bun (not Node.js)
- **Frontend**: React Router v7, Radix UI, Tailwind CSS, shadcn/ui components
- **Backend**: TypeScript, Prisma ORM, PostgreSQL, Redis, Supabase
- **Code Quality**: Biome (replaces ESLint/Prettier)
- **Environment**: Doppler for secrets management
- **Deployment**: Hetzner via Kamal 2 (Docker); auto-deploys on merge to main

## File Naming Conventions

- Repository files: `[domain]-repository.ts`
- Service files: `[domain]-service.ts`
- Component files: kebab-case (e.g., `review-card.tsx`)
- Route files: React Router v7 file-based routing conventions

## Environment and Config

- All environment variables managed through Doppler
- Never commit secrets or API keys
- Use `doppler run --` prefix for commands that need environment variables

## Cache Key Versioning

When you change the shape of a value stored in Redis (rename a field, add/remove a field, change a type, or change the semantic of an existing field), bump the version suffix on every cache key that holds that value (e.g. `:v2` → `:v3`). Cache key constants live in [packages/domain/src/cache-keys.ts](packages/domain/src/cache-keys.ts). If multiple keys cache the same payload (`songs:index:full`, `songs:filtered:...`, `songs:all-timers`, etc.), bump them all in the same change. Otherwise deployed instances will serve stale-shape payloads written by the previous version until the TTL expires.

## Show Ordering

Any code that orders or filters shows/tracks chronologically MUST use the helpers in `packages/core/src/_shared/show-ordering.ts` (or `compareByShowDate` from `packages/domain/src/show-ordering.ts` for in-memory work). Never write `orderBy: { date: 'asc' }` directly — same-day shows have a `dayOrder` column (NULLS LAST) plus track-position tiebreakers, and the helpers centralize that logic so it stays consistent across SQL, Prisma, and JS.

Use `SHOW_ORDER_ASC` / `SHOW_ORDER_DESC` for Prisma `orderBy`, `showOrderBySql` for raw SQL, `TRACK_BY_SHOW_ORDER_ASC` for ordering tracks by their show, `statsShowsSql` / `STATS_SHOWS_WHERE` for the count_for_stats=true predicate, and `compareByShowDate` for in-memory sorts.

## Every generated statistic is count_for_stats-only, from one shared definition

Any number the site presents as a statistic — counts, averages, totals, first/last dates, "top N" orderings — MUST filter to `count_for_stats = TRUE` via `statsShowsSql` / `STATS_SHOWS_WHERE`. No exceptions for "this set obviously matches". Display-only listings that deliberately show every performance (e.g. the song-detail performances table) are the only queries that skip it, and they aren't statistics.

When the same statistic surfaces in more than one place (an index table and a detail page, say), the *row set* it aggregates over lives in exactly one exported SQL builder that both callers use, not in two hand-written queries that happen to agree today. Two queries drift: the /musicians index and a musician's profile shipped three different definitions of "shows played" (lineup rows vs. shows-with-tracks, one stats-filtered and one not) and disagreed by 96 for Aron Magner. Precedent to copy: [musician-appearances.ts](packages/core/src/musicians/musician-appearances.ts), which exports the appearance-show and song-play row sets plus the shared aggregate SELECT list.

Related: a musician's play count uses distinct `(song_id, show_id)` pairs, matching `Song.timesPlayed`, so a musician's plays can never exceed the per-song totals shown elsewhere.

## Commit and PR Messages

Describe the final before→after change as the user will see it, not the development process or intermediate iterations. Be pithy. Lead with the user-visible change.

If a change involves a particularly tricky technical detail or a non-obvious design decision the reviewer should know about, put it in a separate section at the end of the PR description (not in the lead). Skip that section entirely when the change is straightforward.

## CRITICAL: Don't Guess

**NEVER guess field names, function signatures, or code structure.** Always look at the actual files first. This applies to database fields, function parameters, API endpoints, file paths, configuration keys — anything with a definitive answer in the codebase.

## CRITICAL: Never Be Lazy

Read the actual error message. Understand the real problem. Analyze the root cause. Implement the correct solution — not the fastest hack. Verify it actually works.

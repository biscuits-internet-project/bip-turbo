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

**Formatting:** Always run `make format FILES="file1.ts file2.tsx"` on files you changed before committing. Only format files you modified — never run project-wide formatting. Biome handles formatting, import sorting, and lint fixes — never use Prettier or other formatters.

**Testing:**
```bash
bun run test                         # Run all tests
make test                            # Same as bun run test
cd apps/web && bun run test:watch    # Watch mode
```

Test files are colocated with source: `*.test.{ts,tsx}`. Shared test helpers live in `apps/web/test/test-utils.tsx` (import via `@test/*` alias, e.g. `import { setup } from "@test/test-utils"`).

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
- **Deployment**: Fly.io with Docker

## File Naming Conventions

- Repository files: `[domain]-repository.ts`
- Service files: `[domain]-service.ts`
- Component files: kebab-case (e.g., `review-card.tsx`)
- Route files: React Router v7 file-based routing conventions

## Environment and Config

- All environment variables managed through Doppler
- Never commit secrets or API keys
- Use `doppler run --` prefix for commands that need environment variables

## CRITICAL: Don't Guess

**NEVER guess field names, function signatures, or code structure.** Always look at the actual files first. This applies to database fields, function parameters, API endpoints, file paths, configuration keys — anything with a definitive answer in the codebase.

## CRITICAL: Never Be Lazy

Read the actual error message. Understand the real problem. Analyze the root cause. Implement the correct solution — not the fastest hack. Verify it actually works.

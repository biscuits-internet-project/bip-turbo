# AGENTS.md

Guidance for any coding agent working inside `bip-turbo`. Skim this first, then fall back to `README.md`, `CLAUDE.md`, and docs/ as needed.

## Project Snapshot
- **Stack:** Bun runtime with pnpm workspaces, Turborepo, React Router v7 + Tailwind CSS on the frontend, TypeScript everywhere, Prisma + PostgreSQL + Redis on the backend.
- **Structure:** `apps/web` (React app), `packages/core` (Prisma, repositories, services, DI container), `packages/domain` (Zod models + view builders), shared tooling in `scripts/`, migrations in `packages/core/src/_shared/prisma/`.
- **Environments:** Secrets and app config flow through Doppler; local DB + Redis run via Supabase/Docker (`docker-compose.yaml`, `supabase/` files).

## Setup & Environment
1. **Authenticate & pull secrets** – `doppler login` then `make doppler`.
2. **Install** – `make install` (runs `bun install` via the root Makefile).
3. **Generate Prisma client** – `make db-generate`.
4. **Data services** – `make db-start` (Supabase) + `docker compose up -d` for Redis/ancillary services.
5. **Migrate & seed** – `make migrate`, optionally `make migrate-baseline`, then load scrubbable prod data with `PROD_DATA_PATH=<dump> make db-load-data-dump` and `make db-scrub`.
6. **Run dev** – usually two shells: `docker compose up` (if not already) and `make web`. `make dev` or `bun run dev` can drive full workspace dev if needed.

> Always prefer the **Makefile** targets over ad‑hoc scripts to keep paths/env consistent.

## Core Commands (run from repo root unless noted)
| Purpose | Command |
| --- | --- |
| Build | `make build` |
| Type check (all pkgs) | `make tc` |
| Lint | `make lint` |
| Format | `make format` |
| Clean modules/build | `make clean` |
| Start web dev server | `make web` |
| Full dev (all apps) | `make dev` |
| Prisma migrate dev | `make migrate` |
| Create migration | `make migrate-create` |
| Prisma studio | `make db-studio` |
| Reset db + reload prod dump | `make db-restore` (ensure `PROD_DATA_PATH`) |
| Execute SQL file/query safely | `make db-execute FILE=...` / `make db-query SQL="..."` (guards prod URLs) |
| Vector index rebuild | `make index-all` or the granular `index-*` Bun scripts (require `doppler run --`). |

## Development Expectations
- **Do not guess.** Inspect source for field names, types, and routes (`CLAUDE.md` spells this out). Follow established patterns before adding new ones.
- **Routing:** React Router v7 requires explicit registration. Every new route file (UI or API) must also be added to `apps/web/app/routes.ts` or it will 404.
- **Frontend conventions:** Use Tailwind + shadcn/Radix primitives (`apps/web/app/components/ui`). Keep feature folders domain-focused (e.g., `app/features/shows`). Generate root routes with `bun run gen-root` if you touch `root.tsx`.
- **Backend conventions:** Never talk to Prisma directly from feature code. Instead, extend `packages/core/src/<domain>/<domain>-repository.ts` and `<domain>-service.ts`, wiring through the DI container in `packages/core/src/_shared/container.ts`. Validation/types flow from `packages/domain`.
- **Environment usage:** Wrap commands needing secrets with `doppler run -- ...`. Never commit secrets or rely on `.env`.
- **Database work:** Limit destructive commands to local DB URLs. The Make targets above enforce this; do not bypass them.
- **Search indexing / MCP:** Scripts under `packages/core/src/search/scripts/` fuel MCP endpoints described in `MCP_README.md`. Run them with the provided Bun scripts after changing search/index logic.

## Recommended Workflow for Changes
1. **Plan** – Identify the domain (web UI, service logic, migrations) and inspect existing files to mirror structure.
2. **Implement** – Use Bun + TypeScript; keep imports absolute via package names (`@bip/core`, `@bip/domain`, etc.).
3. **Validate** – `make tc`, `make lint`, `make format`, plus targeted `bun test`/feature checks if tests exist. For routing or DB-heavy work, run the affected app (`make web`) and hit the route/API manually.
4. **Document** – Update relevant docs/routes lists if you introduce new flows (FAQ pages, MCP endpoints, scripts).

## Reference Docs
- `README.md` – project overview, setup, deployment summary.
- `CLAUDE.md` – stricter coding ethos (Makefile, anti-guessing rules, router reminder).
- `docs/` – deeper feature notes (check specific file before editing).
- `MCP_README.md` & `MCP_IMPLEMENTATION_PLAN.md` – context for the MCP server & tooling.

If something is unclear or missing, prefer asking for clarification (or inspecting the code) over inventing new conventions.***

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

## Local DB Setup (Fresh Machine)

1. `supabase start` (or `make db-start`)
2. `make db-load-data-dump` (loads prod data)
3. Fix table ownership: tables get owned by `supabase_admin` but Prisma connects as `postgres`. Run `ALTER TABLE ... OWNER TO postgres` for all public tables.
4. `prisma migrate deploy` to apply pending migrations (use `deploy` not `dev` to skip drift check)
5. If a migration fails, mark it rolled back with `prisma migrate resolve --rolled-back <name>`, then retry deploy.
6. Empty migration directories (no `migration.sql`) will block all migrations — delete them.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
make tc                              # Shorthand for typecheck:all
```

**Code Quality:**
```bash
bun run lint                         # Lint all code with Biome
bun run format                       # Format all code with Biome
make lint                            # Same as bun run lint
make format                          # Same as bun run format
```

**Database Operations:**
```bash
make migrate                         # Run Prisma migrations in dev
make migrate-create                  # Create new migration
make db-reset                        # Reset database and restore prod data
make db-studio                       # Open Prisma Studio
make db-introspect                   # Introspect database schema
```

**Package-specific commands:**
```bash
# Core package (from packages/core/)
bun prisma:generate                  # Generate Prisma client
bun prisma:migrate:dev               # Run migrations
bun prisma:studio                    # Open Prisma Studio

# Web app (from apps/web/)
bun run gen-root                     # Generate root route file
react-router typegen                 # Generate route types
```

## Project Architecture

### Monorepo Structure
This is a **monorepo** using **pnpm workspaces** with **Bun** as the runtime. Key packages:

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

### Web App Architecture (`apps/web/`)
- **Router**: React Router v7 with file-based routing in `app/routes/`
- **Components**: Radix UI primitives in `app/components/ui/`, feature components organized by domain
- **State**: React Query (@tanstack/react-query) for server state
- **Auth**: Supabase SSR authentication
- **Styling**: Tailwind CSS with shadcn/ui component system

### Core Package Architecture (`packages/core/`)
- **Repository Pattern**: Each domain has a repository (e.g., `show-repository.ts`) and service (e.g., `show-service.ts`)
- **Database**: Prisma client with PostgreSQL, schema at `src/_shared/prisma/schema.prisma`
- **Services**: Business logic layer that uses repositories
- **Container**: Dependency injection container at `src/_shared/container.ts`

### Domain Package (`packages/domain/`)
- **Models**: Zod schemas for validation and TypeScript types
- **Views**: Composed data structures for UI consumption (e.g., `song-page.ts`)

## Key Patterns and Conventions

### Database Access
- Always use the repository pattern - don't access Prisma client directly in services
- Database queries are centralized in repository classes
- Use the dependency injection container for service instantiation

### Component Organization
- UI primitives go in `app/components/ui/`
- Feature components are organized by domain (e.g., `review/`, `setlist/`, `show/`)
- Form components use React Hook Form with Zod validation

### File Naming
- Repository files: `[domain]-repository.ts`
- Service files: `[domain]-service.ts`
- Component files: kebab-case (e.g., `review-card.tsx`)
- Route files: React Router v7 file-based routing conventions

### Environment and Config
- All environment variables managed through Doppler
- Never commit secrets or API keys
- Use `doppler run --` prefix for commands that need environment variables

## Development Workflow

1. **Database Changes**: Create migrations with `make migrate-create`, run with `make migrate`
2. **Type Generation**: Run `bun run typecheck` after schema changes to regenerate types
3. **New Features**: Follow the repository/service pattern in core, create corresponding UI components in web
4. **Testing**: No specific test framework mentioned - check if tests exist before assuming testing approach

## Important Notes

- This project uses **Bun, not Node.js** - always use `bun` commands
- Package manager is **pnpm** for workspace management but **Bun** for script execution
- **Doppler is required** for environment variable management in development
- Database uses **PostgreSQL with Prisma** - all DB operations should go through repositories
- **Biome** handles both linting and formatting - don't use ESLint or Prettier
- The web app uses **React Router v7** (latest version) with file-based routing
# Web App (`apps/web/`)

## Routes MUST Be Registered in routes.ts

React Router v7 uses explicit route configuration. File-based routing alone IS NOT ENOUGH.

1. Create the route file (e.g., `routes/api/cron/$action.tsx`)
2. **Add the route to `app/routes.ts`** (e.g., `route("cron/:action", "routes/api/cron/$action.tsx")`)

Otherwise the route WILL NOT WORK and you'll get 404s.

## Don't let server-only modules leak into the client bundle

If a route component references a runtime value from a `.ts` helper under `app/routes/` that imports `~/server/*`, `@bip/core`, or `@prisma/*`, Vite evaluates the server helper in the client bundle and silently breaks `<Link>` navigation (see PR #58). The route component may only `import type` from the helper — never value imports. When the component needs a value the loader also uses, return it from the loader as part of the loader data (preferred) or factor it into a sibling `*-constants.ts` file with no server imports. Enforced by [app/lib/server-import-leak.test.ts](app/lib/server-import-leak.test.ts).

## Architecture

- **Router**: React Router v7 with file-based routing in `app/routes/`
- **Components**: Radix UI primitives in `app/components/ui/`, feature components organized by domain
- **State**: React Query (@tanstack/react-query) for server state
- **Auth**: Supabase SSR authentication
- **Styling**: Tailwind CSS with shadcn/ui component system

## Component Organization

- UI primitives go in `app/components/ui/`
- Feature components are organized by domain (e.g., `review/`, `setlist/`, `show/`)
- Form components use React Hook Form with Zod validation

## Package-Specific Commands

```bash
bun run gen-root          # Generate root route file
react-router typegen      # Generate route types
```

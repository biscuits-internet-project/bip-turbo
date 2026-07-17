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

## Keep components and CSS DRY

Before writing markup, grep the className you're about to type. If it's already somewhere, you owe an extraction.

- **Use existing primitives.** Bare `<input>`/`<textarea>` → [Input](app/components/ui/input.tsx)/[Textarea](app/components/ui/textarea.tsx). Hand-rolled selects → [CompactSelect](app/components/ui/compact-select.tsx) (finite options) or [SearchPicker](app/components/ui/search-picker.tsx) (async search). Don't inline `bg-*`/`hover:bg-*` on [Button](app/components/ui/button.tsx) when a `variant` covers the intent.
- **2+ duplications → className constant** in [form-styles.ts](app/lib/form-styles.ts) (form chrome) or a domain module. See `formInputClass`, `formLabelClass`.
- **2+ Button (or Badge / Card / …) className overrides → add a `variant`** to the existing CVA. See `variant="brand"`. Don't create `<MyButton>`.
- **No thin wrappers to hide a className.** `<PremiumCard>` for `<Card className="card-premium">` is indirection, not abstraction. Use a constant or variant.
- **DO extract a shared component for a repeated multi-element affordance.** A composite that's *more than a className* — e.g. a `Button asChild` + `Link` + icon nav button repeated across pages — belongs in one component so its styling AND verbiage stay consistent app-wide and change in one place. Use [LinkButton](app/components/ui/link-button.tsx) for prominent action/nav buttons ("Create X", "Back to X") and [BackLink](app/components/ui/back-link.tsx) for the subtle content-page back link ("All X"). The "no `<MyButton>`" rule above targets pure single-className hiding, not multi-element composites. Navigation should look identical across pages; settle on one pattern unless there's a real reason for two (e.g. prominent form/list actions vs. low-emphasis content-page nav). Verbiage convention: create buttons say **"Create X"** (not "New X").
- **Don't bake project styling into shadcn defaults.** Auth/search/etc. use the upstream primitive. Project looks → constant or variant.

## Surfaces: pick by intent, never by raw class

A surface's background is chosen by a named role, not by pasting a CSS class. The whole menu is small on purpose; enforced by [app/lib/surface-system.test.ts](app/lib/surface-system.test.ts).

- **Content blocks → `<Card variant>`** ([components/ui/card.tsx](app/components/ui/card.tsx)). `elevated` (default — gradient/border/shadow, the dominant content card and any prominent standalone card, including data/chart cards), `panel` (flat frosted, low-emphasis: small tiles in a grid like stat boxes, and inline secondary text such as notes/lyrics), `plain` (bare shadcn `bg-card`; also the escape hatch for a card with its own custom `bg-*`, e.g. the auth cards). A bare `<Card>` is `elevated`. For a block that must stay a `<div>`/`<a>` (grid item, `asChild`), use `cardVariants({ variant, className })` — never the raw `card-premium`/`glass-content` class. Rule of thumb: if it sits next to elevated cards, it's elevated.
- **Form fields → `formInputClass`** ([lib/form-styles.ts](app/lib/form-styles.ts)) on every `Input`/`Textarea`/`SelectTrigger` in a content form (admin, contact, review, blog). Two deliberate exceptions: **auth** forms (login/register/password reset) use `authInputClass` (frosted `.auth-input`, matching the translucent auth card), and compact **filter-bar** controls use `compactSelectTriggerClass`, which sizes a trigger for a filter bar rather than a content form.
- **Chrome / overlays → `glass`** (dialogs, popovers, command palette, drawers, header). `glass-secondary` is the dashed "unrated / incomplete" affordance surface.

Don't reintroduce `card-premium` or `glass-content` in markup (they only back the Card variants now), and don't add a new whole-surface class when a variant/constant covers the intent.

## There is no `bg-glass-*` / `border-glass-*` / `bg-hover-glass` utility

The `--glass-bg` / `--glass-border` / `--hover-glass` tokens are plain `:root`
custom properties. They are **not** registered in the `@theme` block in
[styles.css](app/styles.css), so Tailwind never generates a utility for them and
`bg-glass-bg`, `border-glass-border`, `hover:bg-hover-glass` and friends silently
do nothing. They are inert, and they accumulate easily because nothing errors.

To use a glass token from CSS, reference it directly as `var(--glass-bg)`, not
`hsl(var(--glass-bg))`. These tokens are already complete `hsla()` colors, so
wrapping them in `hsl()` nests to `hsl(hsla(...))`, which is invalid and gets
dropped. Only bare-triplet tokens (`--brand-primary: 263 85% 60%`) take the
`hsl(var(--x))` form.

For a glass surface in markup use the `.glass` / `.glass-secondary` /
`.glass-content` classes, or `<Card variant>`. If you genuinely need a composable
glass utility, register the token in `@theme` first, and the class will work
everywhere.

## Package-Specific Commands

```bash
bun run gen-root          # Generate root route file
react-router typegen      # Generate route types
```

# Memory Leak Analysis

## Summary

The primary server-side memory leak is caused by a **module-level QueryClient singleton** in `apps/web/app/root.tsx` that accumulates state across all SSR requests without cleanup.

## Root Cause

**File:** `apps/web/app/root.tsx:50-58`

```typescript
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### Why This Causes a Leak

1. The `QueryClient` is created once at module load time
2. It's shared across ALL server-side renders via `<QueryClientProvider client={queryClient}>`
3. React Query internally tracks subscriptions, cache entries, and query states
4. On the server, these are **never cleaned up** because components don't unmount
5. The QueryClient's internal state grows gradually with each request
6. This explains why the leak is gradual and not correlated with traffic volume

## Fix

Replace the module-level singleton with a per-request QueryClient using React's `useState`:

```typescript
import { useState } from "react";

// Remove the module-level queryClient

export function Layout({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient for each request/render
  // useState ensures it's created once per component lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const data = useLoaderData() as RootData | undefined;
  const env = data?.env;

  return (
    // ... rest of component
  );
}
```

This ensures:
- Each SSR request gets a fresh QueryClient
- The QueryClient is properly garbage collected after the response is sent
- Client-side navigation reuses the same QueryClient (no change in behavior)

## Secondary Issues (Client-Side)

These are less critical but should be fixed for completeness:

### 1. `use-infinite-scroll.ts` - IntersectionObserver Leak

**File:** `apps/web/app/hooks/use-infinite-scroll.ts:37-58`

The callback ref returns a cleanup function, but **callback refs don't support cleanup return values** like useEffect. This means IntersectionObserver instances accumulate.

**Fix:** Use `useEffect` with a ref instead of a callback ref pattern.

### 2. `search-feedback.tsx` - Missing Dependency

**File:** `apps/web/app/components/search/search-feedback.tsx:66-72`

```typescript
useEffect(() => {
  setIsComplete(false);
  setSentiment(null);
  setFeedback("");
  setShowFeedbackText(false);
  setShowThanks(false);
}, []); // Missing searchId dependency!
```

Should be `}, [searchId]);` to reset state when search changes.

### 3. `player.tsx` - Uncleaned setTimeout

**File:** `apps/web/app/components/player.tsx:267-274`

The `setTimeout` in `playTrack` callback has no cleanup. If component unmounts before 100ms, it attempts state updates on unmounted component.

### 4. `star-rating.tsx` - Uncleaned setTimeout

**File:** `apps/web/app/components/ui/star-rating.tsx:176-178`

Same issue - `setTimeout` without cleanup in click handler.

## Verification

After deploying the fix, monitor Fly.io memory metrics:
- Memory should stabilize rather than grow continuously
- Expect memory to fluctuate with traffic but return to baseline

## Additional Notes

### What Was NOT the Problem

These were investigated and found to be properly implemented:

- **Prisma Client** - Correctly uses global singleton (`global.__prisma`)
- **Redis Client** - Proper singleton pattern with `globalRedisClient`
- **Services/Container** - True singletons that don't accumulate per-request data
- **Caching** - All caching goes through Redis, no in-memory caches
- **Supabase Clients** - `getServerClient` creates per-request (by design)
- **Pino Logger** - Standard configuration, no accumulation
- **Honeybadger** - Standard error tracking setup

### Symptoms That Led to Diagnosis

- Gradual memory growth (not spiky)
- Not correlated with traffic
- Present since initial deployment
- Crash on Fly.io from OOM

These symptoms pointed to something that accumulates regardless of traffic - a module-level singleton that grows with each SSR render.

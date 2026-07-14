import { type DehydratedState, dehydrate, QueryClient } from "@tanstack/react-query";

/**
 * Per-request `QueryClient` for loader-side prefetching. Each call returns a
 * fresh instance — a module-level shared client would leak user-scoped data
 * (attendance, ratings) between requests.
 *
 * Defaults intentionally mirror the client-side `QueryProvider` so dehydrated
 * entries keep the same stale/gc semantics once they hydrate on the client.
 */
export function createPrefetchClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * Dehydrate a per-request prefetch client and immediately release everything
 * it holds. React Query schedules a gcTime (5 min) timer on each prefetched
 * query even when nothing observes it, so an un-cleared client pins its
 * payloads in server memory for five minutes after the response is gone;
 * at peak traffic that's minutes of requests held on the heap. `dehydrate`
 * copies the data first, so the returned state (and client-side hydration)
 * is unaffected. Loaders must use this instead of bare `dehydrate`.
 */
export function dehydrateAndClear(queryClient: QueryClient): DehydratedState {
  const state = dehydrate(queryClient);
  queryClient.clear();
  return state;
}

/**
 * Combines dehydrated states returned from multiple route loaders into a
 * single state for `<HydrationBoundary>`. Each route segment's loader
 * dehydrates its own client; the root Layout merges them via `useMatches()`.
 */
export function mergeDehydratedStates(states: Array<DehydratedState | undefined>): DehydratedState {
  const merged: DehydratedState = { mutations: [], queries: [] };
  for (const state of states) {
    if (!state) continue;
    if (state.mutations.length > 0) merged.mutations.push(...state.mutations);
    if (state.queries.length > 0) merged.queries.push(...state.queries);
  }
  return merged;
}

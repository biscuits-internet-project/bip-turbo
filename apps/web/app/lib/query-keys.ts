/**
 * Shared React Query keys for hooks that are seeded by loader-side
 * `prefetchQuery` calls. Loader and hook MUST use the same builder so the
 * dehydrated cache entry matches the client's `useQuery` lookup — otherwise
 * the hook treats the cache as empty and refetches client-side.
 */

export function showUserDataQueryKey(showIds: readonly string[]): readonly unknown[] {
  return ["shows", "user-data", [...showIds].sort().join(",")];
}

export function trackUserRatingsQueryKey(trackIds: readonly string[]): readonly unknown[] {
  return ["tracks", "user-ratings", [...trackIds].sort().join(",")];
}

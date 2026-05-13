import { dehydrate } from "@tanstack/react-query";
import { describe, expect, test } from "vitest";
import { showUserDataQueryKey } from "./query-keys";
import { createPrefetchClient, mergeDehydratedStates } from "./query-prefetch";

describe("createPrefetchClient", () => {
  // Loaders must get a fresh client per request. A module-level singleton
  // would leak one user's attendance data into the next request's
  // dehydrated payload.
  test("returns a distinct client each call", () => {
    const a = createPrefetchClient();
    const b = createPrefetchClient();
    expect(a).not.toBe(b);
  });

  // Prefetched data is what the dehydrate/hydrate cycle actually carries
  // across the wire. This is the smoke test that the helper produces a
  // client that prefetchQuery + dehydrate can round-trip.
  test("prefetched data appears in the dehydrated payload", async () => {
    const client = createPrefetchClient();
    await client.prefetchQuery({
      queryKey: showUserDataQueryKey(["show-1"]),
      queryFn: async () => ({ attendances: {}, userRatings: {}, averageRatings: {} }),
    });
    const state = dehydrate(client);
    expect(state.queries.length).toBe(1);
    expect(state.queries[0].queryKey).toEqual(showUserDataQueryKey(["show-1"]));
  });
});

describe("mergeDehydratedStates", () => {
  // Two loaders each prefetch one query; HydrationBoundary needs both. The
  // merger concatenates queries (and mutations, if any) so a single state
  // can be handed to one boundary at the root.
  test("concatenates queries from each input state", async () => {
    const a = createPrefetchClient();
    await a.prefetchQuery({ queryKey: ["q", "a"], queryFn: async () => 1 });
    const b = createPrefetchClient();
    await b.prefetchQuery({ queryKey: ["q", "b"], queryFn: async () => 2 });

    const merged = mergeDehydratedStates([dehydrate(a), dehydrate(b)]);
    expect(merged.queries).toHaveLength(2);
    const keys = merged.queries.map((q) => q.queryKey);
    expect(keys).toEqual(
      expect.arrayContaining([
        ["q", "a"],
        ["q", "b"],
      ]),
    );
  });

  // Loaders that didn't prefetch anything pass back `undefined` from their
  // optional `dehydratedState` field. The merger must tolerate that without
  // throwing or polluting the result.
  test("ignores undefined entries", () => {
    const merged = mergeDehydratedStates([undefined, undefined]);
    expect(merged).toEqual({ mutations: [], queries: [] });
  });
});

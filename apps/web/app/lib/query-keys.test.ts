import { describe, expect, test } from "vitest";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "./query-keys";

describe("query-keys", () => {
  // The key is the contract between loader-side prefetch and client-side
  // useQuery. If input order differs (e.g. loader passes ids in insertion
  // order, hook receives them in render order), the built key must still
  // match — otherwise SSR seeding silently fails.
  test("showUserDataQueryKey is order-independent", () => {
    expect(showUserDataQueryKey(["c", "a", "b"])).toEqual(showUserDataQueryKey(["a", "b", "c"]));
  });

  // Different id sets must produce different keys; otherwise two pages would
  // share a cache entry and one would see the other's prefetched data.
  test("showUserDataQueryKey differs by id set", () => {
    expect(showUserDataQueryKey(["a", "b"])).not.toEqual(showUserDataQueryKey(["a", "b", "c"]));
  });

  // Same invariants for track ratings — different queryFn payload but the
  // key shape (sorted, comma-joined) must be identical so the merge logic
  // and assertion patterns in loaders stay symmetrical.
  test("trackUserRatingsQueryKey is order-independent", () => {
    expect(trackUserRatingsQueryKey(["t2", "t1"])).toEqual(trackUserRatingsQueryKey(["t1", "t2"]));
  });
});

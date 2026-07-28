import { describe, expect, test } from "vitest";
import { yearListingPath } from "./site-paths";

describe("yearListingPath", () => {
  // Pinned as a literal on purpose. The web loader records this path and the
  // core purge service names it; Cloudflare matches a cache key exactly and
  // reports success even when nothing matched, so a drift between the two
  // would evict nothing and raise no error anywhere.
  test("is the /shows/year/:year listing path", () => {
    expect(yearListingPath(2001)).toBe("/shows/year/2001");
  });
});

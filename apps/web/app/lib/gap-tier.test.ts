import { describe, expect, test } from "vitest";
import { pickGapTier } from "./gap-tier";

describe("pickGapTier", () => {
  // Below average frequency: still in normal rotation, no highlight.
  test("returns 'normal' when current gap is at or below average", () => {
    expect(pickGapTier({ showsSince: 4, average: 4.4, longest: 30 })).toBe("normal");
    expect(pickGapTier({ showsSince: 4.4, average: 4.4, longest: 30 })).toBe("normal");
  });

  // Above average but within historical bounds: starting to drag, soft warn.
  test("returns 'warn' when current gap exceeds average but not the longest historical gap", () => {
    expect(pickGapTier({ showsSince: 10, average: 4.4, longest: 30 })).toBe("warn");
  });

  // Past the longest gap on record: this song hasn't been gone this long
  // before — strongest highlight.
  test("returns 'danger' when current gap exceeds the longest historical gap", () => {
    expect(pickGapTier({ showsSince: 31, average: 4.4, longest: 30 })).toBe("danger");
  });

  // Edge: when we don't have an average (debut/never-played), there's
  // nothing to compare against — render plain.
  test("returns 'normal' when average is null (no comparison possible)", () => {
    expect(pickGapTier({ showsSince: 50, average: null, longest: 30 })).toBe("normal");
    expect(pickGapTier({ showsSince: 50, average: null, longest: null })).toBe("normal");
  });

  // Edge: average exists but longest is unknown — promote to 'warn' but
  // never to 'danger' since we can't prove the gap is record-breaking.
  test("caps at 'warn' when longest is null and current exceeds average", () => {
    expect(pickGapTier({ showsSince: 100, average: 4.4, longest: null })).toBe("warn");
  });
});

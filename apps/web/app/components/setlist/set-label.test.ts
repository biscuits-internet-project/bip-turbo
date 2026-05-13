import { describe, expect, test } from "vitest";
import { compareBySetThenPosition, countDistinctEncores, formatSetLabel, setSortKey } from "./set-label";

describe("formatSetLabel", () => {
  // S-prefixed regular sets drop the "S" because the column header (or
  // surrounding context) already says "Set". Lock down the common cases.
  test("drops the S prefix from regular sets", () => {
    expect(formatSetLabel("S1")).toBe("1");
    expect(formatSetLabel("S2")).toBe("2");
    expect(formatSetLabel("S10")).toBe("10");
  });

  // Lowercase is normalized via toUpperCase before pattern matching so the
  // helper is forgiving of input variation from older data or different
  // entry surfaces.
  test("normalizes lowercase set labels", () => {
    expect(formatSetLabel("s1")).toBe("1");
    expect(formatSetLabel("e1", { encoresInSet: 2 })).toBe("E1");
  });

  // Without the encore-count hint, encores keep their numeric label so the
  // caller never accidentally collapses E1 → E in a multi-encore show.
  test("keeps the encore numeral when encoresInSet is omitted", () => {
    expect(formatSetLabel("E1")).toBe("E1");
    expect(formatSetLabel("E2")).toBe("E2");
  });

  // The single-encore collapse is the whole reason for the encoresInSet
  // hint — when a setlist has exactly one encore, "E1" reads cleaner as
  // a bare "E" because the "1" can't be contrasted with anything.
  test("collapses E1 → E only when encoresInSet === 1", () => {
    expect(formatSetLabel("E1", { encoresInSet: 1 })).toBe("E");
    expect(formatSetLabel("E2", { encoresInSet: 1 })).toBe("E"); // E2 alone? Still "E" — the count, not the value, drives collapse.
    expect(formatSetLabel("E1", { encoresInSet: 2 })).toBe("E1");
    expect(formatSetLabel("E1", { encoresInSet: 0 })).toBe("E1"); // boundary: count !== 1, no collapse
  });

  // Anything that isn't a recognized set/encore pattern (Soundcheck, empty
  // strings, future labels we haven't seen) passes through verbatim so the
  // helper never silently mangles unfamiliar input.
  test("returns non-set/non-encore values verbatim", () => {
    expect(formatSetLabel("Soundcheck")).toBe("Soundcheck");
    expect(formatSetLabel("")).toBe("");
    expect(formatSetLabel("???")).toBe("???");
  });
});

describe("countDistinctEncores", () => {
  // Counts unique encore labels regardless of how many tracks share each
  // encore. Two tracks both labeled E1 still report "1 distinct encore".
  test("counts unique encore labels, not encore tracks", () => {
    expect(
      countDistinctEncores([
        { set: "E1" },
        { set: "E1" },
        { set: "E1" },
      ]),
    ).toBe(1);
  });

  // Mixed-set rows: only encores contribute. Regular sets are ignored so
  // the result is safe to feed straight into `formatSetLabel({encoresInSet})`.
  test("ignores non-encore rows", () => {
    expect(
      countDistinctEncores([
        { set: "S1" },
        { set: "S2" },
        { set: "E1" },
        { set: "E2" },
      ]),
    ).toBe(2);
  });

  // Empty list = 0 distinct encores. The collapse branch in formatSetLabel
  // only fires on === 1, so an empty list correctly leaves any encore label
  // (which couldn't exist in this scenario anyway) un-collapsed.
  test("returns 0 for an empty list", () => {
    expect(countDistinctEncores([])).toBe(0);
  });

  // Lowercase encore labels still count toward the distinct set so callers
  // don't have to pre-normalize input.
  test("normalizes lowercase encore labels for de-duplication", () => {
    expect(countDistinctEncores([{ set: "e1" }, { set: "E1" }])).toBe(1);
  });
});

describe("setSortKey", () => {
  // Soundcheck is the earliest possible "set" — sorts before everything
  // else so reading top-to-bottom matches the chronological narrative.
  test("soundcheck sorts before all regular sets", () => {
    expect(setSortKey("soundcheck")).toBeLessThan(setSortKey("S1"));
    expect(setSortKey("Soundcheck")).toBeLessThan(setSortKey("S1"));
  });

  // Set numbering ascends 10/20/30/40 with gaps so future inserts have
  // room. The relative order is all that matters for callers.
  test("regular sets S1 → S4 are strictly ascending", () => {
    expect(setSortKey("S1")).toBeLessThan(setSortKey("S2"));
    expect(setSortKey("S2")).toBeLessThan(setSortKey("S3"));
    expect(setSortKey("S3")).toBeLessThan(setSortKey("S4"));
  });

  // Encores come after every regular set so they cluster at the end of
  // the table even when sorted by Set.
  test("every encore sorts after every regular set", () => {
    expect(setSortKey("S4")).toBeLessThan(setSortKey("E1"));
    expect(setSortKey("E1")).toBeLessThan(setSortKey("E2"));
    expect(setSortKey("E2")).toBeLessThan(setSortKey("E3"));
  });

  // Unknown labels (typos, new schemas we haven't accounted for) sort at
  // the end so they're visually flagged but don't crash the table.
  test("unknown labels sort last", () => {
    expect(setSortKey("???")).toBeGreaterThan(setSortKey("E3"));
    expect(setSortKey("")).toBeGreaterThan(setSortKey("E3"));
  });
});

describe("compareBySetThenPosition", () => {
  // Primary key is the set bucket: a track in S1 always precedes a track
  // in S2 regardless of either track's position-within-set.
  test("sorts by set bucket first", () => {
    const a = { set: "S1", position: 99 };
    const b = { set: "S2", position: 1 };
    expect(compareBySetThenPosition(a, b)).toBeLessThan(0);
    expect(compareBySetThenPosition(b, a)).toBeGreaterThan(0);
  });

  // Within the same set, position breaks the tie — restores the canonical
  // narrative order even after a re-sort on this comparator alone.
  test("breaks set ties by position", () => {
    const a = { set: "S1", position: 1 };
    const b = { set: "S1", position: 5 };
    expect(compareBySetThenPosition(a, b)).toBeLessThan(0);
  });

  // Identical set+position is treated as equal — TanStack uses the row's
  // own id to break further ties downstream.
  test("returns 0 when set and position match", () => {
    const a = { set: "E1", position: 3 };
    const b = { set: "E1", position: 3 };
    expect(compareBySetThenPosition(a, b)).toBe(0);
  });

  // Soundcheck → S1 → encores is the full canonical order; the comparator
  // produces the same result regardless of which two we pick.
  test("preserves the canonical soundcheck → S* → E* order", () => {
    const sc = { set: "soundcheck", position: 1 };
    const s2 = { set: "S2", position: 1 };
    const e1 = { set: "E1", position: 1 };
    expect(compareBySetThenPosition(sc, s2)).toBeLessThan(0);
    expect(compareBySetThenPosition(s2, e1)).toBeLessThan(0);
  });
});

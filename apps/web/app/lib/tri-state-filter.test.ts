import { describe, expect, test } from "vitest";
import { matchesTriState, parseTriState, TRI_STATE_NEXT, writeTriState } from "~/lib/tri-state-filter";

describe("matchesTriState", () => {
  // Positive keeps only items that have the thing.
  test("positive keeps items with the attribute, drops those without", () => {
    expect(matchesTriState("positive", true)).toBe(true);
    expect(matchesTriState("positive", false)).toBe(false);
  });

  // Negative is the inverse — keeps only items that lack the thing.
  test("negative keeps items without the attribute, drops those with", () => {
    expect(matchesTriState("negative", false)).toBe(true);
    expect(matchesTriState("negative", true)).toBe(false);
  });

  // Empty and undefined are both the no-filter state — everything passes.
  test("empty and undefined keep everything", () => {
    expect(matchesTriState("empty", true)).toBe(true);
    expect(matchesTriState("empty", false)).toBe(true);
    expect(matchesTriState(undefined, true)).toBe(true);
    expect(matchesTriState(undefined, false)).toBe(true);
  });
});

describe("parseTriState", () => {
  // Missing key in URLSearchParams.get() returns null — that's the empty state.
  test("returns empty when value is null", () => {
    expect(parseTriState(null)).toBe("empty");
  });

  // The canonical positive serialization.
  test("returns positive for 'yes'", () => {
    expect(parseTriState("yes")).toBe("positive");
  });

  // The only string that means negative — anything else with a value reads positive.
  test("returns negative for 'no'", () => {
    expect(parseTriState("no")).toBe("negative");
  });

  // Permissive positive parsing: bare-key `?archive` (URLSearchParams.get
  // returns ""), `?archive=true`, and any non-"no" value all read as positive.
  // Lets shared/bookmarked URLs that omit the value or use other truthy
  // strings still narrow the show list.
  test.each(["true", "", "1", "anything"])("returns positive for non-'no' value %p", (value) => {
    expect(parseTriState(value)).toBe("positive");
  });
});

describe("writeTriState", () => {
  // Empty state must remove the key entirely so URLs stay clean and old
  // presence-checks (if any survive) don't read a stale value as positive.
  test("empty deletes the key", () => {
    const params = new URLSearchParams("archive=yes&nugs=no");
    writeTriState(params, "archive", "empty");
    expect(params.has("archive")).toBe(false);
    expect(params.get("nugs")).toBe("no");
  });

  // Positive writes the canonical "yes" value.
  test("positive sets value to 'yes'", () => {
    const params = new URLSearchParams();
    writeTriState(params, "archive", "positive");
    expect(params.get("archive")).toBe("yes");
  });

  // Negative writes the canonical "no" value.
  test("negative sets value to 'no'", () => {
    const params = new URLSearchParams();
    writeTriState(params, "archive", "negative");
    expect(params.get("archive")).toBe("no");
  });

  // Re-writing an already-set key replaces (not duplicates) the value, so
  // cycling between states leaves a single canonical entry.
  test("overwrites an existing value", () => {
    const params = new URLSearchParams("archive=yes");
    writeTriState(params, "archive", "negative");
    expect(params.getAll("archive")).toEqual(["no"]);
  });
});

describe("TRI_STATE_NEXT", () => {
  // The cycle the user requested: empty → positive → negative → empty.
  // Locking this down protects the click-handler in show-filters-nav from
  // accidental reorderings.
  test("cycles empty → positive → negative → empty", () => {
    expect(TRI_STATE_NEXT.empty).toBe("positive");
    expect(TRI_STATE_NEXT.positive).toBe("negative");
    expect(TRI_STATE_NEXT.negative).toBe("empty");
  });
});

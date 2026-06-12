import { describe, expect, test } from "vitest";
import { controlsHiddenByPreset } from "./preset-filters";

describe("controlsHiddenByPreset", () => {
  // No preset → nothing hidden.
  test("returns an empty set with no presets", () => {
    expect(controlsHiddenByPreset()).toEqual(new Set());
    expect(controlsHiddenByPreset({})).toEqual(new Set());
  });

  // Author is more limiting than Type, so an author preset hides both its own
  // control and the kind control.
  test("author preset hides author and kind", () => {
    expect(controlsHiddenByPreset({ author: "a-1" })).toEqual(new Set(["author", "kind"]));
  });

  // Same rule for a pinned musician.
  test("musician preset hides musician and kind", () => {
    expect(controlsHiddenByPreset({ musician: "m-1" })).toEqual(new Set(["musician", "kind"]));
  });

  // The all-timer scope hides both the All-Timer chip (pinned) and the Jam
  // Chart chip (a superset, so a no-op inside all-timers).
  test("allTimer preset hides allTimer and jamChart", () => {
    expect(controlsHiddenByPreset({ filters: "allTimer" })).toEqual(new Set(["allTimer", "jamChart"]));
  });

  // The jam-charts scope hides only its own chip; the All-Timer toggle stays
  // visible because it genuinely narrows the union.
  test("jamChart preset hides only jamChart", () => {
    expect(controlsHiddenByPreset({ filters: "jamChart" })).toEqual(new Set(["jamChart"]));
  });
});

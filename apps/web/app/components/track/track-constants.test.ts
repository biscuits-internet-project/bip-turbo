import { describe, expect, test } from "vitest";

import { compareSets, SEGUE_OPTIONS, SET_OPTIONS } from "./track-constants";

describe("SET_OPTIONS", () => {
  // The set dropdown lists S1-S3 then E1-E3. Order matters — it drives the
  // visual order in the picker, which should match how the band's setlist
  // pages render the same sets.
  test("lists all six set values in S1→E3 order", () => {
    expect(SET_OPTIONS.map((o) => o.value)).toEqual(["S1", "S2", "S3", "E1", "E2", "E3"]);
  });

  // Display labels expand the codes for humans: "Set 1" / "Encore 1" rather
  // than the raw "S1" / "E1".
  test("labels expand codes into 'Set N' / 'Encore N' display text", () => {
    const byValue = Object.fromEntries(SET_OPTIONS.map((o) => [o.value, o.label]));
    expect(byValue.S1).toBe("Set 1");
    expect(byValue.S3).toBe("Set 3");
    expect(byValue.E1).toBe("Encore 1");
    expect(byValue.E3).toBe("Encore 3");
  });
});

describe("SEGUE_OPTIONS", () => {
  // Segue dropdown has two states: no segue (the form sentinel is "none")
  // and ">" for the "song A > song B" continuous-play marker. The API
  // boundary in track-manager.tsx translates "none" → null before saving.
  test("offers a 'none' sentinel and the '>' marker", () => {
    expect(SEGUE_OPTIONS).toEqual([
      { value: "none", label: "No segue" },
      { value: ">", label: ">" },
    ]);
  });
});

describe("compareSets", () => {
  // Within the same type (set vs encore), order by numeric suffix —
  // setlist views render sets in playback order.
  test("orders sets numerically within the S group", () => {
    expect(["S2", "S1", "S3"].sort(compareSets)).toEqual(["S1", "S2", "S3"]);
  });

  test("orders encores numerically within the E group", () => {
    expect(["E3", "E1", "E2"].sort(compareSets)).toEqual(["E1", "E2", "E3"]);
  });

  // Encores always follow the regular sets, regardless of suffix. An
  // encore is "after the show proper", so E1 > S3 even though 1 < 3.
  test("places all encores after all sets", () => {
    expect(["E1", "S3", "S1", "E2"].sort(compareSets)).toEqual(["S1", "S3", "E1", "E2"]);
  });
});

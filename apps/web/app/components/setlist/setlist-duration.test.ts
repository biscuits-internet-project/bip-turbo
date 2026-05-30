import { describe, expect, test } from "vitest";
import { formatSetHeading, summarizeDurations } from "./setlist-duration";

describe("summarizeDurations", () => {
  test("sums known durations and counts none missing when all are timed", () => {
    expect(summarizeDurations([{ duration: 522 }, { duration: 410 }])).toEqual({ seconds: 932, known: 2, missing: 0 });
  });

  test("sums only the known durations and counts the rest as missing", () => {
    expect(summarizeDurations([{ duration: 522 }, { duration: null }, { duration: null }])).toEqual({
      seconds: 522,
      known: 1,
      missing: 2,
    });
  });

  test("reports nothing known when no track is timed", () => {
    expect(summarizeDurations([{ duration: null }, { duration: null }])).toEqual({ seconds: 0, known: 0, missing: 2 });
  });
});

describe("formatSetHeading", () => {
  test("spells out regular sets", () => {
    expect(formatSetHeading("S1", 1)).toBe("Set 1");
    expect(formatSetHeading("S2", 1)).toBe("Set 2");
  });

  test("drops the number for a lone encore", () => {
    expect(formatSetHeading("E1", 1)).toBe("Encore");
  });

  test("numbers encores when the show has more than one", () => {
    expect(formatSetHeading("E1", 2)).toBe("Encore 1");
    expect(formatSetHeading("E2", 2)).toBe("Encore 2");
  });

  test("renders an unrecognized label verbatim", () => {
    expect(formatSetHeading("Soundcheck", 0)).toBe("Soundcheck");
  });
});

import { describe, expect, test } from "vitest";
import { formatSetHeading, partialDurationNote, summarizeDurations } from "./setlist-duration";

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

describe("partialDurationNote", () => {
  // The setlist's footnote line, its per-set tooltip, and the shows table's
  // Show time tooltip all read this one sentence, so a total marked partial
  // says the same thing wherever it appears.
  test("explains how many tracks are missing", () => {
    expect(partialDurationNote(5)).toBe("Partial: 5 tracks not yet timed");
  });

  test("uses the singular for a lone untimed track", () => {
    expect(partialDurationNote(1)).toBe("Partial: 1 track not yet timed");
  });

  test("returns null for a complete total so callers can render it unconditionally", () => {
    expect(partialDurationNote(0)).toBeNull();
  });
});

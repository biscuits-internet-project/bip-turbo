import { describe, expect, test } from "vitest";
import { formatDuration, parseDuration } from "./duration";

// ---------------------------------------------------------------------------
// formatDuration — seconds → "m:ss" / "h:mm:ss"
// ---------------------------------------------------------------------------

describe("formatDuration", () => {
  // Drives the per-track Time column and the per-set / show-total labels.

  test("formats sub-minute durations with a zero minute", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(42)).toBe("0:42");
  });

  test("formats minutes:seconds with a non-padded minute under an hour", () => {
    expect(formatDuration(522)).toBe("8:42");
    expect(formatDuration(3133)).toBe("52:13");
  });

  test("switches to h:mm:ss at one hour, zero-padding minutes and seconds", () => {
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3858)).toBe("1:04:18");
  });

  test("rounds fractional seconds (archive lengths arrive as floats)", () => {
    expect(formatDuration(179.51)).toBe("3:00");
    expect(formatDuration(8.4)).toBe("0:08");
  });

  test("returns empty string for invalid input", () => {
    expect(formatDuration(Number.NaN)).toBe("");
    expect(formatDuration(-5)).toBe("");
  });
});

// ---------------------------------------------------------------------------
// parseDuration — admin input "h:mm:ss" / "m:ss" / raw seconds → seconds
// ---------------------------------------------------------------------------

describe("parseDuration", () => {
  // Backs the admin per-track duration field, which accepts any of the three
  // forms a human might type.

  test("parses m:ss", () => {
    expect(parseDuration("8:42")).toBe(522);
    expect(parseDuration("0:42")).toBe(42);
    expect(parseDuration("52:13")).toBe(3133);
  });

  test("parses h:mm:ss", () => {
    expect(parseDuration("1:04:18")).toBe(3858);
    expect(parseDuration("1:00:00")).toBe(3600);
  });

  test("parses raw seconds (string or number)", () => {
    expect(parseDuration("522")).toBe(522);
    expect(parseDuration(522)).toBe(522);
    expect(parseDuration("0")).toBe(0);
  });

  test("trims surrounding whitespace", () => {
    expect(parseDuration("  52:13  ")).toBe(3133);
  });

  test("rejects out-of-range minute/second parts", () => {
    expect(parseDuration("8:60")).toBeNull();
    expect(parseDuration("1:60:00")).toBeNull();
  });

  test("rejects garbage and negatives", () => {
    expect(parseDuration("")).toBeNull();
    expect(parseDuration("abc")).toBeNull();
    expect(parseDuration("-5")).toBeNull();
    expect(parseDuration(-5)).toBeNull();
    expect(parseDuration("5.5")).toBeNull();
  });
});

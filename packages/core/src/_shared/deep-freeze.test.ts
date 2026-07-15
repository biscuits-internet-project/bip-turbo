import { describe, expect, test } from "vitest";
import { deepFreeze } from "./deep-freeze";

describe("deepFreeze", () => {
  // The whole point over Object.freeze: a memoized payload's nested arrays
  // and objects (sets, tracks) must also reject mutation, not just the root.
  test("freezes nested objects and arrays so mutation throws at any depth", () => {
    const value = deepFreeze({
      show: { date: "1999-12-31" },
      sets: [{ label: "S1", tracks: [{ title: "Munchkin Invasion" }] }],
    });

    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.sets)).toBe(true);
    expect(Object.isFrozen(value.sets[0].tracks[0])).toBe(true);
    expect(() => {
      (value.show as { date: string }).date = "2000-01-01";
    }).toThrow(TypeError);
    expect(() => {
      (value.sets as unknown[]).push({ label: "E" });
    }).toThrow(TypeError);
  });

  // Callers memoize the return value directly, so it must be the same
  // reference, not a frozen copy.
  test("returns the same reference it was given", () => {
    const value = { sets: [] };

    expect(deepFreeze(value)).toBe(value);
  });

  // Leaf values inside JSON payloads (strings, numbers, null) reach the
  // recursion; they must pass through without error.
  test("passes primitives and null through unchanged", () => {
    expect(deepFreeze(null)).toBeNull();
    expect(deepFreeze(42)).toBe(42);
    expect(deepFreeze("Aceetobee")).toBe("Aceetobee");
  });

  // Re-freezing (e.g. a memo refresh handing back the same object) must be
  // a harmless no-op, not an error.
  test("is idempotent on an already-frozen value", () => {
    const value = deepFreeze({ sets: [{ label: "S1" }] });

    expect(deepFreeze(value)).toBe(value);
    expect(Object.isFrozen(value.sets[0])).toBe(true);
  });
});

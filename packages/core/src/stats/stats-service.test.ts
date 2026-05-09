import { describe, expect, test } from "vitest";
import { songStatsChanged } from "./stats-service";

const baseFresh = {
  timesPlayed: 3,
  dateFirstPlayed: new Date("2010-01-01"),
  dateLastPlayed: new Date("2012-06-15"),
  yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
};

describe("songStatsChanged", () => {
  // Identical values must not trigger a write — this is the whole reason
  // diff-before-write exists.
  test("returns false when current row exactly matches the freshly-computed aggregate", () => {
    const current = {
      timesPlayed: 3,
      dateFirstPlayed: new Date("2010-01-01"),
      dateLastPlayed: new Date("2012-06-15"),
      yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // Counter changed → must write. The cheapest possible diff hit.
  test("returns true when timesPlayed changed", () => {
    const current = { ...baseFresh, timesPlayed: 2 };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Date objects with the same wall-clock value must compare equal — we
  // diff via getTime(), not reference equality, so two `new Date(...)`
  // calls for the same date don't spuriously trigger a write.
  test("returns false for distinct Date instances representing the same moment", () => {
    const current = {
      timesPlayed: 3,
      dateFirstPlayed: new Date("2010-01-01"),
      dateLastPlayed: new Date("2012-06-15"),
      yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // Date moved → must write. Latest play could shift earlier (delete) or
  // later (new performance).
  test("returns true when dateLastPlayed shifted", () => {
    const current = { ...baseFresh, dateLastPlayed: new Date("2012-06-14") };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Null ↔ Date transitions: a song going from never-played to debut, or
  // having every track removed.
  test("returns true when one date is null and the other is set", () => {
    const current = { ...baseFresh, dateFirstPlayed: null };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  test("returns false when both dates are null", () => {
    const empty = {
      timesPlayed: 0,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      yearlyPlayData: {},
    };
    expect(songStatsChanged(empty, empty)).toBe(false);
  });

  // jsonb doesn't preserve insertion order on round-trip, so the comparator
  // must normalize before comparing — otherwise every song would diff dirty
  // forever and we'd write every row on every rebuild.
  test("returns false when yearlyPlayData differs only by key order", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2012": 1, "2010": 1, "2011": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // A real change in the year buckets — a play moved from one year to
  // another, or a count changed.
  test("returns true when a yearlyPlayData count differs", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2010": 1, "2011": 2, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Adding or removing a year bucket entirely.
  test("returns true when yearlyPlayData has a different set of years", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2010": 1, "2011": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Prisma's JsonValue can be null for a column that was never set.
  // Guard against treating `null` as an empty object accidentally — a
  // null vs `{}` is an actual change worth writing.
  test("returns true when current yearlyPlayData is null and fresh has data", () => {
    const current = { ...baseFresh, yearlyPlayData: null as unknown };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import { DRUMMER_ERAS, drummerEraForDate } from "./drummer-era";

// drummerEraForDate buckets a show by who was on drums, derived purely from the
// date. Boundaries are the successor drummer's first-show date, frozen from the
// lineup data: Aucoin debuts 2005-12-28, Marlon debuts 2025-10-31.
describe("drummerEraForDate", () => {
  test("dates before Aucoin's debut are the Altman era", () => {
    expect(drummerEraForDate("1995-02-11")).toBe("ALTMAN");
    expect(drummerEraForDate("2004-12-31")).toBe("ALTMAN");
  });

  test("Aucoin's debut date opens the Aucoin era (boundary is inclusive)", () => {
    expect(drummerEraForDate("2005-12-27")).toBe("ALTMAN");
    expect(drummerEraForDate("2005-12-28")).toBe("AUCOIN");
  });

  test("Altman sit-ins during the Aucoin era still bucket by date, not lineup", () => {
    // Altman has lineup rows as late as 2010; by date these are Aucoin-era shows.
    expect(drummerEraForDate("2010-12-30")).toBe("AUCOIN");
  });

  test("Marlon's debut date opens the Marlon era (boundary is inclusive)", () => {
    expect(drummerEraForDate("2025-10-30")).toBe("AUCOIN");
    expect(drummerEraForDate("2025-10-31")).toBe("MARLON");
    expect(drummerEraForDate("2026-06-13")).toBe("MARLON");
  });
});

describe("vocabulary constants", () => {
  test("the three drummer eras are the canonical drummer list", () => {
    expect(DRUMMER_ERAS).toEqual(["ALTMAN", "AUCOIN", "MARLON"]);
  });
});

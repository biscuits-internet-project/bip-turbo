import { describe, expect, test } from "vitest";
import {
  DEBUT_FOOTNOTE_START_DATE,
  debutFootnoteSuppressed,
  GAP_FOOTNOTE_START_DATE,
  gapFootnoteSuppressed,
} from "./footnote-constants";

describe("debutFootnoteSuppressed", () => {
  test("a show before the debut start date is suppressed", () => {
    expect(debutFootnoteSuppressed("1998-02-18")).toBe(true);
    expect(debutFootnoteSuppressed("1995-04-21")).toBe(true);
  });

  test("the debut start date itself shows debuts (it's the first trustworthy show)", () => {
    expect(debutFootnoteSuppressed(DEBUT_FOOTNOTE_START_DATE)).toBe(false);
  });

  test("a show after the debut start date is not suppressed", () => {
    expect(debutFootnoteSuppressed("2024-05-02")).toBe(false);
  });

  test("a missing date is not suppressed", () => {
    expect(debutFootnoteSuppressed(undefined)).toBe(false);
    expect(debutFootnoteSuppressed(null)).toBe(false);
    expect(debutFootnoteSuppressed("")).toBe(false);
  });
});

describe("gapFootnoteSuppressed", () => {
  test("a show before the gap start date is suppressed", () => {
    expect(gapFootnoteSuppressed("1998-08-27")).toBe(true);
  });

  test("the gap start date itself shows gap footnotes", () => {
    expect(gapFootnoteSuppressed(GAP_FOOTNOTE_START_DATE)).toBe(false);
  });

  test("a missing date is not suppressed", () => {
    expect(gapFootnoteSuppressed(undefined)).toBe(false);
  });

  // Debuts firm up before gaps, so a show between the two dates shows debuts but
  // still suppresses the gap-derived footnotes.
  test("a show between the two dates suppresses gaps but not debuts", () => {
    const between = "1998-05-01";
    expect(debutFootnoteSuppressed(between)).toBe(false);
    expect(gapFootnoteSuppressed(between)).toBe(true);
  });
});

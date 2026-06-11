import { describe, expect, test } from "vitest";
import { matchesStateFilter, venueMatchesSearch } from "./venue-filters";

const fillmore = { name: "The Fillmore", city: "San Francisco", state: "CA", country: "United States" };
const reykjavik = { name: "Harpa", city: "Reykjavik", state: null, country: "Iceland" };

describe("venueMatchesSearch", () => {
  test("empty query matches everything", () => {
    expect(venueMatchesSearch(fillmore, "")).toBe(true);
  });

  // The single search box stands in for the old multi-field filter, so a
  // query that only hits city/state/country must still match.
  test("matches on city, state, and country, not just name", () => {
    expect(venueMatchesSearch(fillmore, "francisco")).toBe(true);
    expect(venueMatchesSearch(fillmore, "ca")).toBe(true);
    expect(venueMatchesSearch(reykjavik, "iceland")).toBe(true);
  });

  test("is case-insensitive and returns false on no match", () => {
    expect(venueMatchesSearch(fillmore, "FILLMORE")).toBe(true);
    expect(venueMatchesSearch(fillmore, "brooklyn")).toBe(false);
  });
});

describe("matchesStateFilter", () => {
  test("empty filter matches everything", () => {
    expect(matchesStateFilter(fillmore, "")).toBe(true);
    expect(matchesStateFilter(reykjavik, "")).toBe(true);
  });

  // "international" = no US state, i.e. a venue with no state or a non-US country.
  test("international matches venues outside the US", () => {
    expect(matchesStateFilter(reykjavik, "international")).toBe(true);
    expect(matchesStateFilter(fillmore, "international")).toBe(false);
  });

  test("a specific state code matches only that state", () => {
    expect(matchesStateFilter(fillmore, "CA")).toBe(true);
    expect(matchesStateFilter(fillmore, "NY")).toBe(false);
  });
});

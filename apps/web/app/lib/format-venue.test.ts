import { describe, expect, it } from "vitest";
import { formatVenueLocation, venueAddressCountry } from "./format-venue";

/**
 * Venue location string shown next to a venue name. International venues have an
 * empty `state`, so the country has to fill in or the line reads "City," with a
 * dangling comma. US venues keep the familiar "City, ST" and omit the country
 * (stored as either "USA" or "United States").
 */
describe("formatVenueLocation", () => {
  it("appends the country when state is empty (international venue)", () => {
    expect(formatVenueLocation({ city: "Reykjavik", state: "", country: "Iceland" })).toBe("Reykjavik, Iceland");
  });

  it("shows City, ST for a US venue and omits country 'USA'", () => {
    expect(formatVenueLocation({ city: "San Francisco", state: "CA", country: "USA" })).toBe("San Francisco, CA");
  });

  it("omits country when it is 'United States' (the value most US rows store)", () => {
    expect(formatVenueLocation({ city: "Philadelphia", state: "PA", country: "United States" })).toBe(
      "Philadelphia, PA",
    );
  });

  it("includes both state and country when both are present and non-US", () => {
    expect(formatVenueLocation({ city: "Toronto", state: "ON", country: "Canada" })).toBe("Toronto, ON, Canada");
  });

  it("returns just the city when state and country are both empty", () => {
    expect(formatVenueLocation({ city: "Atlantis", state: "", country: "" })).toBe("Atlantis");
  });

  // The Prisma Venue type carries state/country as nullable; null must behave
  // like empty (no dangling comma, no "null" text) since the DB stores NULL for
  // international venues' state.
  it("treats null state/country like empty", () => {
    expect(formatVenueLocation({ city: "Reykjavik", state: null, country: "Iceland" })).toBe("Reykjavik, Iceland");
    expect(formatVenueLocation({ city: "Nowhere", state: null, country: null })).toBe("Nowhere");
  });

  // A venue can have a name but a missing city (rare null in the DB). The result
  // is empty so callers prefixing a name can `[name, location].filter(Boolean)`
  // without producing "Name, undefined".
  it("returns an empty string when city is missing", () => {
    expect(formatVenueLocation({ city: "", state: "NY", country: "USA" })).toBe("");
  });
});

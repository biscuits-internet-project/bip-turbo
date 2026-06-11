import type { VenueShowAggregate } from "@bip/core";
import type { Venue } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { buildVenueRows } from "./venue-rows";

function venue(overrides: Partial<Venue> & Pick<Venue, "id" | "name">): Venue {
  return {
    slug: overrides.name.toLowerCase().replace(/\s+/g, "-"),
    city: "Mukltea",
    state: "NY",
    country: "United States",
    timesPlayed: 0,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    ...overrides,
  } as Venue;
}

function aggregate(overrides: Partial<VenueShowAggregate> & Pick<VenueShowAggregate, "venueId">): VenueShowAggregate {
  return {
    showCount: 1,
    years: [2019],
    firstSlug: "2019-01-01-show",
    firstDate: "2019-01-01",
    lastSlug: "2019-12-31-show",
    lastDate: "2019-12-31",
    ...overrides,
  };
}

describe("buildVenueRows", () => {
  test("merges each venue with its aggregate by id", () => {
    const rows = buildVenueRows(
      [venue({ id: "v1", name: "Starland Ballroom" })],
      [aggregate({ venueId: "v1", showCount: 7, years: [2019, 2017] })],
    );

    expect(rows).toEqual([
      expect.objectContaining({
        id: "v1",
        name: "Starland Ballroom",
        showCount: 7,
        years: [2019, 2017],
        firstSlug: "2019-01-01-show",
        firstDate: "2019-01-01",
        lastSlug: "2019-12-31-show",
        lastDate: "2019-12-31",
      }),
    ]);
  });

  // A venue with no shows gets a zeroed row (it has no aggregate). The loader
  // hides these from non-admins; admins keep them so they can delete them.
  test("zeroes stats for a venue with no aggregate", () => {
    const rows = buildVenueRows([venue({ id: "v2", name: "Tweed" })], []);

    expect(rows[0]).toMatchObject({
      id: "v2",
      showCount: 0,
      years: [],
      firstSlug: null,
      firstDate: null,
      lastSlug: null,
      lastDate: null,
    });
  });
});

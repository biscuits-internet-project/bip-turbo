import { describe, expect, test } from "vitest";
import { type ShowCountFacets, showCountsByYearFromFacets, showFacetMask } from "./show-count-facets";

describe("showFacetMask", () => {
  // The bit each flag owns is the contract between the server that builds a
  // facet blob and the client that reads it, so an encoding that loses or
  // collides a flag has to fail here rather than silently miscount a year.
  test("gives every flag its own bit and combines them", () => {
    expect(showFacetMask({ photos: false, youtube: false, nugs: false, archive: false, relisten: false })).toBe(0);

    const masks = [
      showFacetMask({ photos: true, youtube: false, nugs: false, archive: false, relisten: false }),
      showFacetMask({ photos: false, youtube: true, nugs: false, archive: false, relisten: false }),
      showFacetMask({ photos: false, youtube: false, nugs: true, archive: false, relisten: false }),
      showFacetMask({ photos: false, youtube: false, nugs: false, archive: true, relisten: false }),
      showFacetMask({ photos: false, youtube: false, nugs: false, archive: false, relisten: true }),
    ];

    expect(new Set(masks).size).toBe(5);
    expect(showFacetMask({ photos: true, youtube: true, nugs: true, archive: true, relisten: true })).toBe(
      masks.reduce((all, bit) => all | bit, 0),
    );
  });
});

describe("showCountsByYearFromFacets", () => {
  const photos = showFacetMask({ photos: true, youtube: false, nugs: false, archive: false, relisten: false });
  const nugs = showFacetMask({ photos: false, youtube: false, nugs: true, archive: false, relisten: false });
  const archive = showFacetMask({ photos: false, youtube: false, nugs: false, archive: true, relisten: false });
  const none = 0;

  // With nothing active every bucket contributes, which is what the bare year
  // URL renders beside each year in Filter-by-Year.
  test("sums every bucket when no filters are active", () => {
    const facets: ShowCountFacets = {
      2004: { [none]: 2, [photos]: 3 },
      2023: { [nugs]: 1 },
    };

    expect(showCountsByYearFromFacets(facets, {})).toEqual({ 2004: 5, 2023: 1 });
  });

  test("photos=positive counts only buckets carrying the photos bit", () => {
    const facets: ShowCountFacets = {
      2004: { [none]: 2, [photos]: 3 },
      2023: { [photos | nugs]: 1 },
    };

    expect(showCountsByYearFromFacets(facets, { photos: "positive" })).toEqual({ 2004: 3, 2023: 1 });
  });

  test("photos=negative counts only buckets without the photos bit", () => {
    const facets: ShowCountFacets = {
      2004: { [none]: 2, [photos]: 3 },
      2023: { [photos]: 1 },
    };

    expect(showCountsByYearFromFacets(facets, { photos: "negative" })).toEqual({ 2004: 2 });
  });

  // The headline mixed case: shows with archive but no nugs. Every active flag
  // has to hold for a bucket to count.
  test("combines active flags with AND", () => {
    const facets: ShowCountFacets = {
      2004: {
        [archive]: 4, // archive yes, nugs no → keep
        [archive | nugs]: 7, // both → drop
        [nugs]: 2, // archive no → drop
        [none]: 9, // neither → drop
      },
    };

    expect(showCountsByYearFromFacets(facets, { archive: "positive", nugs: "negative" })).toEqual({ 2004: 4 });
  });

  // Callers pass whatever they parsed out of the URL without normalizing, so an
  // explicit "empty" has to read the same as an absent key.
  test("treats empty tri-state as no filter", () => {
    const facets: ShowCountFacets = { 2004: { [none]: 2, [photos]: 3 } };

    expect(
      showCountsByYearFromFacets(facets, {
        photos: "empty",
        youtube: "empty",
        nugs: "empty",
        archive: "empty",
        relisten: "empty",
      }),
    ).toEqual({ 2004: 5 });
  });

  // Matches what the loader used to return: a year with nothing matching is
  // absent rather than zero, so callers can tell "no data" from "no matches".
  test("omits years with no matching shows", () => {
    const facets: ShowCountFacets = { 2004: { [none]: 2 }, 2023: { [photos]: 1 } };

    const result = showCountsByYearFromFacets(facets, { photos: "positive" });

    expect(result).toEqual({ 2023: 1 });
    expect(result[2004]).toBeUndefined();
  });

  // The blob reaches the component through JSON, which stringifies every
  // numeric key. Reading it back has to survive that round trip.
  test("reads a JSON round-tripped blob", () => {
    const facets: ShowCountFacets = { 2004: { [none]: 2, [photos]: 3 } };

    const roundTripped = JSON.parse(JSON.stringify(facets)) as ShowCountFacets;

    expect(showCountsByYearFromFacets(roundTripped, { photos: "positive" })).toEqual({ 2004: 3 });
  });

  test("returns an empty map for an empty blob", () => {
    expect(showCountsByYearFromFacets({}, { photos: "positive" })).toEqual({});
  });
});

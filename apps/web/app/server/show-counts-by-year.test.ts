import { beforeEach, describe, expect, test, vi } from "vitest";
import { computeShowCountsByYear } from "./show-counts-by-year";

// Mirror the show-external-sources.test.ts shape — swap `services` to use
// per-test mocks so each assertion can shape both catalogs independently.
const getReleaseUrlsByDate = vi.fn();
const getPrimaryUrlsByDate = vi.fn();
const getShowDatesWithFlags = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    nugs: { getReleaseUrlsByDate: () => getReleaseUrlsByDate() },
    archiveDotOrg: { getPrimaryUrlsByDate: () => getPrimaryUrlsByDate() },
    shows: { getShowDatesWithFlags: () => getShowDatesWithFlags() },
  },
}));

describe("computeShowCountsByYear", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getReleaseUrlsByDate.mockResolvedValue({});
    getPrimaryUrlsByDate.mockResolvedValue({});
    getShowDatesWithFlags.mockResolvedValue([]);
  });

  // With no filter flags, every show contributes to its year's bucket.
  test("buckets every show into its year when no filters active", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2004-12-31", hasPhotos: true, hasYoutube: true },
      { date: "2023-06-15", hasPhotos: false, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({});

    expect(result).toEqual({ 2004: 2, 2023: 1 });
  });

  // Positive photos filter — denormalized flag, no catalog lookups needed.
  test("photos=positive counts only shows with photos", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({ photos: "positive" });

    expect(result).toEqual({ 2004: 1, 2023: 1 });
  });

  // Negative photos — the inverse. Required for the user's "shows without
  // photos in 2004" use case from the year-page sidebar.
  test("photos=negative counts only shows without photos", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({ photos: "negative" });

    expect(result).toEqual({ 2004: 1 });
  });

  // Positive nugs intersects show dates with the nugs catalog (one Redis read).
  test("nugs=positive counts only shows present in the nugs catalog", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: false, hasYoutube: false },
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": ["https://play.nugs.net/release/1"],
      "2023-06-15": ["https://play.nugs.net/release/2"],
    });

    const result = await computeShowCountsByYear({ nugs: "positive" });

    expect(result).toEqual({ 2004: 1, 2023: 1 });
  });

  // Negative nugs — keep only shows NOT in the catalog. Crucially the
  // catalog must be fetched for the negative branch too: we can't decide
  // "not in nugs" without knowing which dates are in nugs.
  test("nugs=negative counts only shows missing from the nugs catalog", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: false, hasYoutube: false },
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": ["https://play.nugs.net/release/1"],
    });

    const result = await computeShowCountsByYear({ nugs: "negative" });

    expect(getReleaseUrlsByDate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ 2019: 1, 2023: 1 });
  });

  // Mixed positive + negative: the user's headline use case at the year-bucket
  // level. Counts shows with archive AND without nugs.
  test("archive=positive + nugs=negative counts shows with archive but no nugs", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false }, // archive yes, nugs no → keep
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false }, // archive yes, nugs yes → drop
      { date: "2019-08-10", hasPhotos: false, hasYoutube: false }, // archive no, nugs no → drop
      { date: "2023-06-15", hasPhotos: false, hasYoutube: false }, // archive no, nugs yes → drop
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": ["nugs"],
      "2023-06-15": ["nugs"],
    });
    getPrimaryUrlsByDate.mockResolvedValue({
      "2004-06-01": "archive",
      "2004-12-31": "archive",
    });

    const result = await computeShowCountsByYear({ archive: "positive", nugs: "negative" });

    expect(result).toEqual({ 2004: 1 });
  });

  // All flags positive combine with AND — every active filter must match
  // for a show to be counted in its year bucket.
  test("all positives combine with AND across photos/youtube/nugs/archive", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: true, hasYoutube: true }, // in both catalogs
      { date: "2019-08-10", hasPhotos: true, hasYoutube: true }, // not in nugs
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false }, // missing youtube
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": ["nugs-url"],
      "2023-06-15": ["nugs-url"],
    });
    getPrimaryUrlsByDate.mockResolvedValue({
      "2004-12-31": "archive-url",
      "2019-08-10": "archive-url",
    });

    const result = await computeShowCountsByYear({
      photos: "positive",
      youtube: "positive",
      nugs: "positive",
      archive: "positive",
    });

    expect(result).toEqual({ 2004: 1 });
  });

  // Empty tri-state must behave identically to the flag being absent — no
  // catalog reads, no filtering. Protects callers that pass through whatever
  // state they parsed from the URL without normalizing first.
  test("empty tri-state behaves like no filter", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({
      photos: "empty",
      youtube: "empty",
      nugs: "empty",
      archive: "empty",
    });

    expect(getReleaseUrlsByDate).not.toHaveBeenCalled();
    expect(getPrimaryUrlsByDate).not.toHaveBeenCalled();
    expect(result).toEqual({ 2004: 1, 2023: 1 });
  });

  // Years with zero matching shows don't appear in the result map, so the
  // caller can distinguish "no data" from "0 shows in this year".
  test("omits years with zero matching shows", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({ photos: "positive" });

    expect(result).toEqual({ 2023: 1 });
    expect(result[2004]).toBeUndefined();
  });
});

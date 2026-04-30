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

  // Photo filter uses the denormalized flag — no catalog lookups needed.
  test("counts only shows with photos when photos flag is on", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({ photos: true });

    expect(result).toEqual({ 2004: 1, 2023: 1 });
  });

  // Nugs filter intersects show dates with the nugs catalog (one Redis read).
  test("counts only shows present in the nugs catalog when nugs flag is on", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: false, hasYoutube: false },
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": "https://play.nugs.net/release/1",
      "2023-06-15": "https://play.nugs.net/release/2",
    });

    const result = await computeShowCountsByYear({ nugs: true });

    expect(result).toEqual({ 2004: 1, 2023: 1 });
  });

  // Archive filter mirrors nugs but uses the archive.org catalog.
  test("counts only shows present in the archive catalog when archive flag is on", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: false },
    ]);
    getPrimaryUrlsByDate.mockResolvedValue({
      "2019-08-10": "https://archive.org/details/db2019",
    });

    const result = await computeShowCountsByYear({ archive: true });

    expect(result).toEqual({ 2019: 1 });
  });

  // All flags combine with AND — a show needs to pass every active filter to
  // be counted. Covers the worst-case "stacked filters" path end-to-end.
  test("combines flags with AND across photos/youtube/nugs/archive", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: true, hasYoutube: true }, // in both catalogs
      { date: "2019-08-10", hasPhotos: true, hasYoutube: true }, // not in nugs
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false }, // missing youtube
    ]);
    getReleaseUrlsByDate.mockResolvedValue({
      "2004-12-31": "nugs-url",
      "2023-06-15": "nugs-url",
    });
    getPrimaryUrlsByDate.mockResolvedValue({
      "2004-12-31": "archive-url",
      "2019-08-10": "archive-url",
    });

    const result = await computeShowCountsByYear({
      photos: true,
      youtube: true,
      nugs: true,
      archive: true,
    });

    expect(result).toEqual({ 2004: 1 });
  });

  // Years with zero matching shows don't appear in the result map, so the
  // caller can distinguish "no data" from "0 shows in this year".
  test("omits years with zero matching shows", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-12-31", hasPhotos: false, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: false },
    ]);

    const result = await computeShowCountsByYear({ photos: true });

    expect(result).toEqual({ 2023: 1 });
    expect(result[2004]).toBeUndefined();
  });
});

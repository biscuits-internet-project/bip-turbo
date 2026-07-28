import { beforeEach, describe, expect, test, vi } from "vitest";
import { showFacetMask } from "~/lib/show-count-facets";
import { computeShowCountFacets } from "./show-count-facets";

// Mirror the show-external-sources.test.ts shape — swap `services` to use
// per-test mocks so each assertion can shape both catalogs independently.
const getReleaseUrlsByDate = vi.fn();
const getPrimaryUrlsByDate = vi.fn();
const getRelistenUrlsByDate = vi.fn();
const getShowDatesWithFlags = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    nugs: { getReleaseUrlsByDate: () => getReleaseUrlsByDate() },
    archiveDotOrg: { getPrimaryUrlsByDate: () => getPrimaryUrlsByDate() },
    relisten: { getUrlsByDate: () => getRelistenUrlsByDate() },
    shows: { getShowDatesWithFlags: () => getShowDatesWithFlags() },
  },
}));

function mask(has: Partial<Record<"photos" | "youtube" | "nugs" | "archive" | "relisten", boolean>>) {
  return showFacetMask({
    photos: false,
    youtube: false,
    nugs: false,
    archive: false,
    relisten: false,
    ...has,
  });
}

describe("computeShowCountFacets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getReleaseUrlsByDate.mockResolvedValue({});
    getPrimaryUrlsByDate.mockResolvedValue({});
    getRelistenUrlsByDate.mockResolvedValue({});
    getShowDatesWithFlags.mockResolvedValue([]);
  });

  test("returns an empty blob when there are no shows", async () => {
    expect(await computeShowCountFacets()).toEqual({});
  });

  // Shows with the same flags share a bucket; different flags split into their
  // own. This is the whole reason the blob stays small.
  test("buckets shows by year and by the flags they carry", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2004-06-01", hasPhotos: false, hasYoutube: false },
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2004-08-02", hasPhotos: true, hasYoutube: false },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: true },
    ]);

    expect(await computeShowCountFacets()).toEqual({
      2004: { [mask({})]: 1, [mask({ photos: true })]: 2 },
      2023: { [mask({ photos: true, youtube: true })]: 1 },
    });
  });

  // The three external catalogs are date-keyed, so a show earns its nugs /
  // archive / relisten bit by having an entry for its own date.
  test("sets the external-source bits from the catalogs", async () => {
    getShowDatesWithFlags.mockResolvedValue([
      { date: "2001-03-17", hasPhotos: false, hasYoutube: false },
      { date: "2001-08-10", hasPhotos: false, hasYoutube: false },
    ]);
    getReleaseUrlsByDate.mockResolvedValue({ "2001-03-17": ["https://play.nugs.net/release/1"] });
    getPrimaryUrlsByDate.mockResolvedValue({ "2001-03-17": "https://archive.org/details/db" });
    getRelistenUrlsByDate.mockResolvedValue({ "2001-08-10": "https://relisten.net/db/2001-08-10" });

    expect(await computeShowCountFacets()).toEqual({
      2001: {
        [mask({ nugs: true, archive: true })]: 1,
        [mask({ relisten: true })]: 1,
      },
    });
  });

  // An empty nugs array means the catalog knows the date but has no release,
  // which is not the same as having one.
  test("treats an empty nugs release list as no nugs", async () => {
    getShowDatesWithFlags.mockResolvedValue([{ date: "2001-03-17", hasPhotos: false, hasYoutube: false }]);
    getReleaseUrlsByDate.mockResolvedValue({ "2001-03-17": [] });

    expect(await computeShowCountFacets()).toEqual({ 2001: { [mask({})]: 1 } });
  });

  // The blob describes every combination, so it can't skip a catalog the way
  // the old per-request counts could when that filter happened to be inactive.
  test("always reads all three catalogs", async () => {
    await computeShowCountFacets();

    expect(getReleaseUrlsByDate).toHaveBeenCalledTimes(1);
    expect(getPrimaryUrlsByDate).toHaveBeenCalledTimes(1);
    expect(getRelistenUrlsByDate).toHaveBeenCalledTimes(1);
  });
});

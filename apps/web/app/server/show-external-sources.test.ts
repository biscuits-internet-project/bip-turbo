import { beforeEach, describe, expect, test, vi } from "vitest";
import { computeShowExternalSources } from "./show-external-sources";

const getReleaseUrlsByDate = vi.fn();
const getPrimaryUrlsByDate = vi.fn();
const getFirstVideoUrlByShowIds = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    nugs: { getReleaseUrlsByDate: () => getReleaseUrlsByDate() },
    archiveDotOrg: { getPrimaryUrlsByDate: () => getPrimaryUrlsByDate() },
    youtube: { getFirstVideoUrlByShowIds: (ids: string[]) => getFirstVideoUrlByShowIds(ids) },
  },
}));

describe("computeShowExternalSources", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getReleaseUrlsByDate.mockResolvedValue({});
    getPrimaryUrlsByDate.mockResolvedValue({});
    getFirstVideoUrlByShowIds.mockResolvedValue({});
  });

  // Empty input short-circuits so loaders can pass whatever list they have
  // without ever paying for a Redis or DB round-trip.
  test("returns empty object and skips service calls for empty input", async () => {
    const result = await computeShowExternalSources([]);

    expect(result).toEqual({});
    expect(getReleaseUrlsByDate).not.toHaveBeenCalled();
    expect(getPrimaryUrlsByDate).not.toHaveBeenCalled();
    expect(getFirstVideoUrlByShowIds).not.toHaveBeenCalled();
  });

  // Shows are keyed by id in the result; nugs/archive URLs lookup by date,
  // youtube URLs lookup by show id — this wiring is the whole point.
  test("maps each show to its resolved URLs by date + show id", async () => {
    getReleaseUrlsByDate.mockResolvedValue({ "2004-12-31": "https://play.nugs.net/release/1" });
    getPrimaryUrlsByDate.mockResolvedValue({ "2004-12-31": "https://archive.org/details/db2004" });
    getFirstVideoUrlByShowIds.mockResolvedValue({ "show-nye04": "https://youtube.com/watch?v=aaa" });

    const result = await computeShowExternalSources([{ id: "show-nye04", date: "2004-12-31" }]);

    expect(result).toEqual({
      "show-nye04": {
        nugsUrl: "https://play.nugs.net/release/1",
        archiveUrl: "https://archive.org/details/db2004",
        youtubeUrl: "https://youtube.com/watch?v=aaa",
      },
    });
  });

  // Missing entries in any of the three source maps come through as
  // `undefined` fields — the badge component treats undefined as "skip" so
  // there's no need to filter them out here.
  test("leaves fields undefined when a source has no entry for the show", async () => {
    getReleaseUrlsByDate.mockResolvedValue({});
    getPrimaryUrlsByDate.mockResolvedValue({ "2019-08-10": "https://archive.org/details/db2019" });
    getFirstVideoUrlByShowIds.mockResolvedValue({});

    const result = await computeShowExternalSources([{ id: "show-lockn", date: "2019-08-10" }]);

    expect(result["show-lockn"]).toEqual({
      nugsUrl: undefined,
      archiveUrl: "https://archive.org/details/db2019",
      youtubeUrl: undefined,
    });
  });

  // Multiple shows in one call share the two catalog fetches but each gets
  // its own per-id youtube lookup — confirms the batching contract.
  test("resolves multiple shows with a single pass through each service", async () => {
    getReleaseUrlsByDate.mockResolvedValue({ "2004-12-31": "https://play.nugs.net/release/1" });
    getPrimaryUrlsByDate.mockResolvedValue({ "2019-08-10": "https://archive.org/details/db2019" });
    getFirstVideoUrlByShowIds.mockResolvedValue({
      "show-nye04": "https://youtube.com/watch?v=nye",
    });

    const result = await computeShowExternalSources([
      { id: "show-nye04", date: "2004-12-31" },
      { id: "show-lockn", date: "2019-08-10" },
    ]);

    expect(getReleaseUrlsByDate).toHaveBeenCalledTimes(1);
    expect(getPrimaryUrlsByDate).toHaveBeenCalledTimes(1);
    expect(getFirstVideoUrlByShowIds).toHaveBeenCalledTimes(1);
    expect(getFirstVideoUrlByShowIds).toHaveBeenCalledWith(["show-nye04", "show-lockn"]);
    expect(result["show-nye04"].nugsUrl).toBe("https://play.nugs.net/release/1");
    expect(result["show-lockn"].archiveUrl).toBe("https://archive.org/details/db2019");
    expect(result["show-nye04"].archiveUrl).toBeUndefined();
    expect(result["show-lockn"].nugsUrl).toBeUndefined();
  });
});

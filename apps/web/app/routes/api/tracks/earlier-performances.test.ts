import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  adminLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const findEarlierPerformances = vi.fn();
const getCompletionEarlierTrackIds = vi.fn();
const findPerformancesByTrackIds = vi.fn();
vi.mock("~/server/services", () => ({
  services: { tracks: { findEarlierPerformances, getCompletionEarlierTrackIds, findPerformancesByTrackIds } },
}));

const { loader } = await import("./earlier-performances");

function makeRequest(query: string): LoaderFunctionArgs {
  return {
    request: new Request(`http://localhost/api/tracks/earlier-performances${query}`),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs;
}

describe("GET /api/tracks/earlier-performances", () => {
  beforeEach(() => {
    findEarlierPerformances.mockReset().mockResolvedValue([]);
    getCompletionEarlierTrackIds.mockReset().mockResolvedValue([]);
    findPerformancesByTrackIds.mockReset().mockResolvedValue([]);
  });

  // Happy path with a completer trackId: returns the picker options plus the
  // earlier-track ids it already completes (the editor's seeded selection).
  test("returns the song's earlier performances and the completer's current selection", async () => {
    const performances = [{ trackId: "t1", showDate: "2010-01-01", showSlug: "2010-01-01-shimmy" }];
    findEarlierPerformances.mockResolvedValue(performances);
    getCompletionEarlierTrackIds.mockResolvedValue(["t1"]);

    const result = await loader(makeRequest("?songId=song-1&before=2015-01-01&trackId=later-1"));

    expect(findEarlierPerformances).toHaveBeenCalledWith("song-1", "2015-01-01");
    expect(getCompletionEarlierTrackIds).toHaveBeenCalledWith("later-1");
    // t1 is already in the recent list, so no extra by-id fetch is needed.
    expect(findPerformancesByTrackIds).toHaveBeenCalledWith([]);
    expect(result).toEqual({ performances, selected: ["t1"] });
  });

  // A linked completion outside the recent cap is fetched by id and merged in,
  // so its chip still shows a date.
  test("merges selected performances that fall outside the recent cap", async () => {
    const recent = [{ trackId: "t1", showDate: "2014-01-01", showSlug: "2014-01-01-shimmy" }];
    const old = { trackId: "old", showDate: "2001-09-09", showSlug: "2001-09-09-shimmy" };
    findEarlierPerformances.mockResolvedValue(recent);
    getCompletionEarlierTrackIds.mockResolvedValue(["old"]);
    findPerformancesByTrackIds.mockResolvedValue([old]);

    const result = await loader(makeRequest("?songId=song-1&before=2015-01-01&trackId=later-1"));

    expect(findPerformancesByTrackIds).toHaveBeenCalledWith(["old"]);
    expect(result).toEqual({ performances: [old, ...recent], selected: ["old"] });
  });

  // Without a trackId (a track still being added) the selection is empty and the
  // completion reader is never hit.
  test("returns an empty selection when no completer trackId is given", async () => {
    const result = await loader(makeRequest("?songId=song-1&before=2015-01-01"));

    expect(getCompletionEarlierTrackIds).not.toHaveBeenCalled();
    expect(result).toEqual({ performances: [], selected: [] });
  });

  // Both required params must be present; a missing one is a 400, not a silent
  // catalog-wide query.
  test("rejects a missing songId or before with 400", async () => {
    await expect(loader(makeRequest("?before=2015-01-01"))).rejects.toMatchObject({ status: 400 });
    await expect(loader(makeRequest("?songId=song-1"))).rejects.toMatchObject({ status: 400 });
    expect(findEarlierPerformances).not.toHaveBeenCalled();
  });
});

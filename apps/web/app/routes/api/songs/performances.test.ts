import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const getOrSet = vi.fn();
const buildSongPerformances = vi.fn();
const findBySlug = vi.fn();
vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet },
    songPageComposer: { buildSongPerformances },
    musicians: { findBySlug },
  },
}));

const { loader } = await import("./performances");

function makeRequest(query: string): LoaderFunctionArgs {
  return {
    request: new Request(`http://localhost/api/songs/performances${query}`),
    params: {},
    context: { currentUser: undefined },
  } as unknown as LoaderFunctionArgs;
}

describe("GET /api/songs/performances", () => {
  beforeEach(() => {
    getOrSet.mockReset().mockImplementation((_key: string, fn: () => unknown) => fn());
    buildSongPerformances.mockReset().mockResolvedValue({ performances: [{ trackId: "t-1" }] });
    findBySlug.mockReset();
  });

  // The endpoint is a single uniform call — `?slug=` is folded into the filters
  // (as songSlug) by parsePerformanceFilters, so the composer handles both modes.
  test("with slug, scopes the build to that song and returns its performances", async () => {
    const result = await loader(makeRequest("?slug=king-of-the-world"));

    expect(buildSongPerformances).toHaveBeenCalledWith(expect.objectContaining({ songSlug: "king-of-the-world" }));
    expect(result).toEqual([{ trackId: "t-1" }]);
  });

  // No slug + a narrowing filter → the cross-song list, returned as the flat
  // performances array (what the refetch hook consumes).
  test("with a narrowing filter and no slug, returns the cross-song performances array", async () => {
    const result = await loader(makeRequest("?filters=allTimer"));

    expect(buildSongPerformances).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ trackId: "t-1" }]);
  });

  // No slug + no narrowing filter → 400 from the endpoint guard, before any
  // build runs (the composer throws the same guard as a backstop).
  test("returns 400 for a cross-song request with no narrowing filter, without building", async () => {
    const result = await loader(makeRequest(""));

    expect((result as Response).status).toBe(400);
    expect(buildSongPerformances).not.toHaveBeenCalled();
  });
});

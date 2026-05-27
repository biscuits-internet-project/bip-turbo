import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// publicLoader normally wraps the inner function with optional auth; bypass
// it so the loader can be driven directly with synthetic args.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs & { context: unknown }) => Promise<T>) => fn,
}));

const getSongPlayDates = vi.fn();
vi.mock("~/server/services", () => ({
  services: { stats: { getSongPlayDates } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { loader } = await import("./song-play-dates");

function makeArgs(): LoaderFunctionArgs & { context: unknown } {
  return {
    request: new Request("http://localhost/api/stats/song-play-dates"),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs & { context: unknown };
}

describe("GET /api/stats/song-play-dates", () => {
  beforeEach(() => {
    getSongPlayDates.mockReset();
  });

  // Happy path: pass through the catalog play-history blob the service
  // returns. No auth gating — the catalog isn't user-scoped.
  test("returns the play-dates blob from the service", async () => {
    const payload = {
      "song-tractorbeam": ["2020-06-10", "2021-04-14"],
      "song-confrontation": ["2018-12-31"],
    };
    getSongPlayDates.mockResolvedValue(payload);

    const response = (await loader(makeArgs())) as Response;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(getSongPlayDates).toHaveBeenCalledTimes(1);
  });

  // Service failure: surface a 500 instead of a stack trace. The hook
  // throws on non-ok so React Query can transition to error state.
  test("returns 500 when the service throws", async () => {
    getSongPlayDates.mockRejectedValue(new Error("redis down"));

    const response = (await loader(makeArgs())) as Response;
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Failed to fetch song play dates" });
  });
});

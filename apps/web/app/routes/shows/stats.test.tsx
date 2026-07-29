import type { LoaderFunctionArgs, ShouldRevalidateFunctionArgs } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Server-side modules — stubbed so the route file can be imported without
// pulling Prisma/Supabase into the test bundle. `publicLoader` is an identity
// wrapper so the loader itself is callable.
const recordServedPath = vi.fn();
vi.mock("~/server/services", () => ({
  services: {
    stats: { getShowStatsRows: vi.fn().mockResolvedValue([]) },
    servedUrlRegistry: { record: (scope: string, path: string) => recordServedPath(scope, path) },
  },
}));
vi.mock("~/server/show-external-sources", () => ({ computeShowExternalSources: vi.fn().mockResolvedValue({}) }));
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: (fn: (args: LoaderFunctionArgs) => unknown) => (args: LoaderFunctionArgs) => fn(args),
}));

import { loader, meta, shouldRevalidate } from "./stats";

describe("shows stats indexing directives", () => {
  const robotsFor = (search: string) =>
    (meta({ location: { search } } as never) as Array<Record<string, unknown>>).find((tag) => tag.name === "robots");

  // Every scoped or filtered spelling renders a subset of the same catalog, so
  // it is a duplicate for indexing. `follow` keeps crawlers traversing to the
  // show pages, which hold the content worth indexing.
  test("marks a scoped spelling noindex, follow", () => {
    expect(robotsFor("?timeRange=2001")?.content).toBe("noindex,follow");
  });

  // The bare table is the canonical page and has to stay indexable.
  test("leaves the bare table indexable", () => {
    expect(robotsFor("")).toBeUndefined();
  });
});

const LONG_TTL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600";
const SHORT_TTL = "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

async function loadHeaders(url: string): Promise<Headers> {
  const result = (await (loader as (args: LoaderFunctionArgs) => Promise<{ init: ResponseInit }>)({
    request: new Request(`https://discobiscuits.net${url}`),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs)) as { init: ResponseInit };
  return new Headers(result.init.headers);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("shows stats cache policy", () => {
  // The whole catalog renders on every miss, and production logs showed 100%
  // of this route's traffic carrying a query string against a 5-minute TTL —
  // every spelling returning to the origin 288 times a day. The long TTL is
  // safe only because each served URL is recorded and therefore purgeable.
  test("gives the bare table a day-long edge TTL", async () => {
    expect((await loadHeaders("/shows/stats")).get("Cache-Control")).toBe(LONG_TTL);
  });

  test("gives the table's own params the same day-long TTL", async () => {
    expect((await loadHeaders("/shows/stats?timeRange=2001")).get("Cache-Control")).toBe(LONG_TTL);
    expect((await loadHeaders("/shows/stats?nugs=yes&statsOnly=0")).get("Cache-Control")).toBe(LONG_TTL);
  });

  // A tracking parameter is unbounded and arrives from outside, so recording it
  // would let one shared link consume the scope's cap and starve the URLs that
  // matter. Left to self-heal instead.
  test("gives an unrecognized param the short self-healing TTL", async () => {
    expect((await loadHeaders("/shows/stats?utm_source=newsletter")).get("Cache-Control")).toBe(SHORT_TTL);
  });

  // `q` is applied client-side like the rest, so the payload is identical — but
  // it is whatever someone typed, so recording it would fill the scope with
  // one-off entries.
  test("gives a search query the short self-healing TTL", async () => {
    expect((await loadHeaders("/shows/stats?q=wetlands")).get("Cache-Control")).toBe(SHORT_TTL);
  });

  test("records only the purgeable spellings, verbatim", async () => {
    await loadHeaders("/shows/stats?timeRange=2001");
    expect(recordServedPath).toHaveBeenCalledWith("shows-stats", "/shows/stats?timeRange=2001");

    recordServedPath.mockClear();
    await loadHeaders("/shows/stats?utm_source=newsletter");
    expect(recordServedPath).not.toHaveBeenCalled();
  });
});

const run = (current: string, next: string) =>
  shouldRevalidate({
    currentUrl: new URL(`https://x.test${current}`),
    nextUrl: new URL(`https://x.test${next}`),
    defaultShouldRevalidate: true,
  } as ShouldRevalidateFunctionArgs);

describe("shouldRevalidate", () => {
  // The loader returns the whole catalog — ~1,950 rows, 659KB of JSON that
  // takes ~2ms just to parse — and every filter and sort is applied in the
  // browser. Refetching it on a filter click would be pure waste, and the
  // filters change the URL on every keystroke in the search box.
  test("skips revalidation when only filters or sorting change", () => {
    expect(run("/shows/stats", "/shows/stats?timeRange=2001")).toBe(false);
    expect(run("/shows/stats?timeRange=2001", "/shows/stats?timeRange=2001&sort=rating")).toBe(false);
    expect(run("/shows/stats?q=wet", "/shows/stats?q=wetlands")).toBe(false);
    expect(run("/shows/stats?statsOnly=0", "/shows/stats")).toBe(false);
  });

  // Leaving for a different route is a real navigation and defers to the
  // router's own decision.
  test("defers to the default when the path changes", () => {
    expect(run("/shows/stats", "/shows/year/2001")).toBe(true);
  });
});

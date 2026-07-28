import type { LoaderFunctionArgs, ShouldRevalidateFunctionArgs } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Server-side modules, stubbed so the route file can be imported without
// pulling Prisma/Supabase into the test bundle. `publicLoader` becomes an
// identity wrapper so the loader itself is callable.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: (fn: (args: LoaderFunctionArgs & { context: unknown }) => unknown) => (args: LoaderFunctionArgs) =>
    fn({ ...args, context: {} }),
}));
const getOrSet = vi.fn();
vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet: (key: string, fill: () => unknown) => getOrSet(key, fill) },
    setlists: { findMany: vi.fn().mockResolvedValue([]), findManyByShowIds: vi.fn().mockResolvedValue([]) },
    shows: { search: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock("~/server/show-external-sources", () => ({ computeShowExternalSources: vi.fn().mockResolvedValue({}) }));
const computeShowCountFacets = vi.fn();
vi.mock("~/server/show-count-facets", () => ({ computeShowCountFacets: () => computeShowCountFacets() }));
vi.mock("~/lib/query-prefetch", () => ({
  createPrefetchClient: () => ({ prefetchQuery: vi.fn().mockResolvedValue(undefined) }),
  dehydrateAndClear: () => ({}),
}));

import { headers, loader, shouldRevalidate } from "./$year";

interface LoadResult {
  data: { setlists: Array<{ show: { id: string } }>; showCountFacets: Record<number, Record<number, number>> };
  init: ResponseInit;
}

/** Run the loader for one year-page URL. */
async function load(url: string): Promise<LoadResult> {
  return (await (loader as (args: LoaderFunctionArgs) => Promise<LoadResult>)({
    request: new Request(`https://discobiscuits.net${url}`),
    params: { year: url.slice("/shows/year/".length, "/shows/year/".length + 4) },
    context: {},
  } as unknown as LoaderFunctionArgs)) as LoadResult;
}

async function loadHeaders(url: string): Promise<Headers> {
  return new Headers((await load(url)).init.headers);
}

/** Minimal setlist shape — the loader only ever reads `show.id` / `show.date`. */
function setlist(id: string, date: string) {
  return { show: { id, date } };
}

const LONG_TTL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600";
const SHORT_TTL = "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

beforeEach(() => {
  vi.clearAllMocks();
  getOrSet.mockResolvedValue([]);
  computeShowCountFacets.mockResolvedValue({});
});

describe("year listing payload", () => {
  // The whole point of the client-side filtering: every filter combination
  // resolves to the same loader payload, so the cached year blob is reused and
  // a toggle has nothing left to refetch.
  test("returns the full year regardless of which filters the URL carries", async () => {
    getOrSet.mockResolvedValue([setlist("show-a", "2001-03-17"), setlist("show-b", "2001-08-10")]);

    const unfiltered = await load("/shows/year/2001");
    const filtered = await load("/shows/year/2001?nugs=yes&photos=no&archive=yes");

    expect(unfiltered.data.setlists.map((s) => s.show.id)).toEqual(["show-a", "show-b"]);
    expect(filtered.data.setlists.map((s) => s.show.id)).toEqual(["show-a", "show-b"]);
  });

  // Filter-by-Year counts are derived in the browser from this blob, so the
  // loader ships the joint distribution rather than one filtered total.
  test("returns the show-count facet blob", async () => {
    computeShowCountFacets.mockResolvedValue({ 2001: { 0: 40, 4: 63 } });

    expect((await load("/shows/year/2001")).data.showCountFacets).toEqual({ 2001: { 0: 40, 4: 63 } });
  });

  // A search hits the DB for whatever was typed and spans every year, so there
  // are no per-year counts to render alongside it.
  test("returns no facets for a search", async () => {
    computeShowCountFacets.mockResolvedValue({ 2001: { 0: 40 } });

    const result = await load("/shows/year/2001?q=wetlands");

    expect(result.data.showCountFacets).toEqual({});
    expect(computeShowCountFacets).not.toHaveBeenCalled();
  });
});

describe("shouldRevalidate", () => {
  const run = (current: string, next: string) =>
    shouldRevalidate({
      currentUrl: new URL(`https://discobiscuits.net${current}`),
      nextUrl: new URL(`https://discobiscuits.net${next}`),
      defaultShouldRevalidate: true,
    } as ShouldRevalidateFunctionArgs);

  // The payload no longer depends on the filters, so a toggle only rewrites the
  // query string. Refetching would re-pay a multi-megabyte render for data the
  // browser already holds.
  test("skips revalidation when only the media filters change", () => {
    expect(run("/shows/year/2001", "/shows/year/2001?nugs=yes")).toBe(false);
    expect(run("/shows/year/2001?nugs=yes", "/shows/year/2001?nugs=no&photos=yes")).toBe(false);
    expect(run("/shows/year/2001?photos=yes", "/shows/year/2001")).toBe(false);
  });

  // Search results come from a server query, not from the year blob, so a
  // changed `q` is the one query-string edit that still needs fresh data.
  test("revalidates when the search query changes", () => {
    expect(run("/shows/year/2001", "/shows/year/2001?q=wetlands")).toBe(true);
    expect(run("/shows/year/2001?q=wetlands", "/shows/year/2001")).toBe(true);
    expect(run("/shows/year/2001?q=wet", "/shows/year/2001?q=wetlands")).toBe(true);
    expect(run("/shows/year/2001?q=wetlands", "/shows/year/2001?q=wetlands&nugs=yes")).toBe(false);
  });

  // Switching years is a different year blob, so it defers to the router.
  test("defers to the default when the path changes", () => {
    expect(run("/shows/year/2001", "/shows/year/1998")).toBe(true);
    expect(run("/shows/year/2001?nugs=yes", "/shows/year/1998?nugs=yes")).toBe(true);
  });
});

describe("year listing cache headers", () => {
  // The bare URL is the one a show mutation can actually purge
  // (`purgeYearListings` emits exactly it plus its `.data` twin), so it earns
  // the long edge TTL.
  test("gives the bare URL a day-long edge TTL", async () => {
    const headers = await loadHeaders("/shows/year/2001");

    expect(headers.get("Cache-Control")).toBe(LONG_TTL);
  });

  // Filter combinations are still distinct document URLs — a shared link or a
  // cold load lands on one — and Cloudflare's cache key includes the query
  // string, so no purge reaches them. A short TTL bounds their staleness
  // instead of leaving them a day behind. Client-side filtering changed only
  // who applies the filters, not which URLs a purge can name.
  test("gives a filtered variant a short edge TTL", async () => {
    const headers = await loadHeaders("/shows/year/2001?nugs=yes");

    expect(headers.get("Cache-Control")).toBe(SHORT_TTL);
  });

  // A `q` shorter than the search threshold falls through to the normal
  // listing branch, so it renders the same content as the bare URL but under
  // its own cache key, which no purge reaches.
  test("gives a below-threshold search query a short edge TTL", async () => {
    const headers = await loadHeaders("/shows/year/2001?q=ab");

    expect(headers.get("Cache-Control")).toBe(SHORT_TTL);
  });

  // Search results are one-offs keyed by whatever someone typed. Caching them
  // publicly fills the edge with single-use entries and serves a stale index
  // to the next person who searches the same words.
  test("keeps search results out of any shared cache", async () => {
    const headers = await loadHeaders("/shows/year/2001?q=wetlands");

    expect(headers.get("Cache-Control")).toBe("private, no-cache");
  });

  // Cache-Tag purging is Enterprise-only and this zone is not, so a tag buys
  // nothing here. Invalidation runs through purge-by-URL instead.
  test("emits no Cache-Tag", async () => {
    expect((await loadHeaders("/shows/year/2001")).has("Cache-Tag")).toBe(false);
    expect((await loadHeaders("/shows/year/2001?nugs=yes")).has("Cache-Tag")).toBe(false);
  });
});

describe("headers export", () => {
  // The whole policy is decided in the loader because React Router's
  // `HeadersArgs` carries no loader data. Reading a `data` field here yields
  // undefined and silently selects the wrong branch, so this export must do
  // nothing but forward.
  test("forwards the headers the loader attached", () => {
    const loaderHeaders = new Headers({ "Cache-Control": LONG_TTL });

    const result = new Headers(
      headers({ loaderHeaders, parentHeaders: new Headers(), actionHeaders: new Headers(), errorHeaders: undefined }),
    );

    expect(result.get("Cache-Control")).toBe(LONG_TTL);
  });
});

import type { LoaderFunctionArgs } from "react-router";
import { describe, expect, test, vi } from "vitest";

// Server-side modules, stubbed so the route file can be imported without
// pulling Prisma/Supabase into the test bundle. `publicLoader` becomes an
// identity wrapper so the loader itself is callable.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: (fn: (args: LoaderFunctionArgs & { context: unknown }) => unknown) => (args: LoaderFunctionArgs) =>
    fn({ ...args, context: {} }),
}));
vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet: vi.fn().mockResolvedValue([]) },
    setlists: { findMany: vi.fn().mockResolvedValue([]), findManyByShowIds: vi.fn().mockResolvedValue([]) },
    shows: { search: vi.fn().mockResolvedValue([]) },
  },
}));
vi.mock("~/server/show-external-sources", () => ({ computeShowExternalSources: vi.fn().mockResolvedValue({}) }));
vi.mock("~/server/show-counts-by-year", () => ({ computeShowCountsByYear: vi.fn().mockResolvedValue({}) }));
vi.mock("~/server/show-user-data", () => ({ computeShowUserData: vi.fn().mockResolvedValue({}) }));
vi.mock("~/server/apply-external-source-filters", () => ({
  applyExternalSourceFilters: (setlists: unknown) => setlists,
}));
vi.mock("~/server/apply-media-count-filters", () => ({ applyMediaCountFilters: (setlists: unknown) => setlists }));
vi.mock("~/lib/query-prefetch", () => ({
  createPrefetchClient: () => ({ prefetchQuery: vi.fn().mockResolvedValue(undefined) }),
  dehydrateAndClear: () => ({}),
}));

import { headers, loader } from "./$year";

/** Run the loader for one year-page URL and return the headers it attached. */
async function loadHeaders(url: string): Promise<Headers> {
  const result = (await (loader as (args: LoaderFunctionArgs) => Promise<{ init: ResponseInit }>)({
    request: new Request(`https://discobiscuits.net${url}`),
    params: { year: url.slice("/shows/year/".length, "/shows/year/".length + 4) },
    context: {},
  } as unknown as LoaderFunctionArgs)) as { init: ResponseInit };
  return new Headers(result.init.headers);
}

const LONG_TTL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600";
const SHORT_TTL = "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

describe("year listing cache headers", () => {
  // The bare URL is the one a show mutation can actually purge
  // (`purgeYearListings` emits exactly it plus its `.data` twin), so it earns
  // the long edge TTL.
  test("gives the bare URL a day-long edge TTL", async () => {
    const headers = await loadHeaders("/shows/year/2001");

    expect(headers.get("Cache-Control")).toBe(LONG_TTL);
  });

  // Cloudflare's default cache key includes the query string and purge-by-URL
  // matches keys exactly, so no filtered variant is reachable by a purge. A
  // short TTL bounds their staleness instead of leaving them a day behind.
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

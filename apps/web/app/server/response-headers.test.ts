import { describe, expect, test } from "vitest";
import {
  allowSharedCachingOfPublicPages,
  hasCredential,
  preventSharedCachingForCredentialedRequests,
} from "./response-headers";

const PUBLIC_EDGE = "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600";

function req(headers: Record<string, string> = {}) {
  return new Request("https://discobiscuits.net/shows/year/1999", { headers });
}

function cacheControlFor(request: Request, initial: string | null) {
  const headers = new Headers(initial ? { "Cache-Control": initial } : {});
  preventSharedCachingForCredentialedRequests(request, headers);
  return headers.get("Cache-Control");
}

describe("shared-cache guard for signed-in renders", () => {
  // Every document embeds the viewer's sessionUser (email, admin flag). Cloudflare keys the
  // year listing on the URL alone, so a signed-in render cached for a day was served to
  // every later visitor.
  test("a signed-in request never gets a public edge policy", () => {
    const signedIn = req({ Cookie: "theme=dark; sb-abcd-auth-token=base64-xyz" });
    expect(cacheControlFor(signedIn, PUBLIC_EDGE)).toBe("private, no-store");
  });

  test("chunked session cookies count as signed in", () => {
    expect(hasCredential(req({ Cookie: "sb-abcd-auth-token.0=part" }))).toBe(true);
  });

  test("a bearer token counts as signed in", () => {
    expect(cacheControlFor(req({ Authorization: "Bearer jwt" }), PUBLIC_EDGE)).toBe("private, no-store");
  });

  test("anonymous visitors keep the edge policy", () => {
    expect(cacheControlFor(req(), PUBLIC_EDGE)).toBe(PUBLIC_EDGE);
    expect(cacheControlFor(req({ Cookie: "theme=dark" }), PUBLIC_EDGE)).toBe(PUBLIC_EDGE);
  });

  test("an already-private policy is left alone", () => {
    const signedIn = req({ Cookie: "sb-abcd-auth-token=x" });
    expect(cacheControlFor(signedIn, "private, no-cache")).toBe("private, no-cache");
  });
});

describe("shared caching of public pages", () => {
  function policyFor(
    path: string,
    {
      status = 200,
      method = "GET",
      requestHeaders = {},
      initial = {},
    }: {
      status?: number;
      method?: string;
      requestHeaders?: Record<string, string>;
      initial?: Record<string, string>;
    } = {},
  ) {
    const headers = new Headers(initial);
    const request = new Request(`https://discobiscuits.net${path}`, { method, headers: requestHeaders });
    allowSharedCachingOfPublicPages(request, status, headers);
    return headers.get("Cache-Control");
  }

  const HOUR = "public, max-age=0, s-maxage=3600";
  const FIVE_MINUTES = "public, max-age=0, s-maxage=300";

  // An edit purges these by exact URL, so they can hold a long TTL.
  test.each([
    "/songs",
    "/songs/jam",
    "/venues",
    "/venues/red-rocks",
    "/musicians/aron-magner",
    "/authors/trey-parker",
    "/shows/2024-04-06-red-rocks",
    "/about",
  ])("%s stays at the edge for an hour", (path) => expect(policyFor(path)).toBe(HOUR));

  // Nothing purges these by name, so they self-heal quickly.
  test.each([
    "/",
    "/songs/recent",
    "/songs/all-timers",
    "/songs/jam/stats",
    "/shows/tour-dates",
    "/shows/top-rated",
    "/blog",
    "/blog/a-post",
    "/resources/perfume",
  ])("%s stays at the edge for five minutes", (path) => expect(policyFor(path)).toBe(FIVE_MINUTES));

  // The cache key includes the query string and purge-by-URL matches exactly, so a
  // long TTL here would be an entry no edit could ever evict.
  test.each([
    "/songs/jam?x=1",
    "/shows/2024-04-06-red-rocks?view=gap-chart",
    "/songs/jam/",
    "/songs/jam.data?_routes=root",
  ])("%s can't be purged, so it gets the short TTL", (path) => expect(policyFor(path)).toBe(FIVE_MINUTES));

  // A client-side navigation reads the `.data` twin, never the document.
  test("single-fetch twins get the same policy as their page", () => {
    expect(policyFor("/songs/jam.data")).toBe(HOUR);
    expect(policyFor("/_root.data")).toBe(FIVE_MINUTES);
    expect(policyFor("/songs/recent.data")).toBe(FIVE_MINUTES);
  });

  test.each([
    "/auth/login",
    "/oauth/consent",
    "/profile",
    "/users/someone",
    "/admin",
    "/on-this-day/11-05",
    "/mcp",
  ])("%s is never marked cacheable", (path) => expect(policyFor(path)).toBeNull());

  test("a signed-in request is never marked cacheable", () => {
    expect(policyFor("/songs/jam", { requestHeaders: { Cookie: "sb-abcd-auth-token=x" } })).toBeNull();
    expect(policyFor("/songs/jam", { requestHeaders: { Authorization: "Bearer jwt" } })).toBeNull();
  });

  // A protected page redirects a signed-out visitor; that redirect, a not-found and an
  // error must not outlive what caused them.
  test.each([301, 302, 404, 429, 500])("a %i is never marked cacheable", (status) => {
    expect(policyFor("/songs/new", { status })).toBeNull();
  });

  test("a form post is never marked cacheable", () => {
    expect(policyFor("/songs/jam", { method: "POST" })).toBeNull();
  });

  test("a route's own policy wins", () => {
    expect(policyFor("/shows/stats", { initial: { "Cache-Control": PUBLIC_EDGE } })).toBe(PUBLIC_EDGE);
  });
});

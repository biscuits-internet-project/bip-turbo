import { describe, expect, test } from "vitest";
import { hasCredential, preventSharedCachingForCredentialedRequests } from "./response-headers";

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

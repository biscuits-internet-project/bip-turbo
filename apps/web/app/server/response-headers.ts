/**
 * Headers every rendered response gets, for documents and for `.data` single-fetch
 * payloads alike. Kept in one module so the two entry points can't drift.
 */

/**
 * Baseline security headers.
 *
 * SAMEORIGIN is what actually closes the clickjacking path to /oauth/consent — framing
 * defense belongs on every page, not just the one route we noticed. HSTS complements the
 * Secure cookie flag: without it, a single plain-HTTP request can still be forced before
 * any redirect fires. Deliberately no Content-Security-Policy here — this app renders
 * third-party HTML on the homepage and inline JSON-LD, so a CSP needs its own pass with
 * real testing rather than being bolted on with the rest.
 */
export function setSecurityHeaders(headers: Headers): void {
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.APP_ENV === "production") {
    headers.set("Strict-Transport-Security", "max-age=31536000");
  }
}

/** Supabase's session cookie (`sb-<ref>-auth-token`, possibly chunked as `.0`, `.1`, ...). */
const SUPABASE_AUTH_COOKIE = /(?:^|;\s*)sb-[^=;]*-auth-token(?:\.\d+)?=/;

export function hasCredential(request: Request): boolean {
  return (
    Boolean(request.headers.get("Authorization")) || SUPABASE_AUTH_COOKIE.test(request.headers.get("Cookie") ?? "")
  );
}

/**
 * Never let a shared cache store a response rendered for a signed-in caller.
 *
 * Every document embeds the root loader's `sessionUser` (email, id, admin flag), and some
 * routes (year listings, show stats) send `public, s-maxage=86400` so Cloudflare holds
 * them for a day. Cloudflare keys those on the URL alone, so a signed-in user's render
 * could be served to every later visitor. Decided here rather than per route so a route
 * that adds edge caching later is covered without having to know about this.
 */
export function preventSharedCachingForCredentialedRequests(request: Request, headers: Headers): void {
  if (!hasCredential(request)) return;
  const cacheControl = headers.get("Cache-Control");
  if (cacheControl && !/\bpublic\b|s-maxage/i.test(cacheControl)) return;
  headers.set("Cache-Control", "private, no-store");
}

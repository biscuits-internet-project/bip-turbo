/**
 * Repair a URL whose `&` separators arrived as the literal text `&amp;`.
 *
 * React escapes `&` to `&amp;` when it renders an href, which is correct HTML.
 * A crawler that fetches the raw attribute without decoding the entity requests
 * that literal string, so every separator after the first becomes part of the
 * *next* param's name: `?timeRange=2001&amp;nugs=yes` parses as `timeRange` and
 * `amp;nugs` rather than `timeRange` and `nugs`.
 *
 * The markup is fine; the fetch is not. It still costs us, because each mangled
 * spelling is a distinct cache key the route's own param list doesn't recognize,
 * so it misses the purgeable long TTL and renders at origin. In production these
 * accounted for 100% of the short-TTL traffic on `/shows/stats` and roughly
 * three quarters of that route's requests, each a full whole-catalog render.
 *
 * Returns the corrected `pathname + search`, or null when there is nothing to
 * repair — callers redirect only on a non-null result, so a well-formed request
 * never pays a bounce.
 */
export function normalizeEscapedAmpersands(url: URL): string | null {
  const entries = [...url.searchParams.entries()];
  if (!entries.some(([key]) => key.startsWith("amp;"))) return null;

  const repaired = new URLSearchParams();
  for (const [key, value] of entries) {
    // Only the *name* is rewritten. A value containing the same text is a
    // legitimate value, not a mangled separator, and must survive untouched.
    repaired.append(key.startsWith("amp;") ? key.slice("amp;".length) : key, value);
  }

  return `${url.pathname}?${repaired.toString()}`;
}

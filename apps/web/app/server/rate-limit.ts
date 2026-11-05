import { createHash } from "node:crypto";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

/**
 * Full-catalog listings whose filters are applied in the browser. Every filter
 * combination is its own URL, so a crawler walking the combinations misses
 * Cloudflare's cache on each one and makes the origin render the whole catalog
 * again. People rarely send these: toggling a filter updates the page without a
 * request, so only opening a filtered link (or moving between years with filters
 * on) reaches the server.
 */
const FILTERED_LISTING_PATHS = [/^\/shows\/year\/[^/]+$/, /^\/shows\/stats$/];

export function isFilteredListingRequest(url: URL): boolean {
  return url.search !== "" && FILTERED_LISTING_PATHS.some((pattern) => pattern.test(url.pathname));
}

/**
 * Requests allowed per caller per window. `api` is sized so one person browsing
 * fast (a show page fans out into several batched POSTs) never sees it; `search`
 * is tighter because each query scans the catalog and writes a history row;
 * `filteredListing` bounds the catalog renders described above.
 */
export const RATE_LIMITS = {
  api: { limit: 300, windowSeconds: 60 },
  search: { limit: 30, windowSeconds: 60 },
  mcp: { limit: 60, windowSeconds: 60 },
  filteredListing: { limit: 20, windowSeconds: 60 },
} as const;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

/**
 * Logged-in callers are counted by user id, so many fans on one venue's cellular
 * NAT don't share a budget. Everyone else is counted by IP, hashed so Redis never
 * holds a raw address. Cloudflare's header comes first: behind the proxy, the
 * socket and X-Forwarded-For only show a Cloudflare edge.
 */
export function rateLimitIdentity(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return `ip:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;
}

/**
 * Throws a 429 when the caller is over the bucket's limit. Redis being down
 * fails open: an outage of the counter should not take the API down with it.
 */
export async function enforceRateLimit(request: Request, bucket: RateLimitBucket, userId?: string): Promise<void> {
  const { limit, windowSeconds } = RATE_LIMITS[bucket];
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `ratelimit:${bucket}:${rateLimitIdentity(request, userId)}:${window}`;

  let count: number;
  try {
    count = await services.redis.incrWithExpiry(key, windowSeconds);
  } catch (error) {
    logger.warn("Rate limit check failed; allowing request", { error, bucket });
    return;
  }

  if (count > limit) {
    const retryAfter = (window + 1) * windowSeconds - Math.floor(Date.now() / 1000);
    logger.info("Rate limited", { bucket, path: new URL(request.url).pathname });
    throw new Response(JSON.stringify({ error: "Too many requests. Try again shortly." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.max(retryAfter, 1)),
        // One caller's 429 must never be served to everyone from Cloudflare's cache.
        "Cache-Control": "no-store",
      },
    });
  }
}

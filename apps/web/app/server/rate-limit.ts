import { createHash } from "node:crypto";
import { BlockList, isIP } from "node:net";
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
  // Shared by every caller. A crawler spread across a residential proxy network
  // sends a request or two per IP, so no per-caller budget sees it; this one caps
  // the catalog renders it can cause in total.
  filteredListingSiteWide: { limit: 60, windowSeconds: 60 },
} as const;

export type RateLimitBucket = keyof typeof RATE_LIMITS;

/**
 * Cloudflare's published edge ranges (https://www.cloudflare.com/ips/). Only a
 * request arriving from one of these may name its client in `cf-connecting-ip`;
 * anyone else could put any value there.
 */
const CLOUDFLARE_RANGES: Array<[string, number, "ipv4" | "ipv6"]> = [
  ["173.245.48.0", 20, "ipv4"],
  ["103.21.244.0", 22, "ipv4"],
  ["103.22.200.0", 22, "ipv4"],
  ["103.31.4.0", 22, "ipv4"],
  ["141.101.64.0", 18, "ipv4"],
  ["108.162.192.0", 18, "ipv4"],
  ["190.93.240.0", 20, "ipv4"],
  ["188.114.96.0", 20, "ipv4"],
  ["197.234.240.0", 22, "ipv4"],
  ["198.41.128.0", 17, "ipv4"],
  ["162.158.0.0", 15, "ipv4"],
  ["104.16.0.0", 13, "ipv4"],
  ["104.24.0.0", 14, "ipv4"],
  ["172.64.0.0", 13, "ipv4"],
  ["131.0.72.0", 22, "ipv4"],
  ["2400:cb00::", 32, "ipv6"],
  ["2606:4700::", 32, "ipv6"],
  ["2803:f800::", 32, "ipv6"],
  ["2405:b500::", 32, "ipv6"],
  ["2405:8100::", 32, "ipv6"],
  ["2a06:98c0::", 29, "ipv6"],
  ["2c0f:f248::", 32, "ipv6"],
];

const cloudflareEdges = new BlockList();
for (const [address, prefix, family] of CLOUDFLARE_RANGES) cloudflareEdges.addSubnet(address, prefix, family);

function isCloudflareEdge(ip: string): boolean {
  const family = isIP(ip);
  return family !== 0 && cloudflareEdges.check(ip, family === 4 ? "ipv4" : "ipv6");
}

/**
 * The address the request came from. kamal-proxy (TLS on, `forward_headers` off)
 * discards any incoming X-Forwarded-For and sets it to the connecting address, so
 * that header is the real peer. When the peer is a Cloudflare edge, the visitor is
 * in `cf-connecting-ip`; otherwise the peer is the visitor.
 */
export function clientIp(request: Request): string {
  const peer = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!peer) return "unknown";
  if (isCloudflareEdge(peer)) return request.headers.get("cf-connecting-ip") ?? peer;
  return peer;
}

/**
 * Logged-in callers are counted by user id, so many fans on one venue's cellular
 * NAT don't share a budget. Everyone else is counted by IP, hashed so Redis never
 * holds a raw address.
 */
export function rateLimitIdentity(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  return `ip:${createHash("sha256").update(clientIp(request)).digest("hex").slice(0, 16)}`;
}

/** Throws a 429 when the caller is over the bucket's limit. */
export function enforceRateLimit(request: Request, bucket: RateLimitBucket, userId?: string): Promise<void> {
  return enforce(request, bucket, rateLimitIdentity(request, userId));
}

/** Throws a 429 when every caller together is over the bucket's limit. */
export function enforceSiteWideRateLimit(request: Request, bucket: RateLimitBucket): Promise<void> {
  return enforce(request, bucket, "all");
}

/**
 * Throws a 429 for an authenticated non-browser caller (an API key or OAuth app)
 * over its budget, which may be raised above the bucket's default.
 */
export function enforceCallerRateLimit(
  request: Request,
  bucket: RateLimitBucket,
  identity: string,
  raisedLimit?: number,
): Promise<void> {
  return enforce(request, bucket, identity, raisedLimit);
}

/** Redis being down fails open: an outage of the counter should not take the site down with it. */
async function enforce(
  request: Request,
  bucket: RateLimitBucket,
  identity: string,
  raisedLimit?: number,
): Promise<void> {
  const { windowSeconds } = RATE_LIMITS[bucket];
  const limit = raisedLimit ?? RATE_LIMITS[bucket].limit;
  const window = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `ratelimit:${bucket}:${identity}:${window}`;

  let count: number;
  try {
    count = await services.redis.incrWithExpiry(key, windowSeconds);
  } catch (error) {
    logger.warn("Rate limit check failed; allowing request", { error, bucket });
    return;
  }

  if (count > limit) {
    // Once per caller per window, so a flood past the limit doesn't become a log flood.
    if (count === limit + 1) logger.info("Rate limited", { bucket, path: new URL(request.url).pathname });
    const retryAfter = (window + 1) * windowSeconds - Math.floor(Date.now() / 1000);
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

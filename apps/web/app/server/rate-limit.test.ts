import { beforeEach, describe, expect, test, vi } from "vitest";

const incrWithExpiry = vi.fn();
vi.mock("~/server/services", () => ({ services: { redis: { incrWithExpiry } } }));
vi.mock("~/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const {
  clientIp,
  enforceRateLimit,
  enforceSiteWideRateLimit,
  isFilteredListingRequest,
  rateLimitIdentity,
  RATE_LIMITS,
} = await import("~/server/rate-limit");

function request(headers: Record<string, string> = {}) {
  return new Request("https://discobiscuits.net/api/ratings", { headers });
}

async function thrownBy(promise: Promise<unknown>): Promise<Response | null> {
  try {
    await promise;
    return null;
  } catch (thrown) {
    return thrown as Response;
  }
}

beforeEach(() => {
  incrWithExpiry.mockReset();
});

describe("enforceRateLimit", () => {
  test("allows a caller at the limit", async () => {
    incrWithExpiry.mockResolvedValue(RATE_LIMITS.api.limit);
    expect(await thrownBy(enforceRateLimit(request(), "api"))).toBeNull();
  });

  test("rejects the first request over the limit with an uncacheable 429 and Retry-After", async () => {
    incrWithExpiry.mockResolvedValue(RATE_LIMITS.mcp.limit + 1);
    const thrown = await thrownBy(enforceRateLimit(request(), "mcp"));

    expect(thrown?.status).toBe(429);
    expect(thrown?.headers.get("Cache-Control")).toBe("no-store");
    const retryAfter = Number(thrown?.headers.get("Retry-After"));
    expect(retryAfter).toBeGreaterThanOrEqual(1);
    expect(retryAfter).toBeLessThanOrEqual(RATE_LIMITS.mcp.windowSeconds);
  });

  test("counts each bucket separately, with the bucket's window as the TTL", async () => {
    incrWithExpiry.mockResolvedValue(1);
    await enforceRateLimit(request(), "search", "u1");

    const [key, ttl] = incrWithExpiry.mock.calls[0];
    expect(key).toMatch(/^ratelimit:search:user:u1:\d+$/);
    expect(ttl).toBe(RATE_LIMITS.search.windowSeconds);
  });

  test("counts the site-wide budget under one shared key", async () => {
    incrWithExpiry.mockResolvedValue(1);
    await enforceSiteWideRateLimit(request({ "x-forwarded-for": "198.51.100.9" }), "filteredListingSiteWide");
    await enforceSiteWideRateLimit(request({ "x-forwarded-for": "198.51.100.10" }), "filteredListingSiteWide");

    const [first, second] = incrWithExpiry.mock.calls.map((call) => call[0]);
    expect(first).toMatch(/^ratelimit:filteredListingSiteWide:all:\d+$/);
    expect(second).toBe(first);
  });

  test("logs a caller's first rejection in a window, not every one", async () => {
    const { logger } = await import("~/lib/logger");
    vi.mocked(logger.info).mockClear();
    for (const count of [61, 62, 63]) {
      incrWithExpiry.mockResolvedValueOnce(count);
      await thrownBy(enforceRateLimit(request(), "mcp"));
    }

    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  test("lets the request through when Redis is unavailable", async () => {
    incrWithExpiry.mockRejectedValue(new Error("ECONNREFUSED"));
    expect(await thrownBy(enforceRateLimit(request(), "api"))).toBeNull();
  });
});

describe("clientIp", () => {
  const CF_EDGE = "172.70.1.1";

  test("uses Cloudflare's client header when the request came from a Cloudflare edge", () => {
    expect(clientIp(request({ "x-forwarded-for": CF_EDGE, "cf-connecting-ip": "203.0.113.7" }))).toBe("203.0.113.7");
  });

  test("ignores a client header sent by anyone who isn't Cloudflare", () => {
    expect(clientIp(request({ "x-forwarded-for": "198.51.100.9", "cf-connecting-ip": "203.0.113.7" }))).toBe(
      "198.51.100.9",
    );
  });

  test("recognizes Cloudflare's IPv6 edges", () => {
    expect(clientIp(request({ "x-forwarded-for": "2606:4700::1", "cf-connecting-ip": "203.0.113.7" }))).toBe(
      "203.0.113.7",
    );
  });
});

describe("rateLimitIdentity", () => {
  test("keys a logged-in caller by user id, whatever their IP", () => {
    expect(rateLimitIdentity(request({ "x-forwarded-for": "198.51.100.9" }), "u1")).toBe("user:u1");
  });

  test("keys anonymous callers by IP, without storing the raw address", () => {
    const a = rateLimitIdentity(request({ "x-forwarded-for": "198.51.100.9" }));
    const b = rateLimitIdentity(request({ "x-forwarded-for": "198.51.100.10" }));

    expect(a).not.toBe(b);
    expect(a).not.toContain("198.51.100.9");
  });
});

describe("isFilteredListingRequest", () => {
  const check = (path: string) => isFilteredListingRequest(new URL(`https://discobiscuits.net${path}`));

  test("matches the year and stats listings only when they carry filters", () => {
    expect(check("/shows/year/2005?nugs=yes")).toBe(true);
    expect(check("/shows/stats?youtube=true&archive=no")).toBe(true);
    expect(check("/shows/year/2005")).toBe(false);
    expect(check("/shows/stats")).toBe(false);
  });

  test("ignores other pages with query strings", () => {
    expect(check("/shows/2005-12-30-the-electric-factory-philadelphia-pa?x=1")).toBe(false);
    expect(check("/songs?sort=plays")).toBe(false);
  });
});

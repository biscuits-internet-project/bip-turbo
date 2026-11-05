import { beforeEach, describe, expect, test, vi } from "vitest";

const incrWithExpiry = vi.fn();
vi.mock("~/server/services", () => ({ services: { redis: { incrWithExpiry } } }));
vi.mock("~/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const { enforceRateLimit, isFilteredListingRequest, rateLimitIdentity, RATE_LIMITS } = await import(
  "~/server/rate-limit"
);

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

  test("lets the request through when Redis is unavailable", async () => {
    incrWithExpiry.mockRejectedValue(new Error("ECONNREFUSED"));
    expect(await thrownBy(enforceRateLimit(request(), "api"))).toBeNull();
  });
});

describe("rateLimitIdentity", () => {
  test("keys a logged-in caller by user id, whatever their IP", () => {
    expect(rateLimitIdentity(request({ "cf-connecting-ip": "1.1.1.1" }), "u1")).toBe("user:u1");
  });

  test("keys anonymous callers by Cloudflare's client IP, not the edge in X-Forwarded-For", () => {
    const a = rateLimitIdentity(request({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "9.9.9.9" }));
    const b = rateLimitIdentity(request({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "8.8.8.8" }));
    const c = rateLimitIdentity(request({ "cf-connecting-ip": "2.2.2.2", "x-forwarded-for": "9.9.9.9" }));

    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  test("never stores the raw IP", () => {
    expect(rateLimitIdentity(request({ "cf-connecting-ip": "1.1.1.1" }))).not.toContain("1.1.1.1");
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

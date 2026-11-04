import { beforeEach, describe, expect, test, vi } from "vitest";

const search = vi.fn();
const error = vi.fn();

class InvalidSearchQueryError extends Error {}
vi.mock("@bip/core", () => ({ InvalidSearchQueryError, MAX_SEARCH_QUERY_LENGTH: 200 }));

vi.mock("~/lib/base-loaders", () => ({ publicLoader: (fn: unknown) => fn }));
vi.mock("~/lib/logger", () => ({ logger: { error, info: vi.fn(), warn: vi.fn() } }));
vi.mock("~/server/rate-limit", () => ({ enforceRateLimit: vi.fn() }));
vi.mock("~/server/services", () => ({ services: { postgresSearch: { search } } }));

const { action } = await import("./search");

async function post(body: unknown): Promise<Response> {
  const request = new Request("http://localhost/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  try {
    return (await action({ request, context: {} } as never)) as Response;
  } catch (thrown) {
    if (thrown instanceof Response) return thrown;
    throw thrown;
  }
}

describe("POST /api/search validation", () => {
  beforeEach(() => vi.clearAllMocks());

  // The validation throws its 400s inside the handler's try. They used to land in the
  // catch-all and come back as a 500 "Search failed", logged at ERROR — a client mistake
  // reported as a server fault, with junk requests filling the error log.
  test.each([
    ["an overlong query", { query: "a".repeat(201) }],
    ["a non-numeric limit", { query: "tricycle", limit: "abc" }],
    ["a missing query", { query: "" }],
  ])("rejects %s with a 400, not a 500", async (_label, body) => {
    const res = await post(body);

    expect(res.status).toBe(400);
    expect(search).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  test("a real failure is still a 500", async () => {
    search.mockRejectedValueOnce(new Error("db down"));

    const res = await post({ query: "tricycle" });

    expect(res.status).toBe(500);
    expect(error).toHaveBeenCalled();
  });

  // Prisma's error text includes the query shape; it belongs in the log, not the response.
  test("the 500 body does not echo the underlying error", async () => {
    search.mockRejectedValueOnce(new Error("Invalid `prisma.searchHistory.create()` invocation"));

    const body = await (await post({ query: "tricycle" })).json();

    expect(body.error).toBe("Search failed");
  });

  test("a bound enforced by the search service is a 400", async () => {
    search.mockRejectedValueOnce(new InvalidSearchQueryError("Segue searches can chain at most 8 songs"));
    const res = await post({ query: "a > b > c > d > e > f > g > h > i" });
    expect(res.status).toBe(400);
    expect(error).not.toHaveBeenCalled();
  });

  test("a non-string query is a 400", async () => {
    expect((await post({ query: 42 })).status).toBe(400);
  });
});

describe("search rate limit", () => {
  test("uses the stricter search budget, keyed by the logged-in user", async () => {
    const { enforceRateLimit } = await import("~/server/rate-limit");
    const request = new Request("http://localhost/api/search", {
      method: "POST",
      body: JSON.stringify({ query: "basis" }),
    });
    try {
      await action({ request, context: { currentUser: { id: "u1" } } } as never);
    } catch {
      // The search itself is unmocked here; only the limiter call matters.
    }

    expect(enforceRateLimit).toHaveBeenCalledWith(request, "search", "u1");
  });
});

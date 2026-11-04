import type { LoaderFunctionArgs } from "react-router";
import { describe, expect, test, vi } from "vitest";

// Server-only modules, stubbed so the wrapper can be exercised without pulling
// Supabase/Prisma into the test bundle.
vi.mock("~/server/request-user", () => ({ getRequestUser: vi.fn().mockResolvedValue(null) }));
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/server/rate-limit", () => ({ enforceRateLimit: vi.fn() }));
vi.mock("~/lib/logger", () => ({ logger: { info: vi.fn(), error: vi.fn() } }));

import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { enforceRateLimit } from "~/server/rate-limit";
import { getRequestUser } from "~/server/request-user";

/** Run a wrapped loader and return whatever it produced or threw. */
async function run(url: string, inner = vi.fn().mockResolvedValue("rendered")) {
  const loader = publicLoader(inner);
  try {
    return {
      thrown: null,
      result: await (loader as (args: LoaderFunctionArgs) => Promise<unknown>)({
        request: new Request(`https://discobiscuits.net${url}`),
        params: {},
        context: {},
      } as unknown as LoaderFunctionArgs),
      inner,
    };
  } catch (thrown) {
    return { thrown: thrown as Response, result: null, inner };
  }
}

describe("publicLoader escaped-ampersand normalization", () => {
  // The normalization helper being correct is not the same as it running. A
  // change that is right but never invoked is the failure this guards: the
  // /shows/stats cache policy shipped correct and inert for exactly that class
  // of reason.
  test("redirects a mangled URL to its repaired form", async () => {
    const { thrown } = await run("/shows/stats?timeRange=2001&amp;nugs=yes");

    expect(thrown?.status).toBe(301);
    expect(thrown?.headers.get("Location")).toBe("/shows/stats?timeRange=2001&nugs=yes");
  });

  // The whole point is that these stop costing a render, so the wrapped loader
  // must never run for them.
  test("redirects without invoking the loader", async () => {
    const { inner } = await run("/shows/stats?a=1&amp;b=2");

    expect(inner).not.toHaveBeenCalled();
  });

  // Every other request in the app goes through this wrapper, so a well-formed
  // URL must pass straight through rather than bouncing.
  test("leaves a well-formed request alone", async () => {
    const { thrown, result, inner } = await run("/shows/stats?timeRange=2001&nugs=yes");

    expect(thrown).toBeNull();
    expect(result).toBe("rendered");
    expect(inner).toHaveBeenCalled();
  });
});

describe("publicLoader failure logging", () => {
  // A failure line has to say which page failed, or it can't be matched to a
  // user's report. Only the path is logged: the ops workflow prints error lines
  // into world-readable run logs, and query strings can carry auth codes.
  test("logs the method and path of a failed request, without the query string", async () => {
    const failure = new Error("Venue not found");
    const { thrown } = await run("/venues/the-capitol-theatre?code=secret", vi.fn().mockRejectedValue(failure));

    expect(thrown).toBe(failure);
    expect(logger.error).toHaveBeenCalledWith("❌ Request failed", {
      error: failure,
      method: "GET",
      path: "/venues/the-capitol-theatre",
    });
  });

  // Redirects and not-found pages are thrown Responses. Logging them as errors
  // buries the real failures in routine control flow.
  test("logs a thrown redirect or not-found Response at info, not error", async () => {
    vi.mocked(logger.error).mockClear();
    const notFound = new Response(null, { status: 404 });
    const { thrown } = await run("/venues/no-such-venue", vi.fn().mockRejectedValue(notFound));

    expect(thrown).toBe(notFound);
    expect(logger.error).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith("Request ended with a thrown response", {
      error: notFound,
      method: "GET",
      path: "/venues/no-such-venue",
    });
  });

  test("still logs a thrown 5xx Response as an error", async () => {
    vi.mocked(logger.error).mockClear();
    const unavailable = new Response(null, { status: 503 });
    await run("/shows/stats", vi.fn().mockRejectedValue(unavailable));

    expect(logger.error).toHaveBeenCalledWith("❌ Request failed", expect.objectContaining({ error: unavailable }));
  });
});

describe("publicLoader success logging", () => {
  // The ops workflow prints any prod line matching "error" or "warn" into
  // world-readable run logs, and a success URL like ?error=access_denied
  // matches, so the success line carries the path only.
  test("logs the path of a completed request without its query string", async () => {
    vi.mocked(logger.info).mockClear();
    await run("/auth/callback?error=access_denied&code=secret");

    const [line] = vi.mocked(logger.info).mock.calls[0];
    expect(line).toContain("GET /auth/callback |");
    expect(line).not.toContain("secret");
  });
});

describe("publicLoader API rate limit", () => {
  test("counts an /api request against the caller's budget", async () => {
    vi.mocked(enforceRateLimit).mockClear();
    await run("/api/ratings");

    expect(enforceRateLimit).toHaveBeenCalledWith(expect.any(Request), "api", undefined);
  });

  test("stops an over-limit /api request before the loader runs", async () => {
    vi.mocked(enforceRateLimit).mockRejectedValueOnce(new Response(null, { status: 429 }));
    const { thrown, inner } = await run("/api/ratings");

    expect(thrown?.status).toBe(429);
    expect(inner).not.toHaveBeenCalled();
  });

  test("leaves page loaders alone", async () => {
    vi.mocked(enforceRateLimit).mockClear();
    await run("/shows/stats");

    expect(enforceRateLimit).not.toHaveBeenCalled();
  });

  test("exempts admins", async () => {
    vi.mocked(enforceRateLimit).mockClear();
    vi.mocked(getRequestUser).mockResolvedValueOnce({
      id: "admin-1",
      email: "a@example.com",
      app_metadata: { isAdmin: true },
    } as never);
    await run("/api/shows/reorder");

    expect(enforceRateLimit).not.toHaveBeenCalled();
  });
});

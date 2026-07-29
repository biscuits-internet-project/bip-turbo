import type { LoaderFunctionArgs } from "react-router";
import { describe, expect, test, vi } from "vitest";

// Server-only modules, stubbed so the wrapper can be exercised without pulling
// Supabase/Prisma into the test bundle.
vi.mock("~/server/request-user", () => ({ getRequestUser: vi.fn().mockResolvedValue(null) }));
vi.mock("~/server/services", () => ({ services: {} }));

import { publicLoader } from "~/lib/base-loaders";

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

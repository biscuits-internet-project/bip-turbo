import type { LoaderFunctionArgs } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Strip the request wrapper so the loader runs directly with fabricated args.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const findBySlug = vi.fn();
const findSetlists = vi.fn();
vi.mock("~/server/services", () => ({
  services: { venues: { findBySlug }, setlists: { findMany: findSetlists } },
}));

const { loader } = await import("./$slug");

describe("venues/$slug loader", () => {
  // Typos and stale links reach this loader with a slug that matches no venue.
  // That is a 404, not a server error, and nothing else is fetched.
  test("throws a 404 response when no venue has the slug", async () => {
    findBySlug.mockResolvedValue(null);

    const thrown = await Promise.resolve(
      loader({
        params: { slug: "zzz-not-a-venue" },
        request: new Request("http://x/venues/zzz-not-a-venue"),
        context: {},
      } as never),
    ).catch((error: unknown) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
    expect(findSetlists).not.toHaveBeenCalled();
  });
});

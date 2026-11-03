import type { LoaderFunctionArgs } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Strip the request wrapper so the loader runs directly with fabricated args.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const build = vi.fn();
vi.mock("~/server/services", () => ({ services: { songPageComposer: { build } } }));

const { loader } = await import("./$slug");

describe("songs/$slug loader", () => {
  // A song re-slugs when an admin edits its title, so old links and typos
  // reach this loader with a slug that matches nothing. That is a 404, not a
  // server error.
  test("throws a 404 response when no song has the slug", async () => {
    build.mockResolvedValue(null);

    const thrown = await Promise.resolve(
      loader({
        params: { slug: "zzz-not-a-song" },
        request: new Request("http://x/songs/zzz-not-a-song"),
        context: {},
      } as never),
    ).catch((error: unknown) => error);

    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(404);
  });
});

import type { LoaderFunctionArgs } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Strip the request wrapper so the loader runs directly with fabricated args.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const { loader } = await import("./_index");

async function redirectFor(url: string): Promise<Response> {
  const thrown = await Promise.resolve(loader({ params: {}, request: new Request(url), context: {} } as never)).catch(
    (error: unknown) => error,
  );
  expect(thrown).toBeInstanceOf(Response);
  return thrown as Response;
}

describe("shows index loader", () => {
  // TLS ends at Cloudflare and kamal-proxy, so the app sees http:// requests.
  // An absolute Location built from the request origin sent visitors to
  // http://, so the redirect must stay relative.
  test("redirects to the current year with a relative Location", async () => {
    const res = await redirectFor("http://discobiscuits.net/shows");

    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe(`/shows/year/${new Date().getFullYear()}`);
  });

  test("keeps the requested year and search query", async () => {
    const res = await redirectFor("http://discobiscuits.net/shows?year=1999&q=basis");

    expect(res.headers.get("Location")).toBe("/shows/year/1999?q=basis");
  });
});

import type { ShouldRevalidateFunctionArgs } from "react-router";
import { describe, expect, test, vi } from "vitest";

// Server-side modules — stubbed so the route file can be imported without
// pulling Prisma/Supabase into the test bundle.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/server/show-external-sources", () => ({ computeShowExternalSources: vi.fn() }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));

import { shouldRevalidate } from "./stats";

const run = (current: string, next: string) =>
  shouldRevalidate({
    currentUrl: new URL(`https://x.test${current}`),
    nextUrl: new URL(`https://x.test${next}`),
    defaultShouldRevalidate: true,
  } as ShouldRevalidateFunctionArgs);

describe("shouldRevalidate", () => {
  // The loader returns the whole catalog — ~1,950 rows, 659KB of JSON that
  // takes ~2ms just to parse — and every filter and sort is applied in the
  // browser. Refetching it on a filter click would be pure waste, and the
  // filters change the URL on every keystroke in the search box.
  test("skips revalidation when only filters or sorting change", () => {
    expect(run("/shows/stats", "/shows/stats?timeRange=2001")).toBe(false);
    expect(run("/shows/stats?timeRange=2001", "/shows/stats?timeRange=2001&sort=rating")).toBe(false);
    expect(run("/shows/stats?q=wet", "/shows/stats?q=wetlands")).toBe(false);
    expect(run("/shows/stats?statsOnly=0", "/shows/stats")).toBe(false);
  });

  // Leaving for a different route is a real navigation and defers to the
  // router's own decision.
  test("defers to the default when the path changes", () => {
    expect(run("/shows/stats", "/shows/year/2001")).toBe(true);
  });
});

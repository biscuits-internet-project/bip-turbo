import { describe, expect, test } from "vitest";
import { showsViewHref } from "./shows-view-toggle";

const CURRENT_YEAR = 2026;

describe("showsViewHref", () => {
  test("carries the year page's path scope into the table's time range", () => {
    const href = showsViewHref("table", new URLSearchParams("nugs=yes"), 2001, CURRENT_YEAR);

    expect(href).toBe("/shows/stats?nugs=yes&timeRange=2001");
  });

  test("carries the table's time range back into the setlist path", () => {
    const href = showsViewHref("setlist", new URLSearchParams("timeRange=2001&photos=no"), 2001, CURRENT_YEAR);

    expect(href).toBe("/shows/year/2001?photos=no");
  });

  // The setlist branch lands on the year listing, whose edge entries are keyed
  // by the literal query string. The stats table writes its filters in its own
  // order, so passing them through verbatim would fork a second cache entry
  // holding exactly the same bytes.
  test("canonicalizes the filter order when returning to the year listing", () => {
    const href = showsViewHref("setlist", new URLSearchParams("photos=yes&nugs=no"), 2001, CURRENT_YEAR);

    expect(href).toBe("/shows/year/2001?nugs=no&photos=yes");
  });

  test("lands on the current year when the table spans more than one year", () => {
    // Setlists are year-scoped by route, so an all-time or era range has no
    // equivalent — the viewer has to land somewhere.
    const href = showsViewHref("setlist", new URLSearchParams("timeRange=bernstein"), null, CURRENT_YEAR);

    expect(href).toBe(`/shows/year/${CURRENT_YEAR}`);
  });

  test("leaves the table unscoped when no single year is in scope", () => {
    const href = showsViewHref("table", new URLSearchParams(), null, CURRENT_YEAR);

    expect(href).toBe("/shows/stats");
  });

  test("clears the legacy year alias so it can't outrank the scope being written", () => {
    const href = showsViewHref("table", new URLSearchParams("year=1999"), 2001, CURRENT_YEAR);

    expect(href).toBe("/shows/stats?timeRange=2001");
  });

  test("preserves every unrelated filter across the switch", () => {
    const href = showsViewHref("table", new URLSearchParams("q=troc&statsOnly=1&archive=no"), null, CURRENT_YEAR);

    expect(href).toBe("/shows/stats?q=troc&statsOnly=1&archive=no");
  });
});

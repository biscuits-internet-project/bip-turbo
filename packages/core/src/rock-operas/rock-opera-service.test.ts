import type { Logger } from "@bip/domain";
import { describe, expect, test, vi } from "vitest";
import { SHOW_ORDER_ASC } from "../_shared/show-ordering";
import type { StatsService } from "../stats/stats-service";
import { RockOperaService } from "./rock-opera-service";

function makeLogger(): Logger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  } as unknown as Logger;
}

function makeMockDb() {
  return {
    rockOpera: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    rockOperaPerformance: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    show: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
}

// Stats stub — only `getStatsShowDates` is read by RockOperaService.
// Tests drive its return value to control the gap-counting input.
function makeStatsStub(dates: string[] = []): StatsService {
  return {
    getStatsShowDates: vi.fn().mockResolvedValue(dates),
  } as unknown as StatsService;
}

describe("RockOperaService.findAll", () => {
  // Admin form's checkbox group needs the full list. Order by name so the
  // checkboxes render in a stable alphabetical sequence and don't shift
  // when a new opera is added.
  test("returns all rock operas ordered alphabetically by name", async () => {
    const db = makeMockDb();
    db.rockOpera.findMany.mockResolvedValue([
      {
        id: "1",
        slug: "chemical-warfare-brigade",
        name: "Chemical Warfare Brigade",
        shortName: "CWB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        slug: "hot-air-balloon",
        name: "The Hot Air Balloon",
        shortName: "HAB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub());

    const result = await service.findAll();

    expect(db.rockOpera.findMany).toHaveBeenCalledWith({ orderBy: { name: "asc" } });
    expect(result.map((r) => r.slug)).toEqual(["chemical-warfare-brigade", "hot-air-balloon"]);
  });
});

describe("RockOperaService.findPerformanceShowIds", () => {
  // Resource pages render performances in chronological order. We rely on
  // SHOW_ORDER_ASC (date + day_order NULLS LAST + id) so same-day shows
  // tiebreak consistently with the rest of the app, and Postgres returns
  // ids in the canonical order the show pages use.
  test("queries shows tagged with the rock opera, ordered SHOW_ORDER_ASC", async () => {
    const db = makeMockDb();
    db.show.findMany.mockResolvedValue([{ id: "show-a" }, { id: "show-b" }]);
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub());

    const ids = await service.findPerformanceShowIds("hot-air-balloon");

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where).toEqual({
      rockOperaPerformances: { some: { rockOpera: { slug: "hot-air-balloon" } } },
    });
    expect(call.orderBy).toBe(SHOW_ORDER_ASC);
    expect(call.select).toEqual({ id: true });
    expect(ids).toEqual(["show-a", "show-b"]);
  });

  // No tagged performances → empty list, no follow-up queries. Resource
  // page surfaces an empty section rather than an error.
  test("returns [] when no shows are tagged", async () => {
    const db = makeMockDb();
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub());

    const ids = await service.findPerformanceShowIds("revolution-in-motion");

    expect(ids).toEqual([]);
  });
});

describe("RockOperaService.findPerformancesForShow", () => {
  // Untagged show → no annotations, no follow-up queries. SetlistCard
  // renders nothing in the rock-opera annotation slot. findPerformancesForShow
  // is a thin wrapper around the batched findPerformancesForShows; the
  // query shape uses `showId IN [...]` even for the single-show call.
  test("returns [] for a show with no rock opera tags", async () => {
    const db = makeMockDb();
    db.rockOperaPerformance.findMany.mockResolvedValue([]);
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub());

    const result = await service.findPerformancesForShow("show-untagged");

    expect(result).toEqual([]);
    expect(db.rockOperaPerformance.findMany).toHaveBeenCalledWith({
      where: { showId: { in: ["show-untagged"] } },
      include: { rockOpera: true },
    });
  });

  // Middle-of-list performance → annotation carries the 1-based rank plus
  // pointers to the chronologically adjacent performances with `gap` =
  // count of count_for_stats=true shows strictly between (matches
  // Track.gap semantics).
  test("returns annotation with rank + adjacent performance pointers + gap", async () => {
    const db = makeMockDb();
    db.rockOperaPerformance.findMany.mockResolvedValue([
      {
        showId: "show-target",
        rockOperaId: "ro-1",
        rockOpera: {
          id: "ro-1",
          slug: "hot-air-balloon",
          name: "The Hot Air Balloon",
          shortName: "HAB",
        },
      },
    ]);
    db.show.findMany.mockResolvedValue([
      { id: "show-1st", date: "1998-12-31", slug: "1998-12-31-silk-city" },
      { id: "show-2nd", date: "1999-01-24", slug: "1999-01-24-natick" },
      { id: "show-target", date: "1999-03-04", slug: "1999-03-04-target" },
      { id: "show-4th", date: "1999-05-11", slug: "1999-05-11-fourth" },
    ]);
    // Stats dates between performances: 7 shows in (1999-01-24, 1999-03-04),
    // 12 shows in (1999-03-04, 1999-05-11). countShowsBetween uses strictly-
    // between semantics, so endpoint dates are excluded from the input.
    const statsDates = [
      ...Array.from({ length: 7 }, (_, i) => `1999-02-${String(i + 1).padStart(2, "0")}`),
      ...Array.from({ length: 12 }, (_, i) => `1999-04-${String(i + 1).padStart(2, "0")}`),
    ].sort();
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub(statsDates));

    const result = await service.findPerformancesForShow("show-target");

    expect(result).toEqual([
      {
        rockOpera: { slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
        performanceNumber: 3,
        previousPerformance: { date: "1999-01-24", slug: "1999-01-24-natick", gap: 7 },
        nextPerformance: { date: "1999-05-11", slug: "1999-05-11-fourth", gap: 12 },
      },
    ]);
  });

  // First-ever performance has no `previousPerformance`; last has no
  // `nextPerformance`. Both come back as null so the renderer can hide
  // those lines cleanly.
  test("nulls previousPerformance for the 1st performance and nextPerformance for the last", async () => {
    const db = makeMockDb();
    db.rockOperaPerformance.findMany.mockResolvedValue([
      {
        showId: "show-only",
        rockOperaId: "ro-1",
        rockOpera: { id: "ro-1", slug: "revolution-in-motion", name: "Revolution In Motion", shortName: "RIM" },
      },
    ]);
    db.show.findMany.mockResolvedValue([{ id: "show-only", date: "2024-03-29", slug: "2024-03-29-webster-hall" }]);
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub([]));

    const result = await service.findPerformancesForShow("show-only");

    expect(result[0].previousPerformance).toBeNull();
    expect(result[0].nextPerformance).toBeNull();
  });

  // Tagged with two operas → one annotation per opera, each rank and gap
  // computed independently against its own chronological list.
  test("computes independent ranks when a show is tagged with multiple operas", async () => {
    const db = makeMockDb();
    db.rockOperaPerformance.findMany.mockResolvedValue([
      {
        showId: "show-target",
        rockOperaId: "ro-1",
        rockOpera: { id: "ro-1", slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
      },
      {
        showId: "show-target",
        rockOperaId: "ro-2",
        rockOpera: { id: "ro-2", slug: "chemical-warfare-brigade", name: "Chemical Warfare Brigade", shortName: "CWB" },
      },
    ]);
    db.show.findMany
      .mockResolvedValueOnce([
        { id: "show-target", date: "1998-12-31", slug: "show-target-slug" },
        { id: "show-x", date: "1999-01-24", slug: "show-x-slug" },
      ])
      .mockResolvedValueOnce([
        { id: "show-a", date: "2000-12-30", slug: "show-a-slug" },
        { id: "show-b", date: "2001-04-26", slug: "show-b-slug" },
        { id: "show-c", date: "2002-11-06", slug: "show-c-slug" },
        { id: "show-d", date: "2003-11-28", slug: "show-d-slug" },
        { id: "show-target", date: "2009-06-03", slug: "show-target-slug" },
      ]);
    // Two stub stats dates: one falls between HAB target & next, one
    // between CWB show-d & target. Verifies gap is computed per-opera.
    const service = new RockOperaService(db as never, makeLogger(), makeStatsStub(["1999-01-10", "2005-01-01"]));

    const result = await service.findPerformancesForShow("show-target");

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      rockOpera: { slug: "hot-air-balloon" },
      performanceNumber: 1,
      previousPerformance: null,
      nextPerformance: { date: "1999-01-24", gap: 1 },
    });
    expect(result[1]).toMatchObject({
      rockOpera: { slug: "chemical-warfare-brigade" },
      performanceNumber: 5,
      previousPerformance: { date: "2003-11-28", gap: 1 },
      nextPerformance: null,
    });
  });
});

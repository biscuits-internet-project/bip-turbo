import { describe, expect, test, vi } from "vitest";
import { InstrumentService, MusicianService } from "./musician-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeMusicianDb(existingBySlug: Record<string, unknown> = {}) {
  return {
    musician: {
      findUnique: vi.fn(({ where }: { where: { slug?: string } }) =>
        Promise.resolve(where.slug ? (existingBySlug[where.slug] ?? null) : null),
      ),
      create: vi.fn(({ data }: { data: Record<string, unknown> }) => Promise.resolve({ id: "new-id", ...data })),
    },
  };
}

function makeInstrumentDb(existingBySlug: Record<string, unknown> = {}) {
  return {
    instrument: {
      findUnique: vi.fn(({ where }: { where: { slug?: string } }) =>
        Promise.resolve(where.slug ? (existingBySlug[where.slug] ?? null) : null),
      ),
      create: vi.fn(({ data }: { data: Record<string, unknown> }) => Promise.resolve({ id: "new-id", ...data })),
    },
  };
}

describe("MusicianService.create — dedupe by slug", () => {
  // Re-running the seed/backfill must not spawn "sam-altman-2"; an existing
  // slug returns the existing row instead.
  test("returns the existing musician when the slug already exists, without creating", async () => {
    const existing = {
      id: "existing-id",
      name: "Sam Altman",
      slug: "sam-altman",
      defaultInstrumentId: null,
      createdAt: new Date("2020-01-01"),
      updatedAt: new Date("2020-01-01"),
    };
    const db = makeMusicianDb({ "sam-altman": existing });
    const service = new MusicianService(db as never, logger);

    const result = await service.create({ name: "Sam Altman" });

    expect(result.id).toBe("existing-id");
    expect(db.musician.create).not.toHaveBeenCalled();
  });

  test("creates a new musician when the slug is free", async () => {
    const db = makeMusicianDb();
    const service = new MusicianService(db as never, logger);

    const result = await service.create({ name: "Marlon Lewis", defaultInstrumentId: "drums-id" });

    expect(db.musician.create).toHaveBeenCalledTimes(1);
    expect(result.slug).toBe("marlon-lewis");
    expect(result.defaultInstrumentId).toBe("drums-id");
  });
});

describe("InstrumentService.create — dedupe by slug", () => {
  test("returns the existing instrument when the slug already exists, without creating", async () => {
    const existing = {
      id: "drums-id",
      name: "Drums",
      slug: "drums",
      createdAt: new Date("2020-01-01"),
      updatedAt: new Date("2020-01-01"),
    };
    const db = makeInstrumentDb({ drums: existing });
    const service = new InstrumentService(db as never, logger);

    const result = await service.create({ name: "Drums" });

    expect(result.id).toBe("drums-id");
    expect(db.instrument.create).not.toHaveBeenCalled();
  });

  test("creates a new instrument when the slug is free", async () => {
    const db = makeInstrumentDb();
    const service = new InstrumentService(db as never, logger);

    const result = await service.create({ name: "Percussion" });

    expect(db.instrument.create).toHaveBeenCalledTimes(1);
    expect(result.slug).toBe("percussion");
  });
});

describe("MusicianService.findAppearances", () => {
  function makeAppearancesDb(args: {
    lineupShowIds: string[];
    presentDeltaShowIds: string[];
    absentDeltaCount: number;
    lineupTrackCount: number;
    firstShowDate?: string;
    lastShowDate?: string;
  }) {
    return {
      showMusician: {
        findMany: vi.fn(() => Promise.resolve(args.lineupShowIds.map((showId) => ({ showId })))),
      },
      trackMusician: {
        findMany: vi.fn(() => Promise.resolve(args.presentDeltaShowIds.map((showId) => ({ track: { showId } })))),
        count: vi.fn(() => Promise.resolve(args.absentDeltaCount)),
      },
      track: {
        count: vi.fn(() => Promise.resolve(args.lineupTrackCount)),
      },
      show: {
        findFirst: vi.fn(({ orderBy }: { orderBy: { date: "asc" | "desc" } }) => {
          const date = orderBy.date === "asc" ? (args.firstShowDate ?? null) : (args.lastShowDate ?? null);
          return Promise.resolve(date ? { date, slug: `show-${date}`, venue: null } : null);
        }),
      },
    };
  }

  test("unions lineup shows with sit-in shows and dedupes overlaps", async () => {
    // The musician is in the lineup for show-1 and show-2, and sat in on a
    // track of show-2 (overlap) and show-3 (new).
    const db = makeAppearancesDb({
      lineupShowIds: ["show-1", "show-2"],
      presentDeltaShowIds: ["show-2", "show-3"],
      absentDeltaCount: 0,
      lineupTrackCount: 20,
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect([...result.showIds].sort()).toEqual(["show-1", "show-2", "show-3"]);
  });

  test("track count is lineup tracks minus sat-outs plus sit-ins on non-lineup shows", async () => {
    // 20 lineup tracks, 3 sat-outs, one sit-in on a lineup show (not added
    // again) and one on a non-lineup show (added). 20 - 3 + 1 = 18.
    const db = makeAppearancesDb({
      lineupShowIds: ["show-1"],
      presentDeltaShowIds: ["show-1", "show-9"],
      absentDeltaCount: 3,
      lineupTrackCount: 20,
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.trackCount).toBe(18);
  });

  test("surfaces first and last show dates from the appearance show set", async () => {
    const db = makeAppearancesDb({
      lineupShowIds: ["show-1"],
      presentDeltaShowIds: [],
      absentDeltaCount: 0,
      lineupTrackCount: 5,
      firstShowDate: "2003-04-12",
      lastShowDate: "2019-09-01",
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.firstShow?.date).toBe("2003-04-12");
    expect(result.lastShow?.date).toBe("2019-09-01");
  });
});

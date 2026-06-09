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

type InstrumentRow = { id: string; name: string; slug: string };

function makeInstrumentEditDb(bySlug: Record<string, InstrumentRow>) {
  return {
    instrument: {
      findFirst: vi.fn(({ where }: { where: { slug?: string; id?: { not?: string } } }) => {
        const match = where.slug ? bySlug[where.slug] : null;
        if (!match) return Promise.resolve(null);
        // generateInstrumentSlug excludes the current row when checking collisions.
        if (where.id?.not && match.id === where.id.not) return Promise.resolve(null);
        return Promise.resolve(match);
      }),
      update: vi.fn(({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
        Promise.resolve({
          id: where.id,
          name: "",
          slug: "",
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
          ...data,
        }),
      ),
    },
  };
}

describe("InstrumentService.update — resolves by slug", () => {
  test("looks the instrument up by slug and regenerates the slug on rename", async () => {
    const db = makeInstrumentEditDb({ guitar: { id: "g1", name: "Guitar", slug: "guitar" } });
    const service = new InstrumentService(db as never, logger);

    const result = await service.update("guitar", { name: "Electric Guitar" });

    expect(db.instrument.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "g1" } }));
    expect(result.slug).toBe("electric-guitar");
  });

  test("appends a suffix when the renamed slug collides with another instrument", async () => {
    const db = makeInstrumentEditDb({
      keys: { id: "k1", name: "Keys", slug: "keys" },
      piano: { id: "p1", name: "Piano", slug: "piano" },
    });
    const service = new InstrumentService(db as never, logger);

    const result = await service.update("keys", { name: "Piano" });

    expect(result.slug).toBe("piano-2");
  });

  test("throws when no instrument matches the slug", async () => {
    const service = new InstrumentService(makeInstrumentEditDb({}) as never, logger);

    await expect(service.update("kazoo", { name: "Kazoo" })).rejects.toThrow('Instrument with slug "kazoo" not found');
  });
});

describe("InstrumentService.delete — guards referenced rows", () => {
  function makeDeleteDb(counts: { show: number; track: number; musician: number }) {
    return {
      showMusicianInstrument: { count: vi.fn(() => Promise.resolve(counts.show)) },
      trackMusicianInstrument: { count: vi.fn(() => Promise.resolve(counts.track)) },
      musician: { count: vi.fn(() => Promise.resolve(counts.musician)) },
      instrument: { delete: vi.fn(() => Promise.resolve({})) },
    };
  }

  test("refuses to delete an instrument referenced by any join or musician default", async () => {
    const db = makeDeleteDb({ show: 0, track: 2, musician: 1 });
    const service = new InstrumentService(db as never, logger);

    await expect(service.delete("g1")).rejects.toThrow("Cannot delete instrument with 3 reference(s)");
    expect(db.instrument.delete).not.toHaveBeenCalled();
  });

  test("deletes an unreferenced instrument", async () => {
    const db = makeDeleteDb({ show: 0, track: 0, musician: 0 });
    const service = new InstrumentService(db as never, logger);

    const result = await service.delete("g1");

    expect(result).toBe(true);
    expect(db.instrument.delete).toHaveBeenCalledWith({ where: { id: "g1" } });
  });
});

describe("InstrumentService.findManyWithUsageCount", () => {
  test("sums show, track, and musician-default counts per instrument", async () => {
    const db = {
      instrument: {
        findMany: vi.fn(() =>
          Promise.resolve([
            {
              id: "g1",
              name: "Guitar",
              slug: "guitar",
              createdAt: new Date("2020-01-01"),
              updatedAt: new Date("2020-01-01"),
              _count: { showMusicianInstruments: 4, trackMusicianInstruments: 5, musicians: 2 },
            },
          ]),
        ),
      },
    };
    const service = new InstrumentService(db as never, logger);

    const [result] = await service.findManyWithUsageCount();

    expect(result.usageCount).toBe(11);
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

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

describe("MusicianService.findTopByPlayCount", () => {
  // The picker's default list surfaces the most-played musicians first (the
  // core lineup + frequent guests) so the common picks aren't buried under an
  // alphabetical list. Ties break alphabetically for a stable order.
  test("orders by play count desc, breaking ties alphabetically, and caps at the limit", async () => {
    const service = new MusicianService({} as never, logger);
    vi.spyOn(service, "findAllWithStats").mockResolvedValue([
      { id: "1", name: "Allen Aucoin", slug: "allen-aucoin", playCount: 5 },
      { id: "2", name: "Marc Brownstein", slug: "marc-brownstein", playCount: 40 },
      { id: "3", name: "Aron Magner", slug: "aron-magner", playCount: 40 },
      { id: "4", name: "Sam Altman", slug: "sam-altman", playCount: 12 },
    ] as never);

    const result = await service.findTopByPlayCount(3);

    expect(result.map((m) => m.slug)).toEqual([
      // 40 (Aron < Marc alphabetically), then 40, then 12 — Allen's 5 is cut.
      "aron-magner",
      "marc-brownstein",
      "sam-altman",
    ]);
  });
});

describe("MusicianService.findAllWithStats", () => {
  // Shows, songs and plays are three aggregates over the same appearances
  // (venues turned up at, distinct repertoire, repeat plays); mapping any of
  // them to the wrong field would silently swap plausible-looking numbers.
  test("maps the show, song, and play aggregates to their own fields", async () => {
    const db = {
      $queryRaw: vi.fn(() =>
        Promise.resolve([
          {
            id: "1",
            name: "Aron Magner",
            slug: "aron-magner",
            known_from: null,
            default_instrument_id: null,
            default_instrument_name: "Keyboards",
            show_count: BigInt(1899),
            song_count: BigInt(550),
            play_count: BigInt(20111),
            first_show_date: "1995-04-15",
            last_show_date: "2026-01-03",
          },
        ]),
      ),
    };
    const service = new MusicianService(db as never, logger);

    const [magner] = await service.findAllWithStats();

    expect(magner.showCount).toBe(1899);
    expect(magner.songCount).toBe(550);
    expect(magner.playCount).toBe(20111);
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

type MusicianRow = {
  id: string;
  name: string;
  slug: string;
  knownFrom: string | null;
  defaultInstrumentId: string | null;
};

function makeMusicianEditDb(bySlug: Record<string, MusicianRow>) {
  return {
    musician: {
      findFirst: vi.fn(({ where }: { where: { slug?: string; id?: { not?: string } } }) => {
        const match = where.slug ? bySlug[where.slug] : null;
        if (!match) return Promise.resolve(null);
        // generateMusicianSlug excludes the current row when checking collisions.
        if (where.id?.not && match.id === where.id.not) return Promise.resolve(null);
        return Promise.resolve(match);
      }),
      update: vi.fn(({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
        Promise.resolve({
          id: where.id,
          name: "",
          slug: "",
          knownFrom: null,
          defaultInstrumentId: null,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
          ...data,
        }),
      ),
    },
  };
}

describe("MusicianService.update resolves by slug", () => {
  test("looks the musician up by slug and regenerates the slug on rename", async () => {
    const db = makeMusicianEditDb({
      "jon-gutwillig": {
        id: "jg",
        name: "Jon Gutwillig",
        slug: "jon-gutwillig",
        knownFrom: null,
        defaultInstrumentId: null,
      },
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.update("jon-gutwillig", { name: "Jon Gutwillik" });

    expect(db.musician.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "jg" } }));
    expect(result.slug).toBe("jon-gutwillik");
  });

  test("appends a suffix when the renamed slug collides with another musician", async () => {
    const db = makeMusicianEditDb({
      "marc-brownstein": {
        id: "mb",
        name: "Marc Brownstein",
        slug: "marc-brownstein",
        knownFrom: null,
        defaultInstrumentId: null,
      },
      "aron-magner": { id: "am", name: "Aron Magner", slug: "aron-magner", knownFrom: null, defaultInstrumentId: null },
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.update("marc-brownstein", { name: "Aron Magner" });

    expect(result.slug).toBe("aron-magner-2");
  });

  test("updates knownFrom and the default instrument", async () => {
    const db = makeMusicianEditDb({
      "aron-magner": { id: "am", name: "Aron Magner", slug: "aron-magner", knownFrom: null, defaultInstrumentId: null },
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.update("aron-magner", { knownFrom: "Conspirator", defaultInstrumentId: "keys-id" });

    expect(result.knownFrom).toBe("Conspirator");
    expect(result.defaultInstrumentId).toBe("keys-id");
  });

  test("clears knownFrom and the default instrument when set to null", async () => {
    const db = makeMusicianEditDb({
      "allen-aucoin": {
        id: "aa",
        name: "Allen Aucoin",
        slug: "allen-aucoin",
        knownFrom: "DJ Spaceman",
        defaultInstrumentId: "drums-id",
      },
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.update("allen-aucoin", { knownFrom: null, defaultInstrumentId: null });

    expect(db.musician.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ knownFrom: null, defaultInstrumentId: null }) }),
    );
    expect(result.knownFrom).toBeNull();
    expect(result.defaultInstrumentId).toBeNull();
  });

  test("throws when no musician matches the slug", async () => {
    const service = new MusicianService(makeMusicianEditDb({}) as never, logger);

    await expect(service.update("nobody", { name: "Someone" })).rejects.toThrow(
      'Musician with slug "nobody" not found',
    );
  });
});

describe("MusicianService.delete guards referenced rows", () => {
  function makeDeleteDb(counts: { show: number; track: number }) {
    return {
      showMusician: { count: vi.fn(() => Promise.resolve(counts.show)) },
      trackMusician: { count: vi.fn(() => Promise.resolve(counts.track)) },
      musician: { delete: vi.fn(() => Promise.resolve({})) },
    };
  }

  test("counts lineup and per-track references", async () => {
    const db = makeDeleteDb({ show: 4, track: 6 });
    const service = new MusicianService(db as never, logger);

    expect(await service.countReferences("am")).toBe(10);
  });

  test("refuses to delete a musician with appearances", async () => {
    const db = makeDeleteDb({ show: 1, track: 2 });
    const service = new MusicianService(db as never, logger);

    await expect(service.delete("am")).rejects.toThrow("Cannot delete musician with 3 reference(s)");
    expect(db.musician.delete).not.toHaveBeenCalled();
  });

  test("deletes an unreferenced musician", async () => {
    const db = makeDeleteDb({ show: 0, track: 0 });
    const service = new MusicianService(db as never, logger);

    const result = await service.delete("am");

    expect(result).toBe(true);
    expect(db.musician.delete).toHaveBeenCalledWith({ where: { id: "am" } });
  });
});

describe("MusicianService.findAppearances", () => {
  // The shows and the counts are two raw queries over two shared builders;
  // route each by the column the show query projects.
  function makeAppearancesDb(args: {
    showIds: string[];
    songCount?: number;
    playCount?: number;
    firstShowDate?: string;
    lastShowDate?: string;
  }) {
    return {
      $queryRaw: vi.fn((strings: TemplateStringsArray) =>
        strings.join("").includes("SELECT DISTINCT a.show_id")
          ? Promise.resolve(args.showIds.map((show_id) => ({ show_id })))
          : Promise.resolve([{ song_count: BigInt(args.songCount ?? 0), play_count: BigInt(args.playCount ?? 0) }]),
      ),
      show: {
        findFirst: vi.fn(({ orderBy }: { orderBy: Array<{ date?: "asc" | "desc" }> }) => {
          const date = orderBy[0]?.date === "asc" ? (args.firstShowDate ?? null) : (args.lastShowDate ?? null);
          return Promise.resolve(date ? { date, slug: `show-${date}`, venue: null } : null);
        }),
      },
    };
  }

  // The shows table and the "Shows Played" figure both read `showIds`, so the
  // count has to be the length of that same list rather than its own query.
  test("reports the appearance shows and counts them", async () => {
    const db = makeAppearancesDb({ showIds: ["show-1", "show-2", "show-3"] });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.showIds).toEqual(["show-1", "show-2", "show-3"]);
    expect(result.showCount).toBe(3);
  });

  // The profile header shows repeat plays next to distinct repertoire; both
  // come from one raw query, so each has to land on its own field.
  test("song and play counts come from the aggregate query", async () => {
    const db = makeAppearancesDb({ showIds: ["show-1"], songCount: 17, playCount: 42 });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.songCount).toBe(17);
    expect(result.playCount).toBe(42);
  });

  test("surfaces first and last show dates from the appearance show set", async () => {
    const db = makeAppearancesDb({
      showIds: ["show-1"],
      firstShowDate: "2003-04-12",
      lastShowDate: "2019-09-01",
    });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.firstShow?.date).toBe("2003-04-12");
    expect(result.lastShow?.date).toBe("2019-09-01");
  });

  // Musicians with no recorded appearances must not fan out into two
  // first/last lookups over an empty id list.
  test("skips the first/last lookups when there are no appearance shows", async () => {
    const db = makeAppearancesDb({ showIds: [] });
    const service = new MusicianService(db as never, logger);

    const result = await service.findAppearances("musician-1");

    expect(result.showCount).toBe(0);
    expect(result.firstShow).toBeNull();
    expect(db.show.findFirst).not.toHaveBeenCalled();
  });
});

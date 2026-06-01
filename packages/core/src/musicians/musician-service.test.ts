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

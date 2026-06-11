import { describe, expect, test, vi } from "vitest";
import { VenueService } from "./venue-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

type VenueRow = { id: string; name: string; slug: string; city: string; state: string; country: string };

// The admin edit route passes the slug from the URL, so update must resolve the
// venue by slug — not by id (passing the slug as an id matches nothing and throws).
function makeVenueDb(bySlug: Record<string, VenueRow>) {
  return {
    venue: {
      findFirst: vi.fn(({ where }: { where: { slug?: string; id?: { not?: string } } }) => {
        const match = where.slug ? bySlug[where.slug] : null;
        if (!match) return Promise.resolve(null);
        // generateVenueSlug excludes the current venue when checking collisions.
        if (where.id?.not && match.id === where.id.not) return Promise.resolve(null);
        return Promise.resolve(match);
      }),
      update: vi.fn(({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
        Promise.resolve({
          id: where.id,
          name: "",
          slug: "",
          city: null,
          state: null,
          country: null,
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
          ...data,
        }),
      ),
    },
  };
}

// `$queryRaw` is called as a tag template — Prisma passes the cooked
// template-string chunks as the first arg and every interpolated
// `Prisma.Sql` fragment as the rest. Concatenate both so an assertion can
// `.toContain()` SQL the service issued (e.g. the same-day tiebreak).
function joinSqlFromCall(call: unknown[]): string {
  const chunks = (call[0] as readonly string[]).join("?");
  const fragments = call
    .slice(1)
    .map((arg) => (arg as { sql?: string }).sql ?? "")
    .join(" ");
  return `${chunks} ${fragments}`;
}

describe("VenueService.getShowAggregates", () => {
  test("maps grouped rows to the camelCase aggregate shape", async () => {
    const queryRaw = vi.fn().mockResolvedValue([
      {
        venue_id: "v1",
        show_count: 3,
        years: [2019, 2017],
        first_slug: "2017-08-15-the-camp-bisco",
        first_date: "2017-08-15",
        last_slug: "2019-12-31-the-fillmore",
        last_date: "2019-12-31",
      },
    ]);
    const service = new VenueService({ $queryRaw: queryRaw } as never, logger);

    const result = await service.getShowAggregates();

    expect(result).toEqual([
      {
        venueId: "v1",
        showCount: 3,
        years: [2019, 2017],
        firstSlug: "2017-08-15-the-camp-bisco",
        firstDate: "2017-08-15",
        lastSlug: "2019-12-31-the-fillmore",
        lastDate: "2019-12-31",
      },
    ]);
  });

  // First/last shows must order by the show-ordering tiebreak (date, then
  // day_order, then id), not raw date alone — same-day shows would otherwise
  // pick an arbitrary first/last.
  test("groups by venue and orders first/last by the same-day tiebreak", async () => {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const service = new VenueService({ $queryRaw: queryRaw } as never, logger);

    await service.getShowAggregates();

    expect(queryRaw).toHaveBeenCalledTimes(1);
    const sql = joinSqlFromCall(queryRaw.mock.calls[0]).toLowerCase();
    expect(sql).toContain("group by");
    expect(sql).toContain("day_order");
  });
});

describe("VenueService.delete", () => {
  // A venue that still hosts shows can't be deleted — the FK would block it and
  // it isn't a stale row. The guard refuses with a message the admin UI shows.
  test("refuses to delete a venue that still has shows", async () => {
    const db = {
      show: { count: vi.fn().mockResolvedValue(3) },
      venue: { delete: vi.fn() },
    };
    const service = new VenueService(db as never, logger);

    await expect(service.delete("v1")).rejects.toThrow("Cannot delete venue with 3 show(s)");
    expect(db.venue.delete).not.toHaveBeenCalled();
  });

  test("deletes a venue with no shows", async () => {
    const db = {
      show: { count: vi.fn().mockResolvedValue(0) },
      venue: { delete: vi.fn().mockResolvedValue({ id: "v1" }) },
    };
    const service = new VenueService(db as never, logger);

    await expect(service.delete("v1")).resolves.toBe(true);
    expect(db.venue.delete).toHaveBeenCalledWith({ where: { id: "v1" } });
  });
});

describe("VenueService.update — resolves by slug", () => {
  test("looks the venue up by slug and regenerates the slug on rename", async () => {
    const db = makeVenueDb({
      "the-caverns": {
        id: "cav",
        name: "The Caverns",
        slug: "the-caverns",
        city: "Pelham",
        state: "TN",
        country: "United States",
      },
    });
    const service = new VenueService(db as never, logger);

    const result = await service.update("the-caverns", {
      name: "Red Rocks Amphitheater",
      city: "Morrison",
      state: "CO",
      country: "United States",
    });

    expect(db.venue.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "cav" } }));
    expect(result.slug).toBe("red-rocks-amphitheater");
  });

  test("throws when no venue matches the slug", async () => {
    const db = makeVenueDb({});
    const service = new VenueService(db as never, logger);

    await expect(
      service.update("nobody", { name: "Somewhere", city: "Town", state: "TN", country: "United States" }),
    ).rejects.toThrow('Venue with slug "nobody" not found');
  });
});

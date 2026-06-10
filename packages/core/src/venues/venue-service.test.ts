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

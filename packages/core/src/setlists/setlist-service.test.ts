import { describe, expect, test, vi } from "vitest";
import { SetlistService } from "./setlist-service";

// Minimal mock DbClient — only the paths used by tests
function makeMockDb() {
  return {
    show: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
  };
}

describe("SetlistService.findManyLight", () => {
  // monthDay filter passes endsWith to Prisma's date where clause
  test("applies endsWith date filter when monthDay is provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { monthDay: "04-04" },
      sort: [{ field: "date", direction: "desc" }],
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toEqual({ endsWith: "-04-04" });
  });

  // Year filter expands to a half-open date range (gte first day, lt next
  // year's first day) so it works with the string-shaped date column.
  test("applies gte/lt date filter when year is provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024 },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toEqual({ gte: "2024-01-01", lt: "2025-01-01" });
  });

  // No date filter when neither year nor monthDay is provided
  test("omits date filter when no year or monthDay provided", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({ filters: {} });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.date).toBeUndefined();
  });

  // hasYoutube=true maps to showYoutubesCount > 0 — same pattern as hasPhotos
  // but targets the denormalized YouTube count on the Show model.
  test("applies showYoutubesCount > 0 when hasYoutube is true", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasYoutube: true },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toEqual({ gt: 0 });
  });

  // hasYoutube=false is the negative tri-state branch — caller is asking for
  // shows that explicitly DO NOT have a YouTube video. Maps to showYoutubesCount = 0
  // rather than skipping the filter (which is the `undefined` case).
  test("applies showYoutubesCount = 0 when hasYoutube is false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasYoutube: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toEqual({ equals: 0 });
  });

  // hasPhotos=false — same negative branch on the photos column. Drives the
  // "shows without photos" filter from the year-page UI.
  test("applies showPhotosCount = 0 when hasPhotos is false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasPhotos: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showPhotosCount).toEqual({ equals: 0 });
  });

  // Without the flag set (undefined), the where-clause must not constrain
  // either count column so all shows remain in the results.
  test("omits photos/youtube filters when hasPhotos and hasYoutube are undefined", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({ filters: { year: 2024 } });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showYoutubesCount).toBeUndefined();
    expect(call.where.showPhotosCount).toBeUndefined();
  });

  // hasPhotos and hasYoutube combine as AND when both are active — lets the
  // filter bar stack Photos+YouTube on the year route. Includes a positive
  // and negative mix to cover the cross-product.
  test("stacks hasPhotos=true with hasYoutube=false", async () => {
    const db = makeMockDb();
    const service = new SetlistService(db as never);

    await service.findManyLight({
      filters: { year: 2024, hasPhotos: true, hasYoutube: false },
    });

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.where.showPhotosCount).toEqual({ gt: 0 });
    expect(call.where.showYoutubesCount).toEqual({ equals: 0 });
  });
});

describe("SetlistService.countByMonthDay", () => {
  // Uses Prisma's count with endsWith to match any year for a given
  // calendar day. Used by the home page to show On This Day counts.
  test("calls db.show.count with endsWith date filter", async () => {
    const db = makeMockDb();
    db.show.count.mockResolvedValue(7);
    const service = new SetlistService(db as never);

    const result = await service.countByMonthDay("04-08");

    expect(result).toBe(7);
    expect(db.show.count).toHaveBeenCalledWith({
      where: { date: { endsWith: "-04-08" } },
    });
  });
});

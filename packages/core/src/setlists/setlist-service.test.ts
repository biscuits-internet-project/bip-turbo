import { describe, expect, test, vi } from "vitest";
import { SetlistService } from "./setlist-service";

// Minimal mock DbClient — only the show.findMany path used by findManyLight
function makeMockDb() {
  return {
    show: {
      findMany: vi.fn().mockResolvedValue([]),
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

  // Existing year filter still works (gte/lt range) — no regression
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
});

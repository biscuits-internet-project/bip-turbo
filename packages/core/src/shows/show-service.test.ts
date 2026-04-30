import { describe, expect, test, vi } from "vitest";
import { ShowService } from "./show-service";

// Minimal logger stub — show-service only calls `.info`
const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeMockDb() {
  return {
    show: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  };
}

describe("ShowService.getShowDatesWithFlags", () => {
  // The year page needs, for every show, whether it has photos and whether it
  // has YouTube, so counts can be bucketed by year in the loader after external
  // catalogs (nugs/archive) are joined in. This is the single DB query that
  // feeds that computation.
  test("returns date + flags for every show, derived from denormalized counts", async () => {
    const db = makeMockDb();
    db.show.findMany.mockResolvedValue([
      { date: "2004-12-31", showPhotosCount: 4, showYoutubesCount: 0 },
      { date: "2019-08-10", showPhotosCount: 0, showYoutubesCount: 2 },
      { date: "2023-06-15", showPhotosCount: 7, showYoutubesCount: 3 },
    ]);
    const service = new ShowService(db as never, logger);

    const result = await service.getShowDatesWithFlags();

    expect(result).toEqual([
      { date: "2004-12-31", hasPhotos: true, hasYoutube: false },
      { date: "2019-08-10", hasPhotos: false, hasYoutube: true },
      { date: "2023-06-15", hasPhotos: true, hasYoutube: true },
    ]);
  });

  // Only the date + two counts are selected — this query runs for every filter
  // toggle change on the year page, so keep it narrow.
  test("selects only the fields needed for bucketing", async () => {
    const db = makeMockDb();
    const service = new ShowService(db as never, logger);

    await service.getShowDatesWithFlags();

    const call = db.show.findMany.mock.calls[0][0];
    expect(call.select).toEqual({
      date: true,
      showPhotosCount: true,
      showYoutubesCount: true,
    });
  });
});

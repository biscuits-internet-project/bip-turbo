import { describe, expect, test, vi } from "vitest";
import { PostgresSearchService } from "./postgres-search-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

describe("PostgresSearchService.searchByDate", () => {
  // A full-date query (e.g. "2025-10-31") matches by date alone, so the orphan
  // placeholder show that coexists with the real show on that date would come
  // back as a venueless result the user can click into a 404 (findByShowSlug
  // returns null for a venueless show). The date-search SQL must exclude stubs.
  test("excludes venueless stub shows from the date-search query", async () => {
    let capturedSql = "";
    const db = {
      $queryRawUnsafe: vi.fn((sql: string) => {
        capturedSql = sql;
        return Promise.resolve([]);
      }),
    } as never;
    const service = new PostgresSearchService(db, logger);

    await service.search("2025-10-31");

    expect(capturedSql).toContain("venue_id IS NOT NULL");
  });
});

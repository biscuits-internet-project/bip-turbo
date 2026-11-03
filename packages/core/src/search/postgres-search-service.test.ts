import { describe, expect, test, vi } from "vitest";
import { InvalidSearchQueryError, PostgresSearchService } from "./postgres-search-service";

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

describe("PostgresSearchService query cap", () => {
  // /mcp is unauthenticated and called these methods with no length check; each query
  // fans out into trigram/LIKE/tsquery scans of every song, venue and show. The cap lives
  // here so no entry point can skip it.
  const tooLong = "a".repeat(201);

  test.each([
    ["search", (s: PostgresSearchService) => s.search(tooLong)],
    ["searchSongs", (s: PostgresSearchService) => s.searchSongs(tooLong)],
    ["searchVenues", (s: PostgresSearchService) => s.searchVenues(tooLong)],
    ["search with a non-string", (s: PostgresSearchService) => s.search({ contains: "a" } as never)],
    ["a 9-song segue chain", (s: PostgresSearchService) => s.search("a > b > c > d > e > f > g > h > i")],
  ])("%s rejects before touching the database", async (_label, run) => {
    const db = { $queryRawUnsafe: vi.fn(), $queryRaw: vi.fn(), song: { findMany: vi.fn() } } as never;
    const service = new PostgresSearchService(db, logger);

    await expect(run(service)).rejects.toBeInstanceOf(InvalidSearchQueryError);
    expect((db as { $queryRawUnsafe: ReturnType<typeof vi.fn> }).$queryRawUnsafe).not.toHaveBeenCalled();
    expect((db as { $queryRaw: ReturnType<typeof vi.fn> }).$queryRaw).not.toHaveBeenCalled();
  });

  test("a query at the cap still runs", async () => {
    const db = { $queryRawUnsafe: vi.fn().mockResolvedValue([]), $queryRaw: vi.fn().mockResolvedValue([]) } as never;
    await expect(new PostgresSearchService(db, logger).search("a".repeat(200))).resolves.toBeDefined();
  });
});

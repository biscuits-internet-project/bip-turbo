import { describe, expect, test, vi } from "vitest";
import { topUsersByMetric, UserService, type UserStats } from "./user-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

describe("UserService.getUserTabCounts", () => {
  // The user-profile page renders tab labels like "Reviews (12)" /
  // "Track Ratings (783)". Pulling the full data just to derive the count
  // for the tab label was costing megabytes on heavy users — this method
  // returns just the four counts via cheap aggregations so the loader can
  // populate labels without fetching the underlying rows.
  test("returns review/show-rating/track-rating/blog-post counts via cheap COUNT queries", async () => {
    const ratingCount = vi
      .fn()
      .mockImplementationOnce(async () => 17) // first call: show ratings
      .mockImplementationOnce(async () => 42); // second call: track ratings

    const db = {
      review: { count: vi.fn().mockResolvedValue(6) },
      rating: { count: ratingCount },
      blogPost: { count: vi.fn().mockResolvedValue(3) },
    } as never;

    const service = new UserService(db, logger);
    const counts = await service.getUserTabCounts("u-rynow");

    expect(counts).toEqual({
      reviewCount: 6,
      showRatingsCount: 17,
      trackRatingsCount: 42,
      blogPostCount: 3,
    });
  });

  // The two rating counts are filtered by rateableType so we never conflate
  // show ratings with track ratings — the user profile shows them in
  // separate tabs and their counts must not overlap.
  test("filters rating counts by rateableType (Show vs Track)", async () => {
    const ratingCount = vi.fn().mockResolvedValue(0);
    const db = {
      review: { count: vi.fn().mockResolvedValue(0) },
      rating: { count: ratingCount },
      blogPost: { count: vi.fn().mockResolvedValue(0) },
    } as never;

    const service = new UserService(db, logger);
    await service.getUserTabCounts("u-1");

    // First rating.count call → show ratings
    expect(ratingCount.mock.calls[0][0].where).toMatchObject({
      userId: "u-1",
      rateableType: "Show",
    });
    // Second rating.count call → track ratings
    expect(ratingCount.mock.calls[1][0].where).toMatchObject({
      userId: "u-1",
      rateableType: "Track",
    });
  });

  // Blog post count must mirror getUserStats's filter: only published posts.
  // Otherwise the tab label disagrees with what actually renders in the tab.
  test("blog post count only includes published posts", async () => {
    const blogCount = vi.fn().mockResolvedValue(0);
    const db = {
      review: { count: vi.fn().mockResolvedValue(0) },
      rating: { count: vi.fn().mockResolvedValue(0) },
      blogPost: { count: blogCount },
    } as never;

    const service = new UserService(db, logger);
    await service.getUserTabCounts("u-1");

    expect(blogCount.mock.calls[0][0].where).toMatchObject({
      userId: "u-1",
      state: "published",
    });
  });
});

describe("UserService.getUserProfileHeader", () => {
  // The user-profile header always renders attendance count + first/last
  // show dates. Pulling the full attendance list just to derive three
  // values was costing ~30-50ms on heavy users; this method does it via
  // a COUNT + two cheap findFirst queries.
  test("returns attendanceCount + first and last attended shows", async () => {
    const attendanceCount = vi.fn().mockResolvedValue(459);
    const findFirst = vi
      .fn()
      // Ascending: oldest show (first attended)
      .mockResolvedValueOnce({ show: { id: "show-first", date: "1998-04-25" } })
      // Descending: newest show (most recent)
      .mockResolvedValueOnce({ show: { id: "show-last", date: "2026-04-25" } });

    const db = {
      attendance: {
        count: attendanceCount,
        findFirst,
      },
    } as never;

    const service = new UserService(db, logger);
    const header = await service.getUserProfileHeader("u-1");

    expect(header).toEqual({
      attendanceCount: 459,
      firstShow: { id: "show-first", date: "1998-04-25" },
      lastShow: { id: "show-last", date: "2026-04-25" },
    });
  });

  // When the user has no attendances, firstShow/lastShow are null and the
  // header still renders cleanly (no attendances row + zero count).
  test("returns nulls for first/last show when user has no attendances", async () => {
    const db = {
      attendance: {
        count: vi.fn().mockResolvedValue(0),
        findFirst: vi.fn().mockResolvedValue(null),
      },
    } as never;

    const service = new UserService(db, logger);
    const header = await service.getUserProfileHeader("u-1");

    expect(header).toEqual({
      attendanceCount: 0,
      firstShow: null,
      lastShow: null,
    });
  });

  // Ordering matters: first show is the oldest by date, last show is the
  // newest. The findFirst calls must specify these directions explicitly.
  test("orders first by show.date asc and last by show.date desc", async () => {
    const findFirst = vi.fn().mockResolvedValue(null);
    const db = {
      attendance: {
        count: vi.fn().mockResolvedValue(0),
        findFirst,
      },
    } as never;

    const service = new UserService(db, logger);
    await service.getUserProfileHeader("u-1");

    expect(findFirst.mock.calls[0][0].orderBy).toMatchObject({ show: { date: "asc" } });
    expect(findFirst.mock.calls[1][0].orderBy).toMatchObject({ show: { date: "desc" } });
  });
});

describe("UserService.listForSync", () => {
  // PII allowlist: the sync export MUST select only id/username/avatar/
  // timestamps. Email, names, password digest, and auth tokens never leave
  // prod. This test guards against a future refactor accidentally widening
  // the projection.
  test("selects only non-PII columns — never email, names, or auth fields", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { user: { findMany } } as never;

    const service = new UserService(db, logger);
    await service.listForSync({ since: new Date(0), limit: 100 });

    const select = findMany.mock.calls[0][0].select;
    expect(select).toEqual({
      id: true,
      username: true,
      avatarFileId: true,
      avatarFileUrl: true,
      showCalibratedRatings: true,
      showRatingComparisonDebug: true,
      colorCodeRatings: true,
      createdAt: true,
      updatedAt: true,
    });
    expect(select).not.toHaveProperty("email");
    expect(select).not.toHaveProperty("firstName");
    expect(select).not.toHaveProperty("lastName");
    expect(select).not.toHaveProperty("passwordDigest");
    expect(select).not.toHaveProperty("resetPasswordToken");
    expect(select).not.toHaveProperty("confirmationToken");
  });

  // Same stable-cursor semantics as RatingService.listForSync: first page
  // uses since-only, subsequent pages use the (updatedAt, id) tuple to avoid
  // re-fetching or skipping rows landing at identical timestamps.
  test("subsequent page uses (updatedAt, id) tuple as exclusive cursor", async () => {
    const findMany = vi.fn().mockResolvedValue([]);
    const db = { user: { findMany } } as never;

    const service = new UserService(db, logger);
    const cursorUpdatedAt = new Date("2024-05-01T00:00:00Z");
    await service.listForSync({
      since: new Date(0),
      cursorUpdatedAt,
      cursorId: "u-uuid",
      limit: 100,
    });

    expect(findMany.mock.calls[0][0].where).toEqual({
      OR: [{ updatedAt: { gt: cursorUpdatedAt } }, { AND: [{ updatedAt: cursorUpdatedAt }, { id: { gt: "u-uuid" } }] }],
    });
    expect(findMany.mock.calls[0][0].orderBy).toEqual([{ updatedAt: "asc" }, { id: "asc" }]);
  });
});

/** Minimal UserStats fixture; only the count fields matter to the ranking. */
function makeStats(
  username: string,
  counts: Partial<Pick<UserStats, "reviewCount" | "attendanceCount" | "ratingCount" | "blogPostCount">>,
): UserStats {
  return {
    user: { username } as UserStats["user"],
    reviewCount: 0,
    attendanceCount: 0,
    ratingCount: 0,
    averageRating: null,
    badges: [],
    communityScore: 0,
    blogPostCount: 0,
    ...counts,
  };
}

describe("topUsersByMetric", () => {
  // The community page build derives all four leaderboards from ONE
  // getUserStats() pass. The ranking itself is pure: drop users with a zero
  // count for the metric, sort by that count descending, cap at the limit.
  test("filters zero-count users, sorts descending, and applies the limit", () => {
    const stats = [
      makeStats("magner", { reviewCount: 2 }),
      makeStats("barber", { reviewCount: 9 }),
      makeStats("brownie", { reviewCount: 0 }),
      makeStats("allen", { reviewCount: 5 }),
    ];

    const top = topUsersByMetric(stats, "reviews", 2);

    expect(top.map((s) => s.user.username)).toEqual(["barber", "allen"]);
  });

  // Each metric must rank by its own count; a heavy reviewer with zero blog
  // posts belongs on the reviews board and not the bloggers board.
  test("ranks by the requested metric only", () => {
    const stats = [
      makeStats("magner", { reviewCount: 50, blogPostCount: 0 }),
      makeStats("barber", { reviewCount: 1, blogPostCount: 3 }),
    ];

    expect(topUsersByMetric(stats, "blogPostCount", 5).map((s) => s.user.username)).toEqual(["barber"]);
    expect(topUsersByMetric(stats, "attendance", 5)).toEqual([]);
  });

  // The ranking must not reorder the caller's array in place; the page build
  // reuses the same stats array for four metrics and for the full user list.
  test("does not mutate the input array", () => {
    const stats = [makeStats("magner", { ratingCount: 1 }), makeStats("barber", { ratingCount: 7 })];

    topUsersByMetric(stats, "ratings", 5);

    expect(stats.map((s) => s.user.username)).toEqual(["magner", "barber"]);
  });
});

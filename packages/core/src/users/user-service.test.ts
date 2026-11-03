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
      trackCalibratedRatings: true,
      trackRatingComparisonDebug: true,
      colorCodeRatings: true,
      showSetlistTimes: true,
      ratingDecimalPlaces: true,
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

describe("UserService.getUserStats — public payload", () => {
  // /community serializes every user's stats into its SSR HTML, and each profile does the
  // same for its owner. Before this, the full user row rode along, so the page source
  // carried every member's email address.
  test("returned users carry no email", async () => {
    const db = {
      user: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "u-1",
            username: "magner",
            email: "aron@example.com",
            showRatingComparisonDebug: true,
            createdAt: new Date("2020-01-01"),
            updatedAt: new Date("2020-01-01"),
            _count: { reviews: 1, attendances: 2, ratings: 3, blogPosts: 0 },
            ratings: [{ value: 4 }],
          },
        ]),
      },
    } as never;

    const [stats] = await new UserService(db, logger).getUserStats();

    expect(stats.user.username).toBe("magner");
    expect(stats.user).not.toHaveProperty("email");
    // Allowlist, so per-user settings (and any future column) stay off public pages too.
    expect(Object.keys(stats.user).sort()).toEqual(["avatarUrl", "createdAt", "id", "username"]);
    expect(JSON.stringify(stats)).not.toContain("aron@example.com");
  });
});

describe("UserService.findOrCreate — first-request races", () => {
  const row = (over: Record<string, unknown>) => ({
    id: "u-1",
    email: "a@example.com",
    username: "barber",
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    ...over,
  });
  const p2002 = Object.assign(new Error("Unique constraint failed"), { code: "P2002" });

  // Parallel loaders for the same person: one insert wins, the rest trip the unique index.
  // The row they wanted now exists, so they should get it back, not a 500.
  test("returns the row a sibling request just created", async () => {
    const db = {
      user: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce(null) // username check: free
          .mockResolvedValueOnce(row({})), // findByEmail after the conflict
        upsert: vi.fn().mockRejectedValueOnce(p2002),
      },
    } as never;

    const user = await new UserService(db, logger).findOrCreate({ email: "a@example.com", username: "barber" });

    expect(user.id).toBe("u-1");
  });

  // Two different people asking for the same username in the same instant: the loser's
  // email has no row, so it must re-pick a name rather than fail its first request.
  test("re-picks the username when a different user took it concurrently", async () => {
    const upsert = vi
      .fn()
      .mockRejectedValueOnce(p2002)
      .mockImplementationOnce(async (args: { create: { username: string } }) =>
        row({ username: args.create.username }),
      );
    const db = {
      user: {
        findUnique: vi
          .fn()
          .mockResolvedValueOnce(null) // first username check: "barber" free
          .mockResolvedValueOnce(null) // findByEmail after conflict: not ours
          .mockResolvedValueOnce(row({ email: "other@example.com" })) // re-check: "barber" taken now
          .mockResolvedValueOnce(null), // "barber1" free
        upsert,
      },
    } as never;

    const user = await new UserService(db, logger).findOrCreate({ email: "a@example.com", username: "barber" });

    expect(user.username).toBe("barber1");
    expect(upsert).toHaveBeenCalledTimes(2);
  });
});

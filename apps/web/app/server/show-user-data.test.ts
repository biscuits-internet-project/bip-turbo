import type { Attendance } from "@bip/domain";
import { beforeEach, describe, expect, test, vi } from "vitest";

const getAveragesForRateables = vi.fn();
const findManyByUserIdAndShowIds = vi.fn();
const findManyByUserIdAndRateableIds = vi.fn();
const findByEmail = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    ratings: {
      getAveragesForRateables: (...args: unknown[]) => getAveragesForRateables(...args),
      findManyByUserIdAndRateableIds: (...args: unknown[]) => findManyByUserIdAndRateableIds(...args),
    },
    attendances: {
      findManyByUserIdAndShowIds: (...args: unknown[]) => findManyByUserIdAndShowIds(...args),
    },
    users: {
      findByEmail: (...args: unknown[]) => findByEmail(...args),
    },
  },
}));

vi.mock("~/lib/logger", () => ({
  logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

import { computeShowUserData } from "./show-user-data";

describe("computeShowUserData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // An empty input short-circuits before hitting any service. Callers pass
  // [] when there are no shows on the page (e.g. an empty venue), and that
  // must not trigger DB queries.
  test("returns empty skeleton and makes no service calls when showIds is empty", async () => {
    const result = await computeShowUserData({ currentUser: undefined }, []);

    expect(result).toEqual({ attendances: {}, userRatings: {}, averageRatings: {} });
    expect(getAveragesForRateables).not.toHaveBeenCalled();
    expect(findManyByUserIdAndShowIds).not.toHaveBeenCalled();
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
    expect(findByEmail).not.toHaveBeenCalled();
  });

  // Public browsing (no logged-in user) still shows average ratings — they are
  // aggregate data, visible to everyone. Personal attendance / rating fields
  // stay null for every requested show.
  test("populates average ratings for all showIds and leaves user fields null when no currentUser", async () => {
    getAveragesForRateables.mockResolvedValue({
      "show-1": { average: 4.5, count: 10 },
    });

    const result = await computeShowUserData({ currentUser: undefined }, ["show-1", "show-2"]);

    expect(result.averageRatings["show-1"]).toEqual({ average: 4.5, count: 10 });
    expect(result.averageRatings["show-2"]).toBeNull();
    expect(result.attendances).toEqual({ "show-1": null, "show-2": null });
    expect(result.userRatings).toEqual({ "show-1": null, "show-2": null });
    expect(findByEmail).not.toHaveBeenCalled();
  });

  // A Supabase user with no matching local users row (unusual — typically
  // ensureLocalUserRecord creates one on login). The function must still
  // return a well-formed response with average ratings and null user fields,
  // not throw.
  test("skips user lookups when the local users record is missing", async () => {
    getAveragesForRateables.mockResolvedValue({});
    findByEmail.mockResolvedValue(null);

    const result = await computeShowUserData(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["show-1"],
    );

    expect(result.attendances["show-1"]).toBeNull();
    expect(result.userRatings["show-1"]).toBeNull();
    expect(findManyByUserIdAndShowIds).not.toHaveBeenCalled();
    expect(findManyByUserIdAndRateableIds).not.toHaveBeenCalled();
  });

  // Happy path: logged-in user whose local users row exists. The returned
  // record has attendance and user rating entries only for the specific shows
  // the user attended / rated; other shows stay null.
  test("populates attendances and user ratings only for shows the user has interacted with", async () => {
    getAveragesForRateables.mockResolvedValue({
      "show-1": { average: 4.0, count: 5 },
      "show-2": { average: 3.0, count: 2 },
    });
    findByEmail.mockResolvedValue({ id: "user-1", email: "evan@foo.net" });
    const attendance1 = { id: "att-1", showId: "show-1", userId: "user-1" } as Attendance;
    findManyByUserIdAndShowIds.mockResolvedValue([attendance1]);
    findManyByUserIdAndRateableIds.mockResolvedValue([
      { rateableId: "show-2", rateableType: "Show", value: 5, userId: "user-1" },
    ]);

    const result = await computeShowUserData(
      { currentUser: { id: "auth-1", email: "evan@foo.net", isAdmin: false } },
      ["show-1", "show-2"],
    );

    expect(result.attendances["show-1"]).toBe(attendance1);
    expect(result.attendances["show-2"]).toBeNull();
    expect(result.userRatings["show-1"]).toBeNull();
    expect(result.userRatings["show-2"]).toBe(5);
    expect(result.averageRatings["show-1"]).toEqual({ average: 4.0, count: 5 });
    expect(result.averageRatings["show-2"]).toEqual({ average: 3.0, count: 2 });
  });
});

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: { id: "user-1" }, supabase: null, loading: false })),
}));

vi.mock("~/hooks/use-show-user-data", () => ({
  useShowUserData: vi.fn(() => ({
    attendanceMap: new Map(),
    userRatingMap: new Map(),
    averageRatingMap: new Map(),
    isLoading: false,
    error: null,
  })),
}));

import { useSession } from "~/hooks/use-session";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { ATTENDED_ROW_CLASS } from "~/lib/utils";
import { useAttendanceRowHighlight } from "./use-attendance-row-highlight";

type TestItem = { id: string; showId: string };
const getShowId = (item: TestItem) => item.showId;

describe("useAttendanceRowHighlight", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      user: { id: "user-1" } as never,
      supabase: null,
      loading: false,
    });
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map(),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      isLoading: false,
      error: null,
    });
  });

  // rowClassName is the primary output — it's passed directly to DataTable's
  // rowClassName prop. Returns the attended-row CSS class for shows the user
  // attended, undefined otherwise.
  test("rowClassName returns ATTENDED_ROW_CLASS for attended shows and undefined for others", () => {
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["show-attended", { id: "att-1" } as never]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      isLoading: false,
      error: null,
    });

    const items: TestItem[] = [
      { id: "1", showId: "show-attended" },
      { id: "2", showId: "show-other" },
    ];

    const { result } = renderHook(() => useAttendanceRowHighlight(items, getShowId));

    expect(result.current.rowClassName(items[0])).toBe(ATTENDED_ROW_CLASS);
    expect(result.current.rowClassName(items[1])).toBeUndefined();
  });

  // When the user is not authenticated, the hook should pass an empty array
  // to useShowUserData so no attendance data is fetched. This prevents
  // unnecessary API calls for logged-out users.
  test("passes empty showIds to useShowUserData when user is not authenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      user: null,
      supabase: null,
      loading: false,
    });

    const items: TestItem[] = [{ id: "1", showId: "show-1" }];
    renderHook(() => useAttendanceRowHighlight(items, getShowId));

    expect(vi.mocked(useShowUserData)).toHaveBeenCalledWith([]);
  });

  // isAttended is used by filter predicates (e.g., the "Attended" toggle
  // chip on performance tables) to narrow rows to attended shows.
  test("isAttended returns true for attended shows, false for others", () => {
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["show-yes", { id: "att-1" } as never]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      isLoading: false,
      error: null,
    });

    const items: TestItem[] = [
      { id: "1", showId: "show-yes" },
      { id: "2", showId: "show-no" },
    ];

    const { result } = renderHook(() => useAttendanceRowHighlight(items, getShowId));

    expect(result.current.isAttended(items[0])).toBe(true);
    expect(result.current.isAttended(items[1])).toBe(false);
  });

  // Multiple items can reference the same show (e.g., multiple performances
  // at the same show). The hook should deduplicate IDs before passing to
  // useShowUserData to avoid redundant API calls.
  test("deduplicates show IDs before passing to useShowUserData", () => {
    const items: TestItem[] = [
      { id: "1", showId: "show-same" },
      { id: "2", showId: "show-same" },
      { id: "3", showId: "show-other" },
    ];

    renderHook(() => useAttendanceRowHighlight(items, getShowId));

    const calledWithIds = vi.mocked(useShowUserData).mock.calls[0][0] as string[];
    expect(calledWithIds).toHaveLength(2);
    expect(new Set(calledWithIds)).toEqual(new Set(["show-same", "show-other"]));
  });

  // The hook passes through userRatingMap and averageRatingMap from
  // useShowUserData so callers don't need a separate call for rating data.
  test("passes through userRatingMap and averageRatingMap from useShowUserData", () => {
    const mockUserRatingMap = new Map([["show-1", 4.5]]);
    const mockAverageRatingMap = new Map([["show-1", { average: 4.2, count: 10 }]]);

    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map(),
      userRatingMap: mockUserRatingMap,
      averageRatingMap: mockAverageRatingMap,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useAttendanceRowHighlight([{ id: "1", showId: "show-1" }], getShowId));

    expect(result.current.userRatingMap).toBe(mockUserRatingMap);
    expect(result.current.averageRatingMap).toBe(mockAverageRatingMap);
  });
});

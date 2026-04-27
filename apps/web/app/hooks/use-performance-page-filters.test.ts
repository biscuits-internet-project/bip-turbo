import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

import { usePerformancePageFilters } from "./use-performance-page-filters";

// Stable reference prevents the useEffect (which has initialData in its
// deps) from re-running on every render. An inline `[]` creates a new array
// each render, causing an infinite fetch loop in tests.
const EMPTY: never[] = [];

describe("usePerformancePageFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // The hook returns generic `data` and `filteredData` arrays so consumers
  // can work with any type T, not just SongPagePerformance.
  test("returns data and filteredData properties", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.data).toEqual([]);
    expect(result.current.filteredData).toEqual([]);
  });

  // isLoading tracks whether a fetch is in progress with a 200ms debounce
  // to prevent flickering on fast responses.
  test("isLoading is false when no filters are active", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.isLoading).toBe(false);
  });

  // Loading state is debounced by 200ms to avoid flicker on fast responses.
  // Before the timeout fires, isLoading should remain false.
  test("isLoading becomes true after debounce when filters trigger a fetch", async () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");
    // Never-resolving fetch so loading stays true
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    // Before debounce, still false
    expect(result.current.isLoading).toBe(false);

    // After 200ms debounce, becomes true
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.isLoading).toBe(true);
  });

  // Once the fetch resolves, loading state should clear — even if the
  // debounce timeout already fired. Verifies the full loading lifecycle.
  test("isLoading returns to false when fetch completes", async () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");
    let resolveResponse: (value: unknown) => void = () => {};
    globalThis.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveResponse = resolve;
        }),
    );

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveResponse({ ok: true, json: () => Promise.resolve([]) });
    });
    expect(result.current.isLoading).toBe(false);
  });

  // hasFilters tracks whether any server-side URL param filter is active.
  // Used to decide whether to fetch filtered data or use the initial dataset.
  test("hasFilters is false when all params are default", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(false);
  });

  // timeRange is the URL param for time-based filtering (years, eras, presets).
  test("hasFilters is true when timeRange is set", () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  // Legacy year= and era= URL params still activate filters for bookmarked URLs.
  test("hasFilters is true when legacy year param is set", () => {
    mockSearchParams = new URLSearchParams("year=2024");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when legacy era param is set", () => {
    mockSearchParams = new URLSearchParams("era=sammy");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when cover filter is set", () => {
    mockSearchParams = new URLSearchParams("cover=cover");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when author is set", () => {
    mockSearchParams = new URLSearchParams("author=Trey");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when toggle filters are set", () => {
    mockSearchParams = new URLSearchParams("filters=encore,setOpener");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when attended is set", () => {
    mockSearchParams = new URLSearchParams("attended=attended");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  // hasActiveFilters combines URL param filters AND client-side search text.
  // Used to show/hide the "Clear All" button in PerformanceFilterControls.
  test("hasActiveFilters is false when all params are default and searchText is empty", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasActiveFilters).toBe(false);
  });

  test("hasActiveFilters is true when searchText is non-empty", () => {
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.setSearchText("test");
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test("hasActiveFilters is true when URL params are set even if searchText is empty", () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.searchText).toBe("");
  });

  // clearFilters is a single entry point to reset everything — both URL param
  // filters (year, era, cover, author, toggles, attended) and client-side
  // search text. This powers the "Clear All" button.
  test("clearFilters also resets searchText", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.setSearchText("hello");
    });
    expect(result.current.searchText).toBe("hello");

    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.searchText).toBe("");
  });

  // skipClientFetch lets a consumer disable the internal fetch when the
  // page's loader is already returning filter-aware data (e.g. /songs).
  // Filters can be active and yet no fetch fires; data stays = initialData
  // and isLoading stays false. Loader revalidation drives data updates.
  test("skipClientFetch=true: no fetch fires even when filters are active", async () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() =>
      usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test", skipClientFetch: true }),
    );

    // Advance past the debounce window — still no fetch.
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(EMPTY);
  });

  // Default behavior preserved: with skipClientFetch unset (or false), the
  // hook still fetches when filters are active. Pins that the new option
  // doesn't accidentally silence the existing client-fetch consumers
  // (/songs/$slug performances, /songs/all-timers, /on-this-day).
  test("skipClientFetch defaults to false: fetch still fires for other consumers", async () => {
    mockSearchParams = new URLSearchParams("timeRange=2024");
    const fetchMock = vi.fn().mockImplementation(() => new Promise(() => {}));
    globalThis.fetch = fetchMock;

    renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // Verifies that the setSearchParams updater clears all URL param keys
  // (timeRange, cover, author, filters, attended, played). We call the updater
  // manually because the mock doesn't trigger React state updates — we just
  // need to confirm the function produces the right params.
  test("clearFilters resets all params", () => {
    mockSearchParams = new URLSearchParams(
      "timeRange=2024&cover=cover&author=Trey&filters=encore&attended=attended&played=notPlayed",
    );

    const { result } = renderHook(() => usePerformancePageFilters({ initialData: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.clearFilters();
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updaterFn = mockSetSearchParams.mock.calls[0][0];
    const nextParams = updaterFn(
      new URLSearchParams("timeRange=2024&cover=cover&author=Trey&filters=encore&attended=attended&played=notPlayed"),
    );

    expect(nextParams.get("timeRange")).toBeNull();
    expect(nextParams.get("cover")).toBeNull();
    expect(nextParams.get("author")).toBeNull();
    expect(nextParams.get("filters")).toBeNull();
    expect(nextParams.get("attended")).toBeNull();
    expect(nextParams.get("played")).toBeNull();
  });
});

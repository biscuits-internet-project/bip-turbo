import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("react-router-dom", () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

import { usePerformancePageFilters } from "./use-performance-page-filters";

// Stable reference prevents the useEffect (which has allPerformances in its
// deps) from re-running on every render. An inline `[]` creates a new array
// each render, causing an infinite fetch loop in tests.
const EMPTY: never[] = [];

describe("usePerformancePageFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  // hasFilters tracks whether any server-side URL param filter is active.
  // Used to decide whether to fetch filtered data or use the initial dataset.
  test("hasFilters is false when all params are default", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(false);
  });

  test("hasFilters is true when year is set", () => {
    mockSearchParams = new URLSearchParams("year=2024");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when era is set", () => {
    mockSearchParams = new URLSearchParams("era=1.0");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when cover filter is set", () => {
    mockSearchParams = new URLSearchParams("cover=cover");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when author is set", () => {
    mockSearchParams = new URLSearchParams("author=Trey");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when toggle filters are set", () => {
    mockSearchParams = new URLSearchParams("filters=encore,setOpener");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  test("hasFilters is true when attended is set", () => {
    mockSearchParams = new URLSearchParams("attended=attended");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasFilters).toBe(true);
  });

  // hasActiveFilters combines URL param filters AND client-side search text.
  // Used to show/hide the "Clear All" button in PerformanceFilterControls.
  test("hasActiveFilters is false when all params are default and searchText is empty", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasActiveFilters).toBe(false);
  });

  test("hasActiveFilters is true when searchText is non-empty", () => {
    globalThis.fetch = vi.fn().mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.setSearchText("test");
    });
    expect(result.current.hasActiveFilters).toBe(true);
  });

  test("hasActiveFilters is true when URL params are set even if searchText is empty", () => {
    mockSearchParams = new URLSearchParams("year=2024");

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.searchText).toBe("");
  });

  // clearFilters is a single entry point to reset everything — both URL param
  // filters (year, era, cover, author, toggles, attended) and client-side
  // search text. This powers the "Clear All" button.
  test("clearFilters also resets searchText", () => {
    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.setSearchText("hello");
    });
    expect(result.current.searchText).toBe("hello");

    act(() => {
      result.current.clearFilters();
    });
    expect(result.current.searchText).toBe("");
  });

  // Verifies that the setSearchParams updater clears all six URL param keys.
  // We call the updater manually because the mock doesn't trigger React state
  // updates — we just need to confirm the function produces the right params.
  test("clearFilters resets all params", () => {
    mockSearchParams = new URLSearchParams(
      "year=2024&era=1.0&cover=cover&author=Trey&filters=encore&attended=attended",
    );

    const { result } = renderHook(() => usePerformancePageFilters({ allPerformances: EMPTY, apiUrl: "/api/test" }));

    act(() => {
      result.current.clearFilters();
    });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);

    const updaterFn = mockSetSearchParams.mock.calls[0][0];
    const nextParams = updaterFn(
      new URLSearchParams("year=2024&era=1.0&cover=cover&author=Trey&filters=encore&attended=attended"),
    );

    expect(nextParams.get("year")).toBeNull();
    expect(nextParams.get("era")).toBeNull();
    expect(nextParams.get("cover")).toBeNull();
    expect(nextParams.get("author")).toBeNull();
    expect(nextParams.get("filters")).toBeNull();
    expect(nextParams.get("attended")).toBeNull();
  });
});

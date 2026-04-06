import type { SongPagePerformance } from "@bip/domain";
import { renderHook, act } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { usePerformanceFilters } from "./use-performance-filters";

function makePerformance(overrides: Partial<SongPagePerformance> = {}): SongPagePerformance {
  return {
    trackId: "track-1",
    show: { id: "show-1", slug: "2024-06-15", date: "2024-06-15", venueId: "venue-1" },
    set: "S1",
    position: 3,
    segue: null,
    allTimer: false,
    annotations: [],
    tags: {},
    ...overrides,
  };
}

const neverAttended = () => false;

describe("usePerformanceFilters", () => {
  // When no filters are active, all performances pass through unfiltered.
  test("returns all performances when no filters are active", () => {
    const performances = [
      makePerformance({ trackId: "t1" }),
      makePerformance({ trackId: "t2" }),
      makePerformance({ trackId: "t3" }),
    ];

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended: neverAttended }));

    expect(result.current.filteredPerformances).toHaveLength(3);
    expect(result.current.activeFilters.size).toBe(0);
  });

  // Toggling "encore" filters to only performances tagged as encores.
  // The filter predicate checks `performance.tags?.encore`.
  test("toggling encore filters to performances with tags.encore === true", () => {
    const performances = [
      makePerformance({ trackId: "t-encore", tags: { encore: true } }),
      makePerformance({ trackId: "t-other", tags: { setOpener: true } }),
    ];

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended: neverAttended }));

    act(() => result.current.toggleFilter("encore"));

    expect(result.current.filteredPerformances).toHaveLength(1);
    expect(result.current.filteredPerformances[0].trackId).toBe("t-encore");
  });

  // Multiple active filters use OR semantics: a performance matches if ANY
  // active filter's tag is true. This is important because tags like
  // "segue in" and "encore" are independent — AND would produce empty
  // results in most cases.
  test("multiple active filters use OR semantics", () => {
    const performances = [
      makePerformance({ trackId: "t-encore", tags: { encore: true } }),
      makePerformance({ trackId: "t-opener", tags: { setOpener: true } }),
      makePerformance({ trackId: "t-neither", tags: {} }),
    ];

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended: neverAttended }));

    act(() => {
      result.current.toggleFilter("encore");
      result.current.toggleFilter("setOpener");
    });

    expect(result.current.filteredPerformances).toHaveLength(2);
  });

  // The "attended" filter uses the isAttended callback provided by the
  // caller (from useAttendanceRowHighlight) rather than reading from
  // performance.tags. This is how the two hooks compose.
  test("attended filter uses the provided isAttended callback", () => {
    const performances = [
      makePerformance({ trackId: "t-attended", show: { id: "s-yes", slug: "s", date: "2024-01-01", venueId: "v" } }),
      makePerformance({ trackId: "t-not", show: { id: "s-no", slug: "s", date: "2024-01-01", venueId: "v" } }),
    ];

    const isAttended = (performance: SongPagePerformance) => performance.show.id === "s-yes";

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended }));

    act(() => result.current.toggleFilter("attended"));

    expect(result.current.filteredPerformances).toHaveLength(1);
    expect(result.current.filteredPerformances[0].trackId).toBe("t-attended");
  });

  // clearFilters resets the active set to empty, restoring all performances.
  test("clearFilters resets all filters", () => {
    const performances = [
      makePerformance({ trackId: "t-encore", tags: { encore: true } }),
      makePerformance({ trackId: "t-other", tags: {} }),
    ];

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended: neverAttended }));

    act(() => result.current.toggleFilter("encore"));
    expect(result.current.filteredPerformances).toHaveLength(1);

    act(() => result.current.clearFilters());
    expect(result.current.filteredPerformances).toHaveLength(2);
    expect(result.current.activeFilters.size).toBe(0);
  });

  // Toggling the same filter twice removes it — chips are toggles, not
  // radio buttons.
  test("toggling the same filter twice removes it", () => {
    const performances = [
      makePerformance({ trackId: "t1", tags: { encore: true } }),
      makePerformance({ trackId: "t2", tags: {} }),
    ];

    const { result } = renderHook(() => usePerformanceFilters(performances, { isAttended: neverAttended }));

    act(() => result.current.toggleFilter("encore"));
    expect(result.current.filteredPerformances).toHaveLength(1);

    act(() => result.current.toggleFilter("encore"));
    expect(result.current.filteredPerformances).toHaveLength(2);
  });

  // filterDefinitions provides the key/label pairs for rendering
  // ToggleFilterGroup. All 10 standard tag filters should be present.
  test("filterDefinitions contains all 10 tag definitions", () => {
    const { result } = renderHook(() => usePerformanceFilters([], { isAttended: neverAttended }));

    const keys = result.current.filterDefinitions.map((filter) => filter.key);
    expect(keys).toEqual([
      "setOpener",
      "setCloser",
      "encore",
      "segueIn",
      "segueOut",
      "standalone",
      "inverted",
      "dyslexic",
      "allTimer",
      "attended",
    ]);
  });
});

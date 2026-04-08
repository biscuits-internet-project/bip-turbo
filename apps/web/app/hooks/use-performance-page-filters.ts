import type { SongPagePerformance } from "@bip/domain";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const searchPerformance = (performance: SongPagePerformance, query: string) =>
  performance.songTitle?.toLowerCase().includes(query) ||
  performance.venue?.name?.toLowerCase().includes(query) ||
  performance.venue?.city?.toLowerCase().includes(query) ||
  performance.venue?.state?.toLowerCase().includes(query) ||
  false;

interface PageFiltersOptions<T> {
  initialData: T[];
  apiUrl: string;
  extraParams?: Record<string, string>;
  searchFilter?: (item: T, query: string) => boolean;
}

export function usePerformancePageFilters<T>({
  initialData,
  apiUrl,
  extraParams,
  searchFilter,
}: PageFiltersOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "all";
  const selectedEra = searchParams.get("era") || "all";
  const coverFilter = (searchParams.get("cover") as "all" | "cover" | "original") || "all";
  const selectedAuthor = searchParams.get("author") || null;
  const filtersParam = searchParams.get("filters") || "";
  const attendedParam = searchParams.get("attended") || "";
  const playedParam = searchParams.get("played") || "";

  const activeToggles = useMemo(() => {
    const toggles = filtersParam ? filtersParam.split(",").filter(Boolean) : [];
    if (attendedParam) toggles.push("attended");
    return toggles;
  }, [filtersParam, attendedParam]);
  const activeToggleSet = new Set(activeToggles);

  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasFilters =
    selectedYear !== "all" ||
    selectedEra !== "all" ||
    coverFilter !== "all" ||
    !!selectedAuthor ||
    filtersParam !== "" ||
    attendedParam !== "" ||
    playedParam !== "";

  useEffect(() => {
    if (!hasFilters) {
      setData(initialData);
      setIsLoading(false);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      return undefined;
    }

    const controller = new AbortController();

    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 200);

    const params = new URLSearchParams();
    if (selectedYear !== "all") params.set("year", selectedYear);
    if (selectedEra !== "all") params.set("era", selectedEra);
    if (coverFilter !== "all") params.set("cover", coverFilter);
    if (selectedAuthor) params.set("author", selectedAuthor);
    if (filtersParam) params.set("filters", filtersParam);
    if (attendedParam) params.set("attended", attendedParam);
    if (playedParam) params.set("played", playedParam);

    if (extraParams) {
      for (const [key, value] of Object.entries(extraParams)) {
        params.set(key, value);
      }
    }

    fetch(`${apiUrl}?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((result: T[]) => {
        setData(result);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setData([]);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setIsLoading(false);
      });

    return () => {
      controller.abort();
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [
    selectedYear,
    selectedEra,
    coverFilter,
    selectedAuthor,
    filtersParam,
    attendedParam,
    playedParam,
    initialData,
    hasFilters,
    apiUrl,
    extraParams,
  ]);

  const updateFilter = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          for (const [key, value] of Object.entries(updates)) {
            if (value && value !== "all") {
              next.set(key, value);
            } else {
              next.delete(key);
            }
          }
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const toggleFilter = useCallback(
    (key: string) => {
      if (key === "attended") {
        updateFilter({ attended: attendedParam ? null : "attended" });
        return;
      }

      const currentFilters = filtersParam ? filtersParam.split(",").filter(Boolean) : [];
      const filterSet = new Set(currentFilters);
      if (filterSet.has(key)) {
        filterSet.delete(key);
      } else {
        filterSet.add(key);
      }
      updateFilter({ filters: [...filterSet].join(",") || null });
    },
    [filtersParam, attendedParam, updateFilter],
  );

  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    if (!searchText || !searchFilter) return data;
    const lower = searchText.toLowerCase();
    return data.filter((item) => searchFilter(item, lower));
  }, [data, searchText, searchFilter]);

  const hasActiveFilters = hasFilters || searchText.length > 0;

  const clearFilters = useCallback(() => {
    updateFilter({ year: null, era: null, cover: null, author: null, filters: null, attended: null, played: null });
    setSearchText("");
  }, [updateFilter]);

  return {
    data,
    filteredData,
    isLoading,
    selectedYear,
    selectedEra,
    coverFilter,
    selectedAuthor,
    playedFilter: playedParam || "all",
    activeToggleSet,
    hasFilters,
    hasActiveFilters,
    searchText,
    setSearchText,
    updateFilter,
    toggleFilter,
    clearFilters,
  };
}

import type { SongPagePerformance } from "@bip/domain";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface PerformancePageFiltersOptions {
  allPerformances: SongPagePerformance[];
  apiUrl: string;
  extraParams?: Record<string, string>;
}

export function usePerformancePageFilters({ allPerformances, apiUrl, extraParams }: PerformancePageFiltersOptions) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedYear = searchParams.get("year") || "all";
  const selectedEra = searchParams.get("era") || "all";
  const coverFilter = (searchParams.get("cover") as "all" | "cover" | "original") || "all";
  const selectedAuthor = searchParams.get("author") || null;
  const filtersParam = searchParams.get("filters") || "";
  const attendedParam = searchParams.get("attended") || "";

  const activeToggles = useMemo(() => {
    const toggles = filtersParam ? filtersParam.split(",").filter(Boolean) : [];
    if (attendedParam) toggles.push("attended");
    return toggles;
  }, [filtersParam, attendedParam]);
  const activeToggleSet = new Set(activeToggles);

  const [performances, setPerformances] = useState<SongPagePerformance[]>(allPerformances);

  const hasFilters =
    selectedYear !== "all" ||
    selectedEra !== "all" ||
    coverFilter !== "all" ||
    !!selectedAuthor ||
    filtersParam !== "" ||
    attendedParam !== "";

  useEffect(() => {
    if (!hasFilters) {
      setPerformances(allPerformances);
      return undefined;
    }

    const controller = new AbortController();

    const params = new URLSearchParams();
    if (selectedYear !== "all") params.set("year", selectedYear);
    if (selectedEra !== "all") params.set("era", selectedEra);
    if (coverFilter !== "all") params.set("cover", coverFilter);
    if (selectedAuthor) params.set("author", selectedAuthor);
    if (filtersParam) params.set("filters", filtersParam);
    if (attendedParam) params.set("attended", attendedParam);

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
      .then((data: SongPagePerformance[]) => {
        setPerformances(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setPerformances([]);
      });

    return () => {
      controller.abort();
    };
  }, [
    selectedYear,
    selectedEra,
    coverFilter,
    selectedAuthor,
    filtersParam,
    attendedParam,
    allPerformances,
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

  const clearFilters = useCallback(() => {
    updateFilter({ filters: null, attended: null });
  }, [updateFilter]);

  return {
    performances,
    selectedYear,
    selectedEra,
    coverFilter,
    selectedAuthor,
    activeToggleSet,
    updateFilter,
    toggleFilter,
    clearFilters,
  };
}

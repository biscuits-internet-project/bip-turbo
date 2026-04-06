import type { SongPagePerformance } from "@bip/domain";
import { useCallback, useMemo, useState } from "react";

const FILTER_DEFINITIONS = [
  { key: "setOpener", label: "Set Opener" },
  { key: "setCloser", label: "Set Closer" },
  { key: "encore", label: "Encore" },
  { key: "segueIn", label: "Segue In" },
  { key: "segueOut", label: "Segue Out" },
  { key: "standalone", label: "Standalone" },
  { key: "inverted", label: "Inverted" },
  { key: "dyslexic", label: "Dyslexic" },
  { key: "allTimer", label: "All-Timer" },
  { key: "attended", label: "Attended" },
] as const;

interface UsePerformanceFiltersOptions {
  isAttended: (performance: SongPagePerformance) => boolean;
}

export function usePerformanceFilters(
  performances: SongPagePerformance[],
  { isAttended }: UsePerformanceFiltersOptions,
) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = useCallback((key: string) => {
    setActiveFilters((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters(new Set());
  }, []);

  const filteredPerformances = useMemo(() => {
    if (activeFilters.size === 0) return performances;

    return performances.filter((performance) => {
      return Array.from(activeFilters).some((filterKey) => {
        switch (filterKey) {
          case "setOpener":
            return performance.tags?.setOpener;
          case "setCloser":
            return performance.tags?.setCloser;
          case "encore":
            return performance.tags?.encore;
          case "segueIn":
            return performance.tags?.segueIn;
          case "segueOut":
            return performance.tags?.segueOut;
          case "standalone":
            return performance.tags?.standalone;
          case "inverted":
            return performance.tags?.inverted;
          case "dyslexic":
            return performance.tags?.dyslexic;
          case "allTimer":
            return performance.allTimer;
          case "attended":
            return isAttended(performance);
          default:
            return false;
        }
      });
    });
  }, [performances, activeFilters, isAttended]);

  return {
    filteredPerformances,
    activeFilters,
    toggleFilter,
    clearFilters,
    filterDefinitions: FILTER_DEFINITIONS as unknown as Array<{ key: string; label: string }>,
  };
}

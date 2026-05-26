import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * URL-syncs an opt-in "show all rows" toggle for the shared DataTable. Reads
 * `?all=1` on mount and writes the param when the user flips the toggle.
 * Switching back to paginated mode drops the param entirely so the bare URL
 * stays clean.
 */
export function useShowAll(): [boolean, (next: boolean) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const showAll = searchParams.get("all") === "1";

  const setShowAll = useCallback(
    (next: boolean) => {
      setSearchParams(
        (prev) => {
          if (next) {
            prev.set("all", "1");
          } else {
            prev.delete("all");
          }
          return prev;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return [showAll, setShowAll];
}

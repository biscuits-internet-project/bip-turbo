import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { SetlistView } from "~/components/setlist/setlist-card";

/**
 * URL-syncs the SetlistCard's setlist/gap-chart toggle on /shows/:slug.
 * Reads `?view=gap-chart` on mount and writes the param when the user
 * flips the toggle. Setting back to "setlist" drops the param so the
 * default state has a clean URL. List pages skip this hook so toggling
 * stays local per card.
 */
export function useSetlistView(): [SetlistView, (next: SetlistView) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const view: SetlistView = searchParams.get("view") === "gap-chart" ? "gap-chart" : "setlist";

  const setView = useCallback(
    (next: SetlistView) => {
      setSearchParams(
        (prev) => {
          if (next === "gap-chart") {
            prev.set("view", "gap-chart");
          } else {
            prev.delete("view");
          }
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return [view, setView];
}

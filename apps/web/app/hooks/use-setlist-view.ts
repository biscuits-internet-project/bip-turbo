import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { SetlistView } from "~/components/setlist/setlist-card";

/**
 * URL-syncs the SetlistCard view toggle on /shows/:slug. Reads `?view=` on
 * mount and writes the param when the user flips the toggle. Setting back
 * to "setlist" (the default) drops the param so the bare URL stays clean.
 * List pages skip this hook so toggling stays local per card.
 */
export function useSetlistView(): [SetlistView, (next: SetlistView) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("view");
  const view: SetlistView = raw === "gap-chart" || raw === "personal" ? raw : "setlist";

  const setView = useCallback(
    (next: SetlistView) => {
      setSearchParams(
        (prev) => {
          if (next === "setlist") {
            prev.delete("view");
          } else {
            prev.set("view", next);
          }
          return prev;
        },
        // `preventScrollReset` keeps the user's current scroll position
        // when the param changes — toggling the view shouldn't yank the
        // page back to the top.
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  return [view, setView];
}

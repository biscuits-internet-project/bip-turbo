import type { Setlist } from "@bip/domain";
import { Fragment, type ReactNode, useMemo } from "react";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { SetlistCard } from "./setlist-card";
import type { ShowExternalSources } from "./show-external-badges";

/**
 * Renders a list of SetlistCards, owning the per-show lookups for attendance,
 * user rating, and live average rating via a single `useShowUserData` call.
 * Callers hand in `setlists` and an `externalSources` map; cards receive the
 * per-show slices internally.
 *
 * Loaders that render this list prefetch `showUserDataQueryKey(...)` into a
 * dehydrated state; the root `<HydrationBoundary>` warms the cache before
 * this component mounts, so attendance / rating badges paint with the HTML.
 */
interface SetlistListProps {
  setlists: Array<Setlist>;
  externalSources: Record<string, ShowExternalSources>;
  /** Rendered when `setlists` is empty. Defaults to nothing. */
  empty?: ReactNode;
  /**
   * When true, renders setlists grouped by month with a scroll anchor
   * (`#month-N`) before each group. Preserves the input order — callers are
   * responsible for sorting setlists before passing them in.
   */
  groupByMonth?: boolean;
  /**
   * When true, renders a left gutter with the 1-based rank (setlist index + 1)
   * next to each card. The caller orders the list by rank before passing it in.
   */
  numbered?: boolean;
  /** Forwarded to each SetlistCard; see SetlistCard's `collapsible` prop. */
  collapsible?: boolean;
}

export function SetlistList({
  setlists,
  externalSources,
  empty,
  groupByMonth,
  numbered,
  collapsible,
}: SetlistListProps) {
  const showIds = useMemo(() => setlists.map((s) => s.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap, displayedRatingMap, rankComparisonMap } =
    useShowUserData(showIds);

  if (setlists.length === 0) {
    return <>{empty ?? null}</>;
  }

  const renderCard = (setlist: Setlist, index: number) => {
    const showId = setlist.show.id;
    const live = averageRatingMap.get(showId);
    // The displayed ★ is the viewer's calibrated score when their mode resolves to
    // calibrated (server only sends it then), else the live/canonical average.
    const displayed = displayedRatingMap.get(showId);
    const card = (
      <SetlistCard
        setlist={setlist}
        userAttendance={attendanceMap.get(showId) ?? null}
        userRating={userRatingMap.get(showId) ?? null}
        showRating={displayed?.rating ?? live?.average ?? null}
        showRatingCount={displayed?.count ?? live?.count ?? null}
        canonicalRating={live?.average ?? null}
        externalSources={externalSources[showId]}
        rankComparison={rankComparisonMap.get(showId)}
        collapsible={collapsible}
      />
    );
    if (!numbered) return <Fragment key={showId}>{card}</Fragment>;
    return (
      <div key={showId} className="flex items-start gap-4">
        <div
          data-testid="setlist-rank"
          aria-hidden
          className="hidden md:flex shrink-0 w-14 pt-3 justify-end font-bold text-4xl text-content-text-tertiary/40 tabular-nums"
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">{card}</div>
      </div>
    );
  };

  if (groupByMonth) {
    const groups = new Map<number, Array<Setlist>>();
    for (const setlist of setlists) {
      const month = new Date(setlist.show.date).getMonth();
      const bucket = groups.get(month);
      if (bucket) bucket.push(setlist);
      else groups.set(month, [setlist]);
    }
    return (
      <>
        {Array.from(groups.entries()).map(([month, monthSetlists]) => (
          <div key={month} className="space-y-4">
            <div id={`month-${month}`} className="scroll-mt-20" />
            {monthSetlists.map(renderCard)}
          </div>
        ))}
      </>
    );
  }

  return <>{setlists.map(renderCard)}</>;
}

import type { Setlist, SetlistLight } from "@bip/domain";
import { type ReactNode, useMemo } from "react";
import { useShowUserData } from "~/hooks/use-show-user-data";
import type { ShowUserDataResponse } from "~/server/show-user-data";
import { SetlistCard } from "./setlist-card";
import type { ShowExternalSources } from "./show-external-badges";

/**
 * Renders a list of SetlistCards, owning the per-show lookups for attendance,
 * user rating, and live average rating via a single `useShowUserData` call.
 * Callers hand in `setlists` and an `externalSources` map; cards receive the
 * per-show slices internally.
 *
 * `initialUserData`, when supplied by a loader, seeds React Query's cache so
 * attendance and rating badges render on first paint with no hydration flicker.
 */
interface SetlistListProps {
  setlists: Array<Setlist | SetlistLight>;
  externalSources: Record<string, ShowExternalSources>;
  initialUserData?: ShowUserDataResponse;
  /** Rendered when `setlists` is empty. Defaults to nothing. */
  empty?: ReactNode;
  /**
   * When true, renders setlists grouped by month with a scroll anchor
   * (`#month-N`) before each group. Preserves the input order — callers are
   * responsible for sorting setlists before passing them in.
   */
  groupByMonth?: boolean;
  /** Forwarded to each SetlistCard (not the list container). */
  className?: string;
}

export function SetlistList({
  setlists,
  externalSources,
  initialUserData,
  empty,
  groupByMonth,
  className,
}: SetlistListProps) {
  const showIds = useMemo(() => setlists.map((s) => s.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds, { initialData: initialUserData });

  if (setlists.length === 0) {
    return <>{empty ?? null}</>;
  }

  const renderCard = (setlist: Setlist | SetlistLight) => {
    const showId = setlist.show.id;
    const liveAverage = averageRatingMap.get(showId)?.average;
    const showRating = liveAverage ?? setlist.show.averageRating ?? null;
    return (
      <SetlistCard
        key={showId}
        setlist={setlist}
        className={className}
        userAttendance={attendanceMap.get(showId) ?? null}
        userRating={userRatingMap.get(showId) ?? null}
        showRating={showRating}
        externalSources={externalSources[showId]}
      />
    );
  };

  if (groupByMonth) {
    const groups = new Map<number, Array<Setlist | SetlistLight>>();
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

import type { Setlist, SetlistLight } from "@bip/domain";
import { Fragment, type ReactNode, useMemo } from "react";
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
  initialUserData,
  empty,
  groupByMonth,
  className,
  numbered,
  collapsible,
}: SetlistListProps) {
  const showIds = useMemo(() => setlists.map((s) => s.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds, { initialData: initialUserData });

  if (setlists.length === 0) {
    return <>{empty ?? null}</>;
  }

  const renderCard = (setlist: Setlist | SetlistLight, index: number) => {
    const showId = setlist.show.id;
    const liveAverage = averageRatingMap.get(showId)?.average;
    const card = (
      <SetlistCard
        setlist={setlist}
        className={className}
        userAttendance={attendanceMap.get(showId) ?? null}
        userRating={userRatingMap.get(showId) ?? null}
        showRating={liveAverage ?? setlist.show.averageRating ?? null}
        externalSources={externalSources[showId]}
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

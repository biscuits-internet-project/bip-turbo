import { average, median, type TrackLight } from "@bip/domain";
import { useEffect, useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { usePersonalSongHistory } from "~/hooks/use-personal-song-history";
import { usePreferences } from "~/hooks/use-preferences";
import { useSession } from "~/hooks/use-session";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { computePersonalRow, eligiblePersonalGaps, type PersonalSetlistRow } from "~/lib/personal-setlist-columns";
import { createPersonalSetlistColumns, type PersonalSetlistTableRow } from "./setlist-columns-personal";
import { applyTimePreference } from "./setlist-common-columns";

interface SetlistTablePersonalProps {
  tracks: TrackLight[];
  /** Target slug for rating mutations from the in-row rating cells. */
  showSlug: string;
  showDate: string;
  onSummaryChange?: (summary: { average: number | null; median: number | null; debutCount: number }) => void;
}

/**
 * Per-user "personal" view of a setlist. Looks up the viewer's full
 * attendance + per-song history from React Query (lazy, one fetch per
 * session), then computes Total Times Seen / Last Seen / Last Before /
 * Your Gap for each track via the pure helpers in personal-setlist-columns.
 *
 * `onSummaryChange` lets the parent SetlistCard hoist the average/median
 * up to its SetlistViewControl so the summary text stays on the same row
 * as the toggle — matches the gap-chart layout.
 */
export function SetlistTablePersonal({ tracks, showSlug, showDate, onSummaryChange }: SetlistTablePersonalProps) {
  const { data, isLoading } = usePersonalSongHistory();
  const { user } = useSession();
  const { showSetlistTimes, ratingDecimalPlaces } = usePreferences();
  const isAuthenticated = !!user;
  const trackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);
  const { userRatingMap, displayRatingMap, comparisonMap } = useTrackUserRatings(trackIds);

  const setlistTracks = useMemo(
    () => tracks.map((t) => ({ id: t.id, songId: t.songId, set: t.set, position: t.position })),
    [tracks],
  );

  const rows: PersonalSetlistTableRow[] = useMemo(() => {
    return tracks.map((track) => {
      const personal: PersonalSetlistRow = computePersonalRow({
        track: { id: track.id, songId: track.songId, set: track.set, position: track.position },
        showDate,
        setlistTracks,
        songAttendances: data.songAttendances[track.songId] ?? [],
        attendedShows: data.attendedShows,
      });
      return { ...track, personal };
    });
  }, [tracks, data, setlistTracks, showDate]);

  const columns = useMemo(
    () =>
      applyTimePreference(
        createPersonalSetlistColumns({
          showSlug,
          averageRatingMap: displayRatingMap,
          userRatingMap,
          isAuthenticated,
          comparisonMap,
          ratingDecimalPlaces,
        }),
        showSetlistTimes,
      ),
    [showSlug, displayRatingMap, userRatingMap, isAuthenticated, comparisonMap, showSetlistTimes, ratingDecimalPlaces],
  );

  // Hoist the summary up to the parent so it can render alongside the
  // toggle. useMemo + useEffect-like trigger via stable identity: compute
  // here, but only invoke the callback when values change.
  const summary = useMemo(() => {
    const personals = rows.map((r) => r.personal);
    const eligible = eligiblePersonalGaps(personals);
    // Count distinct personal debuts — the pure helper marks the first
    // occurrence as `debut` and within-show repeats as `this-show`, so a
    // simple kind-check already dedupes.
    const debutCount = personals.filter((p) => p.yourGap.kind === "debut").length;
    return {
      average: average(eligible),
      median: median(eligible),
      debutCount,
    };
  }, [rows]);

  // Notify the parent whenever the computed summary changes so it can
  // render alongside the toggle. Depending on the value triple gives a
  // stable dep set without creating a new object identity per render.
  // biome-ignore lint/correctness/useExhaustiveDependencies: depend on the value triple, not the callback identity
  useEffect(() => {
    onSummaryChange?.(summary);
  }, [summary.average, summary.median, summary.debutCount]);

  if (isLoading && data.attendedShows.length === 0) {
    return (
      <div className="text-sm text-content-text-tertiary py-4 text-center">Loading your personal setlist view…</div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      hideSearch
      hidePagination
      hidePaginationText
      initialSorting={[{ id: "set", desc: false }]}
    />
  );
}

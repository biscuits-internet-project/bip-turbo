import { TrackRatingOverlay, type TrackRatingOverlayTrack } from "~/components/setlist/track-rating-overlay";
import { TrackIcon } from "./track-icon";

/**
 * "A track worth surfacing": all-timer OR a curated note. The single
 * predicate used wherever the UI gates on noteworthy-ness, so the
 * "marker exists" definition can't drift between call sites. Mirrors
 * the server's SQL: `tracks.all_timer = true OR (tracks.note IS NOT
 * NULL AND tracks.note <> '')` — keep them in sync.
 *
 * Accepts both `note` (Track / TrackLight shape) and `notes` (the
 * SongPagePerformance projection) so cross-song surfaces don't have to
 * adapt before calling.
 */
export function isNoteworthy(t: { allTimer?: boolean | null; note?: string | null; notes?: string | null }): boolean {
  return !!t.allTimer || !!(t.note ?? t.notes)?.trim();
}

/**
 * The standard noteworthy-track flame: renders nothing for plain
 * tracks, the bare flame for all-timers without a note, and the flame
 * wrapped in a click-triggered note popover when a note exists.
 * Encapsulates the "is the track marker-worthy" + "does it carry a
 * tap-target popover" decisions so call sites can just drop the
 * component in without re-implementing either check.
 *
 * Use this on inline-flow surfaces (setlist flow view, song-title
 * rows). Table cells with a fixed-height wrapper should use
 * `AllTimerCell`, which composes this with the sized container.
 */
export function NoteworthyMarker({
  track,
  iconClassName,
  className,
}: {
  track: TrackRatingOverlayTrack;
  iconClassName?: string;
  className?: string;
}) {
  if (!isNoteworthy(track)) return null;
  const icon = <TrackIcon track={track} iconClassName={iconClassName} className={className} />;
  if (!track.note?.trim()) return icon;
  return (
    <TrackRatingOverlay track={track} showRating={false} trigger="click">
      <span className="cursor-pointer">{icon}</span>
    </TrackRatingOverlay>
  );
}

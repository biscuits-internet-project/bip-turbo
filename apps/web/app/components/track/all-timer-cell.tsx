import { TrackRatingOverlay, type TrackRatingOverlayTrack } from "~/components/setlist/track-rating-overlay";
import { TrackIcon } from "./track-icon";

/**
 * Table-cell renderer for the noteworthy-track marker. The `h-6` wrapper
 * matches the default text-base line-height of adjacent cells so the
 * 14px flame sits on the same baseline as song-title text.
 *
 * Renders nothing when the track is neither an all-timer nor carries a
 * note. When a note IS present, the flame is wrapped in the shared
 * TrackRatingOverlay (rating-suppressed variant) so hovering it
 * surfaces the song title + note text without duplicating the rating
 * data that already lives in the row's Rating column.
 *
 * `align` controls horizontal placement: `"center"` (default) suits the
 * standalone narrow column; `"start"` is used when the flame sits
 * inline beneath other content in a wider host cell (e.g. the perf-table
 * Date cell or the setlist Set cell on mobile).
 */
export function AllTimerCell({
  track,
  align = "center",
}: {
  /**
   * Carries `allTimer`, `note`, and the minimal fields TrackRatingOverlay
   * reads (id, song?.title, etc.). Wider call sites pass a full
   * TrackLight; the perf-table cell adapts SongPagePerformance to the
   * same shape with `trackFromPerformance`.
   */
  track: TrackRatingOverlayTrack;
  align?: "center" | "start";
}) {
  const hasMarker = !!track.allTimer || !!track.note?.trim();
  if (!hasMarker) return null;

  const flame = (
    <div className={`flex h-6 items-center ${align === "center" ? "justify-center" : "justify-start"}`}>
      <TrackIcon track={track} iconClassName="h-3.5 w-3.5" />
    </div>
  );

  // No note → no information to surface in an overlay; the flame alone
  // already says "all-timer". Avoid wrapping in the hover card to keep
  // the cell inert.
  if (!track.note?.trim()) return flame;

  return (
    <TrackRatingOverlay track={track} showRating={false} trigger="click">
      {flame}
    </TrackRatingOverlay>
  );
}

/**
 * Meta options for the all-timer column — narrowest viable slot with no
 * horizontal padding so it never steals width from neighboring columns.
 * Mobile visibility is decided by the caller: setlist views and the
 * perf table both default to hiding the column on mobile and rendering
 * the flame inline in a neighboring cell instead; jam-charts surfaces
 * keep the column visible on mobile (via the caller's
 * `mobileFlamePriority`) so the marker stays at the leftmost slot.
 */
export const allTimerColumnMeta = {
  fixedWidth: "1.5rem",
  mobileFixedWidth: "1rem",
  cellClassName: "px-0 sm:px-0",
} as const;

import type { Setlist, SetlistLight } from "@bip/domain";
import { formatDuration } from "@bip/domain";
import { Link } from "react-router-dom";
import { NoteworthyMarker } from "~/components/track/noteworthy-marker";
import {
  AUTO_FOOTNOTES_ENABLED,
  COMPLETIONS_FOOTNOTES_ENABLED,
  debutFootnoteSuppressed,
  gapFootnoteSuppressed,
  LAST_TIME_PLAYED_GAP_THRESHOLD,
} from "~/lib/footnote-constants";
import { deriveShowLineupNotes, elevatedGuestIds } from "~/lib/lineup-notes";
import { MUSICIANS_FEATURE_ENABLED } from "~/lib/musicians-constants";
import { cn } from "~/lib/utils";
import {
  annotationFootnoteSources,
  dataDrivenFootnoteSources,
  debutFootnoteSources,
  deriveFootnotes,
  guestExclusionFootnotes,
  lastTimePlayedFootnoteSources,
  synthesizePerformerFootnotes,
} from "./footnotes";
import { countSetlistEncores } from "./set-label";
import { formatSetHeading, summarizeDurations } from "./setlist-duration";
import { TrackRatingOverlay } from "./track-rating-overlay";

/**
 * The default "flow" rendering of a setlist: each set's tracks inline with
 * segue markers, per-set and total running times, and the footnoted track
 * annotations. Extracted from SetlistCard so this (the bulk of the card body)
 * can be rendered and tested on its own, apart from the rating/attendance/
 * view-toggle machinery around it.
 */
export function SetlistFlow({ setlist }: { setlist: Setlist | SetlistLight }) {
  const allTracks = setlist.sets.flatMap((set) => set.tracks);
  // DB annotations are numbered before synthesized performer footnotes on any
  // given track, so the existing annotation indices stay stable. Performer
  // footnotes are gated behind the feature flag, leaving the flag-off output
  // identical to annotations-only numbering.
  //
  // Whole-show guests are surfaced in the show-level lineup note, so their
  // per-track "with" footnotes are suppressed; for guests below 100% coverage
  // the tracks they sat out are footnoted ("except where noted").
  const lineupNotes = MUSICIANS_FEATURE_ENABLED
    ? deriveShowLineupNotes(
        setlist.show.date,
        setlist.lineup,
        setlist.trackMusicianDeltas,
        allTracks.map((track) => track.id),
      )
    : { missing: [], guests: [], offInstrument: [], milestones: [] };
  // The early setlists are too scattered to trust a song's gap or first
  // appearance. Debuts firm up sooner than gaps, so they have separate start
  // dates: before each, that category is suppressed. Flags, completions,
  // annotations, and performer notes still render — observed facts, not stats.
  const suppressDebuts = debutFootnoteSuppressed(setlist.show.date);
  const suppressGaps = gapFootnoteSuppressed(setlist.show.date);
  const footnoteSources = [
    ...annotationFootnoteSources(setlist.annotations),
    // All of a track's structured flags + completion links read on one line,
    // right after annotations so the setlist reads like its annotation era.
    ...(COMPLETIONS_FOOTNOTES_ENABLED
      ? dataDrivenFootnoteSources(allTracks, { suppressRecurrences: suppressGaps })
      : []),
    ...(MUSICIANS_FEATURE_ENABLED
      ? [
          ...synthesizePerformerFootnotes(setlist.trackMusicianDeltas, elevatedGuestIds(lineupNotes)),
          ...guestExclusionFootnotes(lineupNotes.guests, setlist.trackMusicianDeltas),
        ]
      : []),
    // Auto last-time-played / debut footnotes append after the above so the
    // existing annotation and performer footnote numbers stay stable.
    ...(AUTO_FOOTNOTES_ENABLED && !suppressGaps
      ? lastTimePlayedFootnoteSources(allTracks, LAST_TIME_PLAYED_GAP_THRESHOLD)
      : []),
    ...(AUTO_FOOTNOTES_ENABLED && !suppressDebuts ? debutFootnoteSources(allTracks) : []),
  ];
  const { trackFootnoteIndices, orderedFootnotes } = deriveFootnotes(allTracks, footnoteSources);

  const encoresInSet = countSetlistEncores(setlist.sets);
  const showDuration = summarizeDurations(allTracks);
  // One regular (non-encore) set reads just "Set" (no number), whether or not
  // an encore follows.
  const isSoleRegularSet = setlist.sets.filter((set) => /^S\d+$/i.test(set.label)).length === 1;
  // A truly single-set show (no encore) also skips the redundant Total — its
  // set time already is the show time.
  const isSoleSet = setlist.sets.length === 1;

  return (
    <>
      <div className="space-y-3 md:space-y-4">
        {setlist.sets.map((set) => {
          const setDuration = summarizeDurations(set.tracks);
          return (
            <div key={setlist.show.id + set.label}>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-medium text-content-text-tertiary">
                  {formatSetHeading(set.label, encoresInSet, isSoleRegularSet)}
                </span>
                {setDuration.known > 0 && (
                  <span
                    className="text-sm text-content-text-tertiary tabular-nums"
                    title={
                      setDuration.missing > 0
                        ? `Partial: ${setDuration.missing} track${setDuration.missing > 1 ? "s" : ""} not yet timed`
                        : undefined
                    }
                  >
                    {formatDuration(setDuration.seconds)}
                    {setDuration.missing > 0 && "*"}
                  </span>
                )}
              </div>
              <div className="text-base pl-4">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline">
                    <TrackRatingOverlay track={track}>
                      <span
                        className={cn(
                          "relative text-brand-primary hover:text-brand-secondary hover:underline transition-colors text-base",
                          track.allTimer && "font-medium",
                        )}
                      >
                        <NoteworthyMarker
                          track={track}
                          iconClassName="h-3 w-3 md:h-4 md:w-4 inline-block mr-1 transform -translate-y-0.5"
                        />
                        <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                        {trackFootnoteIndices.has(track.id) && (
                          <sup className="text-brand-secondary ml-0.5 font-medium text-xs">
                            {trackFootnoteIndices.get(track.id)?.map((index, markerPosition) => (
                              <span key={index} className={markerPosition > 0 ? "ml-1" : ""}>
                                {index}
                              </span>
                            ))}
                          </sup>
                        )}
                      </span>
                    </TrackRatingOverlay>
                    {i < set.tracks.length - 1 && (
                      <span className="text-content-text-secondary mx-1 font-medium text-base">
                        {track.segue ? " > " : ", "}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showDuration.known > 0 && !isSoleSet && (
        <div className="mt-4 text-sm text-content-text-secondary">
          <span className="font-medium text-content-text-tertiary">Total</span>{" "}
          <span className="tabular-nums">
            {formatDuration(showDuration.seconds)}
            {showDuration.missing > 0 && "*"}
          </span>
        </div>
      )}
      {showDuration.known > 0 && showDuration.missing > 0 && (
        <div className={cn(isSoleSet ? "mt-4" : "mt-1", "text-xs text-content-text-tertiary")}>
          * Partial: {showDuration.missing} track{showDuration.missing > 1 ? "s" : ""} not yet timed
        </div>
      )}

      {orderedFootnotes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-glass-border/30 space-y-2">
          {orderedFootnotes.map((footnote) => (
            <div key={`footnote-${footnote.index}`} className="text-sm text-content-text-secondary">
              <sup className="text-brand-secondary">{footnote.index}</sup> {footnote.content}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

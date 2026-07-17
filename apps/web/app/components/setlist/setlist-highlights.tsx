import type { Setlist, TrackLight } from "@bip/domain";
import { Link } from "react-router-dom";
import { TrackIcon } from "~/components/track/track-icon";
import { cardVariants } from "~/components/ui/card";
import { compareBySetThenPosition, countDistinctEncores, formatSetLabel } from "./set-label";

interface SetlistHighlightsProps {
  setlist: Setlist;
}

/**
 * Right-rail panel listing every track from the show that is either an
 * all-timer or carries a curated jam-chart note, in canonical show order.
 * Each row shows the position label (printed only on the first row of
 * each set group), a flame (orange for all-timer, off-white for
 * jam-chart), a song-page link, and the note text underneath when
 * present. Hidden entirely when no track is noteworthy.
 */
export function SetlistHighlights({ setlist }: SetlistHighlightsProps) {
  const highlights = setlist.sets.flatMap((set) => set.tracks).filter((track) => track.allTimer || hasNote(track));
  if (highlights.length === 0) return null;

  const encoresInSet = countDistinctEncores(highlights);
  const ordered = [...highlights].sort(compareBySetThenPosition);

  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg px-3 py-2 space-y-3" })}>
      <h3 className="text-sm font-medium text-content-text-secondary">Show Highlights</h3>
      <ul className="space-y-2">
        {ordered.map((track, idx) => {
          const showSetLabel = idx === 0 || ordered[idx - 1].set !== track.set;
          return (
            <li key={track.id} className="text-sm">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-content-text-tertiary font-medium w-5 shrink-0">
                  {showSetLabel ? formatSetLabel(track.set, { encoresInSet }) : ""}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <TrackIcon track={track} iconClassName="h-3.5 w-3.5" />
                    <Link
                      to={`/songs/${track.song?.slug}`}
                      className="text-brand-primary hover:text-brand-secondary hover:underline transition-colors"
                    >
                      {track.song?.title}
                    </Link>
                  </span>
                  {hasNote(track) && (
                    <p className="text-xs text-content-text-secondary mt-0.5 pl-2 border-l-2">{track.note?.trim()}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function hasNote(track: Pick<TrackLight, "note">): boolean {
  return !!track.note?.trim();
}

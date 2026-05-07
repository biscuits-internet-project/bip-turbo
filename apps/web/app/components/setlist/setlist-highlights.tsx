import type { Setlist } from "@bip/domain";
import { FileText, Flame } from "lucide-react";
import { Link } from "react-router";

interface SetlistHighlightsProps {
  setlist: Setlist;
}

export function SetlistHighlights({ setlist }: SetlistHighlightsProps) {
  // Collect all tracks that are all-timers or have notes
  const allTimerTracks = [];
  const tracksWithNotes = [];

  for (const set of setlist.sets) {
    for (const track of set.tracks) {
      if (track.allTimer) {
        allTimerTracks.push({ ...track, set: set.label });
      }

      if (track.note && track.note.trim() !== "") {
        tracksWithNotes.push({ ...track, set: set.label });
      }
    }
  }

  // If there are no highlights, don't render the component
  if (allTimerTracks.length === 0 && tracksWithNotes.length === 0) {
    return null;
  }

  return (
    <div className="card-premium rounded-lg px-3 py-2 space-y-3">
      <h3 className="text-sm font-medium text-content-text-secondary">Show Highlights</h3>
      {allTimerTracks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-content-text-primary flex items-center gap-2 mb-1.5">
            <Flame className="h-4 w-4 text-orange-500 shrink-0" />
            <span>All-Timers</span>
          </h4>
          <ul className="space-y-0.5 pl-6">
            {allTimerTracks.map((track) => (
              <li key={track.id} className="text-content-text-secondary text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-content-text-tertiary font-medium">{track.set}</span>
                  <Link
                    to={`/songs/${track.song?.slug}`}
                    className="text-brand-tertiary hover:text-brand-primary hover:underline transition-colors"
                  >
                    {track.song?.title}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tracksWithNotes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-content-text-primary flex items-center gap-2 mb-1.5">
            <FileText className="h-4 w-4 text-info shrink-0" />
            <span>Track Notes</span>
          </h4>
          <ul className="space-y-2 pl-6">
            {tracksWithNotes.map((track) => (
              <li key={track.id} className="text-content-text-secondary text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-content-text-tertiary font-medium">{track.set}</span>
                  <div className="flex-1">
                    <Link
                      to={`/songs/${track.song?.slug}`}
                      className="text-brand-primary hover:text-brand-secondary hover:underline transition-colors"
                    >
                      {track.song?.title}
                    </Link>
                    <p className="text-xs text-content-text-tertiary mt-0.5 pl-2 border-l-2 border-glass-border">
                      {track.note}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

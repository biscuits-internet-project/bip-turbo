import type { Setlist } from "@bip/domain";
import { FileText, Flame } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

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
    <Card className="card-premium h-full">
      <CardHeader className="border-b border-glass-border/50 px-6 py-4">
        <CardTitle className="text-xl text-content-text-primary">Show Highlights</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-6">
        {allTimerTracks.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-content-text-primary flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-warning" />
              <span>All-Timers</span>
            </h3>
            <ul className="space-y-2">
              {allTimerTracks.map((track) => (
                <li key={track.id} className="text-content-text-secondary">
                  <div className="flex items-baseline">
                    <span className="text-xs text-content-text-tertiary font-medium w-6">{track.set}</span>
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
            <h3 className="text-lg font-medium text-content-text-primary flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-info" />
              <span>Track Notes</span>
            </h3>
            <ul className="space-y-3">
              {tracksWithNotes.map((track) => (
                <li key={track.id} className="text-content-text-secondary">
                  <div className="flex items-baseline">
                    <span className="text-xs text-content-text-tertiary font-medium w-6">{track.set}</span>
                    <div className="flex-1">
                      <Link
                        to={`/songs/${track.song?.slug}`}
                        className="text-brand-primary hover:text-brand-secondary hover:underline transition-colors"
                      >
                        {track.song?.title}
                      </Link>
                      <p className="text-sm text-content-text-tertiary mt-1 pl-1 border-l-2 border-glass-border ml-1">{track.note}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

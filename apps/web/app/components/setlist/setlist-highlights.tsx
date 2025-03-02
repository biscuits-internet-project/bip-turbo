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
    <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/80 h-full">
      <CardHeader className="border-b border-gray-800/50 px-6 py-4">
        <CardTitle className="text-xl text-white">Show Highlights</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-6">
        {allTimerTracks.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <span>All-Timers</span>
            </h3>
            <ul className="space-y-2">
              {allTimerTracks.map((track) => (
                <li key={track.id} className="text-gray-300">
                  <div className="flex items-baseline">
                    <span className="text-xs text-gray-500 font-medium w-6">{track.set}</span>
                    <Link
                      to={`/songs/${track.song?.slug}`}
                      className="text-orange-300 hover:text-orange-200 hover:underline transition-colors"
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
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <span>Track Notes</span>
            </h3>
            <ul className="space-y-3">
              {tracksWithNotes.map((track) => (
                <li key={track.id} className="text-gray-300">
                  <div className="flex items-baseline">
                    <span className="text-xs text-gray-500 font-medium w-6">{track.set}</span>
                    <div className="flex-1">
                      <Link
                        to={`/songs/${track.song?.slug}`}
                        className="text-blue-300 hover:text-blue-200 hover:underline transition-colors"
                      >
                        {track.song?.title}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1 pl-1 border-l-2 border-gray-700 ml-1">{track.note}</p>
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

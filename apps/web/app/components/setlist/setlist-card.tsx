import type { Setlist } from "@bip/domain";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function SetlistCard({ setlist }: { setlist: Setlist }) {
  const date = new Date(setlist.show.date);

  return (
    <Card className="relative overflow-hidden border-gray-800 transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />

      <CardHeader className="relative z-10 border-b border-gray-800/50 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-lg text-purple-300 hover:text-purple-200 transition-colors">
            <Link to={`/shows/${setlist.show.slug}`}>
              {date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
            </Link>
          </div>
          <div className="text-xl font-medium text-white">
            {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 py-5">
        {setlist.show.notes && (
          <div className="mb-6 text-gray-300 italic bg-purple-950/20 p-4 rounded-md border-l-2 border-purple-500">
            {setlist.show.notes}
          </div>
        )}

        <div className="space-y-4">
          {setlist.sets.map((set) => (
            <div key={setlist.show.id + set.label} className="flex gap-4">
              <span
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full text-white font-medium",
                  set.label === "I" && "bg-purple-900/50",
                  set.label === "II" && "bg-indigo-900/50",
                  set.label === "III" && "bg-blue-900/50",
                  set.label === "E" && "bg-pink-900/50",
                  !["I", "II", "III", "E"].includes(set.label) && "bg-gray-800/50",
                )}
              >
                {set.label}
              </span>
              <div className="flex-1 pt-1">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline-flex items-baseline">
                    <span className="text-white hover:text-purple-300 hover:underline transition-colors">
                      {track.song?.title}
                    </span>
                    {i < set.tracks.length - 1 && (
                      <span className="text-gray-400 mx-1 font-medium">{track.segue ? " > " : ", "}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {setlist.annotations.length > 0 && (
          <div className="mt-6 space-y-2 pt-4 border-t border-gray-800/50">
            {setlist.annotations.map((annotation, i) => (
              <div key={setlist.show.id + annotation.id} className="text-sm text-gray-400">
                <sup className="text-purple-400">{i + 1}</sup> {annotation.desc}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

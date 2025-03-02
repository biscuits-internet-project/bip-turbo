import type { Setlist } from "@bip/domain";
import { format } from "date-fns";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function SetlistCard({ setlist }: { setlist: Setlist }) {
  const date = new Date(setlist.show.date);
  const rating = setlist.show.averageRating;

  return (
    <Card className="relative overflow-hidden border-gray-800 transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />

      <CardHeader className="relative z-10 border-b border-gray-800/50 px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium text-purple-300 hover:text-purple-200 transition-colors">
              <Link to={`/shows/${setlist.show.slug}`}>{format(date, "M/d/yyyy")}</Link>
            </div>
            <div className="text-xl text-gray-200">
              {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
            </div>
          </div>
          {rating !== null && rating > 0 && (
            <div className="flex items-center gap-1 bg-purple-900/30 px-2 py-1 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-yellow-400"
                role="img"
                aria-hidden="true"
              >
                <title>Rating star</title>
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-yellow-100">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 py-5">
        {setlist.show.notes && (
          <div className="mb-4 text-sm text-gray-400 italic border-l border-gray-700 pl-3 py-1">
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
                      <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
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

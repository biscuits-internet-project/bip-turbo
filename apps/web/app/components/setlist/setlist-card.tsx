import type { Setlist } from "@bip/domain";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export function SetlistCard({ setlist }: { setlist: Setlist }) {
  const date = new Date(setlist.show.date);

  return (
    <Card>
      <CardHeader>
        <div className="text-lg text-muted-foreground">
          <Link to={`/shows/${setlist.show.slug}`}>{date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}</Link>
        </div>
        <div className="text-xl font-medium">
          {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
        </div>
      </CardHeader>

      <CardContent>
        {setlist.show.notes && <div className="mb-4 text-muted-foreground italic">{setlist.show.notes}</div>}

        <div className="space-y-2">
          {setlist.sets.map((set) => (
            <div key={setlist.show.id + set.label} className="flex">
              <span className="w-8 text-muted-foreground">{set.label}</span>
              <div className="flex-1">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline-flex items-baseline">
                    <span className="text-primary hover:underline">{track.song?.title}</span>
                    {i < set.tracks.length - 1 && <span className="text-muted-foreground mx-1">{track.segue ? " > " : ", "}</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {setlist.annotations.length > 0 && (
          <div className="mt-4 space-y-1">
            {setlist.annotations.map((annotation, i) => (
              <div key={setlist.show.id + annotation.id} className="text-sm text-muted-foreground">
                <sup>{i + 1}</sup> {annotation.desc}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

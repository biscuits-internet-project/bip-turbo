import type { Setlist, Venue } from "@bip/domain";
import { format, parseISO } from "date-fns";
import { CalendarDays, Edit, MapPin, Ticket } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

export const routeParam = "slug";

interface LoaderData {
  venue: Venue;
  setlists: Setlist[];
  stats: {
    totalShows: number;
    firstShow: Date | null;
    lastShow: Date | null;
    yearsPlayed: number[];
  };
}

export const loader = publicLoader(async ({ params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw new Error("Slug is required");

  const venue = await services.venues.findBySlug(slug);
  if (!venue) throw new Error("Venue not found");

  // Fetch setlists for this venue
  const setlists = await services.setlists.findMany({
    filters: { venueId: venue.id },
    sort: [{ field: "date", direction: "desc" }],
  });

  // Calculate stats
  const showDates = setlists.map((setlist) => setlist.show.date);
  const yearsPlayed = [...new Set(showDates.map((date) => new Date(date).getFullYear()))].sort((a, b) => b - a);

  const stats = {
    totalShows: setlists.length,
    firstShow: showDates.length ? new Date(Math.min(...showDates.map((d) => new Date(d).getTime()))) : null,
    lastShow: showDates.length ? new Date(Math.max(...showDates.map((d) => new Date(d).getTime()))) : null,
    yearsPlayed,
  };

  return { venue, setlists, stats };
});

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  sublabel?: string;
}

function StatBox({ icon, label, value, sublabel }: StatBoxProps) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-gray-400 mb-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white">{value || "—"}</div>
        {sublabel && <div className="text-xs text-gray-500 mt-1">{sublabel}</div>}
      </CardContent>
    </Card>
  );
}

// Custom setlist card that displays the exact date without timezone adjustments
function VenueSetlistCard({ setlist }: { setlist: Setlist }) {
  const rating = setlist.show.averageRating;

  // Create a flat array of all tracks in order for annotations
  const allTracks = [];
  for (const set of setlist.sets) {
    for (const track of set.tracks) {
      allTracks.push(track);
    }
  }

  // Process annotations
  const uniqueAnnotations = new Map<string, { index: number; desc: string }>();
  const trackAnnotationMap = new Map<string, number>();
  let annotationIndex = 1;

  // First pass: identify all unique annotations and assign indices in order of appearance
  for (const track of allTracks) {
    // Get annotations for this track
    const trackAnnotations = setlist.annotations.filter((a) => a.trackId === track.id);

    for (const annotation of trackAnnotations) {
      if (annotation.desc) {
        // If this description hasn't been seen before, assign a new index
        if (!uniqueAnnotations.has(annotation.desc)) {
          uniqueAnnotations.set(annotation.desc, {
            index: annotationIndex++,
            desc: annotation.desc,
          });
        }

        // Map this track to the annotation index
        const index = uniqueAnnotations.get(annotation.desc)?.index;
        if (index) {
          trackAnnotationMap.set(track.id, index);
        }
      }
    }
  }

  // Convert the unique annotations map to an array for display
  const orderedAnnotations = Array.from(uniqueAnnotations.values()).sort((a, b) => a.index - b.index);

  // Format the date directly from the ISO string using parseISO to avoid timezone issues
  // This ensures we get the exact date as stored in the database
  let formattedDate: string;

  if (typeof setlist.show.date === "string") {
    // If it's already a string, parse it directly
    formattedDate = format(parseISO(setlist.show.date), "M/d/yyyy");
  } else {
    // If it's a Date object, extract the date parts and format them
    const date = setlist.show.date as Date;
    // Use the date parts directly to avoid timezone issues
    formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <Card className="relative overflow-hidden border-gray-800 transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />

      <CardHeader className="relative z-10 border-b border-gray-800/50 px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium text-purple-300 hover:text-purple-200 transition-colors">
              <Link to={`/shows/${setlist.show.slug}`}>{formattedDate}</Link>
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
                    <span className="inline-flex items-center gap-1">
                      <span
                        className={cn(
                          "relative text-white hover:text-purple-300 hover:underline transition-colors",
                          track.allTimer && "font-medium",
                        )}
                      >
                        {track.allTimer && <span className="text-orange-500 inline-block mr-1">🔥</span>}
                        <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                        {trackAnnotationMap.has(track.id) && (
                          <sup className="text-purple-400 ml-0.5 font-medium">{trackAnnotationMap.get(track.id)}</sup>
                        )}
                      </span>
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

        {orderedAnnotations.length > 0 && (
          <div className="mt-6 space-y-2 pt-4 border-t border-gray-800/50">
            {orderedAnnotations.map((annotation) => (
              <div key={`annotation-${annotation.index}`} className="text-sm text-gray-400">
                <sup className="text-purple-400">{annotation.index}</sup> {annotation.desc}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function meta({ data }: { data: LoaderData }) {
  const venueName = data.venue.name;
  const cityState = `${data.venue.city}, ${data.venue.state}`;
  const showCount = data.venue.timesPlayed;

  return [
    { title: `${venueName} - ${cityState} | Biscuits Internet Project` },
    {
      name: "description",
      content: `View shows, history, and information about ${venueName} in ${cityState}. The Disco Biscuits have played here ${showCount} times.`,
    },
  ];
}

export default function VenuePage() {
  const { venue, setlists, stats } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{venue.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{[venue.city, venue.state, venue.country].filter(Boolean).join(", ")}</span>
          </div>
        </div>

        <AdminOnly>
          <Button asChild size="sm" variant="outline">
            <Link to={`/venues/${venue.slug}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit Venue</span>
            </Link>
          </Button>
        </AdminOnly>
      </div>

      <div className="space-y-6">
        {/* Stats Grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="First Show"
            value={stats.firstShow ? format(stats.firstShow, "MMM d, yyyy") : null}
          />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="Last Show"
            value={stats.lastShow ? format(stats.lastShow, "MMM d, yyyy") : null}
          />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="Years Played"
            value={stats.yearsPlayed.length}
            sublabel={stats.yearsPlayed.join(", ")}
          />
        </dl>

        {/* Setlists */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Shows at this Venue</h2>
          {setlists.length > 0 ? (
            setlists.map((setlist) => <VenueSetlistCard key={setlist.show.id} setlist={setlist} />)
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 text-center text-gray-400">
              No shows found for this venue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

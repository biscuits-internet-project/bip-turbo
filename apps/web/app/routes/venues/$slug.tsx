import type { Setlist, Venue } from "@bip/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft, CalendarDays, Edit, MapPin, Ticket } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

interface VenueStats {
  totalShows: number;
  firstShow: Date | null;
  lastShow: Date | null;
  yearsPlayed: number[];
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
    <Card className="glass-content">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-content-text-secondary mb-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-content-text-primary">{value || "—"}</div>
        {sublabel && <div className="text-xs text-content-text-tertiary mt-1">{sublabel}</div>}
      </CardContent>
    </Card>
  );
}

// Custom setlist card that displays the exact date without timezone adjustments
function VenueSetlistCard({
  setlist,
  onRate,
}: { setlist: Setlist; onRate?: (showId: string, rating: number) => Promise<void> }) {
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
    <Card className="card-premium relative overflow-hidden transition-all duration-300 hover:border-brand-primary/60">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />

      <CardHeader className="relative z-10 border-b border-glass-border/50 px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium text-brand-primary hover:text-brand-secondary transition-colors">
              <Link to={`/shows/${setlist.show.slug}`}>{formattedDate}</Link>
            </div>
            <div className="text-xl text-content-text-primary">
              {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 py-5">
        {setlist.show.notes && (
          <div className="mb-4 text-sm text-content-text-secondary italic border-l border-glass-border pl-3 py-1">
            {setlist.show.notes}
          </div>
        )}

        <div className="space-y-4">
          {setlist.sets.map((set) => (
            <div key={setlist.show.id + set.label} className="flex gap-4">
              <span
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full text-white font-medium",
                  set.label === "I" && "bg-brand/20",
                  set.label === "II" && "bg-brand-secondary/20",
                  set.label === "III" && "bg-info/20",
                  set.label === "E" && "bg-chart-tertiary/20",
                  !["I", "II", "III", "E"].includes(set.label) && "bg-content-bg-secondary/50",
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
                          "relative text-content-text-primary hover:text-brand-primary hover:underline transition-colors",
                          track.allTimer && "font-medium",
                        )}
                      >
                        {track.allTimer && <span className="text-chart-accent inline-block mr-1">🔥</span>}
                        <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                        {trackAnnotationMap.has(track.id) && (
                          <sup className="text-brand-primary ml-0.5 font-medium">{trackAnnotationMap.get(track.id)}</sup>
                        )}
                      </span>
                    </span>
                    {i < set.tracks.length - 1 && (
                      <span className="text-content-text-secondary mx-1 font-medium">{track.segue ? " > " : ", "}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {orderedAnnotations.length > 0 && (
          <div className="mt-6 space-y-2 pt-4 border-t border-glass-border/50">
            {orderedAnnotations.map((annotation) => (
              <div key={`annotation-${annotation.index}`} className="text-sm text-content-text-secondary">
                <sup className="text-brand-primary">{annotation.index}</sup> {annotation.desc}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end mt-6 pt-4 border-t border-glass-border/50">
          {orderedAnnotations.length > 0 ? (
            <div className="space-y-2">
              {orderedAnnotations.map((annotation) => (
                <div key={`annotation-${annotation.index}`} className="text-sm text-content-text-secondary">
                  <sup className="text-brand-primary">{annotation.index}</sup> {annotation.desc}
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
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
  const queryClient = useQueryClient();

  // Mutation for rating
  const rateMutation = useMutation({
    mutationFn: async ({ showId, rating }: { showId: string; rating: number }) => {
      const response = await fetch("/api/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateableId: showId,
          rateableType: "Show",
          value: rating,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to rate show");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("Rating submitted successfully");
      // Update the setlist in the cache with the new rating
      queryClient.setQueryData(
        ["venue", venue.id],
        (old: { venue: Venue; setlists: Setlist[]; stats: VenueStats } | undefined) => {
          if (!old?.setlists) return old;
          return {
            ...old,
            setlists: old.setlists.map((setlist: Setlist) => {
              if (setlist.show.id === variables.showId) {
                return {
                  ...setlist,
                  show: {
                    ...setlist.show,
                    userRating: variables.rating,
                    averageRating: data.averageRating,
                  },
                };
              }
              return setlist;
            }),
          };
        },
      );
    },
    onError: (error) => {
      console.error("Error rating show:", error);
      toast.error("Failed to submit rating. Please try again.");
    },
  });

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-content-text-primary">{venue.name}</h1>
            <div className="flex items-center text-content-text-secondary mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{[venue.city, venue.state, venue.country].filter(Boolean).join(", ")}</span>
            </div>
          </div>

          <AdminOnly>
            <Button asChild size="sm" className="btn-secondary">
              <Link to={`/venues/${venue.slug}/edit`} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit Venue</span>
              </Link>
            </Button>
          </AdminOnly>
        </div>
        
        {/* Subtle back link */}
        <div className="flex justify-start">
          <Link 
            to="/venues" 
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to venues</span>
          </Link>
        </div>
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
          <h2 className="text-xl font-semibold text-content-text-primary mb-4">Shows at this Venue</h2>
          {setlists.length > 0 ? (
            setlists.map((setlist) => <VenueSetlistCard key={setlist.show.id} setlist={setlist} />)
          ) : (
            <div className="glass-content rounded-lg p-6 text-center text-content-text-secondary">
              No shows found for this venue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

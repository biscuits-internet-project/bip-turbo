import type { Attendance, Rating, Setlist } from "@bip/domain";
import { Flame } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { StarRating } from "~/components/ui/star-rating";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useSession } from "~/hooks/use-session";
import { cn, formatDateShort } from "~/lib/utils";
import { AttendanceToggle } from "./attendance";

interface SetlistCardProps {
  setlist: Setlist;
  className?: string;
  userAttendance: Attendance | null;
  userRating: Rating | null;
  showRating: number | null;
}

function SetlistCardComponent({ setlist, className, userAttendance, userRating, showRating }: SetlistCardProps) {
  const { user } = useSession();
  const formattedDate = formatDateShort(setlist.show.date);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedRating, setDisplayedRating] = useState<number>(showRating ?? setlist.show.averageRating ?? 0);

  // Trigger animation only when rating updates
  useEffect(() => {
    const newRating = showRating ?? setlist.show.averageRating ?? 0;
    if (newRating !== displayedRating) {
      setIsAnimating(true);
      // Wait for animation to reach peak before updating displayed value
      const updateTimer = setTimeout(() => setDisplayedRating(newRating), 800);
      const animationTimer = setTimeout(() => setIsAnimating(false), 2000);
      return () => {
        clearTimeout(updateTimer);
        clearTimeout(animationTimer);
      };
    }
  }, [showRating, setlist.show.averageRating, displayedRating]);

  // Create a map to store unique annotations by description
  const uniqueAnnotations = new Map<string, { index: number; desc: string }>();

  // Create a map of trackId to annotation index for quick lookup
  const trackAnnotationMap = new Map<string, number>();

  // Process annotations in order of tracks in the setlist
  let annotationIndex = 1;

  // Create a flat array of all tracks in order
  const allTracks = [];
  for (const set of setlist.sets) {
    for (const track of set.tracks) {
      allTracks.push(track);
    }
  }

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
  // Sort by index to maintain the order they were encountered
  const orderedAnnotations = Array.from(uniqueAnnotations.values()).sort((a, b) => a.index - b.index);

  return (
    <Card
      className={cn(
        "card-premium relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/30 hover:border-brand-primary/80",
        className,
      )}
    >

      <CardHeader className="relative z-10 border-b border-glass-border/30 px-6 py-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium text-brand-primary hover:text-brand-secondary transition-colors">
              <Link to={`/shows/${setlist.show.slug}`}>{formattedDate}</Link>
            </div>
            <div className="text-xl text-content-text-primary">
              {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
            </div>
          </div>
          {displayedRating !== null && displayedRating > 0 && (
            <div className="flex items-center gap-1 glass-secondary px-2 py-1 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={cn("w-4 h-4 text-rating-gold", isAnimating && "animate-avg-rating-update")}
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
              <span className={cn("text-sm font-medium text-rating-gold", isAnimating && "animate-avg-rating-update")}>
                {displayedRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-6 py-5">
        {setlist.show.notes && (
          <div className="mb-4 text-sm text-content-text-secondary italic border-l border-content-bg-secondary pl-3 py-1">
            {setlist.show.notes}
          </div>
        )}

        <div className="space-y-4">
          {setlist.sets.map((set) => (
            <div key={setlist.show.id + set.label} className="flex gap-4">
              <span
                className={cn(
                  "w-9 h-9 flex items-center justify-center rounded-full text-white font-medium",
                  set.label === "I" && "bg-brand-primary/30",
                  set.label === "II" && "bg-brand-secondary/30",
                  set.label === "III" && "bg-brand-tertiary/30",
                  set.label === "E" && "bg-purple-400/30",
                  !["I", "II", "III", "E"].includes(set.label) && "bg-glass-bg",
                )}
              >
                {set.label}
              </span>
              <div className="flex-1 pt-1">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline-flex items-baseline">
                    <span className="inline-flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              className={cn(
                                "relative text-brand-primary hover:text-brand-secondary hover:underline transition-colors",
                                track.allTimer && "font-medium",
                              )}
                            >
                              {track.allTimer && (
                                <Flame className="h-4 w-4 text-chart-accent inline-block mr-1 transform -translate-y-0.5" />
                              )}
                              <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                              {trackAnnotationMap.has(track.id) && (
                                <sup className="text-brand-secondary ml-0.5 font-medium">
                                  {trackAnnotationMap.get(track.id)}
                                </sup>
                              )}
                            </span>
                          </TooltipTrigger>
                          {trackAnnotationMap.has(track.id) && (
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="text-sm">
                                <span className="font-medium text-brand-secondary">
                                  Note {trackAnnotationMap.get(track.id)}:{" "}
                                </span>
                                {orderedAnnotations.find((a) => a.index === trackAnnotationMap.get(track.id))?.desc}
                              </p>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
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

        <div className="flex justify-between items-end mt-6 pt-4 border-t border-glass-border/30">
          {orderedAnnotations.length > 0 ? (
            <div className="space-y-2">
              {orderedAnnotations.map((annotation) => (
                <div key={`annotation-${annotation.index}`} className="text-sm text-content-text-secondary">
                  <sup className="text-brand-secondary">{annotation.index}</sup> {annotation.desc}
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
        </div>
        {user && (
          <div className="flex items-center justify-end gap-4">
            <StarRating
              rateableId={setlist.show.id}
              rateableType="Show"
              className="hover:scale-105 transition-transform"
              initialRating={userRating?.value}
            />
            <AttendanceToggle showId={setlist.show.id} initialAttendance={userAttendance} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const SetlistCard = memo(SetlistCardComponent);

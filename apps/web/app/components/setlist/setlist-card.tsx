import type { Attendance, Rating, Setlist } from "@bip/domain";
import { Flame } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";
import { cn, formatDateShort } from "~/lib/utils";
import { AttendanceToggle } from "./attendance";
import { TrackRatingOverlay } from "./track-rating-overlay";

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

  // Create a map of trackId to array of annotation indices for quick lookup
  const trackAnnotationMap = new Map<string, number[]>();

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
    const trackIndices: number[] = [];

    for (const annotation of trackAnnotations) {
      if (annotation.desc) {
        // If this description hasn't been seen before, assign a new index
        if (!uniqueAnnotations.has(annotation.desc)) {
          uniqueAnnotations.set(annotation.desc, {
            index: annotationIndex++,
            desc: annotation.desc,
          });
        }

        // Add this annotation index to the track's indices array
        const index = uniqueAnnotations.get(annotation.desc)?.index;
        if (index) {
          trackIndices.push(index);
        }
      }
    }

    // Map this track to all its annotation indices
    if (trackIndices.length > 0) {
      trackAnnotationMap.set(track.id, trackIndices);
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
      <CardHeader className="relative z-10 border-b border-glass-border/30 px-3 py-3 md:px-6 md:py-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="text-lg md:text-2xl font-medium text-brand-primary hover:text-brand-secondary transition-colors">
              <Link to={setlist.show.slug ? `/shows/${setlist.show.slug}` : `/shows`}>{formattedDate}</Link>
            </div>
            <div className="text-base md:text-xl text-content-text-primary">
              {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
            </div>
          </div>
          {displayedRating !== null && displayedRating > 0 && (
            <div className="flex items-center gap-1 glass-secondary px-2 py-1 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={cn("w-4 h-4", isAnimating && "animate-avg-rating-update")}
                style={{ color: "hsl(var(--rating-gold))" }}
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
              <span
                className={cn("text-sm font-medium", isAnimating && "animate-avg-rating-update")}
                style={{ color: "hsl(var(--rating-gold))" }}
              >
                {displayedRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-3 py-3 md:px-6 md:py-5">
        {setlist.show.notes && (
          <div
            className="mb-4 text-sm text-content-text-secondary italic border-l border-glass-border pl-3 py-1"
            dangerouslySetInnerHTML={{ __html: setlist.show.notes }}
          />
        )}

        <div className="space-y-2 md:space-y-4">
          {setlist.sets.map((set, setIndex) => (
            <span key={setlist.show.id + set.label} className="inline-block w-full md:flex md:gap-4 md:items-baseline">
              <span className="inline text-sm md:text-base font-medium text-content-text-tertiary">{set.label}</span>
              <span className="inline ml-2 md:ml-0 md:flex-1">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline">
                    <TrackRatingOverlay track={track}>
                      <span
                        className={cn(
                          "relative text-brand-primary hover:text-brand-secondary hover:underline transition-colors text-sm md:text-base",
                          track.allTimer && "font-medium",
                        )}
                      >
                        {track.allTimer && (
                          <Flame className="h-3 w-3 md:h-4 md:w-4 inline-block mr-1 transform -translate-y-0.5 text-orange-500" />
                        )}
                        <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                        {trackAnnotationMap.has(track.id) && (
                          <sup className="text-brand-secondary ml-0.5 font-medium text-xs">
                            {trackAnnotationMap.get(track.id)?.map((index, i) => (
                              <span key={index} className={i > 0 ? "ml-1" : ""}>
                                {index}
                              </span>
                            ))}
                          </sup>
                        )}
                      </span>
                    </TrackRatingOverlay>
                    {i < set.tracks.length - 1 && (
                      <span className="text-content-text-secondary mx-1 font-medium text-sm md:text-base">
                        {track.segue ? " > " : ", "}
                      </span>
                    )}
                  </span>
                ))}
              </span>
              {setIndex < setlist.sets.length - 1 && <span className="hidden"> </span>}
            </span>
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

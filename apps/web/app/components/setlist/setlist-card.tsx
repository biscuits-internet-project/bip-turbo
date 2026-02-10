import type { Attendance, Rating, Setlist, SetlistLight } from "@bip/domain";
import { Camera, Check, Flame } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RatingComponent } from "~/components/rating";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";
import { useAttendanceMutation } from "~/hooks/use-show-user-data";
import { cn, formatDateShort } from "~/lib/utils";
import { TrackRatingOverlay } from "./track-rating-overlay";

interface SetlistCardProps {
  setlist: Setlist | SetlistLight;
  className?: string;
  userAttendance: Attendance | null;
  userRating: Rating | number | null;
  showRating: number | null;
}

function SetlistCardComponent({ setlist, className, userAttendance, userRating, showRating }: SetlistCardProps) {
  const { user } = useSession();
  const formattedDate = formatDateShort(setlist.show.date);
  const [displayedRating, setDisplayedRating] = useState<number>(showRating ?? setlist.show.averageRating ?? 0);
  const [displayedCount, setDisplayedCount] = useState<number>(setlist.show.ratingsCount ?? 0);
  const [isRatingAnimating, setIsRatingAnimating] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [isAttendanceAnimating, setIsAttendanceAnimating] = useState(false);
  const [localAttendance, setLocalAttendance] = useState<Attendance | null>(userAttendance);
  const [localHasRated, setLocalHasRated] = useState(userRating !== null && userRating !== undefined);

  const attendanceMutation = useAttendanceMutation();
  const ratingAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attendanceAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (ratingAnimationTimeoutRef.current) clearTimeout(ratingAnimationTimeoutRef.current);
      if (attendanceAnimationTimeoutRef.current) clearTimeout(attendanceAnimationTimeoutRef.current);
    };
  }, []);

  // Update displayed rating when props change
  useEffect(() => {
    const newRating = showRating ?? setlist.show.averageRating ?? 0;
    if (newRating !== displayedRating) {
      // Wait for animation to reach peak before updating displayed value
      const updateTimer = setTimeout(() => setDisplayedRating(newRating), 800);
      return () => {
        clearTimeout(updateTimer);
      };
    }
  }, [showRating, setlist.show.averageRating, displayedRating]);

  // Sync attendance state with props
  useEffect(() => {
    setLocalAttendance(userAttendance);
  }, [userAttendance]);

  // Sync rating state with props
  useEffect(() => {
    setLocalHasRated(userRating !== null && userRating !== undefined);
  }, [userRating]);

  // Derived state for whether user is attending
  const isAttending = !!localAttendance;

  // Callback to update rating display when user submits a rating
  const handleAverageRatingChange = (average: number, count: number) => {
    setIsRatingAnimating(true);
    setDisplayedRating(average);
    setDisplayedCount(count);
    setLocalHasRated(true); // Mark as rated
    // Collapse the rating picker and reset animation
    setIsRatingExpanded(false);
    // Clear any existing timeout and set new one
    if (ratingAnimationTimeoutRef.current) clearTimeout(ratingAnimationTimeoutRef.current);
    ratingAnimationTimeoutRef.current = setTimeout(() => setIsRatingAnimating(false), 600);
  };

  // Toggle attendance using mutation
  const toggleAttendance = () => {
    if (attendanceMutation.isPending) return;

    const previousAttendance = localAttendance; // Capture BEFORE optimistic update

    // Optimistically update local state
    setLocalAttendance(
      previousAttendance ? null : ({ id: "optimistic", showId: setlist.show.id, userId: "" } as Attendance),
    );

    attendanceMutation.mutate(
      { showId: setlist.show.id, currentAttendance: previousAttendance },
      {
        onSuccess: (result) => {
          setLocalAttendance(result.attendance);
          if (result.isAttending) {
            setIsAttendanceAnimating(true);
            // Clear any existing timeout and set new one
            if (attendanceAnimationTimeoutRef.current) clearTimeout(attendanceAnimationTimeoutRef.current);
            attendanceAnimationTimeoutRef.current = setTimeout(() => setIsAttendanceAnimating(false), 600);
          }
        },
        onError: () => {
          // Revert on error using captured previous value
          setLocalAttendance(previousAttendance);
        },
      },
    );
  };

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
          {user && (
            <div className="flex items-center gap-2">
              {/* Attendance badge - clickable to toggle */}
              <button
                type="button"
                onClick={toggleAttendance}
                disabled={attendanceMutation.isPending}
                className={cn(
                  "flex items-center justify-center gap-1 px-2 h-6 sm:px-3 sm:h-8 rounded-md transition-all",
                  "hover:brightness-110 cursor-pointer",
                  isAttending
                    ? "bg-green-500/10 border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                    : "glass-secondary border border-dashed border-glass-border hover:border-green-500/30",
                  isAttendanceAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
                  attendanceMutation.isPending && "opacity-50",
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    isAttending ? "text-green-500" : "text-content-text-tertiary",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium hidden sm:inline",
                    isAttending ? "text-green-400" : "text-content-text-secondary",
                  )}
                >
                  {isAttending ? "Saw it" : "Saw it?"}
                </span>
              </button>

              {/* Rating badge - clickable to expand */}
              <button
                type="button"
                onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                className={cn(
                  "flex items-center justify-center gap-1 px-2 h-6 sm:px-3 sm:h-8 rounded-md transition-all",
                  "hover:brightness-110 cursor-pointer",
                  localHasRated
                    ? "bg-amber-500/10 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                    : "glass-secondary border border-dashed border-glass-border hover:border-amber-500/30",
                  isRatingAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
                )}
              >
                {isRatingExpanded ? (
                  <StarRating
                    rateableId={setlist.show.id}
                    rateableType="Show"
                    initialRating={typeof userRating === "number" ? userRating : (userRating?.value ?? null)}
                    showSlug={setlist.show.slug}
                    onAverageRatingChange={handleAverageRatingChange}
                  />
                ) : (
                  <RatingComponent rating={displayedRating} ratingsCount={displayedCount} />
                )}
              </button>
            </div>
          )}
          {!user && (
            <LoginPromptPopover message="Sign in to rate">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-1 glass-secondary px-2 h-6 sm:px-3 sm:h-8 rounded-md",
                  "cursor-pointer hover:brightness-110 border border-dashed border-glass-border hover:border-amber-500/30",
                  isRatingAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
                )}
              >
                <RatingComponent rating={displayedRating} ratingsCount={displayedCount} />
              </button>
            </LoginPromptPopover>
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
              <span className="inline text-base font-medium text-content-text-tertiary">{set.label}</span>
              <span className="inline ml-2 md:ml-0 md:flex-1">
                {set.tracks.map((track, i) => (
                  <span key={track.id} className="inline">
                    <TrackRatingOverlay track={track}>
                      <span
                        className={cn(
                          "relative text-brand-primary hover:text-brand-secondary hover:underline transition-colors text-base",
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
                      <span className="text-content-text-secondary mx-1 font-medium text-base">
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
          {setlist.show.showPhotosCount > 0 && (
            <Link
              to={`/shows/${setlist.show.slug}#photos`}
              className="flex items-center gap-1.5 text-content-text-tertiary hover:text-content-text-secondary transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span className="text-sm">{setlist.show.showPhotosCount}</span>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const SetlistCard = memo(SetlistCardComponent);

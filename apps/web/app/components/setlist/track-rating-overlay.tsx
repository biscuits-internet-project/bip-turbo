import type { RatingValueBucket } from "@bip/core";
import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating";
import { RatingDistributionChart } from "~/components/rating/rating-distribution-chart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";

/**
 * Minimal structural type for any track shape this overlay can read.
 * Wider call sites pass a full `Track` / `TrackLight`; surfaces with
 * their own track-like row shape (e.g. SongPagePerformance) adapt at
 * the call site. Listed inline so consumers don't have to import the
 * full domain types just to satisfy the prop.
 */
export interface TrackRatingOverlayTrack {
  id: string;
  allTimer?: boolean | null;
  note?: string | null;
  song?: { title?: string | null } | null;
  averageRating?: number | null;
  ratingsCount?: number | null;
  likesCount?: number | null;
}

interface TrackRatingOverlayProps {
  track: TrackRatingOverlayTrack;
  children: React.ReactNode;
  /**
   * When false, suppress the rating display, likes count, and user
   * rating editor — and skip the /api/tracks/:id refetch. Use this
   * variant when the surrounding view already shows rating in its own
   * column (e.g. the gap-chart tables) so the overlay reduces to
   * "song title + note" without redundant scoring data.
   */
  showRating?: boolean;
  /**
   * `"hover"` (default) wraps the trigger in a hover card — opens on
   * pointer hover, works on desktop only. `"click"` uses a popover so
   * the overlay also opens on tap on touch devices; use it on small
   * targets like the standalone flame icon where mobile users have no
   * other way to surface the note.
   */
  trigger?: "hover" | "click";
}

interface TrackDataResponse {
  track: {
    id: string;
    songTitle: string;
    averageRating: number;
    ratingsCount: number;
    likesCount: number;
    note: string | null;
  };
  userRating: number | null;
  distribution: RatingValueBucket[];
}

export function TrackRatingOverlay({ track, children, showRating = true, trigger = "hover" }: TrackRatingOverlayProps) {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<TrackDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch fresh track data when hover card opens. Skipped in note-only
  // mode — the rating display is hidden anyway, and the note text on
  // the row already comes from the same source.
  useEffect(() => {
    if (!isOpen) return;
    if (!showRating) return;

    const fetchTrackData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/tracks/${track.id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch track data");
        const responseData = await response.json();
        if (isMountedRef.current) {
          setData(responseData);
        }
      } catch {
        // Silently fail - will fall back to initial track data
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchTrackData();
  }, [isOpen, track.id, showRating]);

  // Use fetched data if available, otherwise fall back to initial track data
  const displayRating = data?.track.averageRating ?? track.averageRating ?? 0;
  const ratingCount = data?.track.ratingsCount ?? track.ratingsCount ?? 0;
  const userRating = data?.userRating ?? null;

  const content = (
    <div className="space-y-3">
      <div className="text-lg font-medium text-brand-primary">{track.song?.title}</div>

      {showRating &&
        (isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ) : (
          <RatingComponent rating={displayRating} ratingsCount={ratingCount} userRating={userRating} />
        ))}

      {showRating && (data?.track.likesCount ?? track.likesCount ?? 0) > 0 && (
        <div className="text-xs text-content-text-secondary">
          {data?.track.likesCount ?? track.likesCount}{" "}
          {(data?.track.likesCount ?? track.likesCount) === 1 ? "like" : "likes"}
        </div>
      )}

      {showRating && data?.distribution && <RatingDistributionChart compact buckets={data.distribution} />}

      {(data?.track.note ?? track.note) && (
        <div className="text-xs text-content-text-secondary border-t pt-2 mt-2">{data?.track.note ?? track.note}</div>
      )}

      {showRating && user && (
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-content-text-secondary">Your Rating:</span>
            <StarRating
              rateableId={track.id}
              rateableType="Track"
              className="scale-110 [&_fieldset]:border-0"
              initialRating={userRating}
              onRatingChange={() => {
                // Refetch track data after rating
                setData(null);
                setIsLoading(true);
                fetch(`/api/tracks/${track.id}`, { credentials: "include" })
                  .then((res) => res.json())
                  .then((newData) => {
                    if (isMountedRef.current) {
                      setData(newData);
                      setIsLoading(false);
                    }
                  })
                  .catch(() => {
                    if (isMountedRef.current) {
                      setIsLoading(false);
                    }
                  });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  // Shared content styling between the hover-card and popover variants
  // so the panel looks identical regardless of trigger mode.
  const contentClassName = "w-80 p-4 bg-black/90 backdrop-blur-md shadow-xl";

  if (trigger === "click") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="cursor-pointer">
          {children}
        </PopoverTrigger>
        <PopoverContent className={contentClassName} side="top" align="start">
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <HoverCard openDelay={600} closeDelay={200} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild className="cursor-pointer">
        {children}
      </HoverCardTrigger>
      <HoverCardContent className={contentClassName} side="top" align="start">
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}

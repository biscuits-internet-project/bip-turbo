import type { Track, TrackLight } from "@bip/domain";
import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

interface TrackRatingOverlayProps {
  track: Track | TrackLight;
  children: React.ReactNode;
  className?: string;
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
}

export function TrackRatingOverlay({ track, children, className }: TrackRatingOverlayProps) {
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

  // Fetch fresh track data when hover card opens
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, track.id]);

  // Use fetched data if available, otherwise fall back to initial track data
  const displayRating = data?.track.averageRating ?? track.averageRating ?? 0;
  const ratingCount = data?.track.ratingsCount ?? track.ratingsCount ?? 0;
  const userRating = data?.userRating ?? null;

  return (
    <HoverCard openDelay={600} closeDelay={200} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild className={cn("cursor-pointer", className)}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-4 bg-black/90 backdrop-blur-md border-glass-border shadow-xl"
        side="top"
        align="start"
      >
        <div className="space-y-3">
          <div className="text-lg font-medium text-brand-primary">{track.song?.title}</div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <RatingComponent rating={displayRating} ratingsCount={ratingCount} />
          )}

          {(data?.track.likesCount ?? track.likesCount) > 0 && (
            <div className="text-xs text-content-text-secondary">
              {data?.track.likesCount ?? track.likesCount}{" "}
              {(data?.track.likesCount ?? track.likesCount) === 1 ? "like" : "likes"}
            </div>
          )}

          {(data?.track.note ?? track.note) && (
            <div className="text-xs text-content-text-secondary border-t border-glass-border pt-2 mt-2">
              {data?.track.note ?? track.note}
            </div>
          )}

          {user && (
            <div className="border-t border-glass-border pt-3 mt-3">
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
      </HoverCardContent>
    </HoverCard>
  );
}

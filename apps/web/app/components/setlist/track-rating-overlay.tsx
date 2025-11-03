import type { Track } from "@bip/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RatingComponent } from "~/components/rating";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { Skeleton } from "~/components/ui/skeleton";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

interface TrackRatingOverlayProps {
  track: Track;
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
  const queryClient = useQueryClient();

  // Fetch fresh track data when hover card opens
  const { data, isLoading } = useQuery<TrackDataResponse>({
    queryKey: ["track", track.id],
    queryFn: async () => {
      const response = await fetch(`/api/tracks/${track.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch track data");
      const data = await response.json();
      console.log("Fresh track data received:", data);
      return data;
    },
    enabled: isOpen, // Only fetch when hover card is open
    staleTime: 0, // Always fetch fresh
    gcTime: 1000 * 60, // Cache for 1 minute in memory
  });

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
                    // Invalidate and refetch track data after rating
                    queryClient.invalidateQueries({ queryKey: ["track", track.id] });
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

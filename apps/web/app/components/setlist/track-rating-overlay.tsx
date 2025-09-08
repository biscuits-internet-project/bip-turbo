import type { Track } from "@bip/domain";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  const hasRating = displayRating > 0;
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
          ) : hasRating || ratingCount > 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
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
                  <span className="text-base font-medium" style={{ color: "hsl(var(--rating-gold))" }}>
                    {displayRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-content-text-secondary">Average Rating</span>
              </div>
              <span className="text-xs text-content-text-tertiary">
                {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
              </span>
            </div>
          ) : (
            <div className="text-sm text-content-text-secondary">No ratings yet</div>
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

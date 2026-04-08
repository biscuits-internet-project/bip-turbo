import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { StarRating } from "~/components/ui/star-rating";
import { cn } from "~/lib/utils";

export function TrackRatingCell({
  trackId,
  showSlug,
  initialRating,
  ratingsCount,
  userRating,
  isAuthenticated,
}: {
  trackId: string;
  showSlug: string;
  initialRating: number | null;
  ratingsCount: number | null;
  userRating?: number | null;
  isAuthenticated: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedRating, setDisplayedRating] = useState(initialRating ?? 0);
  const [displayedCount, setDisplayedCount] = useState(ratingsCount ?? 0);
  const [localHasRated, setLocalHasRated] = useState(userRating != null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when props change — handles both async fetch completion
  // (userRating arriving after initial render) and component reuse (React
  // keeping the same component mounted but with different data after a
  // sort or filter change).
  useEffect(() => {
    setDisplayedRating(initialRating ?? 0);
    setDisplayedCount(ratingsCount ?? 0);
  }, [initialRating, ratingsCount]);

  useEffect(() => {
    setLocalHasRated(userRating != null);
  }, [userRating]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const handleRatingChange = (average: number, count: number) => {
    setIsAnimating(true);
    setLocalHasRated(true);
    setDisplayedRating(average);
    setDisplayedCount(count);
    setIsExpanded(false);
    // Clear any existing timeout and set new one
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), 600);
  };

  const ratingButton = (
    <button
      type="button"
      onClick={(e) => {
        if (!isAuthenticated) return;
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md",
        "origin-center",
        localHasRated
          ? "bg-amber-500/10 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
          : "glass-secondary border border-dashed border-glass-border",
        isAuthenticated && "hover:brightness-110 cursor-pointer hover:border-amber-500/30",
        !isAuthenticated && "cursor-pointer hover:border-amber-500/30",
        isAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
      )}
    >
      {isExpanded ? (
        <StarRating
          rateableId={trackId}
          rateableType="Track"
          showSlug={showSlug}
          initialRating={userRating}
          onAverageRatingChange={handleRatingChange}
          skipRevalidation
        />
      ) : (
        <RatingComponent rating={displayedRating || null} ratingsCount={displayedCount || null} />
      )}
    </button>
  );

  if (!isAuthenticated) {
    return (
      <div className="w-[140px]">
        <LoginPromptPopover message="Sign in to rate">{ratingButton}</LoginPromptPopover>
      </div>
    );
  }

  return <div className="w-[140px]">{ratingButton}</div>;
}

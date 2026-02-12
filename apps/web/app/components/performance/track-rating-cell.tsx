import { useEffect, useRef, useState } from "react";
import { RatingComponent } from "~/components/rating";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { StarRating } from "~/components/ui/star-rating";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

export function TrackRatingCell({
  trackId,
  showSlug,
  initialRating,
  ratingsCount,
}: {
  trackId: string;
  showSlug: string;
  initialRating: number | null;
  ratingsCount: number | null;
}) {
  const { user } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedRating, setDisplayedRating] = useState(initialRating ?? 0);
  const [displayedCount, setDisplayedCount] = useState(ratingsCount ?? 0);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  const handleRatingChange = (average: number, count: number) => {
    setIsAnimating(true);
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
        if (!user) return;
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md",
        "origin-center",
        "glass-secondary border border-dashed border-glass-border",
        user && "hover:brightness-110 cursor-pointer hover:border-amber-500/30",
        !user && "cursor-pointer hover:border-amber-500/30",
        isAnimating && "animate-[avg-rating-update_0.5s_ease-out]"
      )}
    >
      {isExpanded ? (
        <StarRating
          rateableId={trackId}
          rateableType="Track"
          showSlug={showSlug}
          onAverageRatingChange={handleRatingChange}
          skipRevalidation
        />
      ) : (
        <RatingComponent rating={displayedRating || null} ratingsCount={displayedCount || null} />
      )}
    </button>
  );

  if (!user) {
    return (
      <div className="w-[140px]">
        <LoginPromptPopover message="Sign in to rate">
          {ratingButton}
        </LoginPromptPopover>
      </div>
    );
  }

  return <div className="w-[140px]">{ratingButton}</div>;
}

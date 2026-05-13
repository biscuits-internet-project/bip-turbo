import { RatingBadgeButton } from "~/components/rating/rating-badge-button";

/**
 * Thin shim around `RatingBadgeButton` for the performance table cell
 * surface — picks the compact size variant. `skipRevalidation` is set so
 * editing inside a long virtualized table doesn't trigger a route
 * revalidation per submission.
 */
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
  return (
    <RatingBadgeButton
      rateableId={trackId}
      rateableType="Track"
      showSlug={showSlug}
      initialRating={initialRating}
      ratingsCount={ratingsCount}
      userRating={userRating}
      isAuthenticated={isAuthenticated}
      size="compact"
      skipRevalidation
    />
  );
}

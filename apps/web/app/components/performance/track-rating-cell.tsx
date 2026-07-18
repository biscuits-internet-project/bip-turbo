import { RatingBadgeButton } from "~/components/rating/rating-badge-button";
import type { TrackRatingComparison } from "~/server/track-user-ratings";

/**
 * Thin shim around `RatingBadgeButton` for the performance/setlist table cell
 * surface — picks the compact size variant. `skipRevalidation` is set so
 * editing inside a long virtualized table doesn't trigger a route
 * revalidation per submission. When a `comparison` is passed (the author
 * compare/debug overlay), it renders a small "community → calibrated (Δ)" note
 * under the badge — the one place that layout lives, shared by both table
 * column factories.
 */
export function TrackRatingCell({
  trackId,
  showSlug,
  initialRating,
  ratingsCount,
  userRating,
  isAuthenticated,
  comparison,
}: {
  trackId: string;
  showSlug: string;
  initialRating: number | null;
  ratingsCount: number | null;
  userRating?: number | null;
  isAuthenticated: boolean;
  comparison?: TrackRatingComparison;
}) {
  const badge = (
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

  if (!comparison) return badge;

  return (
    <div className="flex flex-col items-end gap-0.5">
      {badge}
      <span
        className="text-[10px] leading-none text-content-text-tertiary tabular-nums"
        title="community → calibrated (Δ)"
      >
        {comparison.plain.toFixed(2)}→{comparison.calibrated.toFixed(2)} ({comparison.delta >= 0 ? "+" : ""}
        {comparison.delta.toFixed(2)})
      </span>
    </div>
  );
}

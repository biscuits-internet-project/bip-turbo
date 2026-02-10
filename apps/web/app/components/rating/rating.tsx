import { Star } from "lucide-react";

interface RatingProps {
  rating: number | null;
  ratingsCount?: number | null;
}

export const RatingComponent = ({ rating, ratingsCount }: RatingProps) => {
  return rating ? (
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="flex items-center">
        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-rating-gold mr-0.5 sm:mr-1" />
        <span className="font-medium text-xs sm:text-sm text-content-text-primary">{rating?.toFixed(2) || "—"}</span>
      </div>
      {ratingsCount && ratingsCount > 0 && (
        <span className="text-content-text-tertiary text-xs sm:text-sm">({ratingsCount})</span>
      )}
    </div>
  ) : (
    <div className="text-xs sm:text-sm text-content-text-secondary">Rate</div>
  );
};

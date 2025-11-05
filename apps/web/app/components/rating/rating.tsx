import { Star } from "lucide-react";

interface RatingProps {
  rating: number | null;
  ratingsCount?: number | null;
}

export const RatingComponent = ({ rating, ratingsCount }: RatingProps) => {
  return rating ? (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <Star className="h-4 w-4 text-rating-gold mr-1" />
        <span className="font-medium text-content-text-primary">{rating?.toFixed(3) || "—"}</span>
      </div>
      {ratingsCount && ratingsCount > 0 && <span className="text-content-text-tertiary text-sm">({ratingsCount})</span>}
    </div>
  ) : (
    <div className="text-sm text-content-text-secondary">No ratings yet</div>
  );
};

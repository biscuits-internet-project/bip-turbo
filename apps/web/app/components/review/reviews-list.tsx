import type { ReviewMinimal } from "@bip/domain";
import { ReviewCard } from "./review-card";

interface ReviewsListProps {
  reviews: ReviewMinimal[];
  title?: string;
}

export function ReviewsList({ reviews, title = "Reviews" }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-8 mt-8 border-t border-gray-800/50">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="text-gray-400 italic bg-gray-900/50 p-6 rounded-md border border-gray-800/50">
          No reviews yet. Be the first to share your thoughts!
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 mt-8 border-t border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

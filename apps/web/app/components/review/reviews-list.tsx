import type { ReviewMinimal } from "@bip/domain";
import { ReviewCard } from "./review-card";

interface ReviewsListProps {
  reviews: ReviewMinimal[];
  title?: string;
  currentUserId?: string;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, content: string) => Promise<void>;
}

export function ReviewsList({ reviews, title = "Reviews", currentUserId, onDelete, onUpdate }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            currentUserId={currentUserId}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

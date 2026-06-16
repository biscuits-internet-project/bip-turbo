import type { RatingValueBucket } from "@bip/core";
import { RatingDistributionChart } from "~/components/rating/rating-distribution-chart";
import { cardVariants } from "~/components/ui/card";
import { CollapsibleSection } from "~/components/ui/collapsible-section";

interface ShowRatingHistogramProps {
  buckets: RatingValueBucket[];
}

/**
 * Right-rail card showing the distribution of this show's ratings. Expanded
 * on desktop, collapsed behind a tappable header on mobile (the rail stacks
 * under the setlist there, so the chart shouldn't push reviews far down by
 * default). Renders nothing when the show has no ratings.
 */
export function ShowRatingHistogram({ buckets }: ShowRatingHistogramProps) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.count, 0);
  if (total === 0) return null;

  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg p-3" })}>
      <CollapsibleSection
        title={<span className="text-sm font-semibold text-content-text-primary">Rating distribution</span>}
        titleAs="h3"
        breakpoint="md"
        headerExtra={
          <span className="text-xs text-content-text-tertiary">
            {total} {total === 1 ? "rating" : "ratings"}
          </span>
        }
        contentClassName="pt-2"
      >
        <RatingDistributionChart buckets={buckets} hideHeader />
      </CollapsibleSection>
    </div>
  );
}

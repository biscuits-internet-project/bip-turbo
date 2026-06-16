import type { RatingValueBucket } from "@bip/core";
import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ShowRatingHistogram } from "./show-rating-histogram";

// Recharts ResponsiveContainer needs ResizeObserver (absent in jsdom); stub
// it so the card body mounts. Assertions target the card chrome, not the
// recharts SVG.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 240 }}>{children}</div>
    ),
  };
});

const buckets: RatingValueBucket[] = [
  { value: 5, count: 30 },
  { value: 4, count: 12 },
];

describe("ShowRatingHistogram", () => {
  // The card titles itself and surfaces the sample size so the collapsed
  // mobile header still says what it holds.
  test("renders the heading and total when there are ratings", async () => {
    await setup(<ShowRatingHistogram buckets={buckets} />);
    expect(screen.getByRole("heading", { name: /rating distribution/i })).toBeInTheDocument();
    expect(screen.getByText("42 ratings")).toBeInTheDocument();
  });

  // A show with no ratings gets no card — avoids an empty-axis panel in the
  // right rail.
  test("renders nothing when there are no ratings", async () => {
    const { container } = await setup(<ShowRatingHistogram buckets={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

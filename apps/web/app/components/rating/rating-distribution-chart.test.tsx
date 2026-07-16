import type { RatingValueBucket } from "@bip/core";
import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PreferencesProvider } from "~/hooks/use-preferences";
import { CHART_COLORS } from "~/lib/chart-colors";
import { RATING_COLOR_GREEN, RATING_COLOR_NEUTRAL, RATING_COLOR_PURPLE } from "~/lib/rating-colors";
import { RatingAxisTick, RatingDistributionChart, RatingHistogramTooltip } from "./rating-distribution-chart";

// Recharts ResponsiveContainer measures parent layout via ResizeObserver,
// which jsdom doesn't implement. Stub it to a fixed-size div so the chart
// mounts during tests (axis SVG ticks still don't render reliably under
// jsdom, so assertions target the component's own DOM, not recharts output).
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
  { value: 5, count: 60 },
  { value: 4.5, count: 40 },
  { value: 4, count: 20 },
  { value: 0.5, count: 8 },
];

describe("RatingDistributionChart", () => {
  // A rateable with no ratings has no shape to draw — render nothing rather
  // than an empty axis card.
  test("renders nothing when there are no ratings", async () => {
    const { container } = await setup(<RatingDistributionChart buckets={[]} />);
    expect(container.firstChild).toBeNull();
  });

  // Total summarizes the sample size so a 3-vote distribution doesn't read
  // with the same authority as a 300-vote one.
  test("shows the total rating count, pluralized", async () => {
    await setup(<RatingDistributionChart buckets={buckets} />);
    expect(screen.getByText("128 ratings")).toBeInTheDocument();
  });

  test("uses the singular when exactly one rating", async () => {
    await setup(<RatingDistributionChart buckets={[{ value: 5, count: 1 }]} />);
    expect(screen.getByText("1 rating")).toBeInTheDocument();
  });
});

// Recharts injects x/y/payload into the element passed as `tick`, and jsdom
// won't render the axis, so drive the tick directly with the props recharts
// would supply. `payload.index` is the row index into RATING_BUCKETS; the
// label recharts hands over is the already-formatted glyph.
describe("RatingAxisTick", () => {
  const renderTick = (index: number, label: string, colorCodeRatings: boolean | null = true) =>
    setup(
      <PreferencesProvider colorCodeRatings={colorCodeRatings}>
        <svg role="img" aria-label="axis">
          <RatingAxisTick x={10} y={20} fontSize={12} payload={{ value: label, index }} />
        </svg>
      </PreferencesProvider>,
    );

  // The axis doubles as the scale's legend: each tick renders in the color that
  // rating's value renders in everywhere else.
  test("tints each tick with its own bucket's color", async () => {
    const low = await renderTick(0, "½");
    expect(low.container.querySelector("text")).toHaveAttribute("fill", RATING_COLOR_PURPLE);
    low.unmount();

    const mid = await renderTick(6, "3½");
    expect(mid.container.querySelector("text")).toHaveAttribute("fill", RATING_COLOR_NEUTRAL);
    mid.unmount();

    const high = await renderTick(9, "5");
    expect(high.container.querySelector("text")).toHaveAttribute("fill", RATING_COLOR_GREEN);
  });

  test("still renders the label recharts supplies", async () => {
    const { container } = await renderTick(6, "3½");
    expect(container.querySelector("text")?.textContent).toBe("3½");
  });

  // The preference has to reach the axis too, or it only half applies. Both the
  // explicit opt-out and the unset default must leave the axis plain.
  test("falls back to the plain axis color when the viewer opts out", async () => {
    const { container } = await renderTick(9, "5", false);
    expect(container.querySelector("text")).toHaveAttribute("fill", CHART_COLORS.axis);
  });

  test("falls back to the plain axis color by default", async () => {
    const { container } = await renderTick(9, "5", null);
    expect(container.querySelector("text")).toHaveAttribute("fill", CHART_COLORS.axis);
  });
});

describe("RatingHistogramTooltip", () => {
  // Tooltip shows both the raw count and its share of the total so the user
  // reads volume and proportion at once.
  test("renders the hovered bucket's count and percent", async () => {
    const { container } = await setup(
      <RatingHistogramTooltip active total={128} label="4½" payload={[{ value: 40, dataKey: "all" }]} />,
    );
    expect(container.textContent).toContain("4½ stars");
    expect(container.textContent).toContain("40 ratings");
    expect(container.textContent).toContain("31.3%");
  });

  test("renders nothing when inactive", async () => {
    const { container } = await setup(<RatingHistogramTooltip total={128} />);
    expect(container.firstChild).toBeNull();
  });
});

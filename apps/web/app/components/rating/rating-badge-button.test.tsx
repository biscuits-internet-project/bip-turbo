import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Spy on StarRating so tests can drive its onRatingChange callback without
// firing a real network request — that's the only way to verify the new
// user value is captured locally and re-used the next time the editor opens.
const starRatingSpy = vi.fn();
vi.mock("~/components/ui/star-rating", () => ({
  StarRating: (props: {
    initialRating?: number | null;
    onRatingChange?: (value: number) => void;
    onAverageRatingChange?: (average: number, count: number) => void;
  }) => {
    starRatingSpy(props);
    return mockShallowComponent("StarRating", { initialRating: props.initialRating ?? null });
  },
}));

import { RatingBadgeButton } from "./rating-badge-button";

describe("RatingBadgeButton", () => {
  beforeEach(() => {
    starRatingSpy.mockClear();
  });

  // Core display contract: when a community average is provided, the badge
  // shows the number — not the "Rate" placeholder.
  test("displays the community rating when initialRating is provided", async () => {
    await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("4.17")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("Rate")).not.toBeInTheDocument();
  });

  // When no community rating exists yet, show the "Rate" CTA so the first
  // user is invited to score the track/show.
  test('displays "Rate" when initialRating is null', async () => {
    await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={null}
        ratingsCount={null}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("Rate")).toBeInTheDocument();
  });

  // Visual rated/unrated state: amber border + bg when the user has rated,
  // dashed glass border otherwise. Same contract for both size variants.
  test("shows amber border when userRating is provided", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={3.5}
        ratingsCount={2}
        userRating={4}
        isAuthenticated={true}
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("border-amber-500");
  });

  test("shows dashed border when userRating is null", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={3.5}
        ratingsCount={2}
        userRating={null}
        isAuthenticated={true}
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("border-dashed");
  });

  // Component must track new props when React reuses the same DOM position
  // for different data (e.g. after a table sort/filter reorders rows).
  // Without this, the cached displayedRating from useState would surface a
  // stale value for the new row.
  test("updates displayed rating when props change due to data reordering", async () => {
    const { rerender } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("4.17")).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <RatingBadgeButton
          rateableId="t2"
          rateableType="Track"
          showSlug="show-2"
          initialRating={null}
          ratingsCount={null}
          userRating={null}
          isAuthenticated={false}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText("4.17")).not.toBeInTheDocument();
    expect(screen.getByText("Rate")).toBeInTheDocument();
  });

  // Symmetric: going from no rating to having one updates display too.
  test("updates from Rate to rating number when props change", async () => {
    const { rerender } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={null}
        ratingsCount={null}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("Rate")).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <RatingBadgeButton
          rateableId="t2"
          rateableType="Track"
          showSlug="show-2"
          initialRating={3.5}
          ratingsCount={2}
          userRating={null}
          isAuthenticated={false}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Rate")).not.toBeInTheDocument();
    expect(screen.getByText("3.50")).toBeInTheDocument();
  });

  // The amber/dashed state must follow the latest userRating prop, not a
  // cached value from a prior row at the same DOM position.
  test("updates amber/dashed state when userRating prop changes", async () => {
    const { container, rerender } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={5}
        isAuthenticated={true}
      />,
    );

    let button = container.querySelector("button");
    expect(button?.className).toContain("border-amber-500");

    rerender(
      <MemoryRouter>
        <RatingBadgeButton
          rateableId="t2"
          rateableType="Track"
          showSlug="show-2"
          initialRating={3.0}
          ratingsCount={1}
          userRating={null}
          isAuthenticated={true}
        />
      </MemoryRouter>,
    );

    button = container.querySelector("button");
    expect(button?.className).toContain("border-dashed");
    expect(button?.className).not.toContain("bg-amber-500");
  });

  // Size variant: "compact" is for table cells — uses py-1 and tighter
  // horizontal padding. "regular" (default) is for card headers — uses
  // explicit h-6 sm:h-8 height to align with sibling buttons in the same
  // row.
  test("size='compact' uses py-1 with no fixed height", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={3.5}
        ratingsCount={2}
        userRating={null}
        isAuthenticated={true}
        size="compact"
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("py-1");
    expect(button?.className).not.toContain("h-6");
    expect(button?.className).not.toContain("h-8");
  });

  test("size='regular' (default) uses h-6 sm:h-8 fixed height", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="show-1"
        rateableType="Show"
        showSlug="show-1"
        initialRating={4.0}
        ratingsCount={5}
        userRating={null}
        isAuthenticated={true}
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("h-6");
    expect(button?.className).toContain("sm:h-8");
  });

  // Padding tightens when the personal score renders so the busier row
  // doesn't grow the box. Verified per size variant since each picks
  // different padding scales.
  test("compact: padding tightens to px-1 when user has rated", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="t1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={4}
        isAuthenticated={true}
        size="compact"
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("px-1");
    expect(button?.className).not.toMatch(/\bpx-2\b/);
  });

  test("regular: padding tightens to px-1.5 sm:px-2 when user has rated", async () => {
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="show-1"
        rateableType="Show"
        showSlug="show-1"
        initialRating={4.0}
        ratingsCount={5}
        userRating={5}
        isAuthenticated={true}
      />,
    );

    const button = container.querySelector("button");
    expect(button?.className).toContain("px-1.5");
    expect(button?.className).toContain("sm:px-2");
  });

  // When the editor reports a cleared rating (null) via onRatingChange,
  // the badge drops its amber chrome and the re-opened editor seeds with
  // an empty state — same local-capture path as a fresh submission, just
  // with a null value.
  test("captures a cleared rating and drops the amber chrome", async () => {
    const user = userEvent.setup();
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="track-1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.0}
        ratingsCount={5}
        userRating={4}
        isAuthenticated={true}
        skipRevalidation
      />,
    );

    // Initial rated state — amber chrome.
    let button = container.querySelector("button") as HTMLButtonElement;
    expect(button.className).toContain("bg-amber-500/10");

    // Open the editor and fire the clear flow through StarRating's spy.
    await user.click(button);
    const lastProps = starRatingSpy.mock.lastCall?.[0];
    await act(async () => {
      lastProps.onRatingChange(null);
      lastProps.onAverageRatingChange(3.8, 4);
    });

    // Editor collapsed; the badge re-renders without the amber chrome.
    button = container.querySelector("button") as HTMLButtonElement;
    expect(button.className).not.toContain("bg-amber-500/10");
    expect(button.className).toContain("border-dashed");

    // Re-opening seeds the editor with null, not the stale prop.
    await user.click(button);
    expect(starRatingSpy).toHaveBeenLastCalledWith(expect.objectContaining({ initialRating: null }));
  });

  // The editor seeds with the latest submitted value, not the original
  // prop. StarRating reports submitted values through `onRatingChange`;
  // the badge captures that locally and passes it as `initialRating` on
  // the next remount. Important for track ratings, which skip route
  // revalidation and therefore never receive a fresh prop value.
  test("captures the user's submitted value and seeds the editor with it on re-open", async () => {
    const user = userEvent.setup();
    const { container } = await setupWithRouter(
      <RatingBadgeButton
        rateableId="track-1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={4.0}
        ratingsCount={5}
        userRating={3}
        isAuthenticated={true}
        skipRevalidation
      />,
    );

    // Open the editor; StarRating mounts with the prop value.
    const button = container.querySelector("button") as HTMLButtonElement;
    await user.click(button);
    expect(starRatingSpy).toHaveBeenLastCalledWith(expect.objectContaining({ initialRating: 3 }));

    // Simulate the user clicking a new star value: StarRating fires
    // onRatingChange with the new value and onAverageRatingChange to
    // collapse the editor. Both happen in the same submit flow.
    const lastProps = starRatingSpy.mock.lastCall?.[0];
    await act(async () => {
      lastProps.onRatingChange(5);
      lastProps.onAverageRatingChange(4.2, 6);
    });

    // Re-open the editor. Without the local-state fix, the spy would see
    // initialRating: 3 (the stale prop). With the fix it sees 5.
    await user.click(button);
    expect(starRatingSpy).toHaveBeenLastCalledWith(expect.objectContaining({ initialRating: 5 }));
  });
});

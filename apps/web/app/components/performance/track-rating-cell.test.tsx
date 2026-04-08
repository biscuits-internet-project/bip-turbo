import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { TrackRatingCell } from "./track-rating-cell";

describe("TrackRatingCell", () => {
  // When a performance has a community average rating, the cell displays
  // the rating number (e.g. "4.17") — not the "Rate" placeholder. This is
  // the core display contract.
  test("displays the community rating when initialRating is provided", async () => {
    await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("4.17")).toBeInTheDocument();
    expect(screen.getByText("(3)")).toBeInTheDocument();
    expect(screen.queryByText("Rate")).not.toBeInTheDocument();
  });

  // When there is no community rating, the cell shows "Rate" as a
  // placeholder to invite the user to be the first rater.
  test('displays "Rate" when initialRating is null', async () => {
    await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
        showSlug="show-1"
        initialRating={null}
        ratingsCount={null}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("Rate")).toBeInTheDocument();
  });

  // When the user has rated the track, the cell gets a golden border
  // (amber styling) regardless of whether a community rating exists.
  test("shows golden border when userRating is provided", async () => {
    const { container } = await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
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

  // When the user has NOT rated the track, the cell has a dashed border
  // (no golden highlight).
  test("shows dashed border when userRating is null", async () => {
    const { container } = await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
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

  // When React reuses a TrackRatingCell component at the same DOM position
  // but with different props (e.g., after sorting or filtering changes the
  // data order), the displayed rating must update to match the new props —
  // not retain the previous row's useState-cached value.
  test("updates displayed rating when props change due to data reordering", async () => {
    const { rerender } = await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={null}
        isAuthenticated={false}
      />,
    );

    expect(screen.getByText("4.17")).toBeInTheDocument();

    // Simulate React reusing this component with different data (as happens
    // when TanStack reorders rows by index after a sort/filter change).
    rerender(
      <MemoryRouter>
        <TrackRatingCell
          trackId="t2"
          showSlug="show-2"
          initialRating={null}
          ratingsCount={null}
          userRating={null}
          isAuthenticated={false}
        />
      </MemoryRouter>,
    );

    // Should now show "Rate", not the stale "4.17" from the previous render.
    expect(screen.queryByText("4.17")).not.toBeInTheDocument();
    expect(screen.getByText("Rate")).toBeInTheDocument();
  });

  // Same scenario in reverse: going from no rating to having a rating.
  test("updates from Rate to rating number when props change", async () => {
    const { rerender } = await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
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
        <TrackRatingCell
          trackId="t2"
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

  // When the component is reused at the same DOM position, the golden
  // border state must track the new userRating prop, not the old one.
  test("updates golden border state when userRating prop changes", async () => {
    const { container, rerender } = await setupWithRouter(
      <TrackRatingCell
        trackId="t1"
        showSlug="show-1"
        initialRating={4.17}
        ratingsCount={3}
        userRating={5}
        isAuthenticated={true}
      />,
    );

    // Initially golden
    let button = container.querySelector("button");
    expect(button?.className).toContain("border-amber-500");

    rerender(
      <MemoryRouter>
        <TrackRatingCell
          trackId="t2"
          showSlug="show-2"
          initialRating={3.0}
          ratingsCount={1}
          userRating={null}
          isAuthenticated={true}
        />
      </MemoryRouter>,
    );

    // Should now be dashed (no user rating), not golden.
    // Check for border-amber-500/50 (the active golden border class)
    // not just border-amber-500 (which also matches hover:border-amber-500/30).
    button = container.querySelector("button");
    expect(button?.className).toContain("border-dashed");
    expect(button?.className).not.toContain("bg-amber-500");
  });
});

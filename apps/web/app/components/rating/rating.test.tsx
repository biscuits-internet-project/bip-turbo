import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RatingComponent } from "./rating";

describe("RatingComponent", () => {
  // Baseline: an average rating + ratingsCount renders the star, the
  // 2-decimal average, and the count separated by a middle-dot (rather
  // than parens — keeps it tight and reads naturally). No divider, no
  // personal value when userRating is absent.
  test("renders average rating, count, and no divider when userRating is omitted", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} />);

    expect(screen.getByText("4.32")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("·")).toBeInTheDocument();
    expect(screen.queryByText("|")).not.toBeInTheDocument();
    expect(screen.queryByTestId("user-rating-value")).not.toBeInTheDocument();
  });

  // Null userRating (e.g. logged-in but hasn't rated yet) renders today's
  // UI unchanged. We never show a placeholder slot — quieter UI for the
  // common "not rated" case.
  test("renders no divider when userRating is null", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} userRating={null} />);
    expect(screen.queryByText("|")).not.toBeInTheDocument();
  });

  // Zero is treated as "not rated" — same as null. Stars use 1-5, so 0
  // never represents a real rating; treating it as not-rated avoids a
  // misleading "★ 0.00" rendering if a caller forwards a default.
  test("renders no divider when userRating is 0", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} userRating={0} />);
    expect(screen.queryByText("|")).not.toBeInTheDocument();
  });

  // The headline case: a logged-in user who has rated sees their own
  // value to the right of a `|` divider. Whole-number ratings render as
  // a bare integer — no star (one in the row is enough visual weight)
  // and no decimal noise.
  test("renders divider + whole-number userRating as plain integer", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} userRating={5} />);

    expect(screen.getByText("4.32")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("|")).toBeInTheDocument();
    expect(screen.getByTestId("user-rating-value")).toHaveTextContent("5");
    // ".5" / ".0" decimal forms must not appear — the half-step format
    // uses the ½ glyph instead.
    expect(screen.getByTestId("user-rating-value").textContent).not.toMatch(/\./);
  });

  // Half-increment rating (4.5) renders with the ½ glyph instead of a
  // decimal. The rating widget only supports whole and half steps so the
  // typographic fraction reads cleaner than "4.5".
  test("renders half-increment userRating with the ½ glyph", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} userRating={4.5} />);
    expect(screen.getByTestId("user-rating-value")).toHaveTextContent("4½");
  });

  // Edge: a 0.5 rating renders as just "½" with no leading zero. The
  // common case for tracks rated below 1 — keeps the slot compact.
  test("renders 0.5 as just '½' with no leading zero", async () => {
    await setup(<RatingComponent rating={4.32} ratingsCount={12} userRating={0.5} />);
    expect(screen.getByTestId("user-rating-value")).toHaveTextContent("½");
    expect(screen.getByTestId("user-rating-value").textContent).not.toMatch(/0/);
  });
});

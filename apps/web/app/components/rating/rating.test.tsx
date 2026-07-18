import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, test } from "vitest";
import { PreferencesProvider } from "~/hooks/use-preferences";
import { RATING_COLOR_GREEN, RATING_COLOR_PURPLE, ratingColor } from "~/lib/rating-colors";
import { RatingComponent } from "./rating";

/**
 * Mounts under an explicit opt-in. Color coding ships off, so a bare `setup`
 * renders uncolored and every coloring assertion has to opt in first.
 */
const withColorCoding = (ui: ReactElement) =>
  setup(
    <PreferencesProvider colorCodeRatings={true} showSetlistTimes={null}>
      {ui}
    </PreferencesProvider>,
  );

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

  // The whole point of the color scale: a strong show and a weak one must be
  // tellable apart without reading the digits.
  test("colors the average by where it falls on the scale", async () => {
    const { unmount } = await withColorCoding(<RatingComponent rating={5} ratingsCount={12} />);
    expect(screen.getByText("5.00")).toHaveStyle({ color: RATING_COLOR_GREEN });
    unmount();

    await withColorCoding(<RatingComponent rating={0.5} ratingsCount={12} />);
    expect(screen.getByText("0.50")).toHaveStyle({ color: RATING_COLOR_PURPLE });
  });

  // The second half of the point: two differently-colored numbers in one badge
  // is what tells a viewer they disagree with the crowd.
  test("colors the viewer's own rating independently of the average", async () => {
    await withColorCoding(<RatingComponent rating={4.62} ratingsCount={12} userRating={0.5} />);

    expect(screen.getByText("4.62")).toHaveStyle({ color: ratingColor(4.62) });
    expect(screen.getByTestId("user-rating-value")).toHaveStyle({ color: RATING_COLOR_PURPLE });
  });

  // Color coding ships off, so the untouched badge must look exactly as it did
  // before the scale existed.
  test("leaves both values uncolored by default", async () => {
    await setup(<RatingComponent rating={5} ratingsCount={12} userRating={2} />);

    expect(screen.getByText("5.00").style.color).toBe("");
    expect(screen.getByTestId("user-rating-value").style.color).toBe("");
  });

  // The `colorCode` override wins over the saved preference so the settings
  // preview can force the scale on. Here the preference is off (bare setup).
  test("colors values when colorCode={true} overrides a disabled preference", async () => {
    await setup(<RatingComponent rating={1.8} userRating={4.5} colorCode={true} />);
    expect(screen.getByText("1.80")).toHaveStyle({ color: ratingColor(1.8) });
    expect(screen.getByTestId("user-rating-value")).toHaveStyle({ color: ratingColor(4.5) });
  });

  // The other direction: the preview's "off" column forces the scale off even
  // when the viewer has color coding on.
  test("leaves values uncolored when colorCode={false} overrides an enabled preference", async () => {
    await setup(
      <PreferencesProvider colorCodeRatings={true} showSetlistTimes={null}>
        <RatingComponent rating={1.8} userRating={4.5} colorCode={false} />
      </PreferencesProvider>,
    );
    expect(screen.getByText("1.80").style.color).toBe("");
    expect(screen.getByTestId("user-rating-value").style.color).toBe("");
  });

  test("leaves both values uncolored when the viewer opts out", async () => {
    await setup(
      <PreferencesProvider colorCodeRatings={false} showSetlistTimes={null}>
        <RatingComponent rating={5} ratingsCount={12} userRating={2} />
      </PreferencesProvider>,
    );

    expect(screen.getByText("5.00").style.color).toBe("");
    expect(screen.getByTestId("user-rating-value").style.color).toBe("");
  });

  // The gold star is Don's, and it means "rating" regardless of the score —
  // the scale colors the digits only. Checked with coloring on, since that's
  // the only state where the star could be dragged along with the values.
  test("leaves the star gold at both ends of the scale", async () => {
    const { container, unmount } = await withColorCoding(<RatingComponent rating={5} ratingsCount={12} />);
    expect(container.querySelector(".text-rating-gold")).toBeInTheDocument();
    unmount();

    const low = await withColorCoding(<RatingComponent rating={0.5} ratingsCount={12} />);
    expect(low.container.querySelector(".text-rating-gold")).toBeInTheDocument();
  });
});

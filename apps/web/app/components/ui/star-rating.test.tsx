import { setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: { id: "user-1" }, supabase: null, loading: false })),
}));
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useRevalidator: () => ({ revalidate: vi.fn(), state: "idle" }),
  };
});
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueryClient: () => ({ setQueriesData: vi.fn() }),
  };
});

import { StarRating } from "./star-rating";

describe("StarRating clear affordance", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // The clear glyph is only meaningful when the viewer has a rating to
  // clear. With no rating yet, the row is pure stars.
  test("does not render the clear glyph when initialRating is null", async () => {
    await setupWithRouter(
      <StarRating rateableId="track-1" rateableType="Track" showSlug="show-1" initialRating={null} />,
    );
    expect(screen.queryByRole("button", { name: /clear rating/i })).not.toBeInTheDocument();
  });

  // With a rating present, the clear glyph appears to the left of the
  // stars so the viewer can drop their score without picking a new value.
  test("renders the clear glyph when initialRating is set", async () => {
    await setupWithRouter(
      <StarRating rateableId="track-1" rateableType="Track" showSlug="show-1" initialRating={3.5} />,
    );
    expect(screen.getByRole("button", { name: /clear rating/i })).toBeInTheDocument();
  });

  // Clicking the clear glyph sends a DELETE to /api/ratings with the
  // rateable identifier and tells listeners (onRatingChange, onAverage…)
  // about the cleared state so they can collapse the editor and drop the
  // amber chrome.
  test("clicking the clear glyph DELETEs the rating and reports null to listeners", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ userRating: null, averageRating: 4.1, ratingsCount: 7 }),
    });
    globalThis.fetch = fetchMock;
    const onRatingChange = vi.fn();
    const onAverageRatingChange = vi.fn();
    const user = userEvent.setup();

    await setupWithRouter(
      <StarRating
        rateableId="track-1"
        rateableType="Track"
        showSlug="show-1"
        initialRating={3.5}
        onRatingChange={onRatingChange}
        onAverageRatingChange={onAverageRatingChange}
        skipRevalidation
      />,
    );

    await user.click(screen.getByRole("button", { name: /clear rating/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/ratings");
    expect(options.method).toBe("DELETE");
    const body = JSON.parse(options.body);
    expect(body).toEqual({ rateableId: "track-1", rateableType: "Track", showSlug: "show-1" });

    await waitFor(() => expect(onRatingChange).toHaveBeenCalledWith(null));
    expect(onAverageRatingChange).toHaveBeenCalledWith(4.1, 7);
  });
});

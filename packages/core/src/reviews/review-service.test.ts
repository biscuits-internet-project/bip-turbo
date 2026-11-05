import { describe, expect, test, vi } from "vitest";
import { ReviewService } from "./review-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

function makeReviewDb(deleteResult: unknown = { showId: "show-1" }) {
  const row = { id: "review-1", showId: "show-1", content: "Great", user: { id: "user-1" } };
  return {
    review: {
      create: vi.fn().mockResolvedValue(row),
      update: vi.fn().mockResolvedValue(row),
      delete: vi.fn().mockResolvedValue(deleteResult),
    },
    show: { findUnique: vi.fn().mockResolvedValue({ slug: "2024-04-06-red-rocks" }) },
  };
}

describe("ReviewService edge cache invalidation", () => {
  // The show page renders its reviews, and signed-out visitors get it from Cloudflare.
  test.each([
    ["create", (service: ReviewService) => service.create({ content: "Great", showId: "show-1" } as never)],
    ["update", (service: ReviewService) => service.update("review-1", { content: "Better" })],
    ["delete", (service: ReviewService) => service.delete("review-1")],
  ])("%s invalidates the show's page", async (_name, act) => {
    const invalidation = { invalidateShow: vi.fn().mockResolvedValue(undefined) };
    await act(new ReviewService(makeReviewDb() as never, logger, invalidation as never));
    expect(invalidation.invalidateShow).toHaveBeenCalledWith("2024-04-06-red-rocks");
  });

  test("a review with no show invalidates nothing", async () => {
    const invalidation = { invalidateShow: vi.fn().mockResolvedValue(undefined) };
    await new ReviewService(makeReviewDb({ showId: null }) as never, logger, invalidation as never).delete("review-1");
    expect(invalidation.invalidateShow).not.toHaveBeenCalled();
  });
});

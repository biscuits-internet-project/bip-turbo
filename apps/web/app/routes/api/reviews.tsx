import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed, unauthorized } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const showId = url.searchParams.get("showId");

  if (!showId) {
    return badRequest();
  }

  const reviews = await services.reviews.findByShowId(showId);

  // Serialize the reviews with proper date handling
  const serializedReviews = reviews.map((review) => ({
    ...review,
    createdAt: review.createdAt.toISOString(),
  }));

  return new Response(JSON.stringify({ reviews: serializedReviews }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

export const action = protectedAction(async ({ request, params, context }) => {
  const { currentUser } = context;

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { content, showId } = body;

      if (!content || !showId) {
        return badRequest();
      }

      const review = await services.reviews.create({
        content,
        showId,
        userId: currentUser.id,
        status: "published",
      });

      // Get the complete review with user data
      const allReviews = await services.reviews.findByShowId(showId);
      const createdReview = allReviews.find((r) => r.id === review.id);

      if (!createdReview) {
        throw new Error("Failed to fetch created review");
      }

      // Serialize the review with proper date handling
      const serializedReview = {
        ...createdReview,
        createdAt: createdReview.createdAt.toISOString(),
      };

      return { review: serializedReview };
    } catch (error) {
      logger.error("Error creating review:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to create review");
    }
  }

  if (request.method === "DELETE") {
    try {
      const body = await request.json();
      const { id } = body;
      if (!id) return badRequest();

      // Verify the review belongs to the user
      const review = await services.reviews.findById(id);
      if (!review || review.userId !== currentUser.id) {
        return unauthorized();
      }

      await services.reviews.delete(id);
      return new Response(null, { status: 204 });
    } catch (error) {
      logger.error("Error deleting review:", error);
      return new Response(JSON.stringify({ error: "Failed to delete review" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  if (request.method === "PATCH") {
    try {
      const body = await request.json();
      const { id, content } = body;
      if (!id || !content) return badRequest();

      // Verify the review belongs to the user
      const review = await services.reviews.findById(id);
      if (!review || review.userId !== currentUser.id) {
        return unauthorized();
      }

      if (!review.showId) {
        return new Response(JSON.stringify({ error: "Review is not associated with a show" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Update the review
      const updated = await services.reviews.update(id, { content });

      // Serialize the review with proper date handling
      const responseData = {
        review: {
          ...updated,
          createdAt: updated.createdAt.toISOString(),
        },
      };
      return responseData;
    } catch (error) {
      logger.error("Error updating review:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to update review");
    }
  }

  return methodNotAllowed();
});

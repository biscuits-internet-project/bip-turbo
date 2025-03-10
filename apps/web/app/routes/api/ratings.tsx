import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed, unauthorized } from "~/lib/errors";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request, context }) => {
  const { currentUser } = context;

  const url = new URL(request.url);
  const rateableId = url.searchParams.get("rateableId");
  const rateableType = url.searchParams.get("rateableType");

  if (!rateableId || !rateableType) return badRequest();

  let rating = null;
  if (currentUser) {
    rating = await services.ratings.getByRateableIdAndUserId(rateableId, rateableType, currentUser.id);
  }

  const userRating = rating?.value ?? null;
  const averageRating = await services.ratings.getAverageForRateable(rateableId, rateableType);

  return { userRating, averageRating };
});

export const action = protectedAction(async ({ request, context }) => {
  const { currentUser } = context;

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { rateableId, rateableType, value } = body;

      if (!rateableId || !rateableType || !value || value < 1 || value > 5) {
        return badRequest();
      }

      // Create or update the rating
      const updatedRating = await services.ratings.upsert({
        rateableId,
        rateableType,
        userId: currentUser.id,
        value,
      });

      // Get the updated average rating for the show
      const averageRating = await services.ratings.getAverageForRateable(rateableId, rateableType);

      return { userRating: updatedRating.value, averageRating };
    } catch (error) {
      console.error("Error rating rateable:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to rate rateable");
    }
  }

  return methodNotAllowed();
});

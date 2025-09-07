import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request, context }) => {
  const { currentUser } = context;

  const url = new URL(request.url);
  const rateableId = url.searchParams.get("rateableId");
  const rateableType = url.searchParams.get("rateableType");

  if (!rateableId || !rateableType) return badRequest();

  let rating = null;
  if (currentUser) {
    const localUser = await services.users.findByEmail(currentUser.email);
    if (localUser) {
      rating = await services.ratings.getByRateableIdAndUserId(rateableId, rateableType, localUser.id);
    }
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

      if (!rateableId || !rateableType || !value || value < 0.5 || value > 5) {
        return badRequest();
      }

      // Get the actual user from the database
      const user = await services.users.findByEmail(currentUser.email);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Create or update the rating
      const updatedRating = await services.ratings.upsert({
        rateableId,
        rateableType,
        userId: user.id,
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

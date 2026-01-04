import { adminAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const action = adminAction(async ({ request, params, context }) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  const { currentUser } = context;
  const { postId } = params;

  if (!postId) {
    return badRequest("Post ID is required");
  }

  try {
    // Get the actual user from the database
    const user = await services.users.findByEmail(currentUser.email);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await services.moderation.restorePost(postId, user.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Restore post error", { error, postId });

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to restore post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

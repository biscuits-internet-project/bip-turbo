import { z } from "zod";
import { adminAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const reviewFlagSchema = z.object({
  action: z.enum(["dismiss", "hide", "remove"]),
});

export const action = adminAction(async ({ request, params, context }) => {
  if (request.method !== "PATCH") {
    return methodNotAllowed();
  }

  const { currentUser } = context;
  const { id } = params;

  if (!id) {
    return badRequest("Flag ID is required");
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

    const body = await request.json();
    const validated = reviewFlagSchema.parse(body);

    await services.moderation.reviewFlag(id, validated.action, user.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Review flag error", { error, flagId: id });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid request data");
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to review flag" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

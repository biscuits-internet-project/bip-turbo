import { z } from "zod";
import { protectedAction } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const flagPostSchema = z.object({
  postId: z.string().uuid(),
  reason: z.enum(["spam", "harassment", "inappropriate", "misinformation", "other"]),
  description: z.string().optional(),
});

export const action = protectedAction(async ({ request, context }) => {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  const { currentUser } = context;

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
    const validated = flagPostSchema.parse(body);

    await services.moderation.flagPost(validated.postId, user.id, validated.reason, validated.description);

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Flag post error", { error });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid request data");
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to flag post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

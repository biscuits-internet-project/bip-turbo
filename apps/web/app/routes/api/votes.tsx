import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { badRequest } from "~/lib/errors";
import { protectedAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

const voteInputSchema = z.object({
  postId: z.string().uuid(),
  voteType: z.enum(["upvote", "downvote"]),
});

export const action = protectedAction(async ({ request, context }: ActionFunctionArgs) => {
  const { currentUser } = context;

  if (!currentUser) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await services.users.findByEmail(currentUser.email);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { postId, voteType } = voteInputSchema.parse(body);

    const vote = await services.votes.toggleVote(postId, user.id, voteType);

    return new Response(
      JSON.stringify({
        success: true,
        vote: vote
          ? {
              voteType: vote.voteType,
            }
          : null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequest("Invalid input");
    }

    console.error("Error toggling vote:", error);
    return new Response(JSON.stringify({ error: "Failed to toggle vote" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

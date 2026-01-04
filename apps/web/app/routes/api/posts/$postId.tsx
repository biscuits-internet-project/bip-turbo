import type { LoaderFunctionArgs } from "react-router";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ params, context }: LoaderFunctionArgs) => {
  const { postId } = params;

  if (!postId) {
    return new Response(JSON.stringify({ error: "Post ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    let viewerId: string | undefined;
    if (context.currentUser) {
      const user = await services.users.findByEmail(context.currentUser.email);
      viewerId = user?.id;
    }
    const thread = await services.posts.getThread(postId, viewerId);

    return new Response(JSON.stringify(thread), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error("Error fetching post thread", { error, postId });

    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to fetch post thread" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

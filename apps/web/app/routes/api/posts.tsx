import type { PostWithUser } from "@bip/domain";
import { z } from "zod";
import { protectedAction, publicLoader } from "~/lib/base-loaders";
import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const feedSchema = z.object({
  sort: z.enum(["chronological", "hot"]).optional().default("chronological"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

const createPostSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional(),
  quotedPostId: z.string().uuid().optional(),
  mediaUrl: z.string().optional(),
  mediaType: z.enum(["cloudflare_image", "giphy"]).optional(),
});

const editPostSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

const deletePostSchema = z.object({
  postId: z.string().uuid(),
});

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  const params = {
    sort: url.searchParams.get("sort") || "chronological",
    cursor: url.searchParams.get("cursor") || undefined,
    limit: url.searchParams.get("limit") || "20",
  };

  try {
    const validated = feedSchema.parse(params);
    let viewerId: string | undefined;

    if (context.currentUser) {
      const user = await services.users.findByEmail(context.currentUser.email);
      viewerId = user?.id;
    }

    const posts = await services.posts.getFeed({
      ...validated,
      userId: viewerId,
    });

    // Get next cursor from last post
    const nextCursor = posts.length > 0 ? posts[posts.length - 1].createdAt.toISOString() : undefined;

    return new Response(
      JSON.stringify({
        posts,
        nextCursor,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    logger.error("Error fetching posts feed", { error });
    if (error instanceof z.ZodError) {
      return badRequest("Invalid query parameters");
    }
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

export const action = protectedAction(async ({ request, context }) => {
  const { currentUser } = context;

  // Get the actual user from the database
  const user = await services.users.findByEmail(currentUser.email);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    if (request.method === "POST") {
      const body = await request.json();
      const validated = createPostSchema.parse(body);

      // Decide which method to call based on input
      let post: PostWithUser;
      if (validated.parentId) {
        post = await services.posts.replyToPost({
          parentId: validated.parentId,
          userId: user.id,
          content: validated.content,
          mediaUrl: validated.mediaUrl,
          mediaType: validated.mediaType,
        });
      } else if (validated.quotedPostId) {
        post = await services.posts.quotePost({
          quotedPostId: validated.quotedPostId,
          userId: user.id,
          content: validated.content,
          mediaUrl: validated.mediaUrl,
          mediaType: validated.mediaType,
        });
      } else {
        post = await services.posts.createPost({
          userId: user.id,
          content: validated.content,
          mediaUrl: validated.mediaUrl,
          mediaType: validated.mediaType,
        });
      }

      return new Response(JSON.stringify(post), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "PATCH") {
      const body = await request.json();
      const validated = editPostSchema.parse(body);

      const post = await services.posts.editPost(validated.postId, user.id, validated.content);

      return new Response(JSON.stringify(post), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "DELETE") {
      const body = await request.json();
      const validated = deletePostSchema.parse(body);

      await services.posts.deletePost(validated.postId, user.id);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return methodNotAllowed();
  } catch (error) {
    logger.error("Posts API error", { error, method: request.method });

    if (error instanceof z.ZodError) {
      return badRequest("Invalid request data");
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Operation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

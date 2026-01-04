import type { PostFeedItem, PostWithUser } from "@bip/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifyClientError, trackClientSubmit } from "~/lib/honeybadger.client";

// Create a new top-level post
async function createPost(content: string, mediaUrl?: string): Promise<PostWithUser> {
  trackClientSubmit("post:create", {
    hasMedia: Boolean(mediaUrl),
  });
  let response: Response;
  try {
    response = await fetch("/api/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, mediaUrl }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "create-post",
        hasMedia: Boolean(mediaUrl),
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to create post");
    notifyClientError(error, {
      context: {
        action: "create-post",
        hasMedia: Boolean(mediaUrl),
        status: response.status,
      },
    });
    throw error;
  }

  return response.json();
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content, mediaUrl }: { content: string; mediaUrl?: string }) => createPost(content, mediaUrl),
    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
    },
    onSuccess: (newPost) => {
      // Prepend the new post to all feed queries
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    posts: [newPost as PostFeedItem, ...page.posts],
                  }
                : page,
            ),
          };
        },
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

// Reply to a post
async function replyToPost(parentId: string, content: string, mediaUrl?: string): Promise<PostWithUser> {
  trackClientSubmit("post:reply", {
    parentId,
    hasMedia: Boolean(mediaUrl),
  });
  let response: Response;
  try {
    response = await fetch("/api/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, parentId, mediaUrl }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "reply-post",
        parentId,
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to reply to post");
    notifyClientError(error, {
      context: {
        action: "reply-post",
        parentId,
        status: response.status,
      },
    });
    throw error;
  }

  return response.json();
}

export function useReplyToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ parentId, content, mediaUrl }: { parentId: string; content: string; mediaUrl?: string }) =>
      replyToPost(parentId, content, mediaUrl),
    onMutate: async ({ parentId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts", "thread", parentId] });
    },
    onSuccess: (newReply, { parentId }) => {
      // Add the reply to the thread
      queryClient.setQueryData<{ post: PostWithUser; replies: PostWithUser[] }>(
        ["posts", "thread", parentId],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            replies: [...oldData.replies, newReply],
          };
        },
      );

      // Update reply count in feed
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === parentId ? { ...post, replyCount: post.replyCount + 1 } : post,
              ),
            })),
          };
        },
      );

      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["posts", "thread", parentId] });
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

// Quote a post
async function quotePost(quotedPostId: string, content: string, mediaUrl?: string): Promise<PostWithUser> {
  trackClientSubmit("post:quote", {
    quotedPostId,
    hasMedia: Boolean(mediaUrl),
  });
  let response: Response;
  try {
    response = await fetch("/api/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, quotedPostId, mediaUrl }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "quote-post",
        quotedPostId,
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to quote post");
    notifyClientError(error, {
      context: {
        action: "quote-post",
        quotedPostId,
        status: response.status,
      },
    });
    throw error;
  }

  return response.json();
}

export function useQuotePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quotedPostId, content, mediaUrl }: { quotedPostId: string; content: string; mediaUrl?: string }) =>
      quotePost(quotedPostId, content, mediaUrl),
    onMutate: async () => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
    },
    onSuccess: (newPost) => {
      // Prepend the new quote post to all feed queries
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    posts: [newPost as PostFeedItem, ...page.posts],
                  }
                : page,
            ),
          };
        },
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

// Edit a post
async function editPost(postId: string, content: string): Promise<PostWithUser> {
  trackClientSubmit("post:edit", { postId });
  let response: Response;
  try {
    response = await fetch("/api/posts", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "edit-post",
        postId,
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to edit post");
    notifyClientError(error, {
      context: {
        action: "edit-post",
        postId,
        status: response.status,
      },
    });
    throw error;
  }

  return response.json();
}

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => editPost(postId, content),
    onMutate: async ({ postId, content }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous data
      const previousFeedData = queryClient.getQueriesData({ queryKey: ["posts", "feed"] });
      const previousThreadData = queryClient.getQueriesData({ queryKey: ["posts", "thread"] });

      // Optimistically update feed
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => (post.id === postId ? { ...post, content, editedAt: new Date() } : post)),
            })),
          };
        },
      );

      // Optimistically update thread queries
      queryClient.setQueriesData<{ post: PostWithUser; replies: PostWithUser[] }>(
        { queryKey: ["posts", "thread"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            post: oldData.post.id === postId ? { ...oldData.post, content, editedAt: new Date() } : oldData.post,
            replies: oldData.replies.map((reply) =>
              reply.id === postId ? { ...reply, content, editedAt: new Date() } : reply,
            ),
          };
        },
      );

      return { previousFeedData, previousThreadData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFeedData) {
        for (const [queryKey, data] of context.previousFeedData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      if (context?.previousThreadData) {
        for (const [queryKey, data] of context.previousThreadData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSuccess: (updatedPost) => {
      // Update with actual result
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) => (post.id === updatedPost.id ? (updatedPost as PostFeedItem) : post)),
            })),
          };
        },
      );

      queryClient.setQueriesData<{ post: PostWithUser; replies: PostWithUser[] }>(
        { queryKey: ["posts", "thread"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            post: oldData.post.id === updatedPost.id ? updatedPost : oldData.post,
            replies: oldData.replies.map((reply) => (reply.id === updatedPost.id ? updatedPost : reply)),
          };
        },
      );
    },
  });
}

// Delete a post
async function deletePost(postId: string): Promise<void> {
  trackClientSubmit("post:delete", { postId });
  let response: Response;
  try {
    response = await fetch("/api/posts", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "delete-post",
        postId,
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to delete post");
    notifyClientError(error, {
      context: {
        action: "delete-post",
        postId,
        status: response.status,
      },
    });
    throw error;
  }
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost(postId),
    onMutate: async ({ postId }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous data
      const previousFeedData = queryClient.getQueriesData({ queryKey: ["posts", "feed"] });
      const previousThreadData = queryClient.getQueriesData({ queryKey: ["posts", "thread"] });

      // Optimistically remove from feed
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.id !== postId),
            })),
          };
        },
      );

      // Optimistically remove from thread queries
      queryClient.setQueriesData<{ post: PostWithUser; replies: PostWithUser[] }>(
        { queryKey: ["posts", "thread"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            replies: oldData.replies.filter((reply) => reply.id !== postId),
          };
        },
      );

      return { previousFeedData, previousThreadData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFeedData) {
        for (const [queryKey, data] of context.previousFeedData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      if (context?.previousThreadData) {
        for (const [queryKey, data] of context.previousThreadData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSuccess: () => {
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "thread"] });
    },
  });
}

// Toggle reaction on a post
async function toggleReaction(
  postId: string,
  emojiCode: string,
): Promise<{ action: "added" | "removed"; reactionCount: number }> {
  trackClientSubmit("reaction:toggle", { postId, emojiCode });
  let response: Response;
  try {
    response = await fetch("/api/reactions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, emojiCode }),
    });
  } catch (error) {
    notifyClientError(error, {
      context: {
        action: "toggle-reaction",
        postId,
        emojiCode,
      },
    });
    throw error;
  }

  if (!response.ok) {
    const error = new Error("Failed to toggle reaction");
    notifyClientError(error, {
      context: {
        action: "toggle-reaction",
        postId,
        emojiCode,
        status: response.status,
      },
    });
    throw error;
  }

  return response.json();
}

export function useToggleReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, emojiCode }: { postId: string; emojiCode: string }) => toggleReaction(postId, emojiCode),
    onMutate: async ({ postId: _postId }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot previous data
      const previousFeedData = queryClient.getQueriesData({ queryKey: ["posts", "feed"] });
      const previousThreadData = queryClient.getQueriesData({ queryKey: ["posts", "thread"] });

      return { previousFeedData, previousThreadData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousFeedData) {
        for (const [queryKey, data] of context.previousFeedData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      if (context?.previousThreadData) {
        for (const [queryKey, data] of context.previousThreadData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSuccess: (result, { postId }) => {
      // Update reaction count in feed
      queryClient.setQueriesData<{ pages: Array<{ posts: PostFeedItem[]; nextCursor?: string }> }>(
        { queryKey: ["posts", "feed"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === postId ? { ...post, reactionCount: result.reactionCount } : post,
              ),
            })),
          };
        },
      );

      // Update reaction count in thread
      queryClient.setQueriesData<{ post: PostWithUser; replies: PostWithUser[] }>(
        { queryKey: ["posts", "thread"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            post: oldData.post.id === postId ? { ...oldData.post, reactionCount: result.reactionCount } : oldData.post,
            replies: oldData.replies.map((reply) =>
              reply.id === postId ? { ...reply, reactionCount: result.reactionCount } : reply,
            ),
          };
        },
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "thread", postId] });
    },
  });
}

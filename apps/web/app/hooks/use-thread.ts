import type { PostWithUser } from "@bip/domain";
import { useQuery } from "@tanstack/react-query";

interface ThreadResponse {
  post: PostWithUser;
  replies: PostWithUser[];
}

async function fetchThread(postId: string): Promise<ThreadResponse> {
  const response = await fetch(`/api/posts/${postId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch post thread");
  }

  return response.json();
}

export function useThread(postId: string) {
  return useQuery({
    queryKey: ["posts", "thread", postId],
    queryFn: () => fetchThread(postId),
    enabled: !!postId,
    staleTime: 30_000, // 30 seconds
  });
}

import type { PostFeedItem } from "@bip/domain";
import { useInfiniteQuery } from "@tanstack/react-query";

interface FeedResponse {
  posts: PostFeedItem[];
  nextCursor?: string;
}

interface UseFeedOptions {
  sort?: "chronological" | "hot";
  limit?: number;
}

async function fetchFeed(sort: "chronological" | "hot", limit: number, cursor?: string): Promise<FeedResponse> {
  const params = new URLSearchParams({
    sort,
    limit: limit.toString(),
  });

  if (cursor) {
    params.append("cursor", cursor);
  }

  const response = await fetch(`/api/posts?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts feed");
  }

  return response.json();
}

export function useFeed({ sort = "chronological", limit = 20 }: UseFeedOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["posts", "feed", sort],
    queryFn: ({ pageParam }) => fetchFeed(sort, limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30_000, // 30 seconds
  });
}

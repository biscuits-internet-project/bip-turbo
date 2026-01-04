import type { PostFeedItem } from "@bip/domain";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BoardCard } from "~/components/board/board-card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useFeed } from "~/hooks/use-feed";

interface BoardStreamProps {
  currentUserId?: string;
}

export function BoardStream({ currentUserId }: BoardStreamProps) {
  const [sort, setSort] = useState<"hot" | "new">("hot");

  // Map "new" to "chronological" for the API
  const apiSort = sort === "new" ? "chronological" : "hot";
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed({
    sort: apiSort as "chronological" | "hot",
    limit: 20,
  });

  // Get all posts
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const skeletonPlaceholders = ["board-skeleton-1", "board-skeleton-2", "board-skeleton-3"];

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-content-text-secondary">Failed to load posts. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sort Toggle */}
      <div className="flex items-center gap-2 p-2 bg-glass-content rounded-lg border border-glass-border">
        <span className="text-sm text-content-text-secondary mr-2">Sort by:</span>
        <Button
          variant={sort === "hot" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("hot")}
          className={sort === "hot" ? "btn-primary" : "text-content-text-secondary hover:text-brand-primary"}
        >
          🔥 Hot
        </Button>
        <Button
          variant={sort === "new" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("new")}
          className={sort === "new" ? "btn-primary" : "text-content-text-secondary hover:text-brand-primary"}
        >
          🆕 New
        </Button>
        <Button variant="ghost" size="sm" disabled className="text-content-text-secondary" title="Coming soon">
          ⬆️ Top
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {skeletonPlaceholders.map((key) => (
            <div key={key} className="card-premium p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts List */}
      {!isLoading && allPosts.length > 0 && (
        <div className="space-y-3">
          {allPosts.map((post: PostFeedItem) => (
            <BoardCard key={post.id} post={post} currentUserId={currentUserId} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && allPosts.length === 0 && (
        <div className="text-center py-12 card-premium">
          <p className="text-content-text-primary text-lg font-semibold mb-2">No posts yet</p>
          <p className="text-content-text-secondary text-sm">Be the first to start a discussion!</p>
        </div>
      )}

      {/* Load More Trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-content-text-secondary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more posts...</span>
            </div>
          )}
        </div>
      )}

      {/* End of Feed */}
      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-content-text-secondary text-sm">You've reached the end!</p>
        </div>
      )}
    </div>
  );
}

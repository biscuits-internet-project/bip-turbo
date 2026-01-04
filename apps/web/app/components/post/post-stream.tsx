import type { PostFeedItem, PostWithUser } from "@bip/domain";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PostCard } from "~/components/post/post-card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useFeed } from "~/hooks/use-feed";
// import { usePostReactions } from "~/hooks/use-post-reactions"; // Temporarily disabled

interface PostStreamProps {
  currentUserId?: string;
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
}

export function PostStream({ currentUserId, currentUser }: PostStreamProps) {
  const [sort, setSort] = useState<"chronological" | "hot">("chronological");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useFeed({
    sort,
    limit: 20,
  });

  // Get all posts
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  // TODO: Reactions temporarily disabled - we're using votes for the board instead
  // const postIds = useMemo(() => allPosts.map((p) => p.id), [allPosts]);
  // const { data: reactionsData } = usePostReactions(postIds);

  // Merge reactions into posts
  // const postsWithReactions = useMemo(() => {
  //   if (!reactionsData) return allPosts;
  //   return allPosts.map((post) => {
  //     const reactions = reactionsData[post.id];
  //     if (!reactions) return post;
  //     return {
  //       ...post,
  //       reactionsByEmoji: reactions.reactionsByEmoji,
  //       userReactions: reactions.userReactions,
  //     };
  //   });
  // }, [allPosts, reactionsData]);

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

  const skeletonPlaceholders = ["feed-skeleton-1", "feed-skeleton-2", "feed-skeleton-3"];

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
      <div className="flex justify-center gap-2 p-2 bg-glass-content rounded-lg border border-glass-border">
        <Button
          variant={sort === "chronological" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("chronological")}
          className={sort === "chronological" ? "btn-primary" : "text-content-text-secondary hover:text-brand-primary"}
        >
          Latest
        </Button>
        <Button
          variant={sort === "hot" ? "default" : "ghost"}
          size="sm"
          onClick={() => setSort("hot")}
          className={sort === "hot" ? "btn-primary" : "text-content-text-secondary hover:text-brand-primary"}
        >
          Hot
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {skeletonPlaceholders.map((key) => (
            <div key={key} className="card-premium p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Posts List */}
      {!isLoading &&
        allPosts.length > 0 &&
        allPosts.map((post: PostFeedItem) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            currentUser={currentUser}
            variant="stream"
          />
        ))}

      {/* Empty State */}
      {!isLoading && allPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-content-text-secondary text-lg">No posts yet</p>
          <p className="text-content-text-secondary text-sm mt-2">Be the first to share something!</p>
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

import { ArrowLeft, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { PostCard } from "~/components/post/post-card";
import { PostComposer } from "~/components/post/post-composer";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useThread } from "~/hooks/use-thread";
// import { usePostReactions } from "~/hooks/use-post-reactions"; // Temporarily disabled

interface ThreadViewProps {
  postId: string;
  currentUserId?: string;
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
}

export function ThreadView({ postId, currentUserId, currentUser }: ThreadViewProps) {
  const { data, isLoading, isError } = useThread(postId);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  // TODO: Reactions temporarily disabled - we're using votes for the board instead
  // Fetch reactions for main post and all replies
  // const postIds = useMemo(() => {
  //   if (!data) return [];
  //   return [data.post.id, ...data.replies.map((r) => r.id)];
  // }, [data]);
  // const { data: reactionsData } = usePostReactions(postIds);

  // Merge reactions into posts
  // const postWithReactions = useMemo(() => {
  //   if (!data || !reactionsData) return data?.post;
  //   const reactions = reactionsData[data.post.id];
  //   if (!reactions) return data.post;
  //   return {
  //     ...data.post,
  //     reactionsByEmoji: reactions.reactionsByEmoji,
  //     userReactions: reactions.userReactions,
  //   };
  // }, [data, reactionsData]);

  // const repliesWithReactions = useMemo(() => {
  //   if (!data || !reactionsData) return data?.replies || [];
  //   return data.replies.map((reply) => {
  //     const reactions = reactionsData[reply.id];
  //     if (!reactions) return reply;
  //     return {
  //       ...reply,
  //       reactionsByEmoji: reactions.reactionsByEmoji,
  //       userReactions: reactions.userReactions,
  //     };
  //   });
  // }, [data, reactionsData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Main post skeleton */}
        <div className="card-premium p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Replies skeleton */}
        {["thread-skeleton-1", "thread-skeleton-2", "thread-skeleton-3"].map((key) => (
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
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-content-text-secondary text-lg">Failed to load post</p>
        <Link to="/feed">
          <Button variant="ghost" className="mt-4 text-brand-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Button>
        </Link>
      </div>
    );
  }

  if (!data.post) return null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link to="/feed">
          <Button variant="ghost" size="sm" className="text-content-text-secondary hover:text-brand-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to feed
          </Button>
        </Link>
      </div>

      {/* Main Post */}
      <PostCard post={data.post} currentUserId={currentUserId} currentUser={currentUser} variant="thread" />

      {/* Reply Composer */}
      <div className="pl-4 border-l-2 border-glass-border/50">
        {showReplyComposer ? (
          <PostComposer
            mode="reply"
            currentUser={currentUser}
            parentPost={data.post}
            onSuccess={() => setShowReplyComposer(false)}
            onCancel={() => setShowReplyComposer(false)}
          />
        ) : (
          <Button
            variant="ghost"
            onClick={() => setShowReplyComposer(true)}
            className="w-full justify-start text-content-text-secondary hover:text-brand-primary hover:bg-glass-content/50 py-6"
          >
            <MessageCircle className="h-5 w-5 mr-3" />
            Write a reply...
          </Button>
        )}
      </div>

      {/* Replies Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-content-text-secondary" />
          <h3 className="text-lg font-semibold text-content-text-primary">
            {data.replies.length} {data.replies.length === 1 ? "Reply" : "Replies"}
          </h3>
        </div>

        {data.replies.length === 0 ? (
          <div className="text-center py-8 bg-glass-content/30 rounded-lg border border-glass-border/50">
            <p className="text-content-text-secondary">No replies yet</p>
            <p className="text-content-text-secondary text-sm mt-2">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4 pl-4 border-l-2 border-glass-border/50">
            {data.replies.map((reply) => (
              <PostCard
                key={reply.id}
                post={reply}
                currentUserId={currentUserId}
                currentUser={currentUser}
                variant="thread"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

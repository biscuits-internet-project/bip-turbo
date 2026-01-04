import type { PostFeedItem, PostWithUser } from "@bip/domain";
import { format, formatDistanceToNow } from "date-fns";
import { MessageCircle, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { VoteButtons } from "~/components/board/vote-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useDeletePost } from "~/hooks/use-post-mutations";

interface BoardCardProps {
  post: PostFeedItem | PostWithUser;
  currentUserId?: string;
  variant?: "stream" | "detail";
}

export function BoardCard({ post, currentUserId, variant = "stream" }: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteMutation = useDeletePost();

  const isOwner = currentUserId === post.userId;
  const isDeleted = post.isDeleted;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ postId: post.id });
      toast.success("Post deleted");
      setShowDeleteDialog(false);
    } catch (_error) {
      toast.error("Failed to delete post");
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const fullDate = format(new Date(post.createdAt), "MMMM d, yyyy 'at' h:mm a");

  // Use the proper title field (or fallback to first line of content if no title)
  const title = post.title || post.content?.split("\n")[0] || "[No title]";
  const description = post.content || "";

  // Generate a consistent mock vote score based on post ID
  // This way the score stays the same across re-renders
  const mockVoteScore = Math.floor(
    ((parseInt(post.id.split("-")[1] || "0", 10) * 13 + post.replyCount * 3) % 200) - 20,
  );

  return (
    <>
      <Card className="card-premium overflow-hidden hover:border-glass-border/70 transition-colors">
        <CardContent className="p-4">
          {/* Header: Author + Timestamp */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link to={`/users/${post.user.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.user.avatarUrl || undefined} alt={post.user.username} />
                  <AvatarFallback className="text-sm">{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link
                  to={`/users/${post.user.username}`}
                  className="text-sm font-medium text-content-text-primary hover:underline"
                >
                  {post.user.username}
                </Link>
                <div className="text-xs text-content-text-secondary">
                  <span title={fullDate}>{timeAgo}</span>
                  {post.editedAt && <span className="ml-1">· edited</span>}
                </div>
              </div>
            </div>

            {/* Options menu */}
            {isOwner && !isDeleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-content-text-secondary hover:text-brand-primary"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/board/${post.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit post
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Title - Large and prominent */}
          <Link to={`/board/${post.id}`} className="block group">
            <h2 className="text-xl font-bold text-content-text-primary mb-2 group-hover:text-brand-primary transition-colors leading-tight">
              {isDeleted ? "[deleted]" : title}
            </h2>

            {/* Description/Body preview */}
            {!isDeleted && description && (
              <p className="text-sm text-content-text-secondary line-clamp-3 mb-3">{description}</p>
            )}

            {/* Media preview */}
            {!isDeleted && post.mediaUrl && (
              <div className="mb-3 rounded-lg overflow-hidden max-h-[400px]">
                <img src={post.mediaUrl} alt="Post media" className="w-full h-full object-cover" />
              </div>
            )}
          </Link>

          {/* Bottom actions: Voting + Comments + Share */}
          {!isDeleted && (
            <div className="flex items-center gap-1 pt-2 border-t border-glass-border/30">
              {/* Vote buttons */}
              <div className="mr-2">
                <VoteButtons
                  postId={post.id}
                  currentUserId={currentUserId}
                  voteScore={mockVoteScore}
                  userVote={null} // TODO: Add real user vote
                  orientation="horizontal"
                  size="sm"
                />
              </div>

              {/* Comments */}
              <Link
                to={`/board/${post.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-glass-content/50 text-content-text-secondary hover:text-brand-primary transition-colors text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.replyCount}</span>
              </Link>

              {/* Award placeholder (can add later) */}
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-glass-content/50 text-content-text-secondary hover:text-brand-primary transition-colors text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Awards coming soon!");
                }}
              >
                🏆
              </button>

              {/* Share */}
              <button
                className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-glass-content/50 text-content-text-secondary hover:text-brand-primary transition-colors text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `${window.location.origin}/board/${post.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
}

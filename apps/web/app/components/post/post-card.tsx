import type { PostFeedItem, PostWithUser } from "@bip/domain";
import { format, formatDistanceToNow } from "date-fns";
import { MessageCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router";
import { toast } from "sonner";
import { PostComposer } from "~/components/post/post-composer";
// import { ReactionPicker } from "~/components/post/reaction-picker"; // Temporarily disabled
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
import { Textarea } from "~/components/ui/textarea";
import { useDeletePost, useEditPost } from "~/hooks/use-post-mutations";

interface PostCardProps {
  post: PostFeedItem | PostWithUser;
  currentUserId?: string;
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
  variant?: "stream" | "thread" | "quoted";
}

export function PostCard({ post, currentUserId, currentUser, variant = "stream" }: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  const editMutation = useEditPost();
  const deleteMutation = useDeletePost();

  const isOwner = currentUserId === post.userId;
  const isDeleted = post.isDeleted;
  const isQuoted = variant === "quoted";

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === (post.content || "")) {
      setIsEditing(false);
      return;
    }

    try {
      await editMutation.mutateAsync({ postId: post.id, content: editContent });
      setIsEditing(false);
      toast.success("Post updated");
    } catch (_error) {
      toast.error("Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ postId: post.id });
      toast.success("Post deleted");
      setShowDeleteDialog(false);
    } catch (_error) {
      toast.error("Failed to delete post");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content || "");
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const fullDate = format(new Date(post.createdAt), "MMMM d, yyyy 'at' h:mm a");

  // Render as quoted preview
  if (isQuoted) {
    return (
      <Link
        to={`/post/${post.id}`}
        className="block border-l-4 border-glass-border bg-glass-content/30 p-3 rounded hover:bg-glass-content/50 transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.avatarUrl || undefined} alt={post.user.username} />
            <AvatarFallback className="text-xs">{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-content-text-primary">{post.user.username}</span>
        </div>
        <div className="text-sm text-content-text-secondary line-clamp-3">{isDeleted ? "[deleted]" : post.content}</div>
      </Link>
    );
  }

  return (
    <>
      <Card className="card-premium overflow-hidden">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <Link to={`/users/${post.user.username}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user.avatarUrl || undefined} alt={post.user.username} />
                <AvatarFallback className="glass-content text-brand-primary font-medium">
                  {post.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/users/${post.user.username}`}
                    className="font-semibold text-content-text-primary hover:underline"
                  >
                    {post.user.username}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-content-text-secondary">
                    <span title={fullDate}>{timeAgo}</span>
                    {post.editedAt && <span>· Edited</span>}
                  </div>
                </div>

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
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit post
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-500">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mb-3">
            {isEditing ? (
              <div className="space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px] glass-content border-glass-border text-content-text-primary"
                  maxLength={1000}
                  disabled={editMutation.isPending}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-content-text-secondary">{editContent.length}/1000</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit} disabled={editMutation.isPending}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleEdit}
                      disabled={editMutation.isPending || !editContent.trim()}
                      className="btn-primary"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none text-content-text-primary">
                  {isDeleted ? (
                    <p className="text-content-text-secondary italic">[deleted]</p>
                  ) : (
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                  )}
                </div>

                {/* Media */}
                {!isDeleted && post.mediaUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      className="w-full max-h-[500px] object-contain bg-glass-content"
                    />
                  </div>
                )}

                {/* Quoted Post */}
                {!isDeleted && post.quotedPostId && post.quotedContentSnapshot && (
                  <div className="mt-3">
                    <PostCard
                      post={{
                        id: post.quotedPostId,
                        content: post.quotedContentSnapshot,
                        // @ts-expect-error - Simplified quoted post data
                        user: { username: "quoted user", avatarUrl: null },
                        userId: "",
                        isDeleted: false,
                        editedAt: null,
                        replyCount: 0,
                        reactionCount: 0,
                        createdAt: post.createdAt,
                      }}
                      variant="quoted"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Reaction counts and replies link - Facebook style */}
          {/* TODO: Reactions temporarily disabled - we're using votes for the board instead */}
          {!isDeleted && post.replyCount > 0 && (
            <div className="flex items-center justify-between py-2 px-1 text-sm text-content-text-secondary">
              {/* Right: Comment count */}
              {post.replyCount > 0 && (
                <Link to={`/post/${post.id}`} className="hover:underline hover:text-brand-primary">
                  {post.replyCount} {post.replyCount === 1 ? "comment" : "comments"}
                </Link>
              )}
            </div>
          )}

          {/* Action buttons - Facebook style */}
          {!isDeleted && !isEditing && (
            <div className="border-t border-glass-border/50 pt-1">
              <div className="flex items-center justify-around gap-1">
                {/* TODO: ReactionPicker temporarily disabled - we're using votes for the board instead */}
                {/* <ReactionPicker
                  postId={post.id}
                  currentUserId={currentUserId}
                /> */}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowReplyComposer(!showReplyComposer)}
                  className="flex-1 text-content-text-secondary hover:bg-glass-content/50 rounded-lg h-10"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inline Reply Composer - only show in stream view */}
      {showReplyComposer && currentUser && variant === "stream" && (
        <div className="ml-12 mt-2">
          <PostComposer
            mode="reply"
            currentUser={currentUser}
            parentPost={post}
            inline
            onSuccess={() => setShowReplyComposer(false)}
            onCancel={() => setShowReplyComposer(false)}
          />
        </div>
      )}

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

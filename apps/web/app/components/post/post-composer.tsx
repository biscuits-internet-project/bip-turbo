import { zodResolver } from "@hookform/resolvers/zod";
import type { PostFeedItem, PostWithUser } from "@bip/domain";
import { Image, Smile, X } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PostCard } from "~/components/post/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useCreatePost, useQuotePost, useReplyToPost } from "~/hooks/use-post-mutations";

const postFormSchema = z.object({
  content: z.string().min(1, "Post content is required").max(1000, "Post is too long"),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostComposerProps {
  mode: "new" | "reply" | "quote";
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
  parentPost?: PostWithUser | PostFeedItem;
  quotedPost?: PostWithUser | PostFeedItem;
  initialContent?: string;
  inline?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostComposer({
  mode,
  currentUser,
  parentPost,
  quotedPost,
  initialContent = "",
  inline = false,
  onSuccess,
  onCancel,
}: PostComposerProps) {
  const [mediaUrl, setMediaUrl] = useState<string>("");

  const createMutation = useCreatePost();
  const replyMutation = useReplyToPost();
  const quoteMutation = useQuotePost();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: initialContent,
    },
  });

  const content = form.watch("content");
  const charCount = content.length;
  const charCountColor = charCount > 900 ? "text-red-500" : charCount > 700 ? "text-yellow-500" : "text-green-500";

  const handleSubmit = async (data: PostFormValues) => {
    try {
      if (mode === "reply" && parentPost) {
        await replyMutation.mutateAsync({
          parentId: parentPost.id,
          content: data.content,
          mediaUrl: mediaUrl || undefined,
        });
        toast.success("Reply posted");
      } else if (mode === "quote" && quotedPost) {
        await quoteMutation.mutateAsync({
          quotedPostId: quotedPost.id,
          content: data.content,
          mediaUrl: mediaUrl || undefined,
        });
        toast.success("Quote posted");
      } else {
        await createMutation.mutateAsync({
          content: data.content,
          mediaUrl: mediaUrl || undefined,
        });
        toast.success("Post created");
      }

      form.reset();
      setMediaUrl("");
      onSuccess?.();
    } catch (_error) {
      toast.error("Failed to create post");
    }
  };

  const handleCancel = () => {
    form.reset();
    setMediaUrl("");
    onCancel?.();
  };

  const isPending = createMutation.isPending || replyMutation.isPending || quoteMutation.isPending;

  const getTitle = () => {
    if (mode === "reply") return "Write a reply";
    if (mode === "quote") return "Quote this post";
    return "Create a post";
  };

  // Inline compact version for Facebook-style inline replies
  if (inline) {
    return (
      <div className="space-y-3">
        {/* Small parent post preview for replies */}
        {mode === "reply" && parentPost && (
          <div className="text-xs text-content-text-secondary flex items-center gap-1.5">
            <span>Replying to</span>
            <span className="font-medium text-content-text-primary">{parentPost.user.username}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            {/* User Avatar + Textarea */}
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={currentUser?.avatarUrl || undefined} alt={currentUser?.username} />
                <AvatarFallback className="glass-content text-brand-primary font-medium text-xs">
                  {currentUser?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }: { field: ControllerRenderProps<PostFormValues, "content"> }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={mode === "reply" ? "Write a reply..." : "What's on your mind?"}
                          {...field}
                          className="glass-content border-glass-border text-content-text-primary min-h-[80px] resize-none text-sm"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Character Count */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${charCountColor}`}>{charCount}/1000</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isPending}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isPending || !content.trim()}
                      className="btn-primary h-7 text-xs"
                    >
                      {isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Full version for dialogs/main composer
  return (
    <Card className="card-premium">
      <CardHeader className="border-b border-glass-border/50">
        <CardTitle className="text-lg text-content-text-primary">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {/* Parent/Quoted Post Preview */}
        {mode === "reply" && parentPost && (
          <div className="mb-4 p-3 bg-glass-content/30 rounded-lg border border-glass-border/50">
            <p className="text-sm text-content-text-secondary mb-2">Replying to:</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={parentPost.user.avatarUrl || undefined} alt={parentPost.user.username} />
                <AvatarFallback className="text-xs">{parentPost.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-content-text-primary">{parentPost.user.username}</span>
            </div>
            <p className="text-sm text-content-text-secondary mt-2 line-clamp-2">{parentPost.content}</p>
          </div>
        )}

        {mode === "quote" && quotedPost && (
          <div className="mb-4">
            <PostCard post={quotedPost} variant="quoted" />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* User Avatar + Textarea */}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={currentUser?.avatarUrl || undefined} alt={currentUser?.username} />
                <AvatarFallback className="glass-content text-brand-primary font-medium">
                  {currentUser?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }: { field: ControllerRenderProps<PostFormValues, "content"> }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="What's on your mind?"
                          {...field}
                          className="glass-content border-glass-border text-content-text-primary min-h-[100px] resize-none"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Character Count */}
            <div className="flex justify-end">
              <span className={`text-sm font-medium ${charCountColor}`}>{charCount}/1000</span>
            </div>

            {/* Media Preview */}
            {mediaUrl && (
              <div className="relative rounded-lg overflow-hidden border border-glass-border">
                <img
                  src={mediaUrl}
                  alt="Media preview"
                  className="w-full max-h-[300px] object-contain bg-glass-content"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-glass-content hover:bg-glass-content/80"
                  onClick={() => setMediaUrl("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-glass-border/50">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  className="text-content-text-secondary hover:text-brand-primary"
                  onClick={() => {
                    // TODO: Implement image upload when we add that feature
                    toast.info("Image upload coming soon");
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isPending}
                  className="text-content-text-secondary hover:text-brand-primary"
                  onClick={() => {
                    // TODO: Implement Giphy picker
                    toast.info("Giphy picker coming soon");
                  }}
                >
                  <Smile className="h-4 w-4 mr-2" />
                  GIF
                </Button>
              </div>

              <div className="flex gap-2">
                {onCancel && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isPending}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" size="sm" disabled={isPending || !content.trim()} className="btn-primary">
                  {isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Smile, X } from "lucide-react";
import { useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useCreatePost } from "~/hooks/use-post-mutations";

const boardPostFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(300, "Title is too long"),
  content: z.string().max(10000, "Post is too long").optional(),
});

type BoardPostFormValues = z.infer<typeof boardPostFormSchema>;

interface BoardComposerProps {
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BoardComposer({ currentUser, onSuccess, onCancel }: BoardComposerProps) {
  const [mediaUrl, setMediaUrl] = useState<string>("");

  const createMutation = useCreatePost();

  const form = useForm<BoardPostFormValues>({
    resolver: zodResolver(boardPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const title = form.watch("title");
  const content = form.watch("content") || "";
  const titleCharCount = title.length;
  const contentCharCount = content.length;

  const handleSubmit = async (data: BoardPostFormValues) => {
    try {
      // For now, combine title and content with newline
      // Later we'll update the API to accept title separately
      const fullContent = data.content ? `${data.title}\n${data.content}` : data.title;

      await createMutation.mutateAsync({
        content: fullContent,
        mediaUrl: mediaUrl || undefined,
      });

      toast.success("Post created");
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

  const isPending = createMutation.isPending;

  return (
    <Card className="card-premium">
      <CardHeader className="border-b border-glass-border/50">
        <CardTitle className="text-lg text-content-text-primary">Create a post</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* User Avatar + Form */}
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={currentUser?.avatarUrl || undefined} alt={currentUser?.username} />
                <AvatarFallback className="glass-content text-brand-primary font-medium">
                  {currentUser?.username?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }: { field: ControllerRenderProps<BoardPostFormValues, "title"> }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Title"
                          {...field}
                          className="glass-content border-glass-border text-content-text-primary font-semibold text-lg"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Content Field (Optional) */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }: { field: ControllerRenderProps<BoardPostFormValues, "content"> }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Text (optional)"
                          {...field}
                          className="glass-content border-glass-border text-content-text-primary min-h-[120px] resize-none"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Character Counts */}
            <div className="flex justify-between text-xs">
              <span className={titleCharCount > 270 ? "text-red-500" : "text-content-text-secondary"}>
                Title: {titleCharCount}/300
              </span>
              <span className={contentCharCount > 9000 ? "text-red-500" : "text-content-text-secondary"}>
                Content: {contentCharCount}/10000
              </span>
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
                    toast.info("Link/URL coming soon");
                  }}
                >
                  🔗 Link
                </Button>
              </div>

              <div className="flex gap-2">
                {onCancel && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleCancel} disabled={isPending}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" size="sm" disabled={isPending || !title.trim()} className="btn-primary">
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

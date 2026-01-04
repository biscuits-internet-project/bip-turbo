import { Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { useToggleReaction } from "~/hooks/use-post-mutations";

const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎵", "🔥", "👏"];

interface ReactionPickerProps {
  postId: string;
  currentUserId?: string;
  reactionCount: number;
  userReactions?: string[]; // Emoji codes the current user has reacted with
  reactionsByEmoji?: Record<string, number>; // Map of emoji to count
}

export function ReactionPicker({
  postId,
  currentUserId,
  reactionCount,
  userReactions = [],
  reactionsByEmoji = {},
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMutation = useToggleReaction();

  const handleReaction = async (emojiCode: string) => {
    if (!currentUserId) {
      toast.error("Sign in to react to posts");
      return;
    }

    try {
      await toggleMutation.mutateAsync({ postId, emojiCode });
      setIsOpen(false);
    } catch (_error) {
      toast.error("Failed to react");
    }
  };

  const hasReacted = userReactions.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className={`flex-1 hover:bg-glass-content/50 rounded-lg h-10 ${
            hasReacted ? "text-brand-primary" : "text-content-text-secondary"
          }`}
          disabled={!currentUserId}
        >
          <Smile className="h-5 w-5 mr-2" />
          Like
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex gap-1">
          {QUICK_EMOJIS.map((emoji) => {
            const count = reactionsByEmoji[emoji] || 0;
            const isUserReaction = userReactions.includes(emoji);
            return (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-all hover:scale-110 ${
                  isUserReaction ? "bg-brand-primary/20 ring-2 ring-brand-primary" : "hover:bg-glass-content"
                }`}
                disabled={toggleMutation.isPending}
                title={`${emoji} ${count > 0 ? `(${count})` : ""}`}
                type="button"
              >
                <span className="text-2xl">{emoji}</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-brand-primary text-white rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

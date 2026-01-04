import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useVote } from "~/hooks/use-vote";

interface VoteButtonsProps {
  postId: string;
  currentUserId?: string;
  voteScore: number; // Net score (upvotes - downvotes)
  userVote?: "upvote" | "downvote" | null; // Current user's vote
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md" | "lg";
}

export function VoteButtons({
  postId,
  currentUserId,
  voteScore,
  userVote = null,
  orientation = "vertical",
  size = "md",
}: VoteButtonsProps) {
  const [optimisticVote, setOptimisticVote] = useState<"upvote" | "downvote" | null>(userVote);
  const [optimisticScore, setOptimisticScore] = useState(voteScore);
  const voteMutation = useVote();

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!currentUserId) {
      toast.error("Sign in to vote");
      return;
    }

    // Optimistic update
    const previousVote = optimisticVote;
    const previousScore = optimisticScore;

    let newScore = optimisticScore;
    let newVote: "upvote" | "downvote" | null = voteType;

    // Calculate new score based on previous state
    if (previousVote === voteType) {
      // Removing vote
      newVote = null;
      newScore = previousVote === "upvote" ? optimisticScore - 1 : optimisticScore + 1;
    } else if (previousVote === null) {
      // Adding new vote
      newScore = voteType === "upvote" ? optimisticScore + 1 : optimisticScore - 1;
    } else {
      // Switching vote
      newScore = voteType === "upvote" ? optimisticScore + 2 : optimisticScore - 2;
    }

    setOptimisticVote(newVote);
    setOptimisticScore(newScore);

    try {
      await voteMutation.mutateAsync({ postId, voteType });
    } catch (error) {
      // Rollback on error
      setOptimisticVote(previousVote);
      setOptimisticScore(previousScore);
      toast.error("Failed to vote");
    }
  };

  const sizeClasses = {
    sm: {
      button: "h-6 w-6",
      icon: "h-4 w-4",
      text: "text-xs",
    },
    md: {
      button: "h-8 w-8",
      icon: "h-5 w-5",
      text: "text-sm",
    },
    lg: {
      button: "h-10 w-10",
      icon: "h-6 w-6",
      text: "text-base",
    },
  };

  const classes = sizeClasses[size];

  const containerClasses = orientation === "vertical" ? "flex flex-col items-center gap-0" : "flex items-center gap-2";

  return (
    <div className={containerClasses}>
      <Button
        variant="ghost"
        size="icon"
        className={`${classes.button} ${
          optimisticVote === "upvote"
            ? "text-orange-500 hover:text-orange-600"
            : "text-content-text-secondary hover:text-orange-500"
        } transition-colors`}
        onClick={() => handleVote("upvote")}
        disabled={!currentUserId}
      >
        <ArrowBigUp className={classes.icon} fill={optimisticVote === "upvote" ? "currentColor" : "none"} />
      </Button>

      <span
        className={`font-semibold ${classes.text} ${
          optimisticVote === "upvote"
            ? "text-orange-500"
            : optimisticVote === "downvote"
              ? "text-blue-500"
              : "text-content-text-secondary"
        }`}
      >
        {optimisticScore}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={`${classes.button} ${
          optimisticVote === "downvote"
            ? "text-blue-500 hover:text-blue-600"
            : "text-content-text-secondary hover:text-blue-500"
        } transition-colors`}
        onClick={() => handleVote("downvote")}
        disabled={!currentUserId}
      >
        <ArrowBigDown className={classes.icon} fill={optimisticVote === "downvote" ? "currentColor" : "none"} />
      </Button>
    </div>
  );
}

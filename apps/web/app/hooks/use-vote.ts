import { useMutation, useQueryClient } from "@tanstack/react-query";

interface VoteInput {
  postId: string;
  voteType: "upvote" | "downvote";
}

interface VoteResponse {
  success: boolean;
  vote: {
    voteType: "upvote" | "downvote";
  } | null;
}

async function toggleVote(input: VoteInput): Promise<VoteResponse> {
  const response = await fetch("/api/votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to toggle vote");
  }

  return response.json();
}

export function useVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleVote,
    onSuccess: () => {
      // Invalidate feed queries to refetch with updated vote counts
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["thread"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
    },
  });
}

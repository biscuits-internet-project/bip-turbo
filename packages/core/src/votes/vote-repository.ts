import type { Vote } from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { DbClient } from "../_shared/database/models";

export type DbVote = Prisma.VoteGetPayload<object>;

export function mapVoteToDomainEntity(dbVote: DbVote): Vote {
  return {
    id: dbVote.id,
    postId: dbVote.postId,
    userId: dbVote.userId,
    voteType: dbVote.voteType as "upvote" | "downvote",
    createdAt: new Date(dbVote.createdAt),
  };
}

export class VoteRepository {
  constructor(private readonly db: DbClient) {}

  async findByPostAndUser(postId: string, userId: string): Promise<Vote | null> {
    const result = await this.db.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    return result ? mapVoteToDomainEntity(result) : null;
  }

  async toggleVote(postId: string, userId: string, voteType: "upvote" | "downvote"): Promise<Vote | null> {
    // Check if user already voted
    const existing = await this.findByPostAndUser(postId, userId);

    // If same vote type, remove the vote (toggle off)
    if (existing && existing.voteType === voteType) {
      await this.db.vote.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      // Update post counts
      await this.updatePostVoteCounts(postId);
      return null;
    }

    // If different vote type or no vote, upsert the vote
    const vote = await this.db.vote.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      create: {
        postId,
        userId,
        voteType,
        createdAt: new Date(),
      },
      update: {
        voteType,
      },
    });

    // Update post counts
    await this.updatePostVoteCounts(postId);

    return mapVoteToDomainEntity(vote);
  }

  async getUserVoteForPost(postId: string, userId: string): Promise<"upvote" | "downvote" | null> {
    const vote = await this.findByPostAndUser(postId, userId);
    return vote?.voteType || null;
  }

  private async updatePostVoteCounts(postId: string): Promise<void> {
    const [upvotes, downvotes] = await Promise.all([
      this.db.vote.count({
        where: { postId, voteType: "upvote" },
      }),
      this.db.vote.count({
        where: { postId, voteType: "downvote" },
      }),
    ]);

    const voteScore = upvotes - downvotes;

    await this.db.post.update({
      where: { id: postId },
      data: {
        upvoteCount: upvotes,
        downvoteCount: downvotes,
        voteScore,
      },
    });
  }
}

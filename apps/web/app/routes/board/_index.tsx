import { PenSquare } from "lucide-react";
import { Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { BoardStream } from "~/components/board/board-stream";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  currentUserId?: string;
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
}

export const loader = publicLoader<LoaderData>(async ({ context }: LoaderFunctionArgs) => {
  const { currentUser } = context;

  if (!currentUser) {
    return { currentUserId: undefined, currentUser: undefined };
  }

  const localUser = await services.users.findByEmail(currentUser.email);

  if (!localUser) {
    return { currentUserId: undefined, currentUser: undefined };
  }

  return {
    currentUserId: localUser.id,
    currentUser: {
      username: localUser.username,
      avatarUrl: localUser.avatarUrl,
    },
  };
});

export function meta() {
  return [{ title: "Board | BIP" }, { name: "description", content: "Community discussion board" }];
}

export default function BoardPage() {
  const { currentUserId, currentUser } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-heading">Discussion Board</h1>
          <p className="text-sm text-content-text-secondary">Reddit-style community discussions</p>
        </div>

        {currentUser && (
          <Button asChild className="btn-primary flex items-center gap-2">
            <Link to="/board/submit">
              <PenSquare className="h-4 w-4" />
              Create Post
            </Link>
          </Button>
        )}
      </div>

      {/* Auth Prompt for non-logged-in users */}
      {!currentUser && (
        <div className="card-premium p-6 text-center">
          <p className="text-content-text-primary mb-4">Sign in to create posts and vote on discussions</p>
          <Button asChild className="btn-primary">
            <a href="/auth/login">Sign In</a>
          </Button>
        </div>
      )}

      {/* Board Stream */}
      <BoardStream currentUserId={currentUserId} />
    </div>
  );
}

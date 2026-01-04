import { PenSquare } from "lucide-react";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { PostComposer } from "~/components/post/post-composer";
import { PostStream } from "~/components/post/post-stream";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
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
  return [{ title: "Feed | BIP" }, { name: "description", content: "Community discussion feed" }];
}

export default function FeedPage() {
  const { currentUserId, currentUser } = useSerializedLoaderData<LoaderData>();
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-heading">Community</h1>

        {currentUser && (
          <Button onClick={() => setShowNewPostDialog(true)} className="btn-primary flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            New Post
          </Button>
        )}
      </div>

      {/* Auth Prompt for non-logged-in users */}
      {!currentUser && (
        <div className="card-premium p-6 text-center">
          <p className="text-content-text-primary mb-4">Sign in to join the conversation and create posts</p>
          <Button asChild className="btn-primary">
            <a href="/auth/login">Sign In</a>
          </Button>
        </div>
      )}

      {/* Post Stream */}
      <PostStream currentUserId={currentUserId} currentUser={currentUser} />

      {/* New Post Dialog */}
      <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <PostComposer
            mode="new"
            currentUser={currentUser}
            onSuccess={() => setShowNewPostDialog(false)}
            onCancel={() => setShowNewPostDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

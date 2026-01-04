import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { BoardComposer } from "~/components/board/board-composer";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { protectedLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  currentUser: {
    username: string;
    avatarUrl?: string | null;
  };
}

export const loader = protectedLoader<LoaderData>(async ({ context }: LoaderFunctionArgs) => {
  const { currentUser } = context;

  if (!currentUser) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const localUser = await services.users.findByEmail(currentUser.email);

  if (!localUser) {
    throw new Response("User not found", { status: 404 });
  }

  return {
    currentUser: {
      username: localUser.username,
      avatarUrl: localUser.avatarUrl,
    },
  };
});

export function meta() {
  return [{ title: "Create Post | BIP" }, { name: "description", content: "Create a new discussion post" }];
}

export default function BoardSubmitPage() {
  const { currentUser } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/board");
  };

  const handleCancel = () => {
    navigate("/board");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link to="/board">
          <Button variant="ghost" size="sm" className="text-content-text-secondary hover:text-brand-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Board
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="border-b border-glass-border pb-4">
        <h1 className="page-heading">Create a Post</h1>
        <p className="text-sm text-content-text-secondary mt-1">Share your thoughts with the community</p>
      </div>

      {/* Post Composer */}
      <div className="card-premium p-6">
        <BoardComposer currentUser={currentUser} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}

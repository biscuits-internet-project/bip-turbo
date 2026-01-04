import type { LoaderFunctionArgs } from "react-router";
import { ThreadView } from "~/components/post/thread-view";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  postId: string;
  currentUserId?: string;
  currentUser?: {
    username: string;
    avatarUrl?: string | null;
  };
}

export const loader = publicLoader<LoaderData>(async ({ context, params }: LoaderFunctionArgs) => {
  const { currentUser } = context;
  const { postId } = params;

  if (!postId) {
    throw new Response("Post not found", { status: 404 });
  }

  let currentUserId: string | undefined;
  let localUser: { username: string; avatarUrl?: string | null } | undefined;

  if (currentUser) {
    const user = await services.users.findByEmail(currentUser.email);
    if (user) {
      currentUserId = user.id;
      localUser = {
        username: user.username,
        avatarUrl: user.avatarUrl,
      };
    }
  }

  return {
    postId,
    currentUserId,
    currentUser: localUser,
  };
});

export function meta() {
  return [{ title: "Post | BIP" }, { name: "description", content: "View post and replies" }];
}

export default function PostThreadPage() {
  const { postId, currentUserId, currentUser } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="max-w-3xl mx-auto">
      <ThreadView postId={postId} currentUserId={currentUserId} currentUser={currentUser} />
    </div>
  );
}

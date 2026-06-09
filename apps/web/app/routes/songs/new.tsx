import { narrowSongKind } from "@bip/domain";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SongForm } from "~/components/song/song-form";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const authorId = formData.get("authorId") as string;
  const lyrics = formData.get("lyrics") as string;
  const tabs = formData.get("tabs") as string;
  const notes = formData.get("notes") as string;
  const kind = narrowSongKind(formData.get("kind") as string | null);
  const history = formData.get("history") as string;
  const featuredLyric = formData.get("featuredLyric") as string;
  const guitarTabsUrl = formData.get("guitarTabsUrl") as string;

  const song = await services.songs.create({
    title,
    authorId: authorId || null,
    lyrics: lyrics || null,
    tabs: tabs || null,
    notes: notes || null,
    kind,
    history: history || null,
    featuredLyric: featuredLyric || null,
    guitarTabsUrl: guitarTabsUrl || null,
  });

  return redirect(`/songs/${song.slug}`);
});

export default function NewSong() {
  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Create Song" backLink={{ to: "/songs", label: "Back to Songs" }} />
      </div>

      <AdminOnly>
        <Card className="card-premium">
          <CardContent className="p-6">
            <SongForm submitLabel="Create Song" cancelHref="/songs" />
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}

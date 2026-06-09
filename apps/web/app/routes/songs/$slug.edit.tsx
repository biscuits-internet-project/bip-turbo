import { narrowSongKind, type Song } from "@bip/domain";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SongForm, type SongFormValues } from "~/components/song/song-form";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  song: Song;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const song = await services.songs.findBySlug(slug as string);

  if (!song) {
    throw notFound(`Song with slug "${slug}" not found`);
  }

  return { song };
});

export const action = adminAction(async ({ request, params }: ActionFunctionArgs) => {
  const { slug } = params;
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

  const song = await services.songs.update(slug as string, {
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

export default function EditSong() {
  const { song } = useSerializedLoaderData<LoaderData>();
  const [defaultValues, setDefaultValues] = useState<SongFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when song data is loaded
  useEffect(() => {
    if (song) {
      setDefaultValues({
        title: song.title,
        authorId: song.authorId,
        lyrics: song.lyrics,
        tabs: song.tabs,
        notes: song.notes,
        kind: song.kind ?? "original",
        history: song.history,
        featuredLyric: song.featuredLyric,
        guitarTabsUrl: song.guitarTabsUrl,
      });
      setIsLoading(false);
    }
  }, [song]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Edit Song" backLink={{ to: `/songs/${song.slug}`, label: "Back to Song" }} />
      </div>

      <AdminOnly>
        <Card className="card-premium">
          <CardContent className="p-6">
            <SongForm defaultValues={defaultValues} submitLabel="Save Changes" cancelHref={`/songs/${song.slug}`} />
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}

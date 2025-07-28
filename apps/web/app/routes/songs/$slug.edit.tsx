import type { Song } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SongForm, type SongFormValues } from "~/components/song/song-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
  const lyrics = formData.get("lyrics") as string;
  const tabs = formData.get("tabs") as string;
  const notes = formData.get("notes") as string;
  const cover = formData.get("cover") === "on";
  const history = formData.get("history") as string;
  const featuredLyric = formData.get("featuredLyric") as string;
  const guitarTabsUrl = formData.get("guitarTabsUrl") as string;

  const song = await services.songs.update(slug as string, {
    title,
    lyrics: lyrics || null,
    tabs: tabs || null,
    notes: notes || null,
    cover,
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
        lyrics: song.lyrics,
        tabs: song.tabs,
        notes: song.notes,
        cover: song.cover,
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
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-content-text-primary">Edit Song</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/songs/${song.slug}`} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Song</span>
          </Link>
        </Button>
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

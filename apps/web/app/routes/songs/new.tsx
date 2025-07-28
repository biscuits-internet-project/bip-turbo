import { ArrowLeft } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { Form, Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SongForm } from "~/components/song/song-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const lyrics = formData.get("lyrics") as string;
  const tabs = formData.get("tabs") as string;
  const notes = formData.get("notes") as string;
  const cover = formData.get("cover") === "on";
  const history = formData.get("history") as string;
  const featuredLyric = formData.get("featuredLyric") as string;
  const guitarTabsUrl = formData.get("guitarTabsUrl") as string;

  const song = await services.songs.create({
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

export default function NewSong() {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create Song</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/songs" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Songs
          </Link>
        </Button>
      </div>

      <AdminOnly>
        <Card className="relative overflow-hidden border-content-bg-secondary transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />
          <CardContent className="relative z-10 p-6">
            <SongForm submitLabel="Create Song" cancelHref="/songs" />
          </CardContent>
        </Card>
      </AdminOnly>
    </div>
  );
}

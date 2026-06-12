import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { useMemo } from "react";
import { redirect } from "react-router-dom";
import { FilteredSongsTable } from "~/components/song/filtered-songs-table";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { getAuthorMeta } from "~/lib/seo";
import { fetchFilteredSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

export const routeParam = "slug";

interface LoaderData {
  author: { id: string; name: string; slug: string };
  songs: Song[];
}

export function meta({ data }: { data?: LoaderData }) {
  // No data on the musician-redirect or not-found paths.
  if (!data) return [];
  return getAuthorMeta({ name: data.author.name, slug: data.author.slug, songCount: data.songs.length });
}

export const loader = publicLoader(async ({ params, context }): Promise<LoaderData | Response> => {
  const slug = params.slug;
  if (!slug) throw notFound();

  const author = await services.authors.findBySlug(slug);
  if (!author) throw notFound();

  // When the author is also a musician, the musician page is canonical.
  const musician = await services.musicians.findByAuthorId(author.id);
  if (musician) return redirect(`/musicians/${musician.slug}`);

  // Cache the unfiltered author payload by slug; the page filters client-side,
  // so the loader always returns the author-pinned base list (no other params).
  return services.cache.getOrSet(
    CacheKeys.authors.page(slug),
    async () => {
      const url = new URL(`https://bip.local/?author=${author.id}`);
      const songs = await fetchFilteredSongs(url, context);
      return { author: { id: author.id, name: author.name, slug: author.slug }, songs };
    },
    { ttl: 86400 },
  );
});

export default function AuthorPage() {
  const { author, songs } = useSerializedLoaderData<LoaderData>();
  const presetFilters = useMemo(() => ({ author: author.id }), [author.id]);

  return (
    <div>
      <div className="space-y-2 mb-6">
        <PageHeader title={author.name} backLink={{ to: "/songs", label: "All Songs" }} />
      </div>
      <FilteredSongsTable songs={songs} presetFilters={presetFilters} />
    </div>
  );
}

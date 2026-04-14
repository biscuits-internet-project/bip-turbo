import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DataTable } from "~/components/ui/data-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface HistorySong {
  id: string;
  title: string;
  slug: string;
  history: string;
}

interface LoaderData {
  songs: HistorySong[];
}

const MINIMUM_HISTORY_LENGTH = 50;

export const loader = publicLoader(async (): Promise<LoaderData> => {
  const cacheKey = CacheKeys.songs.histories();
  const cacheOptions = { ttl: 3600 };

  return await services.cache.getOrSet(
    cacheKey,
    async () => {
      const allSongs = await services.songs.findMany({});
      const songsWithHistory = allSongs
        .filter((song: Song) => song.history && song.history.length > MINIMUM_HISTORY_LENGTH)
        .map((song: Song) => ({
          id: song.id,
          title: song.title,
          slug: song.slug,
          history: song.history as string,
        }))
        .sort((a: HistorySong, b: HistorySong) => a.title.localeCompare(b.title));

      return { songs: songsWithHistory };
    },
    cacheOptions,
  );
});

export function meta() {
  return [
    { title: "Song Histories | Songs" },
    { name: "description", content: "Browse song histories for The Disco Biscuits" },
  ];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

function truncateText(text: string, maxLength: number): string {
  const stripped = stripHtml(text);
  if (stripped.length <= maxLength) return stripped;
  return `${stripped.slice(0, maxLength).trimEnd()}...`;
}

const historiesColumns: ColumnDef<HistorySong>[] = [
  {
    accessorKey: "title",
    meta: { width: "25%" },
    header: "Song",
    cell: ({ row }) => (
      <Link
        to={`/songs/${row.original.slug}?tab=history`}
        className="text-brand-primary hover:text-brand-secondary transition-colors font-medium"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "history",
    meta: { width: "75%" },
    header: "Preview",
    cell: ({ row }) => (
      <span className="text-content-text-secondary text-sm">{truncateText(row.original.history, 150)}</span>
    ),
  },
];

export default function HistoriesPage() {
  const { songs } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      <DataTable columns={historiesColumns} data={songs} pageSize={50} hideSearch />
    </div>
  );
}

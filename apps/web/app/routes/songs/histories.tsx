import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "~/components/ui/data-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { decodeHtmlEntities } from "~/lib/html";
import { cn } from "~/lib/utils";
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

/**
 * Convert history HTML or plain text to plain text with paragraph breaks as
 * double newlines. Paired with whitespace-pre-line CSS to render paragraphs visibly.
 */
function normalizeHistoryText(history: string): string {
  const stripped = history
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");

  return decodeHtmlEntities(stripped)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function HistoryPreview({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  });

  return (
    <div className="text-sm text-content-text-secondary">
      <div ref={contentRef} className={cn("leading-relaxed whitespace-pre-line", !isExpanded && "line-clamp-2")}>
        {text}
      </div>
      {(isTruncated || isExpanded) && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-brand-primary hover:text-brand-secondary underline text-xs mt-0.5"
        >
          {isExpanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
}

const historiesColumns: ColumnDef<HistorySong>[] = [
  {
    accessorKey: "title",
    meta: { width: "25%", cellClassName: "align-top" },
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
    meta: { width: "75%", cellClassName: "align-top" },
    header: "Preview",
    cell: ({ row }) => <HistoryPreview text={normalizeHistoryText(row.original.history)} />,
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

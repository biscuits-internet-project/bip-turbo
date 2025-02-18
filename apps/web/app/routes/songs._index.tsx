import type { Song } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, useSearchParams } from "react-router-dom";
import superjson from "superjson";
import { services } from "../server/services";

const SORT_OPTIONS = {
  title: { field: "title", label: "Title", order: "asc" as const },
  timesPlayed: { field: "timesPlayed", label: "Most Played", order: "desc" as const },
  firstPlayed: { field: "dateLastPlayed", label: "Debut Date", order: "desc" as const },
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sortKey = (url.searchParams.get("sort") as SortKey) || "timesPlayed";
  const searchQuery = url.searchParams.get("q") || "";
  const { field, order } = SORT_OPTIONS[sortKey];

  const songs = await services.songs.findMany({
    title: searchQuery,
  });
  const { json: data, meta } = superjson.serialize({ songs });
  return { data, meta, searchQuery };
}

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold">{song.title}</h2>
      {song.legacyAuthor && <p className="text-gray-600">Author: {song.legacyAuthor}</p>}
      {song.timesPlayed > 0 && (
        <p className="text-gray-500 text-sm">
          Played {song.timesPlayed} times
          {song.dateLastPlayed && ` (Last: ${song.dateLastPlayed.toLocaleDateString()})`}
        </p>
      )}
    </div>
  );
}

function SearchForm() {
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  return (
    <Form className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search songs..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input type="hidden" name="sort" value={searchParams.get("sort") || "timesPlayed"} />
      </div>
    </Form>
  );
}

function SortSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "timesPlayed";

  return (
    <select
      className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={currentSort}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", e.target.value);
        setSearchParams(params);
      }}
    >
      {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
        <option key={key} value={key}>
          Sort by {label}
        </option>
      ))}
    </select>
  );
}

export default function Songs() {
  const { data, meta, searchQuery } = useLoaderData<typeof loader>();
  const { songs } = superjson.deserialize({ json: data, meta }) as { songs: Song[] };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Songs</h1>
          <SortSelect />
        </div>

        <SearchForm />

        {songs.length === 0 ? (
          <p className="text-gray-600">{searchQuery ? `No songs found matching "${searchQuery}"` : "No songs found"}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song: Song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

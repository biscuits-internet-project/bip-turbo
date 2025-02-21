import type { Song } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, useSearchParams } from "react-router-dom";
import superjson from "superjson";
import { services } from "../server/services";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const song = await services.songs.findBySlug(slug);
  if (!song) {
    throw new Response("Not Found", { status: 404 });
  }

  const { json: data, meta } = superjson.serialize({ song });
  return { data, meta };
}

interface StatBoxProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

function StatBox({ label, value, sublabel }: StatBoxProps) {
  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {sublabel && <span className="ml-2 text-sm text-gray-500">{sublabel}</span>}
      </dd>
    </div>
  );
}

export default function SongPage() {
  const { data, meta } = useLoaderData<typeof loader>();
  const { song } = superjson.deserialize({ json: data, meta }) as { song: Song };

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold text-white">{song.title}</h1>
            {song.legacyAuthor && (
              <span className="text-gray-400 text-lg">
                by <span className="text-blue-400">{song.legacyAuthor}</span>
              </span>
            )}
          </div>
          {song.legacyId && (
            <div className="text-gray-500 text-sm">
              Legacy ID: <span className="font-mono">{song.legacyId}</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Times Played" value={song.timesPlayed} sublabel="total plays" />
          <StatBox label="Last Played" value={song.dateLastPlayed ? new Date(song.dateLastPlayed).toLocaleDateString() : "Never"} />
          <StatBox label="Most Common Year" value={song.mostCommonYear || "—"} />
          <StatBox label="Least Common Year" value={song.leastCommonYear || "—"} />
        </dl>

        {/* Additional Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Additional Stats */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Performance History</h2>
              <div className="text-gray-400">{song.history || "No performance history available."}</div>
            </div>
            {song.featuredLyric && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Featured Lyric</h2>
                <blockquote className="text-gray-300 italic">{song.featuredLyric}</blockquote>
              </div>
            )}
          </div>

          {/* Right Column - Notes and Links */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
              <p className="text-gray-400">{song.notes || "No additional notes available."}</p>
            </div>
            {(song.tabs || song.guitarTabsUrl) && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Guitar Tabs</h2>
                {song.tabs && <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap mb-4">{song.tabs}</pre>}
                {song.guitarTabsUrl && (
                  <a href={song.guitarTabsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    View External Guitar Tabs
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

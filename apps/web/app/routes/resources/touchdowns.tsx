import { BackLink } from "~/components/ui/back-link";
import { cardVariants } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatDateLong } from "~/lib/utils";
import { type AcastEpisode, getRecentPodcastEpisodes } from "~/server/latest-podcast-episode";

// Fetched here rather than in the browser: each description is a third party's HTML
// rendered with dangerouslySetInnerHTML, so it has to be sanitized before it reaches a
// client. The server helper also caches the feed, so acast is hit once per TTL instead of
// once per visitor.
interface LoaderData {
  episodes: AcastEpisode[];
}

export const loader = publicLoader<LoaderData>(async () => {
  const episodes = await getRecentPodcastEpisodes();
  return { episodes };
});

export function meta() {
  return [
    { title: "Touchdowns All Day Podcast | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "Step inside the mind of Jon Barber as he breaks down jams, interviews guests, and discusses all things Disco Biscuits on Touchdowns All Day w/ Jon Barber.",
    },
    { property: "og:image", content: "https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/tdad.jpg" },
  ];
}

export default function Touchdowns() {
  const { episodes } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="page-heading">TOUCHDOWNS ALL DAY PODCAST</h1>
        </div>

        {/* Subtle back link */}
        <div className="flex justify-start">
          <BackLink to="/resources">All Resources</BackLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes?.map((episode) => (
            <div
              key={episode.id ?? episode.url}
              className={cardVariants({
                variant: "elevated",
                className: "rounded-lg overflow-hidden h-full flex flex-col",
              })}
            >
              {episode.image && (
                <div className="relative">
                  <img src={episode.image} alt={episode.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-lg font-semibold line-clamp-2">{episode.title}</h2>
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div
                  className="text-content-text-secondary mb-4 line-clamp-3 flex-1"
                  dangerouslySetInnerHTML={{ __html: episode.description }}
                />

                <div className="text-content-text-tertiary text-sm mb-6 space-y-1">
                  <div>Duration: {Math.floor(episode.duration / 60)} minutes</div>
                  <div>Published: {episode.publishDate ? formatDateLong(episode.publishDate) : "Date unavailable"}</div>
                </div>

                <div className="mt-auto">
                  <a
                    href={episode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-secondary text-sm font-medium hover:underline transition-colors"
                  >
                    Listen to episode →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-content-text-secondary">Episodes are unavailable right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { ChevronDown, Headphones } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cardVariants } from "~/components/ui/card";
import type { AcastEpisode } from "~/server/latest-podcast-episode";

interface PodcastCardProps {
  episode: AcastEpisode;
}

/**
 * Formatted in UTC, the zone the acast timestamp is already expressed in.
 * A local-zone format renders the instant as the previous day for readers west
 * of UTC, and renders it differently on the server than in the browser, which
 * is a hydration mismatch on a string that ships with the HTML.
 */
function formatEpisodeDate(publishDate: string): string {
  const date = new Date(publishDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Cover art, blurb and listen link for one episode. Shared by the desktop
 * sidebar, which renders it on its own, and the mobile card, which hides it
 * behind a header until the reader asks for it.
 */
function PodcastEpisodeBody({ episode }: PodcastCardProps) {
  // Joined rather than interpolated so an episode with no publish date reads
  // "81 min" instead of trailing a bullet with nothing after it.
  const meta = [`${Math.floor(episode.duration / 60)} min`, formatEpisodeDate(episode.publishDate)]
    .filter(Boolean)
    .join(" • ");

  return (
    <>
      {episode.image && (
        <div className="relative">
          <img src={episode.image} alt={episode.title} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <h4 className="text-white text-sm font-semibold line-clamp-2">{episode.title}</h4>
          </div>
        </div>
      )}

      <div className="p-4">
        <div
          className="text-content-text-secondary text-sm mb-3 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />

        <div className="flex justify-between items-center">
          <div className="text-content-text-tertiary text-xs">{meta}</div>
          <a
            href={episode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:text-brand-secondary text-xs font-medium hover:underline transition-colors"
          >
            Listen →
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * The podcast episode as the desktop sidebar shows it: always open, under the
 * sidebar's own heading.
 */
export function PodcastCard({ episode }: PodcastCardProps) {
  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg overflow-hidden" })}>
      <PodcastEpisodeBody episode={episode} />
    </div>
  );
}

interface CollapsiblePodcastCardProps extends PodcastCardProps {
  /** Whether the episode is recent enough to open the card and earn the badge. */
  isNew: boolean;
}

/**
 * The podcast episode as the mobile homepage shows it. Touchdowns All Day
 * goes quiet for months at a time, and a dormant show holding a cover-art card
 * near the top of a phone screen pushes the shows and the on-this-day link
 * below the fold. So the card earns its space instead of holding it: a fresh
 * episode opens itself and wears a badge, an old one sits as a single header
 * row that still names and dates the last episode, and either way the reader
 * can tap the header to change their mind.
 */
export function CollapsiblePodcastCard({ episode, isNew }: CollapsiblePodcastCardProps) {
  const [isOpen, setIsOpen] = useState(isNew);
  const publishedOn = formatEpisodeDate(episode.publishDate);

  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg overflow-hidden" })}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        // Vertical padding only is trimmed: the horizontal 4 keeps the header
        // flush with the expanded body below it.
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <Headphones className="h-5 w-5 shrink-0 text-brand-primary" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-content-text-primary">Touchdowns All Day</span>
            {isNew && (
              // Wears the rating star's gold rather than a new near-identical
              // amber; it is the site's one "this is worth your attention"
              // color, and a second one would read as an accident.
              <span className="shrink-0 rounded bg-rating-gold/15 px-1.5 py-0.5 text-xs font-medium text-rating-gold">
                New episode
              </span>
            )}
          </div>
          {/* Date first: episode titles run long enough to truncate away
              anything after them at phone width, and how stale the show is
              is the thing a reader needs off the collapsed row. */}
          <div className="truncate text-xs text-content-text-secondary">
            {publishedOn && <span className="text-content-text-tertiary">{publishedOn} • </span>}
            {episode.title}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-content-text-tertiary transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="border-t">
          <PodcastEpisodeBody episode={episode} />
          <div className="px-4 pb-4">
            <Link
              to="/resources/touchdowns"
              className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
            >
              All episodes →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

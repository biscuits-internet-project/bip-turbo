import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import {
  EXTERNAL_FAVICON_IMG_CLASS,
  EXTERNAL_FAVICON_LINK_CLASS,
  EXTERNAL_SOURCE_DOMAINS,
  faviconBoost,
  faviconSrc,
} from "~/lib/favicon";
import { cn } from "~/lib/utils";

/**
 * Resolved external-source links for a single show. Each field is either a
 * ready-to-link URL or undefined when that source doesn't have this show.
 * URLs (not booleans) so the badge can deep-link directly to the release —
 * listing pages pre-resolve these once so per-row rendering stays cheap.
 */
export interface ShowExternalSources {
  /**
   * Every nugs.net release URL for the show date. Most dates have zero or
   * one URL; dual-billed nights (Disco Biscuits + Tractorbeam) have two.
   * Storing the full list lets the badge strip render one favicon per
   * release so users can tell a rare two-release night at a glance.
   */
  nugsUrls?: string[];
  /** relisten.net link for the show date, or undefined when Relisten lacks it. */
  relistenUrl?: string;
  archiveUrl?: string;
  youtubeUrl?: string;
}

/**
 * Props for the badge strip. External-source URLs come from the route loader
 * map; the photos pair lives on the show record itself and is wired through
 * by the SetlistCard.
 */
interface ShowExternalBadgesProps {
  sources: ShowExternalSources;
  /** Internal link to the show's photos anchor, typically `/shows/<slug>#photos`. */
  photosHref?: string;
  /** Count of photos attached to the show; suppresses the photos badge when zero. */
  photosCount?: number;
}

/**
 * Props for a single favicon-link badge inside the strip.
 */
interface FaviconLinkProps {
  /** Bare host (e.g. "nugs.net") used to resolve the favicon. */
  domain: string;
  /** Fully-qualified link target. Null or undefined collapses the badge to
   *  nothing so callers can pass a raw optional URL, from either a loader
   *  (nullable) or an optional prop, without a surrounding `&&` gate. */
  href: string | null | undefined;
  /** Hover tooltip and screen-reader label. */
  label: string;
}

/**
 * Props for the photos badge.
 */
interface PhotosBadgeProps {
  /** Internal anchor link; undefined collapses the badge. */
  href: string | undefined;
  /** Count shown next to the camera icon; <= 0 collapses the badge. */
  count: number | undefined;
}

const BADGE_ICON_CLASS = "h-5 w-5 shrink-0";

/**
 * A single favicon-as-link. Owns its own absence — returns null when the URL
 * isn't available so callers can pass optional URLs in directly without
 * per-field `&&` gates. Exported because the same affordance appears outside
 * the badge strip (resource pages), and the per-domain brightness tuning it
 * carries has to stay identical everywhere a service logo is shown.
 */
export function FaviconLink({ domain, href, label }: FaviconLinkProps) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={EXTERNAL_FAVICON_LINK_CLASS}>
      <img
        src={faviconSrc(domain)}
        alt={label}
        className={cn(BADGE_ICON_CLASS, EXTERNAL_FAVICON_IMG_CLASS)}
        style={faviconBoost(domain)}
      />
    </a>
  );
}

/**
 * Camera icon + count, linking to the show's #photos anchor. Owns its own
 * absence so the parent can pass raw optional values without `&&` gates.
 *
 * Carries an explicit muted color because it's the one badge drawn as a stroked
 * icon rather than a favicon image: the strip's desaturation only reaches the
 * images, so left on the default text color this would read as the boldest
 * thing in a row of greys.
 *
 * Tuned a step brighter than the favicons' tinted fill rather than matched to
 * it. An outline covers far fewer pixels than a filled tile, so at an equal
 * value it reads lighter — the extra step buys equal presence, not equal color.
 */
function PhotosBadge({ href, count }: PhotosBadgeProps) {
  if (!href || !count || count <= 0) return null;
  return (
    <Link
      to={href}
      title={`${count} photos`}
      className={cn(EXTERNAL_FAVICON_LINK_CLASS, "gap-1 text-content-text-secondary")}
    >
      <Camera className={BADGE_ICON_CLASS} />
      {/* Count crowds the icon strip on mobile; show it from `sm` up. */}
      <span className="hidden sm:inline text-sm">{count}</span>
    </Link>
  );
}

/**
 * At-a-glance strip of per-show indicators rendered in the SetlistCard
 * header: external-service availability (nugs / archive / YouTube) plus the
 * photos anchor. Returns null when nothing matches so listing pages don't
 * show an empty strip.
 */
export function ShowExternalBadges({ sources, photosHref, photosCount }: ShowExternalBadgesProps) {
  const nugsUrls = sources.nugsUrls ?? [];
  const hasAny =
    nugsUrls.length > 0 ||
    sources.relistenUrl ||
    sources.archiveUrl ||
    sources.youtubeUrl ||
    (photosHref && photosCount && photosCount > 0);
  if (!hasAny) return null;

  return (
    <div className="flex items-center gap-2">
      {/* One favicon per nugs release so dual-billed nights (Disco Biscuits +
          Tractorbeam) read as "two releases" at a glance — that double-icon
          is the cue users have asked for. Single-release nights look the same
          as before. */}
      {nugsUrls.map((url, index) => (
        <FaviconLink
          key={url}
          domain={EXTERNAL_SOURCE_DOMAINS.nugs}
          href={url}
          label={nugsUrls.length > 1 ? `Available on nugs.net (release ${index + 1})` : "Available on nugs.net"}
        />
      ))}
      <FaviconLink domain={EXTERNAL_SOURCE_DOMAINS.youtube} href={sources.youtubeUrl} label="Video on YouTube" />
      <FaviconLink
        domain={EXTERNAL_SOURCE_DOMAINS.archive}
        href={sources.archiveUrl}
        label="Available on archive.org"
      />
      <FaviconLink domain={EXTERNAL_SOURCE_DOMAINS.relisten} href={sources.relistenUrl} label="Available on Relisten" />
      <PhotosBadge href={photosHref} count={photosCount} />
    </div>
  );
}

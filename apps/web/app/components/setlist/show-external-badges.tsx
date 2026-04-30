import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
import { cn } from "~/lib/utils";

/**
 * Resolved external-source links for a single show. Each field is either a
 * ready-to-link URL or undefined when that source doesn't have this show.
 * URLs (not booleans) so the badge can deep-link directly to the release —
 * listing pages pre-resolve these once so per-row rendering stays cheap.
 */
export interface ShowExternalSources {
  nugsUrl?: string;
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
  className?: string;
}

/**
 * Props for a single favicon-link badge inside the strip.
 */
interface FaviconLinkProps {
  /** Bare host (e.g. "nugs.net") used to resolve the favicon. */
  domain: string;
  /** Fully-qualified link target. Undefined collapses the badge to nothing so
   *  callers can pass the raw optional URL without a surrounding `&&` gate. */
  href: string | undefined;
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

const BADGE_LINK_CLASS = "opacity-80 hover:opacity-100 transition-opacity inline-flex items-center";
const BADGE_ICON_CLASS = "h-5 w-5";

/**
 * A single favicon-as-link inside the badge strip. Owns its own absence —
 * returns null when the URL isn't available so the parent strip can pass
 * optional URLs in directly without per-field `&&` gates.
 */
function FaviconLink({ domain, href, label }: FaviconLinkProps) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={BADGE_LINK_CLASS}>
      <img src={faviconSrc(domain)} alt={label} className={BADGE_ICON_CLASS} />
    </a>
  );
}

/**
 * Camera icon + count, linking to the show's #photos anchor. Owns its own
 * absence so the parent can pass raw optional values without `&&` gates.
 */
function PhotosBadge({ href, count }: PhotosBadgeProps) {
  if (!href || !count || count <= 0) return null;
  return (
    <Link to={href} title={`${count} photos`} className={cn(BADGE_LINK_CLASS, "gap-1")}>
      <Camera className={BADGE_ICON_CLASS} />
      <span className="text-sm">{count}</span>
    </Link>
  );
}

/**
 * At-a-glance strip of per-show indicators rendered in the SetlistCard
 * header: external-service availability (nugs / archive / YouTube) plus the
 * photos anchor. Returns null when nothing matches so listing pages don't
 * show an empty strip.
 */
export function ShowExternalBadges({ sources, photosHref, photosCount, className }: ShowExternalBadgesProps) {
  const hasAny =
    sources.nugsUrl || sources.archiveUrl || sources.youtubeUrl || (photosHref && photosCount && photosCount > 0);
  if (!hasAny) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FaviconLink domain={EXTERNAL_SOURCE_DOMAINS.nugs} href={sources.nugsUrl} label="Available on nugs.net" />
      <FaviconLink domain={EXTERNAL_SOURCE_DOMAINS.youtube} href={sources.youtubeUrl} label="Video on YouTube" />
      <FaviconLink
        domain={EXTERNAL_SOURCE_DOMAINS.archive}
        href={sources.archiveUrl}
        label="Available on archive.org"
      />
      <PhotosBadge href={photosHref} count={photosCount} />
    </div>
  );
}

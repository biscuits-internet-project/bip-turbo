import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { EXTERNAL_FAVICON_LINK_CLASS, EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
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

const BADGE_ICON_CLASS = "h-5 w-5 shrink-0";

/**
 * A single favicon-as-link inside the badge strip. Owns its own absence —
 * returns null when the URL isn't available so the parent strip can pass
 * optional URLs in directly without per-field `&&` gates.
 */
function FaviconLink({ domain, href, label }: FaviconLinkProps) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" title={label} className={EXTERNAL_FAVICON_LINK_CLASS}>
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
    <Link to={href} title={`${count} photos`} className={cn(EXTERNAL_FAVICON_LINK_CLASS, "gap-1")}>
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

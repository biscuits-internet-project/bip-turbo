import { ExternalSourceCard } from "./external-source-card";

/**
 * A single pre-labeled outbound link. Label building lives at the route
 * boundary so per-service disambiguation (nugs Tractorbeam suffix, multi-video
 * numbering) doesn't leak into the generic card.
 */
export interface ExternalLink {
  url: string;
  label: string;
}

/**
 * Props for the generic external-link list card.
 */
interface ExternalLinkCardProps {
  /** Bare host of the external service; drives the favicon in the card header. */
  faviconDomain: string;
  /** Service label shown next to the favicon (e.g. "Official release", "Video"). */
  title: string;
  /** Pre-labeled outbound links. Empty collapses the card so callers can pass
   *  the raw list without a gate. */
  items: ExternalLink[];
}

/**
 * Renders a list of outbound service links — the shared shape behind
 * "Listen on nugs.net" and "Watch on YouTube". All per-service disambiguation
 * (Tractorbeam suffix, video numbering) is baked into the label by the loader,
 * so the card itself only knows how to render a uniform url+label list.
 */
export function ExternalLinkCard({ faviconDomain, title, items }: ExternalLinkCardProps) {
  if (items.length === 0) return null;
  return (
    <ExternalSourceCard faviconDomain={faviconDomain} title={title}>
      <ul className="space-y-1 pl-6">
        {items.map(({ url, label }) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-secondary hover:text-hover-accent transition-colors"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </ExternalSourceCard>
  );
}

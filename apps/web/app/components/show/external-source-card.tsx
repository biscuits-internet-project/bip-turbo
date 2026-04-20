import type { ReactNode } from "react";
import { faviconSrc } from "~/lib/favicon";

/**
 * Props for the shared external-source card shell.
 */
interface ExternalSourceCardProps {
  /** Bare host of the external service; used to fetch the favicon for the card header. */
  faviconDomain: string;
  /** Service label shown next to the favicon (e.g. "Official release", "Video", "Archive.org"). */
  title: string;
  /** Card body. Typically a list of links; archive card also nests the embedded player. */
  children: ReactNode;
}

/**
 * Shared chrome (glass card + favicon + heading) wrapping each per-service
 * block in the show page's right column. Exists so nugs/youtube/archive cards
 * stay visually aligned as the design evolves — change the chrome here, not
 * in three places.
 */
export function ExternalSourceCard({ faviconDomain, title, children }: ExternalSourceCardProps) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <img src={faviconSrc(faviconDomain)} alt="" className="h-4 w-4" />
        <h4 className="text-sm font-medium text-content-text-secondary">{title}</h4>
      </div>
      {children}
    </div>
  );
}

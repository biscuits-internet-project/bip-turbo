import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BackLinkProps {
  to: string;
  children: ReactNode;
}

/**
 * Subtle text back link for content/detail pages (song, show, venue, musician
 * profiles): a small left-arrow plus a low-emphasis label that returns to the
 * list without competing with the page content. Prominent form/list navigation
 * uses LinkButton instead.
 */
export function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
    >
      <ArrowLeft className="h-3 w-3" />
      <span>{children}</span>
    </Link>
  );
}

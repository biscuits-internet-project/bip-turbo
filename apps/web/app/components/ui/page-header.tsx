import type { ReactNode } from "react";
import { BackLink } from "~/components/ui/back-link";

interface PageHeaderProps {
  title: string;
  /** Optional back link rendered on the left of the control row. */
  backLink?: { to: string; label: string };
  /** Optional action buttons rendered on the right of the control row. */
  actions?: ReactNode;
}

/**
 * The standard page header used across the app: an optional control row (a
 * back link on the left, action buttons on the right) above a centered display
 * title. Keeping the controls on their own row stops them from crowding the
 * centered title on mobile; action buttons should pass `iconOnlyOnMobile` to
 * stay compact there.
 */
export function PageHeader({ title, backLink, actions }: PageHeaderProps) {
  return (
    <div>
      {(backLink || actions) && (
        <div className="mb-2 md:mb-0 flex items-center justify-between gap-3">
          {backLink ? <BackLink to={backLink.to}>{backLink.label}</BackLink> : <span />}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <h1 className="page-heading">{title}</h1>
    </div>
  );
}

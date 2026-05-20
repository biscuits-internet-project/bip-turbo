import { useSearchParams } from "react-router-dom";
import { ShowDate } from "./show-date";

interface ShowDateLinkProps {
  /**
   * The show to link to. `null` / `undefined` renders the em-dash
   * placeholder so the cell stays aligned with neighbors. A row with a
   * date but no slug (pre-slug legacy data) renders the date as plain
   * text instead of a broken link.
   */
  show: { date: string; slug: string | null } | null | undefined;
}

/**
 * Standard cell rendering for a date-that-links-to-a-show. Used wherever
 * a table column shows a date paired with a slug — gap-chart Last Played,
 * song-detail performances Last Played, personal-view Last Seen / Last
 * Before. Empty value is `—` (tertiary), not "Never" or "N/A" — keeps the
 * visual treatment consistent with the rest of the site's tables.
 */
export function ShowDateLink({ show }: ShowDateLinkProps) {
  // Preserve the current SetlistCard view (gap-chart / personal) when
  // navigating to another show — keeps the user in the tab they were
  // already reading instead of dumping them back into the default flow
  // view. No-op on pages without `?view=`.
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const suffix = view === "gap-chart" || view === "personal" ? `?view=${view}` : "";

  if (!show) return <span className="text-content-text-tertiary">—</span>;
  if (!show.slug) {
    return (
      <span className="@container/datecell text-content-text-secondary block">
        <ShowDate date={show.date} />
      </span>
    );
  }
  return (
    <a
      href={`/shows/${show.slug}${suffix}`}
      className="@container/datecell block text-base text-brand-primary hover:text-brand-secondary"
    >
      <ShowDate date={show.date} />
    </a>
  );
}

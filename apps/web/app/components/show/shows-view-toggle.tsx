import { yearListingPath } from "@bip/domain";
import { SegmentLink } from "~/components/ui/segment-button";
import { canonicalizeFilterParams } from "~/lib/tri-state-filter";

export const SHOWS_TABLE_PATH = "/shows/stats";

export type ShowsView = "setlist" | "table";

/**
 * Build the sibling view's URL, carrying the current filters across. The toggle
 * IS the route — there's no `?view=` flag — so a table URL is always shareable
 * as a table and the choice survives a reload.
 *
 * The two views scope a year differently: the setlist view puts it in the path,
 * the table puts it in `timeRange`. `year` is whichever year is currently in
 * scope, or null when the table is showing a wider range than one year — in
 * which case switching to setlists has to land somewhere, so it uses
 * `fallbackYear`.
 */
export function showsViewHref(
  target: ShowsView,
  parameters: URLSearchParams,
  year: number | null,
  fallbackYear: number,
): string {
  const next = new URLSearchParams(parameters);
  // `year` is the legacy alias `getTimeRangeParam` still accepts; drop it so it
  // can't outrank whichever scope we're about to write.
  next.delete("year");

  if (target === "table") {
    if (year !== null) next.set("timeRange", String(year));
    return withSearch(SHOWS_TABLE_PATH, next);
  }

  next.delete("timeRange");
  // Canonicalized because this lands on the year listing, whose edge entries are
  // keyed by the literal query string. The stats table it comes from writes its
  // filters in its own order, which would otherwise fork a second cache entry
  // holding the same bytes.
  return withSearch(yearListingPath(year ?? fallbackYear), canonicalizeFilterParams(next));
}

function withSearch(path: string, parameters: URLSearchParams): string {
  const search = parameters.toString();
  return search ? `${path}?${search}` : path;
}

interface ShowsViewToggleProps {
  active: ShowsView;
  /** Current URL's search params; both destinations compose on top of these. */
  currentURLParameters: URLSearchParams;
  /** The year in scope, or null when the table spans more than one year. */
  year: number | null;
}

/** Setlist ⇄ table switch, in the top-right of both show-list views. */
export function ShowsViewToggle({ active, currentURLParameters, year }: ShowsViewToggleProps) {
  const fallbackYear = new Date().getFullYear();
  return (
    <nav className="inline-flex items-center" aria-label="Show list view">
      <SegmentLink
        active={active === "setlist"}
        to={showsViewHref("setlist", currentURLParameters, year, fallbackYear)}
      >
        setlist
      </SegmentLink>
      <SegmentLink active={active === "table"} to={showsViewHref("table", currentURLParameters, year, fallbackYear)}>
        table
      </SegmentLink>
    </nav>
  );
}

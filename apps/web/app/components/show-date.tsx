import { formatDateShort, formatDateShortMobile } from "~/lib/utils";

/**
 * Single rendering point for show dates across the app. Outputs both the
 * full `M/D/YYYY` and compact `M/D/YY` forms; CSS picks which one to display
 * based on the nearest ancestor labeled `@container/datecell`. When no such
 * container exists (e.g. the SetlistCard header), the default — full form —
 * shows and the compact span stays hidden. Cells that DO declare a
 * `@container/datecell` (DateVenueCell variants, ShowDateLink) swap to the
 * compact form once the cell tightens below ~6rem, so dense tables and
 * narrow layouts collapse dates automatically.
 *
 * Implementation note: ShowDate must not establish the container itself —
 * `container-type: inline-size` zeroes the element's intrinsic inline
 * size, which collapses an inline-block to 0 width and breaks the date
 * character-by-character. The container lives on a sized parent.
 */
export function ShowDate({ date }: { date: string | Date }) {
  return (
    <>
      <span className="inline whitespace-nowrap @max-[6rem]/datecell:hidden">{formatDateShort(date)}</span>
      <span className="hidden whitespace-nowrap @max-[6rem]/datecell:inline">{formatDateShortMobile(date)}</span>
    </>
  );
}

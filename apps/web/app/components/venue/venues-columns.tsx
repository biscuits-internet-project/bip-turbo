import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { ShowDateLink } from "~/components/show-date-link";
import { NumberCell } from "~/components/ui/number-cell";
import { SortableHeader } from "~/components/ui/sortable-header";
import { formatVenueLocation } from "~/lib/format-venue";
import { venueMatchesSearch } from "~/lib/venue-filters";
import type { VenueRow } from "~/lib/venue-rows";

/** First/last show cell — links to the show, em-dash when the venue has none. */
function showDateCell(slug: string | null, date: string | null) {
  return <ShowDateLink show={slug && date ? { date, slug } : null} />;
}

interface GetVenuesColumnsOptions {
  /** Append a delete-action column (only zero-show venues get the button). */
  isAdmin?: boolean;
  /** Revalidate callback fired after a successful delete. */
  onDeleted?: () => void;
}

/**
 * Column definitions for the /venues table. First/last show dates reuse
 * `ShowDateLink` (links to the show, em-dash when absent); the name column's
 * filter spans name+city+state+country so the single search box replaces the
 * old per-field card search. Admins get a trailing column to delete stale
 * zero-show venues.
 */
export function getVenuesColumns({ isAdmin = false, onDeleted }: GetVenuesColumnsOptions = {}): ColumnDef<VenueRow>[] {
  const columns: ColumnDef<VenueRow>[] = [
    {
      id: "name",
      accessorFn: (row) => row.name,
      header: ({ column }) => <SortableHeader column={column} label="Venue" />,
      // Spans name/city/state/country so the lone search box matches any of them.
      filterFn: (row, _columnId, value) => venueMatchesSearch(row.original, value as string),
      cell: ({ row }) => (
        <Link
          to={`/venues/${row.original.slug}`}
          className="text-base text-brand-primary hover:text-brand-secondary font-medium"
        >
          {row.original.name}
        </Link>
      ),
      meta: { weight: 2 },
    },
    {
      id: "location",
      accessorFn: (row) => row.city,
      header: ({ column }) => <SortableHeader column={column} label="Location" />,
      cell: ({ row }) => <span className="text-content-text-secondary">{formatVenueLocation(row.original)}</span>,
      meta: { weight: 1.5 },
    },
    {
      id: "shows",
      accessorFn: (row) => row.showCount,
      header: ({ column }) => <SortableHeader column={column} label="Shows" />,
      cell: ({ row }) => (
        <NumberCell width="3ch" className="text-content-text-primary font-semibold">
          {row.original.showCount}
        </NumberCell>
      ),
      meta: { fixedWidth: "5rem" },
    },
    {
      id: "years",
      accessorFn: (row) => row.years.length,
      header: ({ column }) => <SortableHeader column={column} label="Years Played" />,
      cell: ({ row }) => (
        <span title={row.original.years.join(", ")}>
          <NumberCell width="2ch" className="text-content-text-primary">
            {row.original.years.length}
          </NumberCell>
        </span>
      ),
      // Wide enough that "Years Played" + the sort arrow stay on one line.
      meta: { fixedWidth: "8rem", hideOnMobile: true },
    },
    {
      id: "firstShow",
      accessorFn: (row) => row.firstDate,
      header: ({ column }) => <SortableHeader column={column} label="First Show" />,
      cell: ({ row }) => showDateCell(row.original.firstSlug, row.original.firstDate),
      meta: { weight: 1, hideOnMobile: true },
    },
    {
      id: "lastShow",
      accessorFn: (row) => row.lastDate,
      header: ({ column }) => <SortableHeader column={column} label="Last Show" />,
      cell: ({ row }) => showDateCell(row.original.lastSlug, row.original.lastDate),
      meta: { weight: 1, hideOnMobile: true },
    },
  ];

  if (isAdmin) {
    columns.push({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        // In-use venues can't be deleted (the service guard rejects it), so the
        // affordance only appears on stale zero-show rows.
        if (row.original.showCount > 0) return null;
        return (
          <div className="flex justify-end">
            <DeleteEntityButton
              entityId={row.original.id}
              entityName={row.original.name}
              entityLabel="venue"
              endpoint="/api/admin/venues"
              onDeleted={onDeleted ?? (() => {})}
              variant="icon"
            />
          </div>
        );
      },
      meta: { fixedWidth: "3rem", cellClassName: "!px-0", headerClassName: "!px-0" },
    });
  }

  return columns;
}

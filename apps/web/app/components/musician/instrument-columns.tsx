import type { Instrument } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { NumberCell } from "~/components/ui/number-cell";
import { SortableHeader } from "~/components/ui/sortable-header";
import { formatDateMedium } from "~/lib/utils";

type InstrumentWithUsageCount = Instrument & { usageCount?: number };

// A factory rather than a const so the index page can thread its revalidate
// callback into the per-row delete button.
export function getInstrumentColumns(onDeleted: () => void): ColumnDef<InstrumentWithUsageCount>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => {
        const instrument = row.original;
        return (
          <Link
            to={`/admin/instruments/${instrument.slug}/edit`}
            className="text-brand-primary hover:text-brand-secondary font-medium"
          >
            {instrument.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "usageCount",
      header: ({ column }) => <SortableHeader column={column} label="Usage" />,
      cell: ({ row }) => {
        const count = row.original.usageCount ?? 0;
        return (
          <NumberCell width="4ch" className="text-content-text-primary font-semibold">
            {count}
          </NumberCell>
        );
      },
    },
    {
      accessorKey: "slug",
      header: ({ column }) => <SortableHeader column={column} label="Slug" />,
      cell: ({ row }) => {
        return <span className="text-content-text-secondary font-mono text-sm">{row.original.slug}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} label="Created" />,
      cell: ({ row }) => {
        return <span className="text-content-text-secondary">{formatDateMedium(row.original.createdAt)}</span>;
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const instrument = row.original;
        // In-use instruments can't be deleted (the service guard rejects it), so
        // don't offer the affordance at all.
        if ((instrument.usageCount ?? 0) > 0) return null;
        return (
          <div className="flex justify-end">
            <DeleteEntityButton
              entityId={instrument.id}
              entityName={instrument.name}
              entityLabel="instrument"
              endpoint="/api/admin/instruments"
              onDeleted={onDeleted}
              variant="icon"
            />
          </div>
        );
      },
      meta: { fixedWidth: "3rem", cellClassName: "!px-0", headerClassName: "!px-0" },
    },
  ];
}

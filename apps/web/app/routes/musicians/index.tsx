import type { MusicianWithStats } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { Guitar, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { DataTable } from "~/components/ui/data-table";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { SortableHeader } from "~/components/ui/sortable-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatDateShort } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  musicians: MusicianWithStats[];
}

export const loader = publicLoader(async (): Promise<LoaderData> => {
  return { musicians: await services.musicians.findAllWithStats() };
});

function emptyCell() {
  return <span className="text-content-text-tertiary">-</span>;
}

function dateCell(date: string | null) {
  return date ? formatDateShort(date) : emptyCell();
}

const columns: ColumnDef<MusicianWithStats>[] = [
  {
    accessorKey: "name",
    meta: { weight: 2 },
    header: ({ column }) => <SortableHeader column={column} label="Name" />,
    cell: ({ row }) => (
      <Link
        to={`/musicians/${row.original.slug}`}
        className="text-brand-primary hover:text-brand-secondary font-medium"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "knownFrom",
    meta: { weight: 2, hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="Known From" />,
    cell: ({ row }) => row.original.knownFrom ?? emptyCell(),
  },
  {
    accessorKey: "defaultInstrumentName",
    meta: { weight: 1, hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="Instrument" />,
    cell: ({ row }) =>
      row.original.defaultInstrumentName ? (
        <span className="lowercase">{row.original.defaultInstrumentName}</span>
      ) : (
        emptyCell()
      ),
  },
  {
    accessorKey: "showCount",
    meta: { fixedWidth: "5rem", cellClassName: "tabular-nums" },
    header: ({ column }) => <SortableHeader column={column} label="Shows" />,
  },
  {
    accessorKey: "trackCount",
    meta: { fixedWidth: "5rem", cellClassName: "tabular-nums" },
    header: ({ column }) => <SortableHeader column={column} label="Songs" />,
  },
  {
    accessorKey: "firstShowDate",
    meta: { fixedWidth: "6rem", cellClassName: "tabular-nums", hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="First" />,
    cell: ({ row }) => dateCell(row.original.firstShowDate),
  },
  {
    accessorKey: "lastShowDate",
    meta: { fixedWidth: "6rem", cellClassName: "tabular-nums", hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="Last" />,
    cell: ({ row }) => dateCell(row.original.lastShowDate),
  },
];

export default function MusiciansPage() {
  const { musicians } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="space-y-6">
      <PageHeader
        title="MUSICIANS"
        actions={
          <AdminOnly>
            <LinkButton to="/admin/instruments" icon={Guitar} intent="secondary" iconOnlyOnMobile>
              Manage instruments
            </LinkButton>
            <LinkButton to="/admin/musicians/new" icon={Plus} iconOnlyOnMobile>
              Create Musician
            </LinkButton>
          </AdminOnly>
        }
      />
      <DataTable
        columns={columns}
        data={musicians}
        getRowId={(musician) => musician.id}
        searchKey="name"
        searchPlaceholder="Search musicians..."
        initialSorting={[{ id: "showCount", desc: true }]}
      />
    </div>
  );
}

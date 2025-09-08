import type { Show } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "~/components/ui/data-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatDateShort } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  shows: Show[];
}

export const loader = publicLoader<LoaderData>(async () => {
  // Get shows ordered by rating (highest first), limit to 100
  const shows = await services.shows.search("", {
    pagination: { page: 1, limit: 100 },
    sort: [{ field: "averageRating", direction: "desc" }],
    filters: [
      {
        field: "averageRating",
        operator: "gt",
        value: 0,
      },
      {
        field: "ratingsCount",
        operator: "gt",
        value: 10,
      },
    ],
    includes: ["venue"],
  });

  return { shows };
});

export function meta() {
  return [
    { title: "Top Rated Shows | Biscuits Internet Project" },
    {
      name: "description",
      content: "Discover the highest rated Disco Biscuits shows of all time.",
    },
  ];
}

// Add rank to shows for table display
interface ShowWithRank extends Show {
  rank: number;
}

const columns: ColumnDef<ShowWithRank>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => <span className="font-medium text-content-text-primary">{row.original.rank}</span>,
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-rating-gold mr-1" />
          <span className="font-medium text-content-text-primary">{row.original.averageRating?.toFixed(1) || "—"}</span>
        </div>
        <span className="text-content-text-tertiary text-sm">({row.original.ratingsCount})</span>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <Link
        to={`/shows/${row.original.slug}`}
        className="text-brand-primary hover:text-brand-secondary hover:underline"
      >
        {formatDateShort(row.original.date)}
      </Link>
    ),
  },
  {
    accessorKey: "venue.name",
    header: "Venue",
    cell: ({ row }) => {
      const venue = row.original.venue;
      if (!venue) return <span className="text-content-text-secondary">—</span>;

      return (
        <div>
          <div className="text-content-text-primary">{venue.name}</div>
          <div className="text-content-text-tertiary">
            {venue.city} {venue.state}
          </div>
        </div>
      );
    },
  },
];

export default function TopRated() {
  const { shows = [] } = useSerializedLoaderData<LoaderData>();

  // Add rank to each show
  const showsWithRank: ShowWithRank[] = shows.map((show, index) => ({
    ...show,
    rank: index + 1,
  }));

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="page-heading">TOP RATED SHOWS</h1>
        </div>

        <DataTable columns={columns} data={showsWithRank} hideSearch={true} hidePaginationText={true} />
      </div>
    </div>
  );
}

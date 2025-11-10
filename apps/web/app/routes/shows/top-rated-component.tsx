import type { FilterCondition } from "@bip/core/_shared/database/types";
import type { Show } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { RatingComponent } from "~/components/rating";
import { DataTable } from "~/components/ui/data-table";
import { YearFilterNav } from "~/components/year-filter-nav";
import { formatDateShort } from "~/lib/utils";
import { services } from "~/server/services";

export interface LoaderData {
  shows: Show[];
  year: number | null;
}

export async function getTopRatedShows(year: number | null): Promise<LoaderData> {
  const yearFilters: FilterCondition<Show>[] = year
    ? [
        {
          field: "date",
          operator: "gte",
          value: `${year}-01-01`,
        },
        {
          field: "date",
          operator: "lte",
          value: `${year}-12-31`,
        },
      ]
    : [];
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
      ...yearFilters,
    ],
    includes: ["venue"],
  });
  return { shows, year };
}

export interface ShowWithRank extends Show {
  rank: number;
}

export const columns: ColumnDef<ShowWithRank>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => <span className="font-medium text-content-text-primary">{row.original.rank}</span>,
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => <RatingComponent rating={row.original.averageRating} ratingsCount={row.original.ratingsCount} />,
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

export function TopRatedComponent({ shows, year }: { shows: Show[]; year: number | null }) {
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
        <YearFilterNav currentYear={year} basePath="/shows/top-rated/" showAllButton={true} />
        <DataTable columns={columns} data={showsWithRank} hideSearch={true} hidePaginationText={true} />
      </div>
    </div>
  );
}

export function topRatedMeta(year?: number) {
  return [
    {
      title: year
        ? `Top Rated Shows ${year} | Biscuits Internet Project`
        : "Top Rated Shows | Biscuits Internet Project",
    },
    {
      name: "description",
      content: year
        ? `Discover the highest rated Disco Biscuits shows of ${year}.`
        : "Discover the highest rated Disco Biscuits shows of all time.",
    },
  ];
}

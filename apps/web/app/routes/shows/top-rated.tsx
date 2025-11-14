import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { RatingComponent } from "~/components/rating";
import { DataTable } from "~/components/ui/data-table";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatDateShort } from "~/lib/utils";
import { getTopRatedShows, type ShowWithRank, type TopRatedShowsLoaderData } from "~/routes/shows/top-rated-shows";

const MIN_SHOW_RATINGS = 10;
export const loader = publicLoader<TopRatedShowsLoaderData>(() => getTopRatedShows(null));

export function meta() {
  const original = [
    { title: "Top Rated Shows | Biscuits Internet Project" },
    {
      name: "description",
      content: "Discover the highest rated Disco Biscuits shows of all time.",
    },
  ];
  return original;
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

export default function TopRated() {
  const { shows = [] } = useSerializedLoaderData<TopRatedShowsLoaderData>();
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
        <YearFilterNav
          currentYear={null}
          basePath="/shows/top-rated/"
          showAllButton={true}
          additionalText={`min ${MIN_SHOW_RATINGS} ratings`}
        />
        <DataTable columns={columns} data={showsWithRank} hideSearch={true} hidePaginationText={true} />
      </div>
    </div>
  );
}

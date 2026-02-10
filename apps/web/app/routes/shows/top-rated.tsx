import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RatingComponent } from "~/components/rating";
import { DataTable } from "~/components/ui/data-table";
import { LoginPromptPopover } from "~/components/ui/login-prompt-popover";
import { StarRating } from "~/components/ui/star-rating";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSession } from "~/hooks/use-session";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn, formatDateShort } from "~/lib/utils";
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

// Rating cell component with expand/collapse behavior
function RatingCell({ show, userRating }: { show: ShowWithRank; userRating?: number | null }) {
  const { user } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedRating, setDisplayedRating] = useState(show.averageRating ?? 0);
  const [displayedCount, setDisplayedCount] = useState(show.ratingsCount ?? 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [localHasRated, setLocalHasRated] = useState(userRating !== null && userRating !== undefined);

  const handleAverageRatingChange = (average: number, count: number) => {
    setIsAnimating(true);
    setDisplayedRating(average);
    setDisplayedCount(count);
    setLocalHasRated(true);
    setIsExpanded(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (!user) {
    return (
      <LoginPromptPopover message="Sign in to rate">
        <button
          type="button"
          className="flex items-center justify-center gap-1 glass-secondary px-2 h-6 sm:px-3 sm:h-8 rounded-md cursor-pointer hover:brightness-110 border border-dashed border-glass-border hover:border-amber-500/30"
        >
          <RatingComponent rating={displayedRating} ratingsCount={displayedCount} />
        </button>
      </LoginPromptPopover>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsExpanded(!isExpanded)}
      className={cn(
        "flex items-center justify-center gap-1 px-2 h-6 sm:px-3 sm:h-8 rounded-md transition-all",
        "hover:brightness-110 cursor-pointer",
        localHasRated
          ? "bg-amber-500/10 border border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
          : "glass-secondary border border-dashed border-glass-border hover:border-amber-500/30",
        isAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
      )}
    >
      {isExpanded ? (
        <StarRating
          rateableId={show.id}
          rateableType="Show"
          initialRating={userRating}
          showSlug={show.slug}
          onAverageRatingChange={handleAverageRatingChange}
          skipRevalidation={true}
        />
      ) : (
        <RatingComponent rating={displayedRating} ratingsCount={displayedCount} />
      )}
    </button>
  );
}

const createColumns = (userRatingMap: Map<string, number | null>): ColumnDef<ShowWithRank>[] => [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => <span className="font-medium text-content-text-primary">{row.original.rank}</span>,
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => <RatingCell show={row.original} userRating={userRatingMap.get(row.original.id)} />,
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
  const { user } = useSession();
  const { shows = [] } = useSerializedLoaderData<TopRatedShowsLoaderData>();
  const showsWithRank: ShowWithRank[] = shows.map((show, index) => ({
    ...show,
    rank: index + 1,
  }));

  // Fetch user data (ratings, attendance) for all shows
  const showIds = useMemo(() => shows.map((show) => show.id), [shows]);
  const { userRatingMap } = useShowUserData(user ? showIds : []);

  // Create columns with user rating data
  const columns = useMemo(() => createColumns(userRatingMap), [userRatingMap]);

  return (
    <div>
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

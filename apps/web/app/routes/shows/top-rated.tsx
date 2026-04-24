import { SetlistList } from "~/components/setlist/setlist-list";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getTopRatedShows, type TopRatedShowsLoaderData } from "~/routes/shows/top-rated-shows";

export const loader = publicLoader<TopRatedShowsLoaderData>(async ({ params, context }) => {
  const year = params.year ? Number(params.year) : null;
  return getTopRatedShows(year, context);
});

export function meta({ params }: { params: { year?: string } }) {
  const year = params.year ? Number(params.year) : null;
  const suffix = year ? ` ${year}` : "";
  const descriptionSuffix = year ? ` of ${year}` : " of all time";
  return [
    { title: `Top Rated Shows${suffix} | Biscuits Internet Project` },
    {
      name: "description",
      content: `Discover the highest rated Disco Biscuits shows${descriptionSuffix}.`,
    },
  ];
}

export default function TopRated() {
  const { setlists, year, minShowRatings, countsByYear, allCount, externalSources, initialUserData } =
    useSerializedLoaderData<TopRatedShowsLoaderData>();

  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="page-heading">TOP RATED SHOWS{year ? ` ${year}` : ""}</h1>
        </div>
        <YearFilterNav
          currentYear={year}
          basePath="/shows/top-rated/"
          showAllButton={true}
          additionalText={`min ${minShowRatings} ratings`}
          counts={countsByYear}
          allCount={allCount}
        />
        <div className="space-y-1">
          <SetlistList
            setlists={setlists}
            externalSources={externalSources}
            initialUserData={initialUserData}
            numbered
            collapsible
          />
        </div>
      </div>
    </div>
  );
}

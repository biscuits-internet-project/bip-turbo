import { CacheKeys, type SetlistLight, type SongPagePerformance } from "@bip/domain";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useMemo } from "react";
import type { ClientLoaderFunctionArgs } from "react-router";
import { Link, type LoaderFunctionArgs, redirect } from "react-router";
import { PerformanceTable } from "~/components/performance";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { addDaysYearAgnostic, formatMonthDay, isValidMonthDay } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: SetlistLight[];
  performances: SongPagePerformance[];
  monthDay: string;
  displayLabel: string;
  previousMonthDay: string;
  nextMonthDay: string;
}

export function headers(): Headers {
  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600");
  return headers;
}

export const loader = publicLoader(async ({ params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const { monthDay } = params;

  if (!monthDay) {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    throw redirect(`/on-this-day/${mm}-${dd}`);
  }

  if (!isValidMonthDay(monthDay)) {
    throw new Response(null, { status: 404 });
  }

  const setlistsCacheKey = CacheKeys.shows.list({ monthDay, sort: "desc" });
  const allTimersCacheKey = CacheKeys.songs.allTimersOnThisDay(monthDay);

  const [setlists, allTimersResult] = await Promise.all([
    services.cache.getOrSet(setlistsCacheKey, async () => {
      return services.setlists.findManyLight({
        filters: { monthDay },
        sort: [{ field: "date", direction: "desc" }],
      });
    }),
    services.cache.getOrSet(allTimersCacheKey, async () => {
      return services.songPageComposer.buildAllTimers({ monthDay });
    }),
  ]);

  const displayLabel = formatMonthDay(monthDay);
  const previousMonthDay = addDaysYearAgnostic(monthDay, -1);
  const nextMonthDay = addDaysYearAgnostic(monthDay, 1);

  return {
    setlists,
    performances: allTimersResult.performances,
    monthDay,
    displayLabel,
    previousMonthDay,
    nextMonthDay,
  };
});

export function meta({ data }: { data: LoaderData }) {
  if (!data) return [{ title: "On This Day | Biscuits Internet Project" }];
  return [
    { title: `On This Day: ${data.displayLabel} | Biscuits Internet Project` },
    { name: "description", content: `Disco Biscuits shows and all-time performances on ${data.displayLabel}` },
  ];
}

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

export default function OnThisDay() {
  const { setlists, performances, displayLabel, previousMonthDay, nextMonthDay } =
    useSerializedLoaderData<LoaderData>();

  const showIds = useMemo(() => setlists.map((setlist) => setlist.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds);

  return (
    <div className="py-2">
      <div className="space-y-6 md:space-y-8">
        <div className="relative">
          <h1 className="page-heading">ON THIS DAY</h1>
          <div className="flex justify-between items-center -mt-4">
            <Link
              to={`/on-this-day/${previousMonthDay}`}
              prefetch="intent"
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>{formatMonthDay(previousMonthDay)}</span>
            </Link>
            <span className="text-content-text-secondary text-3xl font-medium">{displayLabel}</span>
            <Link
              to={`/on-this-day/${nextMonthDay}`}
              prefetch="intent"
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              <span>{formatMonthDay(nextMonthDay)}</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-content-text-primary">All-Timers</h2>
            </div>
            <Link
              to="/songs/all-timers"
              className="text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
            >
              View all →
            </Link>
          </div>
          {performances.length === 0 ? (
            <div className="text-center py-2">
              <p className="text-content-text-secondary text-lg">None on this date</p>
            </div>
          ) : (
            <PerformanceTable performances={performances} showSongColumn pageSize={10} />
          )}
        </div>

        <div className="space-y-4">
          {setlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-content-text-secondary text-lg">No shows on {displayLabel}.</p>
            </div>
          ) : (
            setlists.map((setlist) => (
              <SetlistCard
                key={setlist.show.id}
                setlist={setlist}
                userAttendance={attendanceMap.get(setlist.show.id) ?? null}
                userRating={userRatingMap.get(setlist.show.id) ?? null}
                showRating={averageRatingMap.get(setlist.show.id)?.average ?? setlist.show.averageRating}
                className="transition-all duration-300 transform hover:scale-[1.01]"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

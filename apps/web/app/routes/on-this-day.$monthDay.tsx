import { CacheKeys, type SetlistLight } from "@bip/domain";
import { useMemo } from "react";
import type { ClientLoaderFunctionArgs } from "react-router";
import { type LoaderFunctionArgs, redirect } from "react-router";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatMonthDay, isValidMonthDay } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: SetlistLight[];
  monthDay: string;
  displayLabel: string;
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

  const cacheKey = CacheKeys.shows.list({ monthDay, sort: "desc" });

  const setlists = await services.cache.getOrSet(cacheKey, async () => {
    return services.setlists.findManyLight({
      filters: { monthDay },
      sort: [{ field: "date", direction: "desc" }],
    });
  });

  const displayLabel = formatMonthDay(monthDay);

  return { setlists, monthDay, displayLabel };
});

export function meta({ data }: { data: LoaderData }) {
  if (!data) return [{ title: "On This Day | Biscuits Internet Project" }];
  return [
    { title: `On This Day: ${data.displayLabel} | Biscuits Internet Project` },
    { name: "description", content: `Disco Biscuits shows played on ${data.displayLabel}` },
  ];
}

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

export default function OnThisDay() {
  const { setlists, displayLabel } = useSerializedLoaderData<LoaderData>();

  const showIds = useMemo(() => setlists.map((setlist) => setlist.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds);

  return (
    <div className="py-2">
      <div className="space-y-6 md:space-y-8">
        <div className="relative">
          <h1 className="page-heading">ON THIS DAY</h1>
          <div className="flex justify-center -mt-4">
            <span className="text-content-text-secondary text-3xl font-medium">{displayLabel}</span>
          </div>
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

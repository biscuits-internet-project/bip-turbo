import type { SetlistLight } from "@bip/domain";
import { ArrowUp, Camera } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientLoaderFunctionArgs } from "react-router";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: SetlistLight[];
}

export const loader = publicLoader(async (): Promise<LoaderData> => {
  const setlists = await services.setlists.findManyLight({
    filters: {
      hasPhotos: true,
    },
    sort: [{ field: "date", direction: "desc" }],
  });

  return { setlists };
});

export function meta() {
  return [
    { title: "Shows with Photos | biscuits.info" },
    { name: "description", content: "Disco Biscuits shows with photos" },
  ];
}

export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

export default function ShowsWithPhotos() {
  const { setlists } = useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const showIds = useMemo(() => setlists.map((setlist) => setlist.show.id), [setlists]);
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds);

  // Group by year
  const setlistsByYear = useMemo(() => {
    return setlists.reduce(
      (acc, setlist) => {
        const year = new Date(setlist.show.date).getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(setlist);
        return acc;
      },
      {} as Record<number, SetlistLight[]>,
    );
  }, [setlists]);

  const years = useMemo(() => {
    return Object.keys(setlistsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [setlistsByYear]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="relative">
          <h1 className="page-heading">SHOWS WITH PHOTOS</h1>
          <div className="flex items-center justify-center gap-2 -mt-4 text-content-text-secondary">
            <Camera className="h-5 w-5" />
            <span className="text-xl font-medium">{setlists.length} shows</span>
          </div>
        </div>

        {/* Year jump nav */}
        <div className="card-premium rounded-lg overflow-hidden">
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-white mb-3">Jump to Year</h2>
            <div className="flex flex-wrap gap-1.5">
              {years.map((year) => (
                <a
                  key={year}
                  href={`#year-${year}`}
                  className="px-2 py-1.5 text-sm font-medium rounded-md text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white transition-all"
                >
                  {year}
                  <span className="ml-1 text-xs text-content-text-tertiary">({setlistsByYear[year].length})</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Shows grouped by year */}
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year} className="space-y-4">
              <div id={`year-${year}`} className="scroll-mt-20">
                <h2 className="text-xl font-semibold text-white border-b border-glass-border/30 pb-2">
                  {year}
                  <span className="ml-2 text-sm font-normal text-content-text-tertiary">
                    ({setlistsByYear[year].length} shows)
                  </span>
                </h2>
              </div>
              {setlistsByYear[year].map((setlist) => (
                <SetlistCard
                  key={setlist.show.id}
                  setlist={setlist}
                  userAttendance={attendanceMap.get(setlist.show.id) ?? null}
                  userRating={userRatingMap.get(setlist.show.id) ?? null}
                  showRating={averageRatingMap.get(setlist.show.id)?.average ?? setlist.show.averageRating}
                  className="transition-all duration-300 transform hover:scale-[1.01]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Back to Top */}
      <div
        className={cn(
          "fixed bottom-6 right-6 transition-all duration-300 z-50",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
        )}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className="h-14 w-14 rounded-full bg-brand-primary hover:bg-brand-secondary shadow-xl border-2 border-white/20"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}

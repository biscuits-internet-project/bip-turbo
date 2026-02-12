import { type AllTimersPageView, CacheKeys } from "@bip/domain";
import { ArrowLeft, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { PerformanceTable } from "~/components/performance";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = publicLoader(async (): Promise<AllTimersPageView> => {
  const cacheKey = CacheKeys.songs.allTimers();
  const cacheOptions = { ttl: 3600 };

  return await services.cache.getOrSet(cacheKey, async () => services.songPageComposer.buildAllTimers(), cacheOptions);
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  const { performances } = useSerializedLoaderData<AllTimersPageView>();

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">All-Timers</h1>
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          to="/songs"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to songs</span>
        </Link>
      </div>

      <div className="glass-content rounded-lg p-4 md:p-6">
        <PerformanceTable performances={performances} showSongColumn />
      </div>
    </div>
  );
}

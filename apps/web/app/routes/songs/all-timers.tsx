import { CacheKeys } from "@bip/domain";
import { createNoteworthyLoader } from "~/lib/noteworthy-performance-loader";
import { NoteworthyPerformancePage } from "~/lib/noteworthy-performance-page";
import { services } from "~/server/services";

export const loader = createNoteworthyLoader({
  cacheKey: CacheKeys.songs.allTimers(),
  build: () => services.songPageComposer.buildAllTimers(),
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  return <NoteworthyPerformancePage apiUrl="/api/all-timers" hideAllTimerToggle hideJamChartToggle />;
}

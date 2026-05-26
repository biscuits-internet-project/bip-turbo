import { CacheKeys } from "@bip/domain";
import { createNoteworthyLoader } from "~/lib/noteworthy-performance-loader";
import { NoteworthyPerformancePage } from "~/lib/noteworthy-performance-page";
import { services } from "~/server/services";

export const loader = createNoteworthyLoader({
  cacheKey: CacheKeys.songs.jamCharts(),
  build: () => services.songPageComposer.buildJamCharts(),
});

export function meta() {
  return [
    { title: "Jam Charts | Songs" },
    { name: "description", content: "Noteworthy performances: all-timers and curated jam-chart picks" },
  ];
}

export default function JamChartsPage() {
  return <NoteworthyPerformancePage apiUrl="/api/jam-charts" hideJamChartToggle />;
}

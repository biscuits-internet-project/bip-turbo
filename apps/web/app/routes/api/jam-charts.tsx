import { createNoteworthyApiLoader } from "~/lib/noteworthy-performance-api";
import { services } from "~/server/services";

export const loader = createNoteworthyApiLoader({
  cacheSuffix: "jam-charts",
  build: (filters) => services.songPageComposer.buildJamCharts(filters),
});

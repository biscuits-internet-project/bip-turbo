import { createNoteworthyApiLoader } from "~/lib/noteworthy-performance-api";
import { services } from "~/server/services";

export const loader = createNoteworthyApiLoader({
  cacheSuffix: "all-timers",
  build: (filters) => services.songPageComposer.buildAllTimers(filters),
});

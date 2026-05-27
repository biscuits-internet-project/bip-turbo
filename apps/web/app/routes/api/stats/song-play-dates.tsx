import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

/**
 * Backs the gap-chart "Played Before" column. Returns the global
 * `{songId: [date, ...]}` map of stats-eligible performances so the
 * client can binary-search prior counts for any show without paying
 * a per-show server query. Public — the catalog is not user-scoped.
 * Browsers fetch this once per session via React Query (lazy on the
 * first gap-chart open); Redis serves repeat callers.
 */
export const loader = publicLoader(async () => {
  try {
    const blob = await services.stats.getSongPlayDates();
    return Response.json(blob);
  } catch (error) {
    logger.error("Error fetching song play dates", { error });
    return new Response(JSON.stringify({ error: "Failed to fetch song play dates" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

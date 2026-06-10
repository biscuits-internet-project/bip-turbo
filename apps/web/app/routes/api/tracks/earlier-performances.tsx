import { adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

// GET /api/tracks/earlier-performances?songId=<id>&before=<YYYY-MM-DD>&trackId=<id>
// - the earlier same-song performances offered in the completions picker, plus
// the `selected` earlier-track ids the completer (`trackId`, optional for a track
// still being added) already completes, so the editor seeds its current links.
export const loader = adminLoader(async ({ request }) => {
  const url = new URL(request.url);
  const songId = url.searchParams.get("songId");
  const before = url.searchParams.get("before");
  const trackId = url.searchParams.get("trackId");
  if (!songId || !before) {
    throw new Response("songId and before query params are required", { status: 400 });
  }
  const [recent, selected] = await Promise.all([
    services.tracks.findEarlierPerformances(songId, before),
    trackId ? services.tracks.getCompletionEarlierTrackIds(trackId) : Promise.resolve([]),
  ]);
  // Keep already-linked completions visible (with their dates) even when they
  // fall outside the recent-performances cap, so their chips don't degrade to a
  // bare id.
  const missingIds = selected.filter((id) => !recent.some((performance) => performance.trackId === id));
  const extra = await services.tracks.findPerformancesByTrackIds(missingIds);
  return { performances: [...extra, ...recent], selected };
});

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { batchedPostFetch } from "~/lib/batched-fetch";
import type { TrackUserRatingsResponse } from "~/routes/api/tracks/user-ratings";

function mergeTrackUserRatings(results: TrackUserRatingsResponse[]): TrackUserRatingsResponse {
  const merged: TrackUserRatingsResponse = { userRatings: {} };
  for (const result of results) {
    Object.assign(merged.userRatings, result.userRatings);
  }
  return merged;
}

export function useTrackUserRatings(trackIds: string[]) {
  const queryKey = useMemo(() => ["tracks", "user-ratings", [...trackIds].sort().join(",")], [trackIds]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      batchedPostFetch<TrackUserRatingsResponse>(
        "/api/tracks/user-ratings",
        trackIds,
        "trackIds",
        400,
        mergeTrackUserRatings,
      ),
    enabled: trackIds.length > 0,
    staleTime: 30_000,
  });

  const userRatingMap = useMemo(() => {
    const map = new Map<string, number>();
    if (data?.userRatings) {
      for (const [trackId, rating] of Object.entries(data.userRatings)) {
        if (rating !== null) {
          map.set(trackId, rating);
        }
      }
    }
    return map;
  }, [data?.userRatings]);

  return { userRatingMap, isLoading };
}

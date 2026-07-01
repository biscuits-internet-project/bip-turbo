import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { batchedPostFetch } from "~/lib/batched-fetch";
import { trackUserRatingsQueryKey } from "~/lib/query-keys";
import type { TrackUserRatingsResponse } from "~/server/track-user-ratings";

function mergeTrackUserRatings(results: TrackUserRatingsResponse[]): TrackUserRatingsResponse {
  const merged: TrackUserRatingsResponse = { userRatings: {}, averageRatings: {} };
  for (const result of results) {
    Object.assign(merged.userRatings, result.userRatings);
    Object.assign(merged.averageRatings, result.averageRatings);
  }
  return merged;
}

export function useTrackUserRatings(trackIds: string[]) {
  const queryKey = useMemo(() => trackUserRatingsQueryKey(trackIds), [trackIds]);

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

  const averageRatingMap = useMemo(() => {
    const map = new Map<string, { average: number; count: number }>();
    if (data?.averageRatings) {
      for (const [trackId, value] of Object.entries(data.averageRatings)) {
        map.set(trackId, value);
      }
    }
    return map;
  }, [data?.averageRatings]);

  return { userRatingMap, averageRatingMap, isLoading };
}

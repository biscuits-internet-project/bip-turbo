import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { batchedPostFetch } from "~/lib/batched-fetch";
import { trackUserRatingsQueryKey } from "~/lib/query-keys";
import type { TrackRatingComparison, TrackUserRatingsResponse } from "~/server/track-user-ratings";

function mergeTrackUserRatings(results: TrackUserRatingsResponse[]): TrackUserRatingsResponse {
  const merged: TrackUserRatingsResponse = {
    userRatings: {},
    averageRatings: {},
    calibratedRatings: {},
    comparisons: {},
  };
  for (const result of results) {
    Object.assign(merged.userRatings, result.userRatings);
    Object.assign(merged.averageRatings, result.averageRatings);
    Object.assign(merged.calibratedRatings, result.calibratedRatings);
    Object.assign(merged.comparisons, result.comparisons);
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

  // The headline map a viewer sees: the plain community average, overlaid with the
  // calibrated score wherever the viewer opted in and it exists — same {average, count}
  // shape either way, so rating components don't need to know which is which.
  const displayRatingMap = useMemo(() => {
    const map = new Map(averageRatingMap);
    if (data?.calibratedRatings) {
      for (const [trackId, value] of Object.entries(data.calibratedRatings)) {
        map.set(trackId, { average: value.rating, count: value.count });
      }
    }
    return map;
  }, [averageRatingMap, data?.calibratedRatings]);

  const comparisonMap = useMemo(() => {
    const map = new Map<string, TrackRatingComparison>();
    if (data?.comparisons) {
      for (const [trackId, value] of Object.entries(data.comparisons)) {
        map.set(trackId, value);
      }
    }
    return map;
  }, [data?.comparisons]);

  return { userRatingMap, averageRatingMap, displayRatingMap, comparisonMap, isLoading };
}

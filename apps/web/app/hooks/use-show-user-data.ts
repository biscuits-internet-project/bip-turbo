import type { ShowRankComparison } from "@bip/core";
import type { Attendance } from "@bip/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { batchedPostFetch } from "~/lib/batched-fetch";
import { showUserDataQueryKey } from "~/lib/query-keys";
import type { ShowUserDataResponse } from "~/server/show-user-data";

/**
 * Every map holds only the shows that have a value; a missing key means "no
 * attendance / no rating / no average", so callers read through `?? null`.
 */
interface UseShowUserDataResult {
  attendanceMap: Map<string, Attendance>;
  userRatingMap: Map<string, number>;
  averageRatingMap: Map<string, { average: number; count: number }>;
  displayedRatingMap: Map<string, { rating: number; count: number }>;
  rankComparisonMap: Map<string, ShowRankComparison>;
  isLoading: boolean;
  error: Error | null;
}

function mergeShowUserData(results: ShowUserDataResponse[]): ShowUserDataResponse {
  const merged: ShowUserDataResponse = {
    attendances: {},
    userRatings: {},
    averageRatings: {},
    displayedRatings: {},
    rankComparisons: {},
  };

  for (const result of results) {
    Object.assign(merged.attendances, result.attendances);
    Object.assign(merged.userRatings, result.userRatings);
    Object.assign(merged.averageRatings, result.averageRatings);
    Object.assign(merged.displayedRatings, result.displayedRatings);
    Object.assign(merged.rankComparisons, result.rankComparisons);
  }

  return merged;
}

/**
 * Turn one show-id-keyed slice of the response into a Map for O(1) lookup,
 * preserving "absent means no value" — the response only carries shows that
 * have one.
 */
function toShowIdMap<V>(source: Record<string, V> | undefined): Map<string, V> {
  return new Map(Object.entries(source ?? {}));
}

export function useShowUserData(showIds: string[]): UseShowUserDataResult {
  const queryKey = useMemo(() => showUserDataQueryKey(showIds), [showIds]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      batchedPostFetch<ShowUserDataResponse>("/api/shows/user-data", showIds, "showIds", 200, mergeShowUserData),
    enabled: showIds.length > 0,
    staleTime: 30_000,
  });

  const attendanceMap = useMemo(() => toShowIdMap(data?.attendances), [data?.attendances]);
  const userRatingMap = useMemo(() => toShowIdMap(data?.userRatings), [data?.userRatings]);
  const averageRatingMap = useMemo(() => toShowIdMap(data?.averageRatings), [data?.averageRatings]);
  const displayedRatingMap = useMemo(() => toShowIdMap(data?.displayedRatings), [data?.displayedRatings]);
  const rankComparisonMap = useMemo(() => toShowIdMap(data?.rankComparisons), [data?.rankComparisons]);

  return {
    attendanceMap,
    userRatingMap,
    averageRatingMap,
    displayedRatingMap,
    rankComparisonMap,
    isLoading,
    error: error as Error | null,
  };
}

// Mutation for toggling attendance
interface AttendanceMutationVariables {
  showId: string;
  currentAttendance: Attendance | null;
}

interface AttendanceMutationResult {
  attendance: Attendance | null;
  isAttending: boolean;
}

async function toggleAttendance({
  showId,
  currentAttendance,
}: AttendanceMutationVariables): Promise<AttendanceMutationResult> {
  if (currentAttendance?.id) {
    // Remove attendance
    const response = await fetch("/api/attendances", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentAttendance.id }),
    });
    if (!response.ok) throw new Error("Failed to remove attendance");
    return { attendance: null, isAttending: false };
  } else {
    // Add attendance
    const response = await fetch("/api/attendances", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showId }),
    });
    if (!response.ok) throw new Error("Failed to mark attendance");
    const data = await response.json();
    return { attendance: data.attendance, isAttending: true };
  }
}

/**
 * Set or clear one show's attendance in a cached response. Un-attending deletes
 * the key rather than writing null, matching how the server builds the map.
 */
function withAttendance(
  oldData: ShowUserDataResponse,
  showId: string,
  attendance: Attendance | null,
): ShowUserDataResponse {
  const attendances = { ...oldData.attendances };
  if (attendance) attendances[showId] = attendance;
  else delete attendances[showId];
  return { ...oldData, attendances };
}

/**
 * Set or clear one show's rating in a cached response, so a badge reflects a
 * fresh vote without waiting for a route revalidation. Clearing a rating
 * deletes the key rather than writing null, matching how the server builds the
 * map. A null `average` leaves the community average untouched — the ratings
 * endpoint doesn't always return a fresh one.
 */
export function withShowRating(
  oldData: ShowUserDataResponse,
  showId: string,
  userRating: number | null,
  average: { average: number; count: number } | null,
): ShowUserDataResponse {
  const userRatings = { ...oldData.userRatings };
  if (userRating === null) delete userRatings[showId];
  else userRatings[showId] = userRating;

  const averageRatings = { ...oldData.averageRatings };
  if (average) averageRatings[showId] = average;

  return { ...oldData, userRatings, averageRatings };
}

export function useAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAttendance,
    onMutate: async ({ showId, currentAttendance }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["shows", "user-data"] });

      // Snapshot previous value for rollback
      const previousData = queryClient.getQueriesData<ShowUserDataResponse>({
        queryKey: ["shows", "user-data"],
      });

      // Optimistically update the cache
      queryClient.setQueriesData<ShowUserDataResponse>({ queryKey: ["shows", "user-data"] }, (oldData) =>
        oldData
          ? withAttendance(
              oldData,
              showId,
              // Toggle: drop the entry when un-attending, else stand in until the
              // real row comes back.
              currentAttendance ? null : ({ id: "optimistic", showId, userId: "" } as Attendance),
            )
          : oldData,
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        for (const [queryKey, data] of context.previousData) {
          queryClient.setQueryData(queryKey, data);
        }
      }
    },
    onSuccess: (result, { showId }) => {
      // Update cache with actual result
      queryClient.setQueriesData<ShowUserDataResponse>({ queryKey: ["shows", "user-data"] }, (oldData) =>
        oldData ? withAttendance(oldData, showId, result.attendance) : oldData,
      );
    },
  });
}

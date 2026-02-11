import type { Attendance } from "@bip/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ShowUserDataResponse } from "~/routes/api/shows/user-data";

interface UseShowUserDataResult {
  attendanceMap: Map<string, Attendance | null>;
  userRatingMap: Map<string, number | null>;
  averageRatingMap: Map<string, { average: number; count: number } | null>;
  isLoading: boolean;
  error: Error | null;
}

async function fetchShowUserData(showIds: string[]): Promise<ShowUserDataResponse> {
  const response = await fetch("/api/shows/user-data", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ showIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch show user data");
  }

  return response.json();
}

export function useShowUserData(showIds: string[]): UseShowUserDataResult {
  // Create a stable key from sorted show IDs
  const queryKey = useMemo(() => ["shows", "user-data", [...showIds].sort().join(",")], [showIds]);

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetchShowUserData(showIds),
    enabled: showIds.length > 0,
    staleTime: 30_000, // 30 seconds
  });

  // Transform response into Maps for O(1) lookup
  const attendanceMap = useMemo(() => {
    const map = new Map<string, Attendance | null>();
    if (data?.attendances) {
      for (const [showId, attendance] of Object.entries(data.attendances)) {
        map.set(showId, attendance);
      }
    }
    return map;
  }, [data?.attendances]);

  const userRatingMap = useMemo(() => {
    const map = new Map<string, number | null>();
    if (data?.userRatings) {
      for (const [showId, rating] of Object.entries(data.userRatings)) {
        map.set(showId, rating);
      }
    }
    return map;
  }, [data?.userRatings]);

  const averageRatingMap = useMemo(() => {
    const map = new Map<string, { average: number; count: number } | null>();
    if (data?.averageRatings) {
      for (const [showId, avgData] of Object.entries(data.averageRatings)) {
        map.set(showId, avgData);
      }
    }
    return map;
  }, [data?.averageRatings]);

  return {
    attendanceMap,
    userRatingMap,
    averageRatingMap,
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
      queryClient.setQueriesData<ShowUserDataResponse>(
        { queryKey: ["shows", "user-data"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            attendances: {
              ...oldData.attendances,
              // Toggle: if currently attending, set to null; otherwise set a placeholder
              [showId]: currentAttendance ? null : ({ id: "optimistic", showId, userId: "" } as Attendance),
            },
          };
        }
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
      queryClient.setQueriesData<ShowUserDataResponse>(
        { queryKey: ["shows", "user-data"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            attendances: {
              ...oldData.attendances,
              [showId]: result.attendance,
            },
          };
        }
      );
    },
  });
}

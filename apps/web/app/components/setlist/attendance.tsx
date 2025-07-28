import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Attendance } from "@bip/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface AttendanceData {
  attendances: Attendance[];
}

interface Props {
  showId: string;
  initialAttendance: Attendance | null;
}

export function AttendanceToggle({ showId, initialAttendance }: Props) {
  console.log("AttendanceToggle", showId, initialAttendance);
  const [isAttending, setIsAttending] = useState(!!initialAttendance);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(initialAttendance);
  const queryClient = useQueryClient();

  // Keep currentAttendance in sync with initialAttendance
  useEffect(() => {
    setCurrentAttendance(initialAttendance);
  }, [initialAttendance]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ showId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create attendance");
      }

      return response.json();
    },
    onMutate: () => {
      // Optimistically update
      setIsAttending(true);
    },
    onSuccess: (data) => {
      setCurrentAttendance(data.attendance);
      setIsAttending(true);
      queryClient.setQueryData(["attendances", showId], (old: AttendanceData | undefined) => {
        const oldAttendances = old?.attendances || [];
        return {
          attendances: [...oldAttendances, data.attendance],
        };
      });
    },
    onError: () => {
      setIsAttending(false);
      setCurrentAttendance(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (attendanceId: string) => {
      if (!attendanceId) {
        throw new Error("No attendance ID for deletion");
      }

      const response = await fetch("/api/attendances", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: attendanceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete attendance");
      }

      return { deletedId: attendanceId };
    },
    onMutate: (attendanceId) => {
      const previousAttendance = currentAttendance;
      // Optimistically update
      setIsAttending(false);
      setCurrentAttendance(null);
      return { previousAttendance };
    },
    onError: (error, variables, context) => {
      console.error("Delete failed:", error);
      // Revert optimistic update
      if (context?.previousAttendance) {
        setCurrentAttendance(context.previousAttendance);
        setIsAttending(true);
      }
    },
    onSuccess: (result) => {
      setIsAttending(false);
      setCurrentAttendance(null);
      queryClient.setQueryData(["attendances", showId], (old: AttendanceData | undefined) => {
        const oldAttendances = old?.attendances || [];
        return {
          attendances: oldAttendances.filter((a) => a.id !== result.deletedId),
        };
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    if (checked) {
      console.log("Creating attendance");
      createMutation.mutate();
    } else if (currentAttendance?.id) {
      console.log("Deleting attendance with id:", currentAttendance.id);
      deleteMutation.mutate(currentAttendance.id);
    } else {
      console.log("No attendance to delete, just setting state to false");
      setIsAttending(false);
      setCurrentAttendance(null);
    }
  };

  const switchId = `attendance-switch-${showId}`;

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={switchId}
        checked={isAttending}
        onCheckedChange={handleToggle}
        disabled={createMutation.isPending || deleteMutation.isPending}
        className={cn(
          "h-5 w-9",
          "data-[state=checked]:bg-brand",
          "data-[state=unchecked]:bg-brand/50",
          "[&>span]:h-4 [&>span]:w-4",
          "[&>span]:data-[state=checked]:bg-white",
          "[&>span]:data-[state=unchecked]:bg-white",
          "[&>span]:data-[state=checked]:shadow-[0_0_12px_rgba(107,33,168,0.5)]",
        )}
      />
      <label htmlFor={switchId} className="text-sm font-medium leading-none text-content-text-secondary">
        Saw it?
      </label>
    </div>
  );
}

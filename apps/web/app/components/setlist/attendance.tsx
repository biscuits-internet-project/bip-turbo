import type { Attendance } from "@bip/domain";
import { useEffect, useState } from "react";
import { useRevalidator } from "react-router-dom";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface Props {
  showId: string;
  initialAttendance: Attendance | null;
}

export function AttendanceToggle({ showId, initialAttendance }: Props) {
  const [isAttending, setIsAttending] = useState(!!initialAttendance);
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(initialAttendance);
  const [isLoading, setIsLoading] = useState(false);
  const revalidator = useRevalidator();

  // Keep currentAttendance and isAttending in sync with initialAttendance
  useEffect(() => {
    setCurrentAttendance(initialAttendance);
    setIsAttending(!!initialAttendance);
  }, [initialAttendance]);

  const createAttendance = async () => {
    const previousAttendance = currentAttendance;
    const wasAttending = isAttending;

    // Optimistically update
    setIsAttending(true);
    setIsLoading(true);
    toast.loading("Marking attendance...");

    try {
      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create attendance");
      }

      const data = await response.json();
      toast.dismiss();
      toast.success("Attendance marked!");
      setCurrentAttendance(data.attendance);
      setIsAttending(true);
      revalidator.revalidate();
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to mark attendance: ${error instanceof Error ? error.message : "Unknown error"}`);
      // Revert optimistic update
      setIsAttending(wasAttending);
      setCurrentAttendance(previousAttendance);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAttendance = async (attendanceId: string) => {
    if (!attendanceId) {
      return;
    }

    const previousAttendance = currentAttendance;

    // Optimistically update
    setIsAttending(false);
    setCurrentAttendance(null);
    setIsLoading(true);
    toast.loading("Removing attendance...");

    try {
      const response = await fetch("/api/attendances", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: attendanceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete attendance");
      }

      toast.dismiss();
      toast.success("Attendance removed");
      setIsAttending(false);
      setCurrentAttendance(null);
      revalidator.revalidate();
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to remove attendance: ${error instanceof Error ? error.message : "Unknown error"}`);
      // Revert optimistic update
      if (previousAttendance) {
        setCurrentAttendance(previousAttendance);
        setIsAttending(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      createAttendance();
    } else if (currentAttendance?.id) {
      deleteAttendance(currentAttendance.id);
    } else {
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
        disabled={isLoading}
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

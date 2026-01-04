import type { NotificationWithDetails } from "@bip/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NotificationsResponse {
  notifications: NotificationWithDetails[];
}

interface UnreadCountResponse {
  unreadCount: number;
}

async function fetchNotifications(): Promise<NotificationWithDetails[]> {
  const response = await fetch(`/api/notifications`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data: NotificationsResponse = await response.json();
  return data.notifications;
}

async function fetchUnreadCount(): Promise<number> {
  const response = await fetch(`/api/notifications?unread=true`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unread count");
  }

  const data: UnreadCountResponse = await response.json();
  return data.unreadCount;
}

async function markAsRead(notificationIds: string[]): Promise<void> {
  const response = await fetch("/api/notifications", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark as read");
  }
}

async function markAllAsRead(): Promise<void> {
  const response = await fetch("/api/notifications", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markAllAsRead: true }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark all as read");
  }
}

export function useNotifications(isEnabled?: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    enabled: isEnabled,
    staleTime: 30_000, // 30 seconds
  });
}

export function useUnreadCount(isEnabled?: boolean) {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: () => fetchUnreadCount(),
    enabled: isEnabled,
    staleTime: 10_000, // 10 seconds
    refetchInterval: 30_000, // Poll every 30 seconds
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) => markAsRead(notificationIds),
    onSuccess: () => {
      // Invalidate both notifications and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      // Invalidate both notifications and unread count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all as read");
    },
  });
}

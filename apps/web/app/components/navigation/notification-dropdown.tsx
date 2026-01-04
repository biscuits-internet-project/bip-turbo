import { Bell, Check, MessageCircle, Quote, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useMarkAllAsRead, useMarkAsRead, useNotifications, useUnreadCount } from "~/hooks/use-notifications";

interface NotificationDropdownProps {
  userId?: string;
}

export function NotificationDropdown({ userId }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const isEnabled = Boolean(userId);
  const { data: notifications = [], isLoading } = useNotifications(isEnabled);
  const { data: unreadCount = 0 } = useUnreadCount(isEnabled);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleNotificationClick = async (notificationId: string, postId: string, read: boolean) => {
    if (!read) {
      await markAsReadMutation.mutateAsync([notificationId]);
    }
    navigate(`/post/${postId}`);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "reaction":
        return <Smile className="h-4 w-4 text-pink-500" />;
      case "quote":
        return <Quote className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationText = (type: string, actorUsername: string) => {
    switch (type) {
      case "reply":
        return `${actorUsername} replied to your post`;
      case "reaction":
        return `${actorUsername} reacted to your post`;
      case "quote":
        return `${actorUsername} quoted your post`;
      default:
        return `${actorUsername} interacted with your post`;
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold text-content-text-primary">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="text-xs text-brand-primary hover:text-brand-primary/80"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="p-8 text-center text-content-text-secondary">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-content-text-secondary">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.postId, notification.read)}
                className={`flex items-start gap-3 p-4 cursor-pointer ${
                  !notification.read ? "bg-brand-primary/10" : ""
                }`}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={notification.actor.avatarUrl || undefined} alt={notification.actor.username} />
                  <AvatarFallback className="text-xs">
                    {notification.actor.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm text-content-text-primary font-medium">
                        {getNotificationText(notification.type, notification.actor.username)}
                      </p>
                      {notification.post && (
                        <p className="text-xs text-content-text-secondary mt-1 line-clamp-2">
                          {notification.post.content}
                        </p>
                      )}
                      <p className="text-xs text-content-text-secondary mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                {!notification.read && <div className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0 mt-2" />}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

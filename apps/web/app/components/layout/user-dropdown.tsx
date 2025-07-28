import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface UserDropdownProps {
  user: {
    email?: string;
    user_metadata?: {
      username?: string;
      avatar_url?: string;
    };
  };
  className?: string;
}

export function UserDropdown({ user, className }: UserDropdownProps) {
  const username = user?.user_metadata?.username ?? user?.email?.split("@")[0];
  const initials = username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-9 w-9 rounded-full p-0 transition-all duration-200",
            "hover:bg-hover-glass hover:ring-2 hover:ring-brand-primary/30",
            "focus:bg-hover-glass focus:ring-2 focus:ring-brand-primary/50",
            "data-[state=open]:bg-hover-glass data-[state=open]:ring-2 data-[state=open]:ring-brand-primary/50",
            className
          )}
        >
          <Avatar className="h-8 w-8 ring-1 ring-brand-primary/20 transition-all duration-200 hover:ring-brand-primary/50">
            <AvatarImage 
              src={user.user_metadata?.avatar_url} 
              alt={username || "User avatar"}
              className="object-cover"
            />
            <AvatarFallback className="bg-brand-primary/10 text-brand-primary font-medium text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className={cn(
          "w-64 p-2",
          "glass-content rounded-xl border-0",
          "shadow-2xl shadow-brand-primary/10",
          "animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
        )}
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal p-0">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
            <Avatar className="h-10 w-10 ring-1 ring-brand-primary/30">
              <AvatarImage 
                src={user.user_metadata?.avatar_url} 
                alt={username || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-brand-primary/20 text-brand-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-content-text-primary leading-none">
                {username}
              </p>
              <p className="text-xs text-content-text-secondary leading-none truncate max-w-[160px]">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2 bg-brand-primary/20" />
        
        {/* Menu Items */}
        <DropdownMenuItem 
          asChild
          className={cn(
            "cursor-pointer rounded-lg p-3 transition-all duration-200",
            "hover:bg-brand-primary/10 hover:text-brand-primary",
            "focus:bg-brand-primary/10 focus:text-brand-primary",
            "group"
          )}
        >
          <Link to="/profile" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 group-hover:bg-brand-primary/20 transition-colors">
              <User className="h-4 w-4 text-brand-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">My Profile</span>
              <span className="text-xs text-content-text-secondary">Manage your account</span>
            </div>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2 bg-brand-primary/20" />
        
        
        <DropdownMenuItem 
          asChild
          className={cn(
            "cursor-pointer rounded-lg p-3 transition-all duration-200",
            "hover:bg-red-500/10 hover:text-red-400",
            "focus:bg-red-500/10 focus:text-red-400",
            "group"
          )}
        >
          <Link to="/auth/logout" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <LogOut className="h-4 w-4 text-red-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Logout</span>
              <span className="text-xs text-content-text-secondary">Sign out of your account</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
import { Link, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface LoginPromptPopoverProps {
  children: React.ReactNode;
  message?: string;
}

export function LoginPromptPopover({ children, message = "Sign in to rate" }: LoginPromptPopoverProps) {
  const location = useLocation();
  const returnTo = encodeURIComponent(location.pathname + location.search);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto glass-content border-glass-border p-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <p className="text-sm text-content-text-secondary">{message}</p>
          <Link
            to={`/auth/login?next=${returnTo}`}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors whitespace-nowrap"
          >
            Sign in
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

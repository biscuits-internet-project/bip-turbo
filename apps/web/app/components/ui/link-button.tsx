import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface LinkButtonProps {
  to: string;
  icon?: LucideIcon;
  children: ReactNode;
  /** Filled primary action (default) or outlined secondary action. */
  intent?: "primary" | "secondary";
  /** On mobile show only the icon (label stays for screen readers); full label from sm up. Needs an icon. */
  iconOnlyOnMobile?: boolean;
  className?: string;
}

/**
 * A button-styled navigation link: the recurring "Create X" / "Manage X" /
 * "Back to X" header affordance. Centralizes the Button + asChild + Link + icon
 * composite so every page's action links look and behave the same.
 */
export function LinkButton({
  to,
  icon: Icon,
  children,
  intent = "primary",
  iconOnlyOnMobile = false,
  className,
}: LinkButtonProps) {
  return (
    <Button
      asChild
      variant={intent === "secondary" ? "outline" : "default"}
      size="sm"
      className={cn(intent === "secondary" ? "btn-secondary" : "btn-primary", className)}
    >
      <Link to={to}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
        <span className={iconOnlyOnMobile ? "sr-only sm:not-sr-only" : undefined}>{children}</span>
      </Link>
    </Button>
  );
}

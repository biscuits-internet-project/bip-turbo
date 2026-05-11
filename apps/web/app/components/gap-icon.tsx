import type { ReactElement } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

/**
 * Wraps a small status icon (★ debut, ↺ this-show repeat) in a tooltip so
 * users can hover/tap to learn what the icon means without crowding the cell.
 * Shared by the song-detail performances table and the setlist gap-chart view.
 */
export function GapIcon({ icon, label }: { icon: ReactElement; label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span role="img" aria-label={label}>
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

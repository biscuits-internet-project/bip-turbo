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
          {/* inline-block so the icon honors its NumberCell's text-align —
              Tailwind's preflight makes the inner <svg> display:block, which
              would otherwise ignore the right-aligned slot and float left,
              out of line with the numeric gap rows. */}
          <span role="img" aria-label={label} className="inline-block">
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

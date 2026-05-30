import { formatDuration } from "@bip/domain";
import { cn } from "~/lib/utils";

interface DurationValueProps {
  /** Track duration in seconds, or null when unknown. */
  seconds: number | null | undefined;
  className?: string;
}

/**
 * Renders a track duration consistently everywhere it appears (setlist tables,
 * performance tables). Unknown durations render an em-dash.
 */
export function DurationValue({ seconds, className }: DurationValueProps) {
  if (seconds == null) {
    return <span className={cn("text-content-text-tertiary", className)}>—</span>;
  }
  return <span className={cn("tabular-nums text-content-text-secondary", className)}>{formatDuration(seconds)}</span>;
}

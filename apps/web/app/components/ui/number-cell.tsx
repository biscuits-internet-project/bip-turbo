import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

/**
 * Right-aligns digits inside an inline-block sized to the column's widest
 * realistic value, so 1 / 10 / 100 stack with their ones digit aligned and
 * larger numbers extend further left. The block itself sits flush-left in the
 * cell (cells are left-aligned), so the whole column reads as "left-anchored
 * numbers with right-aligned digits" rather than as a right-aligned column.
 * `width` is the min-width of the slot in `ch` units; tabular-nums makes every
 * digit the same `0`-glyph width so the digit columns actually align.
 *
 * Shared across every data-table numeric column (songs, gap-chart, performance)
 * so they read consistently.
 */
export function NumberCell({ width, className, children }: { width: string; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-block text-right tabular-nums", className)} style={{ minWidth: width }}>
      {children}
    </span>
  );
}

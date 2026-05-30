import { RotateCcw, Star } from "lucide-react";
import { GapIcon } from "~/components/gap-icon";
import { NumberCell } from "~/components/ui/number-cell";

/**
 * Discriminated union for the three possible states of a Gap or Your-Gap
 * cell. Numeric `count` is the common case; `debut` and `this-show` carry
 * no extra data and render as icons. Shared by the gap-chart and
 * personal-gap-chart columns — keeps the rendering logic in one place.
 */
export type GapCellState = { kind: "debut" } | { kind: "this-show" } | { kind: "count"; value: number };

/**
 * Resolves the GapCell state from the two inputs every caller computes:
 *   - `isRepeat`: this row's song already appeared earlier in the show.
 *   - `gap`: a numeric distance, or null when there's no prior to compare.
 * Centralizes the precedence (repeat beats debut beats numeric) so the
 * gap-chart and personal-gap-chart cells stay aligned by construction.
 */
export function buildGapCellState(args: { isRepeat: boolean; gap: number | null }): GapCellState {
  if (args.isRepeat) return { kind: "this-show" };
  if (args.gap == null) return { kind: "debut" };
  return { kind: "count", value: args.gap };
}

/**
 * True when this row's `songId` already appears at an earlier `position`
 * in the supplied list — i.e., the row is a within-show repeat. Generic
 * over the row shape; both column factories and the personal pure helpers
 * use this to drive the ↺ marker.
 */
export function isWithinShowRepeat<T extends { id: string; songId: string; position: number }>(
  rows: ReadonlyArray<T>,
  current: T,
): boolean {
  return rows.some((r) => r.songId === current.songId && r.position < current.position);
}

/**
 * Renders a Gap-style cell: ★ for a debut, ↺ for a within-show repeat,
 * or the numeric gap value otherwise. The two icon labels are passed in
 * so the gap-chart can say "Debut" / "This Show" while the personal view
 * says "Your debut" / "Earlier this show" — same visual treatment with
 * tooltips appropriate to context.
 */
export function GapCell({
  state,
  debutLabel,
  thisShowLabel,
}: {
  state: GapCellState;
  debutLabel: string;
  thisShowLabel: string;
}) {
  if (state.kind === "debut") {
    return (
      <NumberCell width="3ch">
        <GapIcon icon={<Star className="h-4 w-4 text-content-text-secondary" />} label={debutLabel} />
      </NumberCell>
    );
  }
  if (state.kind === "this-show") {
    return (
      <NumberCell width="3ch">
        <GapIcon icon={<RotateCcw className="h-4 w-4 text-content-text-secondary" />} label={thisShowLabel} />
      </NumberCell>
    );
  }
  return (
    <NumberCell width="3ch" className="text-content-text-secondary">
      {state.value}
    </NumberCell>
  );
}

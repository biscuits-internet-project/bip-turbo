/**
 * Tier for the "X shows ago" sublabel on the Last Played stat card.
 * - normal: current gap is at or below the song's average frequency
 * - warn: current gap exceeds the average but not the longest historical gap
 * - danger: current gap exceeds the longest historical gap (record-breaking absence)
 *
 * If we can't compute an average, render normal — there's nothing to
 * compare against. If average exists but longest is unknown, cap at warn:
 * we can prove the gap is unusual but not that it's record-breaking.
 */
export function pickGapTier(input: {
  showsSince: number;
  average: number | null;
  longest: number | null;
}): "normal" | "warn" | "danger" {
  if (input.average === null) return "normal";
  if (input.showsSince <= input.average) return "normal";
  if (input.longest !== null && input.showsSince > input.longest) return "danger";
  return "warn";
}

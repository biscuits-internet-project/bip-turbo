import type { RankInField, ShowRankComparison } from "@bip/core";

/**
 * The debug rating comparison overlay: a show's simple→calibrated score plus how its
 * rank moves under the calibration, shown over two fields: every rated show
 * (`all`, where thin shows inflate the raw average) and the real top list (`top`,
 * ≥10 ratings; a thin show reads "not ranked"). Laid out as a table so the
 * was/now/change columns line up across the score and both rank rows. Rendered
 * behind the `ratings.compare-visible` flag + the user's `showRatingComparisonDebug` pref.
 */

function formatScore(value: number | undefined): string {
  return value != null && value > 0 ? value.toFixed(2) : "—";
}

const labelCell = "px-2 py-0.5 text-left font-normal text-content-text-secondary";
const numCell = "px-2 py-0.5 text-right tabular-nums";

function RankRow({ label, rank }: { label: string; rank: RankInField }) {
  const improved = rank.calibratedRank < rank.canonicalRank;
  const moved = rank.calibratedRank !== rank.canonicalRank;
  const places = Math.abs(rank.canonicalRank - rank.calibratedRank);
  return (
    <tr>
      <td className={labelCell}>{label}</td>
      <td className={`${numCell} text-content-text-tertiary`}>#{rank.canonicalRank}</td>
      <td className={`${numCell} font-semibold text-content-text-primary`}>#{rank.calibratedRank}</td>
      <td className={numCell}>
        {moved ? (
          <span className={improved ? "text-green-500" : "text-red-500"}>
            {improved ? "▲" : "▼"}
            {places}
          </span>
        ) : (
          <span className="text-content-text-tertiary">—</span>
        )}
      </td>
    </tr>
  );
}

export function CalibratedSummary({
  canonical,
  rank,
  compact = false,
}: {
  canonical: number | null;
  rank: ShowRankComparison;
  compact?: boolean;
}) {
  const scoreDiff = canonical != null ? rank.calibrated - canonical : 0;
  const scoreMoved = Math.abs(scoreDiff) >= 0.005;
  return (
    <table className={`border-collapse ${compact ? "text-[10px] leading-tight sm:text-xs" : "text-sm"}`}>
      <tbody>
        <tr>
          <td className={labelCell}>Score</td>
          <td className={`${numCell} text-content-text-tertiary`}>{formatScore(canonical ?? undefined)}</td>
          <td className={`${numCell} font-semibold text-content-text-primary`}>{rank.calibrated.toFixed(2)}</td>
          <td
            className={`${numCell} ${scoreDiff > 0 ? "text-green-500" : scoreDiff < 0 ? "text-red-500" : "text-content-text-tertiary"}`}
          >
            {scoreMoved ? `${scoreDiff > 0 ? "+" : "−"}${Math.abs(scoreDiff).toFixed(2)}` : "—"}
          </td>
        </tr>
        <RankRow label="all" rank={rank.all} />
        {rank.top ? (
          <RankRow label="top" rank={rank.top} />
        ) : (
          <tr>
            <td className={labelCell}>top</td>
            <td className={`${numCell} text-content-text-tertiary`} colSpan={3}>
              not ranked (&lt;10)
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

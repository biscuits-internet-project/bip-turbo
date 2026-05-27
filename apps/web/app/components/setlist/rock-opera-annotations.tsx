import type { AdjacentRockOperaPerformance, RockOperaPerformanceAnnotation } from "@bip/domain";
import { Link } from "react-router-dom";
import { ShowDate } from "~/components/show-date";
import { getOrdinalSuffix } from "~/lib/utils";

interface RockOperaAnnotationsProps {
  performances: RockOperaPerformanceAnnotation[];
}

/**
 * Show-level rock opera callouts rendered inside SetlistCard, just above
 * the show notes block. One row per tagged rock opera: a "Nth full
 * performance of <Name>" sentence (hanging-indent star so wrapped text
 * aligns under "This was…"), plus a 3-column inline-grid of adjacent
 * Previous / Next performances with `M/D/YYYY` dates and "X shows earlier
 * / later" gap notes. Renders nothing when `performances` is empty.
 */
export function RockOperaAnnotations({ performances }: RockOperaAnnotationsProps) {
  if (performances.length === 0) return null;
  return (
    <div className="mb-4 space-y-3">
      {performances.map((performance) => (
        <RockOperaAnnotation key={performance.rockOpera.slug} performance={performance} />
      ))}
    </div>
  );
}

function RockOperaAnnotation({ performance }: { performance: RockOperaPerformanceAnnotation }) {
  return (
    <div className="text-sm text-content-text-secondary italic py-1">
      {/* flex layout puts the star in its own non-wrapping column so
          wrapped text aligns under "This was…", not under the star. */}
      <p className="flex gap-1.5">
        <span aria-hidden className="shrink-0">
          ★
        </span>
        <span>
          This was the {performance.performanceNumber}
          {getOrdinalSuffix(performance.performanceNumber)} full performance of{" "}
          <Link
            to={`/resources/${performance.rockOpera.slug}`}
            className="text-brand-primary hover:text-brand-secondary not-italic whitespace-nowrap"
          >
            {performance.rockOpera.name}
          </Link>
          .
        </span>
      </p>
      <AdjacentPerformances previous={performance.previousPerformance} next={performance.nextPerformance} />
    </div>
  );
}

function AdjacentPerformances({
  previous,
  next,
}: {
  previous: AdjacentRockOperaPerformance | null;
  next: AdjacentRockOperaPerformance | null;
}) {
  if (!previous && !next) return null;
  return (
    // inline-grid so the block sizes to its widest row (label column
    // right-aligned, date column right-aligned, gap-note column).
    // Fragment-wrapped cells render as direct grid children.
    <div className="mt-1 pl-4 inline-grid grid-cols-[auto_auto_auto] gap-x-2 text-xs not-italic">
      {previous && <AdjacentRow label="Previous:" point={previous} suffix="earlier" />}
      {next && <AdjacentRow label="Next:" point={next} suffix="later" />}
    </div>
  );
}

function AdjacentRow({
  label,
  point,
  suffix,
}: {
  label: string;
  point: AdjacentRockOperaPerformance;
  suffix: "earlier" | "later";
}) {
  const dateCellClass = "text-right text-brand-primary hover:text-brand-secondary";
  return (
    <>
      <span className="text-right text-content-text-tertiary">{label}</span>
      {point.slug ? (
        <Link to={`/shows/${point.slug}`} className={dateCellClass}>
          <ShowDate date={point.date} />
        </Link>
      ) : (
        <span className="text-right">
          <ShowDate date={point.date} />
        </span>
      )}
      <span className="text-content-text-tertiary">
        ({point.gap} show{point.gap === 1 ? "" : "s"} {suffix})
      </span>
    </>
  );
}

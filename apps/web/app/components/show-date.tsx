import { formatDateShort, formatDateShortMobile } from "~/lib/utils";

interface ShowDateProps {
  date: string | Date;
  /**
   * Render the compact `M/D/YY` form at all viewport sizes instead of
   * only on mobile. For dense surfaces where the four-digit year would
   * wrap the cell.
   */
  compact?: boolean;
}

/**
 * Single rendering point for show dates across the app. Outputs `M/D/YYYY`
 * at sm+ and the compact `M/D/YY` on mobile so narrow tables (songs list,
 * performance tables) stay readable without overlap. Centralizing here keeps
 * date formatting consistent everywhere a show date is displayed — change
 * the format once and every callsite follows.
 */
export function ShowDate({ date, compact }: ShowDateProps) {
  if (compact) return <span>{formatDateShortMobile(date)}</span>;
  return (
    <>
      <span className="hidden sm:inline">{formatDateShort(date)}</span>
      <span className="sm:hidden">{formatDateShortMobile(date)}</span>
    </>
  );
}

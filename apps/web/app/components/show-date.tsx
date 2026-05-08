import { formatDateShort, formatDateShortMobile } from "~/lib/utils";

interface ShowDateProps {
  date: string | Date;
}

/**
 * Single rendering point for show dates across the app. Outputs `M/D/YYYY`
 * at sm+ and the compact `M/D/YY` on mobile so narrow tables (songs list,
 * performance tables) stay readable without overlap. Centralizing here keeps
 * date formatting consistent everywhere a show date is displayed — change
 * the format once and every callsite follows.
 */
export function ShowDate({ date }: ShowDateProps) {
  return (
    <>
      <span className="hidden sm:inline">{formatDateShort(date)}</span>
      <span className="sm:hidden">{formatDateShortMobile(date)}</span>
    </>
  );
}

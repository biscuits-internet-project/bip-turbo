import { useCallback, useMemo } from "react";
import { useSession } from "~/hooks/use-session";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { ATTENDED_ROW_CLASS } from "~/lib/utils";

/**
 * Encapsulates the auth-gated attendance highlighting pattern used across
 * multiple DataTable consumers. Fetches attendance + rating data for the
 * given items' shows, and returns ready-to-use rowClassName and isAttended
 * functions plus the raw maps for callers that need to compose further.
 *
 * @param items - The data rows displayed in the table.
 * @param getShowId - Extracts the show ID from a row. Callers should pass a
 *   stable reference (module-level or useCallback) to avoid busting the
 *   internal useMemo on every render.
 */
export function useAttendanceRowHighlight<T>(items: T[], getShowId: (item: T) => string) {
  const { user } = useSession();

  const showIds = useMemo(() => [...new Set(items.map(getShowId))], [items, getShowId]);

  const { attendanceMap, userRatingMap, averageRatingMap, isLoading } = useShowUserData(user ? showIds : []);

  const isAttended = useCallback((item: T) => !!attendanceMap.get(getShowId(item)), [attendanceMap, getShowId]);

  const rowClassName = useCallback((item: T) => (isAttended(item) ? ATTENDED_ROW_CLASS : undefined), [isAttended]);

  return { rowClassName, isAttended, attendanceMap, userRatingMap, averageRatingMap, isLoading };
}

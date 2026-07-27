import type { ShowStatsRow } from "@bip/domain";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import {
  type ExternalSourceFilterFlags,
  type MediaCountFilterFlags,
  matchesExternalSources,
  matchesMediaCounts,
} from "~/lib/show-source-filters";
import { getTimeRangeParam, SONG_FILTERS } from "~/lib/song-filters";
import { parseTriState } from "~/lib/tri-state-filter";

/** How many shows back the "Last 10 Shows" time range reaches. */
const RECENT_SHOWS_WINDOW = 10;

export interface ShowStatsFilterState {
  /** A key from SONG_FILTERS, `"last10shows"`, or `"all"`. */
  timeRange: string;
  /** Free text matched against date, venue, city, and state. */
  search: string;
  /** Drop soundchecks, radio sessions, and late-night side-project sets. */
  statsOnly: boolean;
  attendedOnly: boolean;
  media: MediaCountFilterFlags;
  external: ExternalSourceFilterFlags;
}

/**
 * Nothing narrowed at all. Used where the table renders WITHOUT filter chrome
 * (the musician profile), so the caller's row set passes through untouched.
 *
 * Deliberately not the route's default — see `readShowStatsFilters`. A
 * default-on scope with no visible chip would silently drop rows the viewer has
 * no way to get back.
 */
export const UNFILTERED_SHOW_STATS: ShowStatsFilterState = {
  timeRange: "all",
  search: "",
  statsOnly: false,
  attendedOnly: false,
  media: {},
  external: {},
};

/**
 * Every filter lives in the URL so the state survives a reload, is shareable,
 * and carries across the setlist/table toggle (which is a navigation between two
 * routes, not a local view flag).
 *
 * `statsOnly` is the one filter that defaults ON: every number in this table is
 * a generated statistic, and the rest of the site computes those over
 * count_for_stats shows only. So a bare URL matches the site's own definition,
 * and the chip reads as already-pressed; turning it off writes `statsOnly=0`.
 */
export function readShowStatsFilters(params: URLSearchParams): ShowStatsFilterState {
  return {
    timeRange: getTimeRangeParam(params) ?? "all",
    search: params.get("q") ?? "",
    statsOnly: params.get("statsOnly") !== "0",
    attendedOnly: params.get("attended") === "1",
    media: { photos: parseTriState(params.get("photos")), youtube: parseTriState(params.get("youtube")) },
    external: {
      nugs: parseTriState(params.get("nugs")),
      archive: parseTriState(params.get("archive")),
      relisten: parseTriState(params.get("relisten")),
    },
  };
}

/**
 * Apply a partial filter change onto existing params, returning the next set.
 * Whatever matches the default deletes its key, so a shared URL only carries
 * what actually differs. The media/external tri-states aren't handled here —
 * `ShowFiltersNav` owns their cycle and writes its own links.
 */
export function writeShowStatsFilters(
  params: URLSearchParams,
  updates: Partial<ShowStatsFilterState>,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (updates.timeRange !== undefined) {
    // `year` and `era` are legacy aliases the reader still accepts; clear them
    // so an older bookmarked value can't outrank the range just picked.
    next.delete("year");
    next.delete("era");
    if (updates.timeRange === "all") next.delete("timeRange");
    else next.set("timeRange", updates.timeRange);
  }
  if (updates.search !== undefined) {
    if (updates.search === "") next.delete("q");
    else next.set("q", updates.search);
  }
  if (updates.statsOnly !== undefined) {
    // Inverted against the others: this one defaults on, so the param records
    // the opt-OUT and a bare URL means "stats shows only".
    if (updates.statsOnly) next.delete("statsOnly");
    else next.set("statsOnly", "0");
  }
  if (updates.attendedOnly !== undefined) {
    if (updates.attendedOnly) next.set("attended", "1");
    else next.delete("attended");
  }
  return next;
}

interface ShowStatsFilterContext {
  externalSources: Record<string, ShowExternalSources>;
  attendedShowIds: Set<string>;
}

/**
 * The inclusive date window a time range covers, or null for no date bound.
 * "Last 10 Shows" is positional rather than calendar-based, so it reads the
 * boundary off the rows themselves — which requires them newest-first, the
 * order the loader returns. This mirrors `resolveLast10ShowsDateRange`, which
 * does the same thing with a query.
 */
function resolveDateWindow(timeRange: string, rows: ShowStatsRow[]): { start?: string; end?: string } | null {
  if (timeRange === "last10shows") {
    const boundary = rows[Math.min(RECENT_SHOWS_WINDOW, rows.length) - 1];
    return boundary ? { start: boundary.date } : null;
  }
  const range = SONG_FILTERS[timeRange];
  if (!range) return null;
  return {
    start: range.startDate?.toISOString().slice(0, 10),
    end: range.endDate?.toISOString().slice(0, 10),
  };
}

/**
 * Narrow the shows stats table client-side. The whole catalog ships in one
 * cached payload, so every control filters here rather than round-tripping —
 * which is also why the source predicates are shared with the year page's
 * server-side equivalents (see show-source-filters) instead of reimplemented.
 *
 * `rows` must be newest-first; "Last 10 Shows" depends on it.
 */
export function filterShowStatsRows(
  rows: ShowStatsRow[],
  state: ShowStatsFilterState,
  context: ShowStatsFilterContext,
): ShowStatsRow[] {
  const dateWindow = state.timeRange === "all" ? null : resolveDateWindow(state.timeRange, rows);
  const query = state.search.trim().toLowerCase();

  return rows.filter((row) => {
    if (state.statsOnly && !row.countForStats) return false;
    if (state.attendedOnly && !context.attendedShowIds.has(row.id)) return false;
    if (dateWindow?.start && row.date < dateWindow.start) return false;
    if (dateWindow?.end && row.date > dateWindow.end) return false;
    if (query) {
      const haystack = [row.date, row.venueName, row.venueCity, row.venueState].filter(Boolean).join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (!matchesMediaCounts(state.media, row.photosCount, row.youtubeCount)) return false;
    if (!matchesExternalSources(state.external, context.externalSources[row.id])) return false;
    return true;
  });
}

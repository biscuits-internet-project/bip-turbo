import type { Show } from "@bip/domain";
import { Prisma } from "@prisma/client";
import type { SortOptions } from "./database/types";

/**
 * Sentinel used in ROW(...) and ORDER BY ... NULLS-LAST emulations: when
 * `day_order` is NULL, treat it as the largest possible Int so it sorts
 * last in ASC and first in DESC. Matches the migration's window-function
 * behavior (`COALESCE(day_order, 2147483647)`).
 */
export const DAY_ORDER_NULL_SENTINEL = 2147483647;

/**
 * Default chronological ordering for shows. Ties on date are broken first
 * by user-set `day_order`, then by row id. Use these wherever shows are
 * returned in a list (listings, search results, prev/next).
 *
 * NULL placement is symmetric between ASC and DESC: clicking a "sort by
 * date" toggle should produce a strict reversal of the list. ASC puts
 * NULL day_orders at the end of their date group; DESC puts them at the
 * start. Postgres ASC defaults to NULLS LAST and DESC to NULLS FIRST, so
 * the matching raw-SQL helpers (`showOrderBySql`) get this for free via
 * `COALESCE(..., 2147483647)` — these Prisma constants make the same
 * behavior explicit at the API level.
 */
export const SHOW_ORDER_ASC: Prisma.ShowOrderByWithRelationInput[] = [
  { date: "asc" },
  { dayOrder: { sort: "asc", nulls: "last" } },
  { id: "asc" },
];

export const SHOW_ORDER_DESC: Prisma.ShowOrderByWithRelationInput[] = [
  { date: "desc" },
  { dayOrder: { sort: "desc", nulls: "first" } },
  { id: "desc" },
];

/**
 * Track ordering when joined to show — adds in-show position after the
 * show ordering and uses show.id as the final tiebreaker. Used by
 * `SongService.updateSongStatistics` to walk a song's tracks chronologically.
 *
 * NOTE: this cannot encode set play-order (Prisma orderBy can't express the
 * `setSortKey` CASE, and alphabetical set order wrongly puts encores first), so
 * it's only a pre-sort. The authoritative in-show ordering — including set rank
 * so encores fall after the regular sets — is applied in-memory by
 * `sortTracksForGapWalk`, which every gap/recurrence walk runs.
 */
export const TRACK_BY_SHOW_ORDER_ASC: Prisma.TrackOrderByWithRelationInput[] = [
  { show: { date: "asc" } },
  { show: { dayOrder: { sort: "asc", nulls: "last" } } },
  { position: "asc" },
  { show: { id: "asc" } },
];

/**
 * Aliases this module's raw-SQL helpers know how to emit. Callers adding
 * a new alias must also project their source's columns as `date`,
 * `day_order`, `id` (no renaming) so the helper output lines up.
 */
type ShowAlias = "s" | "s2" | "shows";
type TrackAlias = "t" | "tracks";
type SortDirection = "ASC" | "DESC";

/**
 * Play-order rank for each set label: Soundcheck → S1..S4 → E1..E3. The single
 * source of truth shared by the in-memory `setSortKey` and the raw-SQL
 * `setSortKeySql`, so server-side `ORDER BY` and any client re-sort of the same
 * rows can't drift. Labels are matched case-insensitively; anything unlisted
 * sorts last via `UNKNOWN_SET_RANK`.
 */
const SET_SORT_ORDER: Record<string, number> = {
  soundcheck: 0,
  s1: 10,
  s2: 20,
  s3: 30,
  s4: 40,
  e1: 50,
  e2: 60,
  e3: 70,
};
const UNKNOWN_SET_RANK = 999;

/**
 * In-memory play-order rank for a set label. Encores don't sort alphabetically
 * into play order ("E1" would precede "S1"), so callers ordering tracks by set
 * must rank through this rather than comparing labels directly.
 */
export function setSortKey(label: string | null | undefined): number {
  if (!label) return UNKNOWN_SET_RANK;
  return SET_SORT_ORDER[label.toLowerCase()] ?? UNKNOWN_SET_RANK;
}

/**
 * Raw-SQL CASE expression equivalent to `setSortKey`, built from the same
 * `SET_SORT_ORDER` map. Use in $queryRaw ORDER BY clauses so SQL-side ordering
 * by set matches the in-memory `compareBySetThenPosition` comparator. Pass the
 * alias your tracks table has in the query (`t` or `tracks`).
 */
export function setSortKeySql(alias: TrackAlias): Prisma.Sql {
  const a = Prisma.raw(alias);
  // SET_SORT_ORDER holds fixed, module-private labels (never user input), so the
  // arms inline as literals, matching how the comparator compares lowercased
  // labels and keeping the rendered CASE readable.
  const arms = Object.entries(SET_SORT_ORDER)
    .map(([label, rank]) => `WHEN '${label}' THEN ${rank}`)
    .join(" ");
  return Prisma.sql`CASE LOWER(${a}.set) ${Prisma.raw(arms)} ELSE ${UNKNOWN_SET_RANK} END`;
}

/**
 * Raw-SQL `ORDER BY` fragment matching SHOW_ORDER_ASC/DESC, for use in
 * `$queryRaw` template literals. Pass the alias the shows-table-shaped
 * source has in your query. The union-typed parameters are inserted as
 * raw SQL — TS prevents arbitrary-string injection at the type level.
 */
export function showOrderBySql(alias: ShowAlias, direction: SortDirection): Prisma.Sql {
  const a = Prisma.raw(alias);
  const d = Prisma.raw(direction);
  return Prisma.sql`${a}.date ${d}, COALESCE(${a}.day_order, ${DAY_ORDER_NULL_SENTINEL}) ${d}, ${a}.id::text ${d}`;
}

/**
 * Raw-SQL ROW(...) tuple representing a show's ordering position, for
 * adjacency comparisons like `ROW(s.date, …) < (here.date, …)`.
 */
export function showOrderTuple(alias: ShowAlias): Prisma.Sql {
  const a = Prisma.raw(alias);
  return Prisma.sql`(${a}.date, COALESCE(${a}.day_order, ${DAY_ORDER_NULL_SENTINEL}), ${a}.id::text)`;
}

/**
 * Filter used wherever we count or aggregate over shows for STATS purposes
 * (timesPlayed, gap denominators, "shows since debut", filtered plays,
 * etc.). Excludes `count_for_stats=false` rows: soundchecks, radio
 * sessions, cancelled stubs, late-night Tractorbeam sets.
 *
 * Use this even when you think the show set "obviously matches" — keeping
 * a single canonical name means a search for `STATS_SHOWS_WHERE` /
 * `statsShowsSql` lights up every stats-counting site, which is how we
 * audit consistency. Display-only queries that should show ALL performances
 * (e.g., the song-detail performances table) intentionally do NOT use this.
 */
export const STATS_SHOWS_WHERE = {
  countForStats: true,
} satisfies Prisma.ShowWhereInput;

/**
 * Filter that excludes orphan placeholder shows — bare YYYY-MM-DD slug, no
 * venue, no setlist. These exist on prod alongside the real show on the same
 * date (e.g. `2025-10-31` next to `2025-10-31-suwannee-music-park-live-oak-fl`)
 * and double-count in user-facing listings. The signal we key on is the
 * missing venue: every real show has one resolved at sync time, and a user
 * can't act on a venueless row anyway.
 *
 * Apply to display-facing queries that count or enumerate shows. Admin
 * tooling that needs to surface these placeholders for cleanup should
 * intentionally NOT use this.
 */
export const NON_STUB_SHOWS_WHERE = {
  venueId: { not: null },
} satisfies Prisma.ShowWhereInput;

/**
 * Raw-SQL fragment matching NON_STUB_SHOWS_WHERE — splice into `WHERE` /
 * `AND` chains in `$queryRaw` calls. Pass the alias used for the shows
 * table in your query.
 */
export function nonStubShowsSql(alias: ShowAlias = "shows"): Prisma.Sql {
  const a = Prisma.raw(alias);
  return Prisma.sql`${a}.venue_id IS NOT NULL`;
}

/**
 * Raw-SQL fragment matching STATS_SHOWS_WHERE — splice into `WHERE` /
 * `AND` chains in `$queryRaw` calls. Pass the alias used for the shows
 * table in your query.
 */
export function statsShowsSql(alias: ShowAlias = "shows"): Prisma.Sql {
  const a = Prisma.raw(alias);
  return Prisma.sql`${a}.count_for_stats = TRUE`;
}

/**
 * Resolve a caller-supplied `SortOptions<Show>[]` (or absence) into a
 * Prisma orderBy that ALWAYS includes the same-date tiebreakers when the
 * caller is sorting by date, plus a final id tiebreaker for stability.
 *
 * Without this, calling `service.findMany({ sort: [{ field: "date",
 * direction: "desc" }] })` would lose the `day_order` + `id` tiebreakers
 * — same-date pairs would order arbitrarily by Postgres-internal order.
 *
 * Pass the default bundle (SHOW_ORDER_ASC or SHOW_ORDER_DESC) to use when
 * the caller doesn't specify a sort.
 */
export function resolveShowOrderBy(
  sort: SortOptions<Show>[] | undefined,
  defaultOrder: Prisma.ShowOrderByWithRelationInput[],
): Prisma.ShowOrderByWithRelationInput[] {
  if (!sort?.length) return defaultOrder;

  const orderBy: Prisma.ShowOrderByWithRelationInput[] = sort.map(
    (s) => ({ [String(s.field)]: s.direction }) as Prisma.ShowOrderByWithRelationInput,
  );

  // If primary sort is by date, append day_order + id tiebreakers in the
  // same direction so a "newest/oldest first" toggle produces a strict
  // reversal (NULLs end up at the end of ASC / start of DESC).
  const primary = sort[0];
  const dir = primary.direction;
  if (String(primary.field) === "date") {
    orderBy.push({ dayOrder: { sort: dir, nulls: dir === "asc" ? "last" : "first" } });
    orderBy.push({ id: dir });
  } else {
    // Non-date primary sort: append id for stable ordering on ties.
    orderBy.push({ id: dir });
  }

  return orderBy;
}

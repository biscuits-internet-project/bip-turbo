import { DRUMMER_ERA_INFO, eraDateWindow } from "@bip/domain";

export interface SongFilterConfig {
  label: string;
  startDate?: Date;
  endDate?: Date;
}

export const START_YEAR = 1995;

const yearFilters: Record<string, SongFilterConfig> = Object.fromEntries(
  Array.from({ length: new Date().getFullYear() - START_YEAR + 1 }, (_, i) => {
    const year = START_YEAR + i;
    return [
      String(year),
      {
        label: String(year),
        startDate: new Date(`${year}-01-01`),
        endDate: new Date(`${year}-12-31`),
      },
    ];
  }),
);

// Drummer-era options derived from DRUMMER_ERA_INFO so the boundary dates live in
// one place; `triscuits` is a special short window, not a drummer era.
const drummerEraFilters: Record<string, SongFilterConfig> = Object.fromEntries(
  DRUMMER_ERA_INFO.map((info) => [info.filterKey, { label: info.filterLabel, ...eraDateWindow(info) }]),
);

const eraFilters: Record<string, SongFilterConfig> = {
  ...drummerEraFilters,
  triscuits: { label: "Triscuits", startDate: new Date("2000-03-11"), endDate: new Date("2000-07-12") },
};

const currentYear = new Date().getFullYear();

export const SONG_FILTERS: Record<string, SongFilterConfig> = {
  ...yearFilters,
  ...eraFilters,
  thisYear: yearFilters[String(currentYear)],
};

export const YEAR_OPTIONS = Object.entries(yearFilters)
  .map(([value, config]) => ({ value, label: config.label }))
  .reverse(); // Most recent first

export const ERA_OPTIONS = Object.entries(eraFilters).map(([value, config]) => ({
  value,
  label: config.label,
}));

export const TIME_RANGE_GROUPS = [
  {
    label: "Recent",
    options: [
      { value: "last10shows", label: "Last 10 Shows" },
      { value: "thisYear", label: "This Year" },
    ],
  },
  {
    label: "Eras",
    options: ERA_OPTIONS,
  },
  {
    label: "Years",
    options: YEAR_OPTIONS,
  },
];

/**
 * Extract the timeRange value from URL search params, accepting year/era as fallbacks
 * for bookmarked URLs.
 */
export function getTimeRangeParam(params: URLSearchParams): string | null {
  return params.get("timeRange") || params.get("year") || params.get("era") || null;
}

/**
 * Tag filters shared between /songs, /songs/all-timers, and /songs/$slug.
 * Used by PerformanceFilterControls for the toggle chip UI and by the
 * server-side API endpoints for filtering.
 */
export const TOGGLE_FILTER_DEFINITIONS = [
  { key: "setOpener", label: "Set Opener" },
  { key: "setCloser", label: "Set Closer" },
  { key: "encore", label: "Encore" },
  { key: "segueIn", label: "Segue In" },
  { key: "segueOut", label: "Segue Out" },
  { key: "standalone", label: "Standalone" },
  { key: "split", label: "Split" },
  { key: "inverted", label: "Inverted" },
  { key: "dyslexic", label: "Dyslexic" },
  { key: "unfinished", label: "Unfinished" },
  { key: "jamChart", label: "Jam Chart" },
  { key: "allTimer", label: "All-Timer" },
  { key: "attended", label: "Attended" },
] as const;

/**
 * Groups the toggle chips into labeled popovers so the filter row stays a
 * single compact strip of buttons as filters accumulate. Each group renders as
 * one popover button (with an active-count badge) holding its chips; labels
 * come from TOGGLE_FILTER_DEFINITIONS (the canonical key→label source). Every
 * toggle key except `attended` belongs to exactly one group — `attended` is a
 * personal on/off, so it renders as a standalone chip rather than in a group.
 */
export const TOGGLE_FILTER_GROUPS = [
  { label: "Quality", keys: ["jamChart", "allTimer"] },
  { label: "Position", keys: ["setOpener", "setCloser", "encore"] },
  { label: "Attributes", keys: ["split", "standalone", "segueIn", "segueOut", "inverted", "dyslexic", "unfinished"] },
] as const;

/** The personal toggle rendered on its own (not in a group popover). */
export const STANDALONE_TOGGLE_KEY = "attended";

import { Filter } from "lucide-react";
import { ShowFiltersNav } from "~/components/show-filters-nav";
import { CollapsibleSection } from "~/components/ui/collapsible-section";
import { SelectFilter } from "~/components/ui/filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Input } from "~/components/ui/input";
import { filterSearchInputClass } from "~/lib/form-styles";
import type { ShowStatsFilterState } from "~/lib/show-stats-filters";
import { TIME_RANGE_GROUPS } from "~/lib/song-filters";
import { isAnyTriStateActive } from "~/lib/tri-state-filter";

/** Boolean chips that narrow the row set. */
const STATS_ONLY_KEY = "statsOnly";
const ATTENDED_KEY = "attendedOnly";

interface ShowsFilterControlsProps {
  filters: ShowStatsFilterState;
  onChange: (updates: Partial<ShowStatsFilterState>) => void;
  /** Path the media tri-state links point back at, with params composed on top. */
  basePath: string;
  currentURLParameters: URLSearchParams;
  isAuthenticated: boolean;
  /** Collapse the chrome on desktop too, for dense pages like a musician profile. */
  collapsibleOnDesktop?: boolean;
}

/**
 * Filter bar for the shows stats table. Deliberately a smaller set than the
 * songs equivalent: author, song kind, and the track-level position/attribute
 * toggles describe a song rather than a show, so they have no meaning here.
 * The five media tri-states reuse `ShowFiltersNav` verbatim, so the same
 * control behaves identically on the year page and here.
 */
export function ShowsFilterControls({
  filters,
  onChange,
  basePath,
  currentURLParameters,
  isAuthenticated,
  collapsibleOnDesktop,
}: ShowsFilterControlsProps) {
  // Attended is only offered to a signed-in viewer — there's nothing to match
  // against otherwise.
  const chips = [
    { key: STATS_ONLY_KEY, label: "Stats shows only" },
    ...(isAuthenticated ? [{ key: ATTENDED_KEY, label: "Attended" }] : []),
  ];
  const activeChips = new Set(
    [filters.statsOnly ? STATS_ONLY_KEY : null, filters.attendedOnly ? ATTENDED_KEY : null].filter(
      (key): key is string => key !== null,
    ),
  );

  // Counts how far the view differs from its default, not how many chips are
  // pressed — `statsOnly` starts on, so a bare page must read as unbadged and
  // switching it OFF is the deviation worth flagging.
  const activeFilterCount =
    (filters.search.length > 0 ? 1 : 0) +
    (filters.timeRange !== "all" ? 1 : 0) +
    (filters.statsOnly ? 0 : 1) +
    (filters.attendedOnly ? 1 : 0) +
    (isAnyTriStateActive(filters.media) ? 1 : 0) +
    (isAnyTriStateActive(filters.external) ? 1 : 0);

  return (
    <CollapsibleSection
      titleAs="div"
      title={
        <span className="inline-flex items-center gap-2">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Search &amp; Filters
        </span>
      }
      titleClassName="text-sm font-medium text-content-text-primary"
      headerExtra={
        activeFilterCount > 0 ? (
          <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary text-xs">
            {activeFilterCount}
          </span>
        ) : undefined
      }
      contentClassName="pt-3 sm:pt-0"
      breakpoint="sm"
      collapseOnLandscape
      hideHeaderWhenExpanded
      dividerWhenClosed
      collapsibleOnDesktop={collapsibleOnDesktop}
    >
      {/* One row: the whole set fits beside itself on a desktop table, and
          wraps rather than stacking by default on anything narrower. */}
      <div className="flex items-end flex-wrap gap-x-3 gap-y-2">
        <Input
          placeholder="Search date or venue..."
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          className={filterSearchInputClass}
        />
        <SelectFilter
          id="shows-time-range-filter"
          label="Time Range"
          value={filters.timeRange}
          onValueChange={(value) => onChange({ timeRange: value })}
          options={[{ value: "all", label: "All Time" }]}
          groups={TIME_RANGE_GROUPS}
          width="w-[160px]"
        />
        <ShowFiltersNav basePath={basePath} currentURLParameters={currentURLParameters} variant="inline" />
        <ToggleFilterGroup
          filters={chips}
          activeFilters={activeChips}
          onToggle={(key) =>
            key === STATS_ONLY_KEY
              ? onChange({ statsOnly: !filters.statsOnly })
              : onChange({ attendedOnly: !filters.attendedOnly })
          }
        />
      </div>
    </CollapsibleSection>
  );
}

import { Filter } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { AuthorSearch } from "~/components/author/author-search";
import { MusicianSearch } from "~/components/musician/musician-search";
import { CollapsibleSection } from "~/components/ui/collapsible-section";
import { SelectFilter } from "~/components/ui/filters";
import { GroupedToggleFilters } from "~/components/ui/filters/grouped-toggle-filters";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Input } from "~/components/ui/input";
import { STANDALONE_TOGGLE_KEY, TIME_RANGE_GROUPS, TOGGLE_FILTER_DEFINITIONS } from "~/lib/song-filters";

const ALL_TOGGLE_FILTERS = TOGGLE_FILTER_DEFINITIONS as unknown as Array<{ key: string; label: string }>;

const labelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";

interface PerformanceFilterControlsProps {
  selectedTimeRange: string;
  activeToggleSet: Set<string>;
  updateFilter: (updates: Record<string, string | null>) => void;
  toggleFilter: (key: string) => void;
  clearFilters: () => void;
  extraSelectFilters?: ReactNode;
  showAllTimerToggle?: boolean;
  /**
   * When false, hide the "Jam Chart" toggle chip. Set on the dedicated
   * Jam Charts page (the whole result set is already jam-charts there)
   * and on the All-Timers page (same reasoning as why "All-Timer" is
   * hidden there) so toggle filters within those views express
   * additional narrowing rather than redundant scope.
   */
  showJamChartToggle?: boolean;
  hideTimeRange?: boolean;
  kindFilter?: string;
  selectedAuthor?: string | null;
  selectedMusician?: string | null;
  playedFilter?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  /**
   * Collapse the filter chrome on desktop too (not just mobile). On dense pages
   * like the musician profile the filters start collapsed behind the toggle at
   * every width; the toggle keeps `sm:hidden` off so it stays clickable and the
   * content wrapper keeps `sm:block` off so it follows the toggle state.
   */
  collapsibleOnDesktop?: boolean;
}

export function PerformanceFilterControls({
  selectedTimeRange,
  activeToggleSet,
  updateFilter,
  toggleFilter,
  clearFilters,
  extraSelectFilters,
  showAllTimerToggle = true,
  showJamChartToggle = true,
  hideTimeRange = false,
  kindFilter,
  selectedAuthor,
  selectedMusician,
  playedFilter,
  searchValue,
  onSearchChange,
  hasActiveFilters = false,
  collapsibleOnDesktop = false,
}: PerformanceFilterControlsProps) {
  const toggleFilters = ALL_TOGGLE_FILTERS.filter((filter) => {
    if (!showAllTimerToggle && filter.key === "allTimer") return false;
    if (!showJamChartToggle && filter.key === "jamChart") return false;
    return true;
  });
  const groupedToggleFilters = toggleFilters.filter((filter) => filter.key !== STANDALONE_TOGGLE_KEY);
  const standaloneToggleFilters = toggleFilters.filter((filter) => filter.key === STANDALONE_TOGGLE_KEY);
  const showPlayedFilter =
    playedFilter !== undefined &&
    (hideTimeRange ||
      selectedTimeRange !== "all" ||
      activeToggleSet.size > 0 ||
      (searchValue !== undefined && searchValue.length > 0));

  useEffect(() => {
    if (!showPlayedFilter && playedFilter !== undefined && playedFilter !== "all") {
      updateFilter({ played: null });
    }
  }, [showPlayedFilter, playedFilter, updateFilter]);

  const activeFilterCount =
    (searchValue && searchValue.length > 0 ? 1 : 0) +
    (!hideTimeRange && selectedTimeRange !== "all" ? 1 : 0) +
    (kindFilter && kindFilter !== "all" ? 1 : 0) +
    (selectedAuthor ? 1 : 0) +
    (selectedMusician ? 1 : 0) +
    (playedFilter && playedFilter !== "all" ? 1 : 0) +
    activeToggleSet.size;

  return (
    <CollapsibleSection
      // Filter chrome, not a document heading — render the toggle as a div so
      // it stays out of the page's heading outline. Force-open from sm (it only
      // crowds phones); on desktop the toggle is hidden entirely and the filters
      // show bare. `collapsibleOnDesktop` keeps the toggle collapsed at every
      // width on dense pages (the musician profile).
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
      // pt-3 spaces the toggle from the controls on phones; dropped at sm+ where
      // the toggle is hidden and the controls render flush.
      contentClassName="space-y-3 pt-3 sm:pt-0"
      breakpoint="sm"
      collapseOnLandscape
      hideHeaderWhenExpanded
      dividerWhenClosed
      collapsibleOnDesktop={collapsibleOnDesktop}
    >
      <div className="flex items-end flex-wrap gap-x-3 gap-y-2">
        {searchValue !== undefined && onSearchChange && (
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full sm:w-auto sm:min-w-[250px] sm:max-w-md h-[34px] text-sm border text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20 placeholder:text-content-text-tertiary"
          />
        )}
        {!hideTimeRange && (
          <SelectFilter
            id="time-range-filter"
            label="Time Range"
            value={selectedTimeRange}
            onValueChange={(value) => updateFilter({ timeRange: value })}
            options={[{ value: "all", label: "All Time" }]}
            groups={TIME_RANGE_GROUPS}
            width="w-[200px]"
          />
        )}
        {selectedMusician !== undefined && (
          <div className="flex flex-col">
            <label htmlFor="musician-search" className={labelClass}>
              Musician
            </label>
            <MusicianSearch
              value={selectedMusician}
              onValueChange={(value) => updateFilter({ musician: value === "none" ? null : value })}
              // Carry the slug (not the id) in the URL so a shared
              // ?musician= link is readable. The /api/musicians endpoint
              // resolves the slug back to a record for pre-fill.
              itemId={(musician) => musician.slug ?? musician.id}
              // Show a deep open-list (the roster is 130+) so most names are
              // visible without typing.
              topLimit={40}
              placeholder="All Musicians"
              className="w-[150px] sm:w-[200px] h-[34px] text-sm"
            />
          </div>
        )}
        {kindFilter !== undefined && (
          <SelectFilter
            id="kind-filter"
            label="Type"
            value={kindFilter}
            onValueChange={(value) => updateFilter({ kind: value })}
            options={[
              { value: "all", label: "All" },
              { value: "original", label: "Original" },
              { value: "cover", label: "Cover" },
              { value: "mashup", label: "Mashup" },
              { value: "improvisation", label: "Improvisation" },
            ]}
            placeholder="Type"
            width="w-[150px]"
          />
        )}
        {selectedAuthor !== undefined && (
          <div className="flex flex-col">
            <label htmlFor="author-search" className={labelClass}>
              Author
            </label>
            <AuthorSearch
              value={selectedAuthor}
              onValueChange={(value) => updateFilter({ author: value === "none" ? null : value })}
              placeholder="All Authors"
              className="w-[150px] sm:w-[200px] h-[34px] text-sm"
              topLimit={50}
            />
          </div>
        )}
        {showPlayedFilter && (
          <SelectFilter
            id="played-filter"
            label="Played"
            value={playedFilter}
            onValueChange={(value) => updateFilter({ played: value })}
            options={[
              { value: "all", label: "All" },
              { value: "notPlayed", label: "Not Played" },
            ]}
            width="w-[150px]"
          />
        )}
        {extraSelectFilters}
        {/* Toggle filters live in the same row as the selects: a compact strip
            of group popovers (Quality / Position / Attributes) plus the
            standalone Attended chip (a personal on/off, not a curation group). */}
        <GroupedToggleFilters filters={groupedToggleFilters} activeFilters={activeToggleSet} onToggle={toggleFilter} />
        <ToggleFilterGroup filters={standaloneToggleFilters} activeFilters={activeToggleSet} onToggle={toggleFilter} />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="h-[34px] px-3 text-sm rounded-md bg-transparent border text-content-text-tertiary hover:text-content-text-secondary transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </CollapsibleSection>
  );
}

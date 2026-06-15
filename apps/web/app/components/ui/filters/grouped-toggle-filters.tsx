import { ChevronDown } from "lucide-react";
import { ToggleFilterGroup } from "~/components/ui/filters/toggle-filter-group";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { TOGGLE_FILTER_GROUPS } from "~/lib/song-filters";

interface GroupedToggleFiltersProps {
  /** Visible toggle chips ({key, label}); already filtered by the caller so
   *  preset-hidden chips (e.g. jamChart on /songs/jam-charts) are absent. */
  filters: Array<{ key: string; label: string }>;
  activeFilters: Set<string>;
  onToggle: (key: string) => void;
}

const triggerBase =
  "inline-flex items-center gap-2 h-[34px] px-3 rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20";

/**
 * Renders the toggle chips as a compact strip of group popovers (Quality,
 * Position, Attributes) so the filter row stays one line of buttons instead of
 * a sprawling chip wall. Each button shows an active-count badge and opens a
 * popover of its chips; a group whose chips are all hidden by the caller is
 * skipped.
 */
export function GroupedToggleFilters({ filters, activeFilters, onToggle }: GroupedToggleFiltersProps) {
  return (
    <>
      {TOGGLE_FILTER_GROUPS.map((group) => {
        const groupFilters = filters.filter((filter) => (group.keys as readonly string[]).includes(filter.key));
        if (groupFilters.length === 0) return null;

        const activeCount = groupFilters.reduce((count, filter) => count + (activeFilters.has(filter.key) ? 1 : 0), 0);
        const active = activeCount > 0;

        return (
          <Popover key={group.label}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`${triggerBase} ${
                  active
                    ? "bg-brand-primary/15 border-brand-primary text-white"
                    : "bg-glass-bg border-glass-border text-content-text-secondary hover:bg-glass-bg/80"
                }`}
              >
                {group.label}
                {active && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-primary text-white text-xs font-semibold">
                    {activeCount}
                  </span>
                )}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto max-w-xs p-3 bg-glass-bg border-glass-border backdrop-blur-md"
            >
              <ToggleFilterGroup filters={groupFilters} activeFilters={activeFilters} onToggle={onToggle} />
            </PopoverContent>
          </Popover>
        );
      })}
    </>
  );
}

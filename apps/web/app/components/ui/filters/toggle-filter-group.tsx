interface ToggleFilterGroupProps {
  filters: Array<{ key: string; label: string }>;
  activeFilters: Set<string>;
  onToggle: (key: string) => void;
  onClearAll: () => void;
}

export function ToggleFilterGroup({ filters, activeFilters, onToggle, onClearAll }: ToggleFilterGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-content-text-secondary mr-2 self-center">Filters:</span>
      {filters.map((filter) => (
        <button
          type="button"
          key={filter.key}
          onClick={() => onToggle(filter.key)}
          className={`px-3 py-1 text-sm rounded-md border transition-colors ${
            activeFilters.has(filter.key)
              ? "bg-brand-primary border-brand-primary text-white"
              : "bg-transparent border-glass-border text-content-text-secondary hover:border-brand-primary/60"
          }`}
        >
          {filter.label}
        </button>
      ))}
      {activeFilters.size > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="px-3 py-1 text-sm rounded-md bg-transparent border border-glass-border text-content-text-tertiary hover:text-content-text-secondary"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

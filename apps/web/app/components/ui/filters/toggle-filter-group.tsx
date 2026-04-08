interface ToggleFilterGroupProps {
  filters: Array<{ key: string; label: string }>;
  activeFilters: Set<string>;
  onToggle: (key: string) => void;
}

export function ToggleFilterGroup({ filters, activeFilters, onToggle }: ToggleFilterGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
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
    </div>
  );
}

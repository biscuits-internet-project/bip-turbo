import { ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "~/lib/utils";

interface ShowMoreListProps<T> {
  items: T[];
  /** How many items are visible before the toggle is used. */
  initialCount?: number;
  /** Returns the content of one row; the list wraps it in an `<li>`. */
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
  /** Applied to the `<ul>`. */
  className?: string;
}

/**
 * Previews the head of a long list and tucks the rest behind a "Show N more"
 * toggle. CollapsibleSection hides a whole titled section; this keeps a list
 * visible but short, so a card with a dozen rows (archive.org recordings)
 * doesn't dominate the page. Renders no toggle when nothing is hidden.
 */
export function ShowMoreList<T>({ items, initialCount = 3, renderItem, getKey, className }: ShowMoreListProps<T>) {
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = items.length - initialCount;
  const visibleItems = expanded ? items : items.slice(0, initialCount);
  return (
    <div>
      <ul className={className}>
        {visibleItems.map((item) => (
          <li key={getKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2 flex items-center gap-1 text-xs text-content-text-tertiary hover:text-content-text-secondary transition-colors"
        >
          {/* The toggle sits below the list, so the arrow points where rows will
              go: ▼ "more appear below", ▲ "collapse back up". */}
          <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          <span>{expanded ? "Show fewer" : `Show ${hiddenCount} more`}</span>
        </button>
      )}
    </div>
  );
}

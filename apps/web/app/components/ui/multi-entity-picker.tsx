import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { formLabelClass } from "~/lib/form-styles";

/** Any row the picker manages must carry a stable `uid` to key it across edits. */
export interface MultiEntityRow {
  uid: string;
}

interface MultiEntityPickerProps<R extends MultiEntityRow> {
  rows: R[];
  /** Renders a row's content (entity search plus any per-row controls). The
   *  remove button is appended by the chrome. */
  renderRow: (row: R) => ReactNode;
  onAdd: () => void;
  onRemove: (uid: string) => void;
  addAriaLabel: string;
  removeAriaLabel: string;
  /** Inline header with a label and Add button. Omit when the caller renders its
   *  own header/Add (e.g. inside a card with Save/Cancel). */
  label?: string;
  addLabel?: string;
  emptyText?: string;
}

/**
 * Shared chrome for the repeatable "pick N entities" editors (track performers,
 * show lineup, song authors): the stacked-on-mobile / inline-on-desktop row
 * list, the per-row remove button, and an optional inline label + Add header.
 * Purely presentational — each caller owns its row state and renders the row's
 * pickers (and any sub-controls like instruments) via `renderRow`.
 */
export function MultiEntityPicker<R extends MultiEntityRow>({
  rows,
  renderRow,
  onAdd,
  onRemove,
  addAriaLabel,
  removeAriaLabel,
  label,
  addLabel = "Add",
  emptyText,
}: MultiEntityPickerProps<R>) {
  return (
    <div>
      {label !== undefined && (
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={formLabelClass}>{label}</span>
          <Button type="button" variant="secondary" size="sm" aria-label={addAriaLabel} onClick={onAdd}>
            <Plus className="mr-1 h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      )}
      {rows.length === 0 && emptyText ? (
        <p className="text-sm text-content-text-tertiary">{emptyText}</p>
      ) : (
        <ul className="space-y-2 sm:space-y-1.5">
          {rows.map((row) => (
            // Bordered block on mobile so each row's stacked pickers read as a
            // group; collapses to a single inline row on sm+.
            <li
              key={row.uid}
              className="flex flex-wrap items-center gap-1.5 rounded-md border border-glass-border/30 p-2 sm:rounded-none sm:border-0 sm:p-0"
            >
              {renderRow(row)}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={removeAriaLabel}
                onClick={() => onRemove(row.uid)}
                className="ml-auto h-8 w-8 shrink-0 sm:ml-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

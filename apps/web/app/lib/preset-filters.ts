/**
 * The filter controls to hide given a table's preset (pinned) filters.
 *
 * Pinning a value and leaving its control visible is misleading — the preset
 * overwrites any change in the fetch — so each preset hides its own control.
 * Some presets also imply a companion hide:
 *  - `author` / `musician` hide the Type (kind) control: once the table is
 *    scoped to one author/musician, the catalog-wide Type filter is redundant
 *    chrome.
 *  - the `allTimer` toggle hides the Jam Chart toggle: jam-chart (all_timer ∪
 *    curated note) is a superset of all-timer, so the chip is a no-op inside an
 *    all-timers scope. (The jam-charts page keeps the All-Timer toggle — it
 *    genuinely narrows the union.)
 *
 * Returns control ids understood by PerformanceFilterControls: "author",
 * "musician", "kind", and toggle keys like "allTimer" / "jamChart".
 */
export function controlsHiddenByPreset(presetFilters?: Record<string, string>): Set<string> {
  const hidden = new Set<string>();
  if (!presetFilters) return hidden;

  if (presetFilters.author) {
    hidden.add("author");
    hidden.add("kind");
  }
  if (presetFilters.musician) {
    hidden.add("musician");
    hidden.add("kind");
  }
  for (const toggle of presetFilters.filters?.split(",").filter(Boolean) ?? []) {
    hidden.add(toggle);
    if (toggle === "allTimer") hidden.add("jamChart");
  }

  return hidden;
}

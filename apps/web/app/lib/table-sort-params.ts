import type { SortingState } from "@tanstack/react-table";

/** Column being sorted, by its TanStack column id. */
const SORT_PARAM = "sort";
/** Direction: only `asc` is written, since every column's default is descending. */
const DIRECTION_PARAM = "dir";

/**
 * Read a single-column sort out of the URL, falling back to the table's own
 * default. Generic on purpose — the param names are the same wherever a sortable
 * table wants a shareable URL, so the encoding lives in one place rather than
 * once per table.
 *
 * Multi-column sort isn't encoded: no table here offers it, and a single pair of
 * params keeps a shared link readable.
 */
export function readSortingParams(params: URLSearchParams, fallback: SortingState): SortingState {
  const columnId = params.get(SORT_PARAM);
  if (!columnId) return fallback;
  return [{ id: columnId, desc: params.get(DIRECTION_PARAM) !== "asc" }];
}

/**
 * Write a sort back onto existing params. A sort matching `fallback` — or none
 * at all — clears both keys, so a bare URL stays bare and only a deliberate
 * re-sort shows up in the address bar.
 */
export function writeSortingParams(
  params: URLSearchParams,
  sorting: SortingState,
  fallback: SortingState,
): URLSearchParams {
  const next = new URLSearchParams(params);
  const active = sorting[0];
  const matchesFallback = active && fallback[0] && active.id === fallback[0].id && active.desc === fallback[0].desc;

  if (!active || matchesFallback) {
    next.delete(SORT_PARAM);
    next.delete(DIRECTION_PARAM);
    return next;
  }

  next.set(SORT_PARAM, active.id);
  if (active.desc) next.delete(DIRECTION_PARAM);
  else next.set(DIRECTION_PARAM, "asc");
  return next;
}

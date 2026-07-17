import { describe, expect, test } from "vitest";
import { applyMediaCountFilters } from "./apply-media-count-filters";

// Minimal setlist-like shape accepted by the helper — it only needs the
// show's denormalized media counts. `as never` avoids building a full Setlist.
function setlist(id: string, photos: number, youtube: number) {
  return { show: { id, showPhotosCount: photos, showYoutubesCount: youtube } } as never;
}

function ids(setlists: { show: { id: string } }[]) {
  return setlists.map((s) => s.show.id);
}

describe("applyMediaCountFilters", () => {
  // No active flags → input passes through by reference. The year loader runs
  // this on every request, so the no-op path must preserve reference equality.
  test("returns setlists unchanged when no filters are active", () => {
    const setlists = [setlist("astronaut", 0, 0), setlist("basis", 3, 0)];
    expect(applyMediaCountFilters(setlists, {})).toBe(setlists);
  });

  // Explicit "empty" is the same as an absent flag.
  test("treats empty tri-state as no filter", () => {
    const setlists = [setlist("astronaut", 0, 0), setlist("basis", 3, 0)];
    expect(applyMediaCountFilters(setlists, { photos: "empty", youtube: "empty" })).toBe(setlists);
  });

  // Positive photos keeps only shows with a nonzero photo count — the exact
  // in-memory equivalent of the DB `showPhotosCount > 0` clause it replaces.
  test("photos=positive keeps only shows with photos", () => {
    const setlists = [setlist("astronaut", 0, 0), setlist("basis", 3, 0)];
    expect(ids(applyMediaCountFilters(setlists, { photos: "positive" }))).toEqual(["basis"]);
  });

  // Negative photos is the DB `showPhotosCount === 0` clause.
  test("photos=negative keeps only shows without photos", () => {
    const setlists = [setlist("astronaut", 0, 0), setlist("basis", 3, 0)];
    expect(ids(applyMediaCountFilters(setlists, { photos: "negative" }))).toEqual(["astronaut"]);
  });

  // Youtube mirrors photos against its own count column.
  test("youtube=positive keeps only shows with youtube", () => {
    const setlists = [setlist("astronaut", 0, 0), setlist("basis", 0, 2)];
    expect(ids(applyMediaCountFilters(setlists, { youtube: "positive" }))).toEqual(["basis"]);
  });

  // Both flags AND together: a mixed positive/negative pair must intersect.
  test("photos=positive + youtube=negative combine with AND", () => {
    const setlists = [
      setlist("crystal-ball", 4, 0), // photos yes, youtube no → keep
      setlist("basis", 4, 1), // both → drop (has youtube)
      setlist("munchkin", 0, 0), // neither → drop (no photos)
      setlist("plan-b", 0, 3), // youtube only → drop (no photos)
    ];
    expect(ids(applyMediaCountFilters(setlists, { photos: "positive", youtube: "negative" }))).toEqual([
      "crystal-ball",
    ]);
  });
});

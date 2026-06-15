import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { buildGapCellState, GapCell, isWithinShowRepeat } from "./gap-cell";

describe("GapCell", () => {
  // Debut state: render a ★ with the caller-provided label so the same
  // component can say "Debut" (catalog) or "Your debut" (personal view).
  test("renders the debut star with the supplied label", () => {
    render(<GapCell state={{ kind: "debut" }} debutLabel="Debut" thisShowLabel="This Show" />);
    expect(screen.getByLabelText("Debut")).toBeInTheDocument();
  });

  test("uses the supplied personal debut label when passed", () => {
    render(<GapCell state={{ kind: "debut" }} debutLabel="Your debut" thisShowLabel="Earlier this show" />);
    expect(screen.getByLabelText("Your debut")).toBeInTheDocument();
  });

  // This-show state: render ↺ with the caller-provided label.
  test("renders the within-show repeat icon with the supplied label", () => {
    render(<GapCell state={{ kind: "this-show" }} debutLabel="Debut" thisShowLabel="This Show" />);
    expect(screen.getByLabelText("This Show")).toBeInTheDocument();
  });

  // Numeric state: render the value as tabular-nums text. No icon, no
  // label — just the number.
  test("renders the numeric gap value with no icon when kind is count", () => {
    render(<GapCell state={{ kind: "count", value: 7 }} debutLabel="Debut" thisShowLabel="This Show" />);
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.queryByLabelText("Debut")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("This Show")).not.toBeInTheDocument();
  });

  // gap=0 still renders — back-to-back shows are a meaningful signal,
  // not the same as a debut.
  test("renders gap=0 as a real value (not a debut)", () => {
    render(<GapCell state={{ kind: "count", value: 0 }} debutLabel="Debut" thisShowLabel="This Show" />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByLabelText("Debut")).not.toBeInTheDocument();
  });
});

describe("buildGapCellState", () => {
  // Repeat overrides everything else: even if the underlying gap value is
  // a real number or null, a within-show repeat collapses to ↺.
  test("isRepeat=true always produces 'this-show' regardless of gap", () => {
    expect(buildGapCellState({ isRepeat: true, gap: null })).toEqual({ kind: "this-show" });
    expect(buildGapCellState({ isRepeat: true, gap: 0 })).toEqual({ kind: "this-show" });
    expect(buildGapCellState({ isRepeat: true, gap: 42 })).toEqual({ kind: "this-show" });
  });

  // Null gap with no repeat means "no prior to compare against" → debut.
  test("gap=null without repeat produces a debut", () => {
    expect(buildGapCellState({ isRepeat: false, gap: null })).toEqual({ kind: "debut" });
  });

  // Numeric gap with no repeat produces a count state with that value.
  // gap=0 is intentionally distinct from a debut.
  test("numeric gap without repeat produces a count state", () => {
    expect(buildGapCellState({ isRepeat: false, gap: 0 })).toEqual({ kind: "count", value: 0 });
    expect(buildGapCellState({ isRepeat: false, gap: 7 })).toEqual({ kind: "count", value: 7 });
  });
});

describe("isWithinShowRepeat", () => {
  // First occurrence: no earlier-position row with the same songId, so
  // not a repeat.
  test("returns false when no earlier same-song row exists", () => {
    const rows = [
      { id: "t1", songId: "tractorbeam", set: "S1", position: 1 },
      { id: "t2", songId: "spaga", set: "S1", position: 2 },
    ];
    expect(isWithinShowRepeat(rows, rows[0])).toBe(false);
    expect(isWithinShowRepeat(rows, rows[1])).toBe(false);
  });

  // Same songId at an earlier position → repeat.
  test("returns true when the same song appears at an earlier position", () => {
    const rows = [
      { id: "t1", songId: "tractorbeam", set: "S1", position: 1 },
      { id: "t2", songId: "spaga", set: "S1", position: 2 },
      { id: "t3", songId: "tractorbeam", set: "S1", position: 5 }, // reprise
    ];
    expect(isWithinShowRepeat(rows, rows[2])).toBe(true);
  });

  // Same song LATER in the show: the earlier instance is the first
  // occurrence (not a repeat); the later one is.
  test("only the second-and-later occurrences are repeats", () => {
    const rows = [
      { id: "t1", songId: "helicopters", set: "S1", position: 2 },
      { id: "t2", songId: "helicopters", set: "S1", position: 7 },
    ];
    expect(isWithinShowRepeat(rows, rows[0])).toBe(false);
    expect(isWithinShowRepeat(rows, rows[1])).toBe(true);
  });

  // Cross-set repeat where the later set carries a LOWER position number.
  // Positions reset per set, so the encore's I-Man (E1 #2) follows the
  // second-set I-Man (S2 #2) in the show even though the raw position is
  // equal — set order must break the tie or the encore loses its ↺.
  test("detects a repeat across sets when the later set has an equal-or-lower position", () => {
    const rows = [
      { id: "t1", songId: "i-man", set: "S2", position: 2 },
      { id: "t2", songId: "i-man", set: "E1", position: 2 },
    ];
    expect(isWithinShowRepeat(rows, rows[0])).toBe(false);
    expect(isWithinShowRepeat(rows, rows[1])).toBe(true);
  });
});

import { compareByShowDate } from "@bip/domain";
import { describe, expect, test } from "vitest";

function row(id: string, date: string, dayOrder: number | null = null) {
  return { show: { id, date, dayOrder } };
}

describe("compareByShowDate", () => {
  // Different dates: chronological order wins, regardless of dayOrder.
  test("orders by date when dates differ", () => {
    const earlier = row("show-A", "2010-01-01");
    const later = row("show-B", "2010-06-01");
    expect(compareByShowDate(earlier, later)).toBeLessThan(0);
    expect(compareByShowDate(later, earlier)).toBeGreaterThan(0);
  });

  // Same date with explicit dayOrders: lower dayOrder sorts first in ASC.
  // Concrete case: 2010-03-26 has Bicentennial Park (day_order=1, Ultra Festival)
  // and Grand Central (day_order=2, Tractorbeam after-party).
  test("breaks same-date ties by dayOrder ascending", () => {
    const earlier = row("show-fest", "2010-03-26", 1);
    const later = row("show-after", "2010-03-26", 2);
    expect(compareByShowDate(earlier, later)).toBeLessThan(0);
  });

  // Same date with NULL dayOrders on both rows falls back to the id
  // tiebreaker — stable but arbitrary. Prevents undefined ordering.
  test("falls back to id when both dayOrders are null", () => {
    const a = row("show-A", "1995-12-01");
    const b = row("show-B", "1995-12-01");
    expect(compareByShowDate(a, b)).toBeLessThan(0);
    expect(compareByShowDate(b, a)).toBeGreaterThan(0);
  });

  // Mixed-NULL same-date pair: NULL sorts LAST in ASC (matches the server
  // rule that surfaces explicit-ordered shows ahead of unset ones).
  test("places null dayOrder after explicit dayOrder on same date", () => {
    const explicit = row("show-known", "2010-03-26", 1);
    const unknown = row("show-unset", "2010-03-26", null);
    expect(compareByShowDate(explicit, unknown)).toBeLessThan(0);
  });

  // Identical row compares equal — TanStack relies on this for stability.
  test("returns 0 when both rows are the same show", () => {
    const r = row("show-A", "2010-03-26", 1);
    expect(compareByShowDate(r, r)).toBe(0);
  });
});

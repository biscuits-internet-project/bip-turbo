import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ShowDate } from "./show-date";

/**
 * ShowDate renders BOTH the full `M/D/YYYY` and compact `M/D/YY` forms into the
 * DOM at once; CSS (`@container/datecell`) picks which is visible. So both
 * strings are always present in the markup — these tests assert the values, not
 * which one shows.
 */
describe("ShowDate", () => {
  test("renders both the full and compact forms of a string date", () => {
    render(<ShowDate date="2024-06-05" />);
    expect(screen.getByText("6/5/2024")).toBeInTheDocument();
    expect(screen.getByText("6/5/24")).toBeInTheDocument();
  });

  // A Date late on the 15th UTC must render as the 15th, not roll to the 16th,
  // regardless of the test runner's timezone.
  test("renders a Date near the day boundary using UTC fields", () => {
    render(<ShowDate date={new Date("2024-06-15T23:30:00Z")} />);
    expect(screen.getByText("6/15/2024")).toBeInTheDocument();
    expect(screen.getByText("6/15/24")).toBeInTheDocument();
  });
});

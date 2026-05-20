import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DateVenueCell } from "./date-venue-cell";

describe("DateVenueCell", () => {
  // The date is the only always-visible piece on mobile; the venue line
  // sits beneath it but is hidden by CSS at narrow widths so the column
  // collapses to a single short line on phones.
  test("renders date as the primary line", async () => {
    await setup(<DateVenueCell date="2024-06-15" venue={{ name: "The Capitol Theatre", city: "Port Chester" }} />);

    expect(screen.getByText("2024-06-15")).toBeInTheDocument();
  });

  // The venue line is rendered, but only visible once the cell container
  // is wide enough — a container query on the cell wrapper drives the
  // toggle so the column collapses to date-only at narrow widths regardless
  // of viewport. Verifies the CQ class is wired so the auto-collapse can't
  // regress silently.
  test("renders venue line with container-query gated visibility", async () => {
    await setup(<DateVenueCell date="2024-06-15" venue={{ name: "The Capitol Theatre", city: "Port Chester" }} />);

    const venueLine = screen.getByText(/The Capitol Theatre/);
    expect(venueLine.className).toContain("hidden");
    expect(venueLine.className).toContain("@[10rem]/datecell:block");
  });

  // City and state are appended to the venue name when present so users
  // can disambiguate venues with the same name (e.g. multiple Fillmores).
  test("appends city and state to venue name", async () => {
    await setup(
      <DateVenueCell date="2024-06-15" venue={{ name: "The Fillmore", city: "Philadelphia", state: "PA" }} />,
    );

    expect(screen.getByText(/The Fillmore, Philadelphia, PA/)).toBeInTheDocument();
  });

  // When there is no venue, the venue line is omitted entirely (rather
  // than rendering an empty bullet) so the cell collapses to date-only.
  test("omits venue line when venue is undefined", async () => {
    await setup(<DateVenueCell date="2024-06-15" />);

    expect(screen.getByText("2024-06-15")).toBeInTheDocument();
    // No venue text rendered — keeps the cell visually clean.
    expect(screen.queryByText(",")).not.toBeInTheDocument();
  });
});

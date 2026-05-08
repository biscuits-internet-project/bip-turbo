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

  // The venue line is rendered, but only visible at sm+ breakpoints. We
  // verify presence + the responsive class so mobile column overlap (the
  // bug this component fixes) cannot regress silently.
  test("renders venue line with hidden sm:block so it is hidden on mobile", async () => {
    await setup(<DateVenueCell date="2024-06-15" venue={{ name: "The Capitol Theatre", city: "Port Chester" }} />);

    const venueLine = screen.getByText(/The Capitol Theatre/);
    expect(venueLine.className).toContain("hidden");
    expect(venueLine.className).toContain("sm:block");
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
    const { container } = await setup(<DateVenueCell date="2024-06-15" />);

    expect(screen.getByText("2024-06-15")).toBeInTheDocument();
    // Only the date div should render — no second child line.
    expect(container.querySelectorAll("div").length).toBeLessThanOrEqual(1);
  });
});

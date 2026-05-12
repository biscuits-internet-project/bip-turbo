import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { ShowDateLink } from "./show-date-link";

/** Render ShowDateLink inside a MemoryRouter seeded with a given URL. */
function renderAtUrl(url: string, show: { date: string; slug: string | null } | null | undefined) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ShowDateLink show={show} />
    </MemoryRouter>,
  );
}

describe("ShowDateLink", () => {
  // No show value (null/undefined) renders the em-dash placeholder —
  // keeps the cell aligned with neighbors in tables.
  test("renders em-dash when show is null", () => {
    renderAtUrl("/", null);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("renders em-dash when show is undefined", () => {
    renderAtUrl("/", undefined);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  // Pre-slug legacy shows have a date but no slug — render the date as
  // plain text rather than a broken link.
  test("renders plain date (no link) when slug is null", () => {
    renderAtUrl("/", { date: "1999-07-18", slug: null });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("—")).not.toBeInTheDocument();
  });

  // Happy path: slug present, render a link to the show page.
  test("renders a link to /shows/{slug} when slug is present", () => {
    renderAtUrl("/", { date: "1999-07-18", slug: "1999-07-18-camden" });
    expect(screen.getByRole("link").getAttribute("href")).toBe("/shows/1999-07-18-camden");
  });

  // View preservation: when the current URL has `?view=gap-chart`, the
  // generated link should keep the user in that view on the destination
  // page. Same routing helper backs both gap-chart and personal views.
  test("preserves ?view=gap-chart from the current URL on the link href", () => {
    renderAtUrl("/shows/foo?view=gap-chart", { date: "1999-07-18", slug: "1999-07-18-camden" });
    expect(screen.getByRole("link").getAttribute("href")).toBe("/shows/1999-07-18-camden?view=gap-chart");
  });

  test("preserves ?view=personal from the current URL on the link href", () => {
    renderAtUrl("/shows/foo?view=personal", { date: "2024-07-19", slug: "2024-07-19-radio-city" });
    expect(screen.getByRole("link").getAttribute("href")).toBe("/shows/2024-07-19-radio-city?view=personal");
  });

  // An unrecognized view param (e.g., an old/typoed value) should not
  // leak into the link — only the two known values are passed through.
  test("ignores unrecognized ?view= values", () => {
    renderAtUrl("/shows/foo?view=bogus", { date: "2024-07-19", slug: "2024-07-19-radio-city" });
    expect(screen.getByRole("link").getAttribute("href")).toBe("/shows/2024-07-19-radio-city");
  });
});

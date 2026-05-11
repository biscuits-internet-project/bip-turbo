import { setupWithRouter } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { useSetlistView } from "./use-setlist-view";

// Tiny harness — render the hook's view + a button to flip it, plus the
// current URL search string so we can assert round-trip behavior.
function Harness() {
  const [view, setView] = useSetlistView();
  const location = useLocation();
  return (
    <>
      <div data-testid="view">{view}</div>
      <div data-testid="search">{location.search}</div>
      <button type="button" onClick={() => setView("gap-chart")}>
        to-gap
      </button>
      <button type="button" onClick={() => setView("setlist")}>
        to-setlist
      </button>
    </>
  );
}

describe("useSetlistView", () => {
  // Default view comes from the absence of ?view= in the URL — preserves
  // today's first-paint (flow text) on the show page.
  test("defaults to setlist when no view param is set", async () => {
    await setupWithRouter(<Harness />);
    expect(screen.getByTestId("view").textContent).toBe("setlist");
  });

  // Reading ?view=gap-chart lets a shared link land directly in the table
  // view without an extra click.
  test("reads ?view=gap-chart from the URL on mount", () => {
    render(
      <MemoryRouter initialEntries={["/shows/2024-07-26?view=gap-chart"]}>
        <Harness />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("view").textContent).toBe("gap-chart");
  });

  // Setting the view writes ?view=gap-chart so the URL is shareable; setting
  // back to setlist drops the param entirely instead of leaving ?view=setlist
  // hanging around (cleaner default state).
  test("setting to gap-chart writes the param; setting to setlist drops it", async () => {
    const user = userEvent.setup();
    await setupWithRouter(<Harness />);

    await user.click(screen.getByText("to-gap"));
    expect(screen.getByTestId("search").textContent).toBe("?view=gap-chart");

    await user.click(screen.getByText("to-setlist"));
    expect(screen.getByTestId("search").textContent).toBe("");
  });
});

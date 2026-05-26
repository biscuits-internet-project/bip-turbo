import { setupWithRouter } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { useShowAll } from "./use-show-all";

function Harness() {
  const [showAll, setShowAll] = useShowAll();
  const location = useLocation();
  return (
    <>
      <div data-testid="show-all">{String(showAll)}</div>
      <div data-testid="search">{location.search}</div>
      <button type="button" onClick={() => setShowAll(true)}>
        on
      </button>
      <button type="button" onClick={() => setShowAll(false)}>
        off
      </button>
    </>
  );
}

describe("useShowAll", () => {
  // Default is paginated — the absence of ?all= keeps existing routes behaving
  // exactly as they do today.
  test("defaults to false when no all param is set", async () => {
    await setupWithRouter(<Harness />);
    expect(screen.getByTestId("show-all").textContent).toBe("false");
  });

  // Shared links that include ?all=1 should land directly in show-all mode.
  test("reads ?all=1 from the URL on mount", () => {
    render(
      <MemoryRouter initialEntries={["/songs/histories?all=1"]}>
        <Harness />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("show-all").textContent).toBe("true");
  });

  // Toggling on writes ?all=1, toggling off drops the param entirely so the
  // bare URL stays clean (matches useSetlistView's round-trip behavior).
  test("toggling on writes ?all=1; toggling off drops the param", async () => {
    const user = userEvent.setup();
    await setupWithRouter(<Harness />);

    await user.click(screen.getByText("on"));
    expect(screen.getByTestId("search").textContent).toBe("?all=1");

    await user.click(screen.getByText("off"));
    expect(screen.getByTestId("search").textContent).toBe("");
  });

  // Unrecognized values (?all=true, ?all=yes, ?all=0) fall through to false
  // rather than guessing intent — only the canonical "1" enables show-all.
  test("falls back to false for non-1 values", () => {
    render(
      <MemoryRouter initialEntries={["/songs/histories?all=yes"]}>
        <Harness />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("show-all").textContent).toBe("false");
  });
});

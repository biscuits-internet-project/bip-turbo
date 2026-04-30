import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ShowFiltersNav } from "./show-filters-nav";

function paramsOf(href: string) {
  // Tests assert link targets, not pathnames — pull out the search params
  // portion so we can reason about them without duplicating the basePath.
  const [, search = ""] = href.split("?");
  return new URLSearchParams(search);
}

describe("ShowFiltersNav", () => {
  // Every filter toggle renders regardless of which params are currently
  // active — users need to see the full menu to discover filters.
  test("renders all four toggles", async () => {
    await setupWithRouter(<ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams()} />);

    expect(screen.getByRole("link", { name: /photos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nugs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /youtube/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /archive/i })).toBeInTheDocument();
  });

  // When a filter isn't active, clicking its link should add `=true` to the
  // URL — matching the existing FilterNav.parameters convention.
  test("inactive toggle link adds ?photos=true", async () => {
    await setupWithRouter(<ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams()} />);

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("photos")).toBe("true");
  });

  // When a filter is already active, clicking its link should remove it —
  // so every button is a two-way toggle.
  test("active toggle link removes the filter", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("photos=true")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).has("photos")).toBe(false);
  });

  // Toggling one filter must leave other active filters intact — the
  // Filter-by-Year nav already preserves ?q= similarly.
  test("toggling one filter preserves the others", async () => {
    await setupWithRouter(
      <ShowFiltersNav
        basePath="/shows/year/2024"
        currentURLParameters={new URLSearchParams("photos=true&nugs=true")}
      />,
    );

    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    const href = youtubeLink.getAttribute("href") ?? "";
    const next = paramsOf(href);
    expect(next.get("photos")).toBe("true");
    expect(next.get("nugs")).toBe("true");
    expect(next.get("youtube")).toBe("true");
  });

  // Non-filter query params (e.g. the legacy `?q=`) must survive a toggle
  // click so users don't lose unrelated state.
  test("preserves unrelated query params", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("q=camden")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("q")).toBe("camden");
  });
});

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
  test("renders all five toggles", async () => {
    await setupWithRouter(<ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams()} />);

    expect(screen.getByRole("link", { name: /photos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /nugs/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /youtube/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /archive/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /relisten/i })).toBeInTheDocument();
  });

  // First click on an empty filter advances to positive — the URL gains
  // `?photos=yes` (the canonical positive serialization).
  test("empty toggle link advances to ?photos=yes", async () => {
    await setupWithRouter(<ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams()} />);

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("photos")).toBe("yes");
  });

  // Second click on an already-positive filter advances to negative —
  // expresses "only shows WITHOUT photos".
  test("positive toggle link advances to ?photos=no", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("photos=yes")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("photos")).toBe("no");
  });

  // Third click clears the filter — completes the cycle empty → positive →
  // negative → empty so users can return to the unfiltered state by clicking.
  test("negative toggle link clears the filter", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("photos=no")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).has("photos")).toBe(false);
  });

  // `?photos=true` reads as positive (the parser is permissive about the
  // value), so its toggle advances to `?photos=no` — the same path any
  // positive-state filter takes when clicked.
  test("?photos=true reads as positive and advances to ?photos=no", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("photos=true")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("photos")).toBe("no");
  });

  // Toggling one filter must leave other active filters intact, including
  // mixed positive/negative combinations across siblings.
  test("toggling one filter preserves mixed positive/negative siblings", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("photos=yes&nugs=no")} />,
    );

    const youtubeLink = screen.getByRole("link", { name: /youtube/i });
    const href = youtubeLink.getAttribute("href") ?? "";
    const next = paramsOf(href);
    expect(next.get("photos")).toBe("yes");
    expect(next.get("nugs")).toBe("no");
    expect(next.get("youtube")).toBe("yes");
  });

  // Non-filter query params (e.g. `?q=` from external search links) must
  // survive a toggle click so users don't lose unrelated state.
  test("preserves unrelated query params", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("q=camden")} />,
    );

    const link = screen.getByRole("link", { name: /photos/i });
    const href = link.getAttribute("href") ?? "";
    expect(paramsOf(href).get("q")).toBe("camden");
  });

  // Negative state announces "excluded" via aria-label so screen-reader
  // users can tell positive and negative apart — neither has visual icon
  // text and the strikethrough is purely decorative.
  test("negative toggle has an excluded aria-label", async () => {
    await setupWithRouter(
      <ShowFiltersNav basePath="/shows/year/2024" currentURLParameters={new URLSearchParams("archive=no")} />,
    );

    const link = screen.getByRole("link", { name: /archive/i });
    expect(link.getAttribute("aria-label")).toMatch(/exclud/i);
  });
});

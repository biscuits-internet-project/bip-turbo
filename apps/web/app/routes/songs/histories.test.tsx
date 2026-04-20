import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("@bip/domain/cache-keys", () => ({ CacheKeys: { songs: { histories: vi.fn() } } }));

// Mock the loader data hook to return songs with history content. "Basis for
// a Day" is stored as multi-paragraph HTML; "Above the Waves" uses plain text
// with \n\n paragraph breaks. The preview should preserve paragraph structure
// for both.
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({
    songs: [
      {
        id: "1",
        title: "Basis for a Day",
        slug: "basis-for-a-day",
        history:
          "<p>Basis for a Day was composed by Marc Brownstein in the early days of the band.</p><p>It quickly became a fan favorite and has remained in heavy rotation ever since.</p>",
      },
      {
        id: "2",
        title: "Above the Waves",
        slug: "above-the-waves",
        history:
          "Above the Waves was first performed in 2003.\n\nIt has been a staple of the band's second set ever since.",
      },
      {
        id: "3",
        title: "Akira Jam",
        slug: "akira-jam",
        // Real-world shape: indented paragraphs, HTML entities
        history:
          '<p>For the 2nd set on New Years Eve, 1999, The Disco Biscuits played along to Katsuhiro Otomo&#x27;s anime masterpiece, Akira.</p>\n  \n  <p>&quot;When the 1988 dateline appears, the first note of the DJ spinning should start up.&quot;</p>',
      },
    ],
  })),
}));

import HistoriesPage from "./histories";

function renderHistories() {
  return render(
    <MemoryRouter initialEntries={["/songs/histories"]}>
      <HistoriesPage />
    </MemoryRouter>,
  );
}

describe("HistoriesPage", () => {
  // Each song with history content should appear as a row in the table
  // with its title linking to the song's history tab.
  test("renders song titles as links to the song history tab", () => {
    renderHistories();

    const basisLink = screen.getByRole("link", { name: "Basis for a Day" });
    expect(basisLink).toHaveAttribute("href", "/songs/basis-for-a-day?tab=history");

    const wavesLink = screen.getByRole("link", { name: "Above the Waves" });
    expect(wavesLink).toHaveAttribute("href", "/songs/above-the-waves?tab=history");
  });

  // The full history text is rendered into the DOM; CSS clamps it visually
  // with a "more"/"less" toggle to expand/collapse.
  test("renders the full history text in the DOM for CSS clamping", () => {
    renderHistories();

    const basisHistory = screen.getByText(/Basis for a Day was composed/);
    expect(basisHistory.textContent).toContain("quickly became a fan favorite");

    const wavesHistory = screen.getByText(/Above the Waves was first performed/);
    expect(wavesHistory.textContent).toContain("staple of the band");
  });

  // History text stored as HTML should have tags stripped before display so
  // users see clean text in the preview column.
  test("strips HTML tags from history text", () => {
    renderHistories();

    // The <p> tag in the "Basis for a Day" history should not be rendered literally.
    const basisHistory = screen.getByText(/Basis for a Day was composed by Marc Brownstein/);
    expect(basisHistory.textContent).not.toContain("<p>");
    expect(basisHistory.textContent).not.toContain("</p>");
  });

  // Paragraph breaks should be preserved so multi-paragraph histories don't
  // collapse into a wall of text. Uses whitespace-pre-line CSS so \n\n renders
  // as a visible blank line.
  test("preserves paragraph breaks from HTML <p> tags", () => {
    renderHistories();

    const basisHistory = screen.getByText(/Basis for a Day was composed/);
    expect(basisHistory.textContent).toContain("\n\n");
    expect(basisHistory.className).toContain("whitespace-pre-line");
  });

  test("preserves paragraph breaks from plain text \\n\\n", () => {
    renderHistories();

    const wavesHistory = screen.getByText(/Above the Waves was first performed/);
    expect(wavesHistory.textContent).toContain("\n\n");
    expect(wavesHistory.className).toContain("whitespace-pre-line");
  });

  // HTML entities in stored history (e.g. &quot;, &#x27;) should decode to
  // their characters so users don't see raw entity codes.
  test("decodes common HTML entities", () => {
    renderHistories();

    const akiraHistory = screen.getByText(/Disco Biscuits played along/);
    expect(akiraHistory.textContent).toContain("Otomo's");
    expect(akiraHistory.textContent).toContain('"When the 1988 dateline appears');
    expect(akiraHistory.textContent).not.toContain("&#x27;");
    expect(akiraHistory.textContent).not.toContain("&quot;");
  });

  // Leading whitespace on paragraph lines (from indented source HTML) should
  // be trimmed so whitespace-pre-line doesn't render visible indentation.
  test("trims leading whitespace on paragraph lines", () => {
    renderHistories();

    const akiraHistory = screen.getByText(/Disco Biscuits played along/);
    // The second paragraph should not start with leading spaces
    expect(akiraHistory.textContent).not.toMatch(/\n\n {2,}"When/);
  });

  // The table should support pagination for when more histories are written.
  // With only 2 items and a page size of 50, pagination nav should be hidden.
  test("hides pagination when all items fit on one page", () => {
    renderHistories();

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});

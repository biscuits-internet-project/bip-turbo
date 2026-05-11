import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { YearlyPlayChart } from "./yearly-play-chart";

// Recharts uses ResizeObserver + measured DOM sizes that jsdom doesn't
// supply. ResponsiveContainer renders nothing under those conditions, which
// would hide the chart from the test entirely. Stub it to a fixed-size div
// so the inner LineChart renders deterministically.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 300 }}>{children}</div>
    ),
  };
});

describe("YearlyPlayChart", () => {
  const yearlyPlayData = { 2010: 12, 2011: 8, 2012: 16 };
  const showsByYear = { 2010: 60, 2011: 80, 2012: 80 };

  // The toggle is a 2-button group styled like the page's existing tabs.
  // "% of Shows" is the default — normalized view is the more interesting
  // read for most users since it controls for tour-volume swings.
  test("renders # Plays and % of Shows toggle buttons with % of Shows selected by default", async () => {
    await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    const countButton = screen.getByRole("button", { name: /# plays/i });
    const percentButton = screen.getByRole("button", { name: /% of shows/i });

    expect(countButton).toBeInTheDocument();
    expect(percentButton).toBeInTheDocument();
    // aria-pressed reflects which mode is active so screen readers and tests
    // can both observe the current selection.
    expect(percentButton).toHaveAttribute("aria-pressed", "true");
    expect(countButton).toHaveAttribute("aria-pressed", "false");
  });

  // Clicking "Count" flips the toggle state. The visual swap of the chart
  // series is hard to assert against jsdom + recharts SVG, so we assert the
  // toggle's pressed state — that's the user-observable contract the test
  // enforces. The data transform is covered by the helper test.
  test("clicking # Plays updates the active button", async () => {
    const { user } = await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    const countButton = screen.getByRole("button", { name: /# plays/i });
    await user.click(countButton);

    expect(countButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /% of shows/i })).toHaveAttribute("aria-pressed", "false");
  });

  // Round-trip: clicking back to % of Shows restores the default. Guards
  // against a one-way toggle bug where clicking the inactive button works
  // but clicking the now-inactive default button is a no-op.
  test("clicking % of Shows after # Plays restores % of Shows as active", async () => {
    const { user } = await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    await user.click(screen.getByRole("button", { name: /# plays/i }));
    await user.click(screen.getByRole("button", { name: /% of shows/i }));

    expect(screen.getByRole("button", { name: /% of shows/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /# plays/i })).toHaveAttribute("aria-pressed", "false");
  });

  // The X-axis-scope toggle lets users switch between "All Years" (every
  // year in the band's touring window since 1995, default) and "Years
  // Played" (debut year through last-played year, with zero-fills for
  // skipped years in between so the X axis stays continuous).
  test("renders Years Played and All Years scope toggle with All Years selected by default", async () => {
    await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    const playedButton = screen.getByRole("button", { name: /years played/i });
    const allYearsButton = screen.getByRole("button", { name: /all years/i });

    expect(allYearsButton).toHaveAttribute("aria-pressed", "true");
    expect(playedButton).toHaveAttribute("aria-pressed", "false");
  });

  // Clicking "Years Played" makes that button the active one. Toggle state
  // is independent of the units toggle (Count vs %).
  test("clicking Years Played activates that scope", async () => {
    const { user } = await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    await user.click(screen.getByRole("button", { name: /years played/i }));

    expect(screen.getByRole("button", { name: /years played/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /all years/i })).toHaveAttribute("aria-pressed", "false");
  });

  // Round-trip: switching back to All Years restores the default. Symmetric
  // with the units-toggle round-trip test.
  test("clicking All Years after Years Played restores All Years as active", async () => {
    const { user } = await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);

    await user.click(screen.getByRole("button", { name: /years played/i }));
    await user.click(screen.getByRole("button", { name: /all years/i }));

    expect(screen.getByRole("button", { name: /all years/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /years played/i })).toHaveAttribute("aria-pressed", "false");
  });

  // The card title is part of the contract: this is the "Played by Year"
  // section. Pinned so a future refactor that drops the heading also trips
  // this test.
  test("renders the section heading", async () => {
    await setup(<YearlyPlayChart yearlyPlayData={yearlyPlayData} showsByYear={showsByYear} />);
    expect(screen.getByText(/played by year/i)).toBeInTheDocument();
  });
});

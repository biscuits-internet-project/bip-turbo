import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SetlistViewControl, type SetlistViewSummary } from "./setlist-view-control";

/** Compact summary builder for tests — sane defaults, override what matters. */
function summary(overrides: Partial<SetlistViewSummary> = {}): SetlistViewSummary {
  return { label: "Average / median song gap", average: null, median: null, debutCount: 0, ...overrides };
}

describe("SetlistViewControl", () => {
  // The "personal" segment is per-user data, so it must be hidden when no
  // user is logged in. Renders setlist + gap-chart only.
  test("does not render the 'personal' segment when showPersonal is false", async () => {
    await setupWithRouter(<SetlistViewControl view="setlist" onChange={vi.fn()} showPersonal={false} />);
    expect(screen.getByRole("button", { name: "setlist" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "gap chart" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "personal gap chart" })).not.toBeInTheDocument();
  });

  // Logged-in users see the third segment alongside the other two.
  test("renders the 'personal' segment when showPersonal is true", async () => {
    await setupWithRouter(<SetlistViewControl view="setlist" onChange={vi.fn()} showPersonal={true} />);
    expect(screen.getByRole("button", { name: "personal gap chart" })).toBeInTheDocument();
  });

  // Debut suffix: when debutCount > 0 the summary appends `· N debuts`
  // (or `· 1 debut` singular). Debuts aren't included in avg/median —
  // surfacing the count keeps the rarity signal intact.
  test("appends '· N debuts' to the summary when debutCount > 0", async () => {
    await setupWithRouter(
      <SetlistViewControl
        view="gap-chart"
        onChange={vi.fn()}
        summary={summary({ average: 4.2, median: 3.0, debutCount: 2 })}
      />,
    );
    expect(screen.getByText(/Average \/ median song gap: 4\.2 \/ 3\.0 · 2 debuts/)).toBeInTheDocument();
  });

  // Singular grammar — `· 1 debut`, not `· 1 debuts`.
  test("uses singular 'debut' wording when debutCount === 1", async () => {
    await setupWithRouter(
      <SetlistViewControl
        view="gap-chart"
        onChange={vi.fn()}
        summary={summary({ average: 4.2, median: 3.0, debutCount: 1 })}
      />,
    );
    expect(screen.getByText(/· 1 debut$/)).toBeInTheDocument();
  });

  // No avg/median (all-debut show) but debuts present: surface the debut
  // count alone so the user still sees the rarity signal.
  test("renders debut count by itself when avg/median are null", async () => {
    await setupWithRouter(
      <SetlistViewControl view="gap-chart" onChange={vi.fn()} summary={summary({ debutCount: 3 })} />,
    );
    expect(screen.getByText("3 debuts")).toBeInTheDocument();
    // Neither the "Average / median" prefix nor any numeric value sneaks in.
    expect(screen.queryByText(/Average/)).not.toBeInTheDocument();
  });

  // Omitting `summary` hides the summary line entirely — useful while the
  // personal-view data is still loading.
  test("hides the summary line entirely when summary is omitted", async () => {
    await setupWithRouter(<SetlistViewControl view="gap-chart" onChange={vi.fn()} />);
    expect(screen.queryByText(/song gap/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/debut/i)).not.toBeInTheDocument();
  });

  // Personal-view caller supplies its own summary with the "Your" label —
  // the control doesn't branch on view to pick a label any more.
  test("renders the caller-supplied 'Your' label and values in personal view", async () => {
    await setupWithRouter(
      <SetlistViewControl
        view="personal"
        onChange={vi.fn()}
        showPersonal
        summary={{ label: "Your average / median song gap", average: 6.59, median: 5, debutCount: 2 }}
      />,
    );
    expect(screen.getByText(/Your average \/ median song gap: 6\.6 \/ 5\.0 · 2 debuts/)).toBeInTheDocument();
    expect(screen.queryByText(/^Average \/ median song gap:/)).not.toBeInTheDocument();
  });
});

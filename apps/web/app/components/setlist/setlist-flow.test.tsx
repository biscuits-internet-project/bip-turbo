import type { SetlistLight } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// TrackRatingOverlay wraps each song in a hover popover that needs React Query
// + session context; render its children straight through. NoteworthyMarker is
// an icon the flow tests don't assert on.
vi.mock("./track-rating-overlay", () => ({
  TrackRatingOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("~/components/track/noteworthy-marker", () => ({
  NoteworthyMarker: () => null,
}));

import { SetlistFlow } from "./setlist-flow";

function durTrack(
  id: string,
  title: string,
  duration: number | null,
  set: string,
  position: number,
  overrides: {
    gap?: number | null;
    previousPerformanceShow?: { date: string; slug: string } | null;
    completes?: { date: string; slug: string }[];
    completedBy?: { date: string; slug: string }[];
    flags?: Array<"DYSLEXIC" | "INVERTED" | "UNFINISHED" | "ENDING_ONLY" | "MIDDLE_ONLY" | "BEGINNING_ONLY">;
    song?: {
      id: string;
      title: string;
      slug: string;
      kind?: "original" | "cover" | "mashup" | "improvisation" | null;
    };
  } = {},
) {
  return {
    id,
    showId: "show-1",
    songId: id,
    set,
    position,
    segue: null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: null,
    ratingsCount: 0,
    gap: null as number | null,
    previousPerformanceShowId: null,
    duration,
    durationSource: duration === null ? null : "nugs",
    previousPerformanceShow: null as { date: string; slug: string } | null,
    song: { id, title, slug: title.toLowerCase().replace(/\s+/g, "-") },
    ...overrides,
  };
}

function flowSetlist(
  sets: Array<{ label: string; tracks: ReturnType<typeof durTrack>[] }>,
  annotations: Array<{ trackId: string; desc: string }> = [],
  showDate?: string,
): SetlistLight {
  return {
    show: { id: "show-1", date: showDate },
    sets: sets.map((s, i) => ({ label: s.label, sort: i + 1, tracks: s.tracks })),
    annotations,
    trackMusicianDeltas: [],
    lineup: [],
  } as unknown as SetlistLight;
}

describe("SetlistFlow", () => {
  // A single-set show labels its one set "Set" (no number) with its duration
  // inline, and drops the redundant Total.
  test("a single-set show labels it 'Set' with inline duration and no Total", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1), durTrack("b", "Spaga", 410, "S1", 2)] },
        ])}
      />,
    );
    expect(screen.getByText("Set")).toBeInTheDocument();
    expect(screen.getByText("15:32")).toBeInTheDocument();
    expect(screen.queryByText("Set 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
  });

  // With one regular set plus an encore, the regular set still reads "Set"
  // (no number), but the Total returns since the show spans multiple sets.
  test("a one-set-plus-encore show labels the set 'Set' and keeps the Total", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] },
          { label: "E1", tracks: [durTrack("b", "Spaga", 410, "E1", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Set")).toBeInTheDocument();
    expect(screen.queryByText("Set 1")).not.toBeInTheDocument();
    expect(screen.getByText("Encore")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  test("a multi-set show shows per-set headings and the Total", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] },
          { label: "S2", tracks: [durTrack("b", "Spaga", 410, "S2", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Set 2")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  // The Total sits directly under the sets, above the divider that fronts the
  // annotation footnotes — not bundled in the bordered footnote block.
  test("renders the Total above the footnote divider", async () => {
    const { container } = await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist(
          [
            { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] },
            { label: "S2", tracks: [durTrack("b", "Spaga", 410, "S2", 1)] },
          ],
          [{ trackId: "a", desc: "Glow-stick war peak" }],
        )}
      />,
    );
    const total = screen.getByText("Total");
    const divider = container.querySelector(".border-t");
    expect(divider).not.toBeNull();
    // Total is not nested inside the bordered footnote block...
    expect(divider?.contains(total)).toBe(false);
    // ...and precedes it in document order.
    expect(total.compareDocumentPosition(divider as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test("flags a partial total when some tracks are untimed", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1), durTrack("b", "Spaga", null, "S1", 2)] },
        ])}
      />,
    );
    expect(screen.getByText(/Partial: 1 track not yet timed/)).toBeInTheDocument();
  });

  test("shows no Total or partial note when nothing is timed", async () => {
    await setupWithRouter(
      <SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] }])} />,
    );
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText(/Partial/)).not.toBeInTheDocument();
  });

  // A lone encore reads "Encore" (no number).
  test("labels a single encore 'Encore'", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] },
          { label: "E1", tracks: [durTrack("b", "Spaga", null, "E1", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Encore")).toBeInTheDocument();
    expect(screen.queryByText("Encore 1")).not.toBeInTheDocument();
  });

  test("numbers multiple encores", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] },
          { label: "E1", tracks: [durTrack("b", "Spaga", null, "E1", 1)] },
          { label: "E2", tracks: [durTrack("c", "Crickets", null, "E2", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Encore 1")).toBeInTheDocument();
    expect(screen.getByText("Encore 2")).toBeInTheDocument();
  });

  // A track with an annotation gets an inline superscript marker and a matching
  // footnote line.
  test("numbers track annotations inline and footnotes them", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist(
          [{ label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] }],
          [{ trackId: "a", desc: "Glow-stick war peak" }],
        )}
      />,
    );
    expect(screen.getByText("Glow-stick war peak")).toBeInTheDocument();
    // The inline superscript marker "1" and the footnote index "1" both render.
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
  });

  // A debut composition and a long-gap return both auto-footnote, alongside the
  // hand annotation (no suppression).
  test("auto-footnotes debuts and long-gap returns next to hand annotations", async () => {
    const debut = durTrack("a", "Aquatic Ape", 522, "S1", 1, { gap: null });
    const returning = durTrack("b", "Spaga", 410, "S1", 2, {
      gap: 241,
      previousPerformanceShow: { date: "2007-02-15", slug: "2007-02-15-foo" },
    });
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([{ label: "S1", tracks: [debut, returning] }], [{ trackId: "a", desc: "Tela tease" }])}
      />,
    );

    expect(screen.getByText("debut (original - unknown author)")).toBeInTheDocument();
    expect(screen.getByText(/last played/)).toHaveTextContent("241 shows");
    // The hand annotation still renders unchanged.
    expect(screen.getByText("Tela tease")).toBeInTheDocument();
  });

  // Helper: a show with a debut track and a long-gap return, to probe which
  // auto footnotes the show's date allows.
  function debutAndReturnSetlist(showDate: string) {
    const debut = durTrack("a", "Aquatic Ape", 522, "S1", 1, { gap: null, flags: ["INVERTED"] });
    const returning = durTrack("b", "Spaga", 410, "S1", 2, {
      gap: 241,
      previousPerformanceShow: { date: "1995-04-21", slug: "1995-04-21-foo" },
    });
    return flowSetlist([{ label: "S1", tracks: [debut, returning] }], [{ trackId: "a", desc: "Tela tease" }], showDate);
  }

  // Before the debut start date, neither debut nor gap footnotes render, but the
  // hand annotation and structured flag still do.
  test("a show before the debut start date shows no debut or last-played footnote", async () => {
    await setupWithRouter(<SetlistFlow setlist={debutAndReturnSetlist("1997-07-10")} />);

    expect(screen.queryByText("debut (original - unknown author)")).not.toBeInTheDocument();
    expect(screen.queryByText(/last played/)).not.toBeInTheDocument();
    // Observed facts still render: the annotation and the structured flag.
    expect(screen.getByText("Tela tease")).toBeInTheDocument();
    expect(screen.getByText("inverted")).toBeInTheDocument();
  });

  // Debuts firm up before gaps: a show between the two start dates shows the
  // debut but still suppresses the gap-derived last-played footnote.
  test("a show between the two start dates shows the debut but not the last-played", async () => {
    await setupWithRouter(<SetlistFlow setlist={debutAndReturnSetlist("1998-05-01")} />);

    expect(screen.getByText("debut (original - unknown author)")).toBeInTheDocument();
    expect(screen.queryByText(/last played/)).not.toBeInTheDocument();
  });

  // On the gap start date both categories are trustworthy.
  test("a show on the gap start date shows both the debut and the last-played", async () => {
    await setupWithRouter(<SetlistFlow setlist={debutAndReturnSetlist("1998-08-28")} />);

    expect(screen.getByText("debut (original - unknown author)")).toBeInTheDocument();
    expect(screen.getByText(/last played/)).toHaveTextContent("241 shows");
  });

  // A track that completes an earlier unfinished version footnotes the link to
  // that earlier show.
  test("footnotes a cross-show completion linking to the earlier version", async () => {
    const completing = durTrack("a", "Basis for a Day", 600, "S1", 1, {
      completes: [{ date: "2025-11-14", slug: "2025-11-14-earlier" }],
    });
    await setupWithRouter(<SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [completing] }])} />);

    expect(screen.getByText(/completes/)).toHaveTextContent("completes 11/14/2025 version");
    expect(screen.getByRole("link", { name: "11/14/2025" })).toHaveAttribute("href", "/shows/2025-11-14-earlier");
  });

  // Structured flags render as footnotes, mirroring the annotation text they
  // replace so the setlist reads the same after the backfill.
  test("renders a footnote for a structured track flag", async () => {
    const inverted = durTrack("a", "Abraxas", 600, "S1", 1, { flags: ["INVERTED"] });
    await setupWithRouter(<SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [inverted] }])} />);

    expect(screen.getByText("inverted")).toBeInTheDocument();
  });
});

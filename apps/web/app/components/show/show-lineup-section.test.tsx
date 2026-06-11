import type { Instrument, ShowLineupMember } from "@bip/domain";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import type { ShowLineupNotes } from "~/lib/lineup-notes";
import { ShowLineupSection } from "./show-lineup-section";

function makeInstrument(name: string): Instrument {
  return { id: `instr-${name}`, name, slug: name.toLowerCase(), createdAt: new Date(), updatedAt: new Date() };
}

function makeMember(name: string, slug: string, instruments: Instrument[]): ShowLineupMember {
  return {
    musician: { id: `m-${slug}`, name, slug, knownFrom: null, defaultInstrument: null },
    instruments,
  };
}

function makeNotes(overrides: Partial<ShowLineupNotes> = {}): ShowLineupNotes {
  return { missing: [], guests: [], offInstrument: [], milestones: [], ...overrides };
}

function renderSection(lineup: ShowLineupMember[], notes?: ShowLineupNotes) {
  return render(
    <MemoryRouter>
      <ShowLineupSection lineup={lineup} notes={notes} />
    </MemoryRouter>,
  );
}

describe("ShowLineupSection", () => {
  test("renders each member as a link to their profile with instruments", () => {
    renderSection([makeMember("Aron Magner", "aron-magner", [makeInstrument("Keys")])]);

    const link = screen.getByText("Aron Magner").closest("a");
    expect(link).toHaveAttribute("href", "/musicians/aron-magner");
    expect(screen.getByText(/Keys/)).toBeInTheDocument();
  });

  test("renders core members first in Jon/Aron/Marc order, then guests, regardless of input order", () => {
    renderSection([
      makeMember("Mike Greenfield", "mike-greenfield", []),
      makeMember("Marc Brownstein", "marc-brownstein", []),
      makeMember("Jon Gutwillig", "jon-gutwillig", []),
      makeMember("Aron Magner", "aron-magner", []),
    ]);

    const names = screen.getAllByRole("link").map((link) => link.textContent);
    expect(names).toEqual(["Jon Gutwillig", "Aron Magner", "Marc Brownstein", "Mike Greenfield"]);
  });

  test("renders nothing for an empty lineup", () => {
    const { container } = renderSection([]);
    expect(container).toBeEmptyDOMElement();
  });

  test("marks a deviating member (whole-show guest) with a sparkle, leaves core members unmarked", () => {
    renderSection(
      [
        makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Guitar")]),
        makeMember("Tom Hamilton", "tom-hamilton", [makeInstrument("Guitar")]),
      ],
      makeNotes({
        guests: [
          {
            musicianId: "m-tom-hamilton",
            name: "Tom Hamilton",
            slug: "tom-hamilton",
            instruments: ["guitar"],
            absentTrackIds: [],
          },
        ],
      }),
    );

    const guestRow = screen.getByText("Tom Hamilton").closest("li");
    const coreRow = screen.getByText("Jon Gutwillig").closest("li");
    expect(within(guestRow as HTMLElement).getByTestId("lineup-member-sparkle")).toBeInTheDocument();
    expect(within(coreRow as HTMLElement).queryByTestId("lineup-member-sparkle")).not.toBeInTheDocument();
  });

  test("marks an off-instrument core member with a sparkle", () => {
    renderSection(
      [makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Keys")])],
      makeNotes({
        offInstrument: [
          { slug: "jon-gutwillig", name: "Jon Gutwillig", instruments: ["keys"], defaultInstrument: "guitar" },
        ],
      }),
    );

    const row = screen.getByText("Jon Gutwillig").closest("li");
    expect(within(row as HTMLElement).getByTestId("lineup-member-sparkle")).toBeInTheDocument();
  });

  test("shows a header deviation indicator when a core member is missing, even with no listed member marked", () => {
    renderSection(
      [makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Guitar")])],
      makeNotes({ missing: [{ slug: "marc-brownstein", name: "Marc Brownstein", instrument: "bass" }] }),
    );

    expect(screen.getByTestId("lineup-deviation-indicator")).toBeInTheDocument();
    expect(screen.queryByTestId("lineup-member-sparkle")).not.toBeInTheDocument();
  });

  test("shows no indicators when notes report no deviations", () => {
    renderSection([makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Guitar")])], makeNotes());
    expect(screen.queryByTestId("lineup-deviation-indicator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lineup-member-sparkle")).not.toBeInTheDocument();
  });

  test("shows no indicators when notes are omitted", () => {
    renderSection([makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Guitar")])]);
    expect(screen.queryByTestId("lineup-deviation-indicator")).not.toBeInTheDocument();
  });

  test("bare mode renders just the member list with no card heading or indicators", () => {
    render(
      <MemoryRouter>
        <ShowLineupSection
          lineup={[makeMember("Jon Gutwillig", "jon-gutwillig", [makeInstrument("Guitar")])]}
          notes={makeNotes({
            guests: [
              {
                musicianId: "m-tom-hamilton",
                name: "Tom Hamilton",
                slug: "tom-hamilton",
                instruments: ["guitar"],
                absentTrackIds: [],
              },
            ],
          })}
          bare
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("heading", { name: "Lineup" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("lineup-deviation-indicator")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lineup-member-sparkle")).not.toBeInTheDocument();
  });
});

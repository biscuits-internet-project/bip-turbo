import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import type { ShowLineupNotes } from "~/lib/lineup-notes";
import { ShowLineupNote } from "./show-lineup-note";

function renderNote(notes: Partial<ShowLineupNotes>) {
  const full: ShowLineupNotes = { missing: [], guests: [], milestones: [], offInstrument: [], ...notes };
  return render(
    <MemoryRouter>
      <ShowLineupNote notes={full} />
    </MemoryRouter>,
  );
}

describe("ShowLineupNote", () => {
  test("renders a missing core member with a link", () => {
    renderNote({ missing: [{ slug: "jon-gutwillig", name: "Jon Gutwillig", instrument: "guitar" }], guests: [] });

    expect(screen.getByText("Jon Gutwillig").closest("a")).toHaveAttribute("href", "/musicians/jon-gutwillig");
    expect(screen.getByText(/without/)).toHaveTextContent("without Jon Gutwillig on guitar");
  });

  test("renders a whole-show guest with a link and no 'except where noted' when on every track", () => {
    renderNote({
      missing: [],
      guests: [
        { musicianId: "m1", name: "Tom Hamilton", slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] },
      ],
    });

    expect(screen.getByText("Tom Hamilton").closest("a")).toHaveAttribute("href", "/musicians/tom-hamilton");
    expect(screen.getByText(/with/)).toHaveTextContent("with Tom Hamilton on guitar");
    expect(screen.queryByText(/except where noted/)).not.toBeInTheDocument();
  });

  test("appends 'except where noted' when the guest sat out some tracks", () => {
    renderNote({
      missing: [],
      guests: [
        {
          musicianId: "m1",
          name: "Tom Hamilton",
          slug: "tom-hamilton",
          instruments: ["guitar"],
          absentTrackIds: ["t5"],
        },
      ],
    });

    expect(screen.getByText(/with/)).toHaveTextContent("with Tom Hamilton on guitar, except where noted");
  });

  test("renders a drummer first-show milestone with a link", () => {
    renderNote({ milestones: [{ slug: "marlon-lewis", name: "Marlon Lewis", ordinal: "1st" }] });

    expect(screen.getByText("Marlon Lewis").closest("a")).toHaveAttribute("href", "/musicians/marlon-lewis");
    expect(screen.getByText(/1st show/)).toHaveTextContent("1st show with Marlon Lewis on drums");
  });

  test("renders a drummer last-show milestone", () => {
    renderNote({ milestones: [{ slug: "allen-aucoin", name: "Allen Aucoin", ordinal: "last" }] });
    expect(screen.getByText(/last show/)).toHaveTextContent("last show with Allen Aucoin on drums");
  });

  test("renders a core member playing a non-default instrument with a link", () => {
    renderNote({
      offInstrument: [
        { slug: "jon-gutwillig", name: "Jon Gutwillig", instruments: ["midi"], defaultInstrument: "guitar" },
      ],
    });

    expect(screen.getByText("Jon Gutwillig").closest("a")).toHaveAttribute("href", "/musicians/jon-gutwillig");
    expect(screen.getByText(/instead of/)).toHaveTextContent("Jon Gutwillig on midi instead of guitar");
  });

  test("combines two guests on the same instrument into one sentence, each name linked", () => {
    renderNote({
      guests: [
        { musicianId: "m1", name: "Tom Hamilton", slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] },
        {
          musicianId: "m2",
          name: "Chris Michetti",
          slug: "chris-michetti",
          instruments: ["guitar"],
          absentTrackIds: [],
        },
      ],
    });

    expect(screen.getByText("Tom Hamilton").closest("a")).toHaveAttribute("href", "/musicians/tom-hamilton");
    expect(screen.getByText("Chris Michetti").closest("a")).toHaveAttribute("href", "/musicians/chris-michetti");
    expect(screen.getByText(/with/)).toHaveTextContent("with Tom Hamilton and Chris Michetti on guitar");
  });

  test("renders nothing when there is nothing to report", () => {
    const { container } = renderNote({});
    expect(container).toBeEmptyDOMElement();
  });
});

import type { Instrument, ShowLineupMember } from "@bip/domain";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
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

function renderSection(lineup: ShowLineupMember[]) {
  return render(
    <MemoryRouter>
      <ShowLineupSection lineup={lineup} />
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
});

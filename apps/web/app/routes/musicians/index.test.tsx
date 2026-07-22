import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// AdminOnly currently renders its children unconditionally; mock it as a
// passthrough so this test asserts the links' structure, not the gating.
vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const loaderData = vi.fn(() => ({ musicians: [] as unknown[] }));
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: () => loaderData(),
}));

// The loader pulls in the server services + env modules; stub both so importing
// the route component in jsdom doesn't drag in the database client or env check.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: <T,>(fn: T) => fn }));

import MusiciansPage from "./index";

describe("MusiciansPage admin links", () => {
  test("admins can create a musician and manage instruments from the public page", async () => {
    await setupWithRouter(<MusiciansPage />);

    expect(screen.getByRole("link", { name: /create musician/i })).toHaveAttribute("href", "/admin/musicians/new");
    expect(screen.getByRole("link", { name: /manage instruments/i })).toHaveAttribute("href", "/admin/instruments");
  });
});

describe("MusiciansPage count columns", () => {
  // Songs (distinct repertoire) and Plays (repeat plays) are separate
  // aggregates over the same appearances; each column has to read its own
  // field, since swapping them would still render plausible numbers.
  test("shows, distinct songs, and repeat plays each get their own column", async () => {
    loaderData.mockReturnValue({
      musicians: [
        {
          id: "am",
          name: "Aron Magner",
          slug: "aron-magner",
          knownFrom: null,
          defaultInstrumentName: "Keyboards",
          showCount: 1899,
          songCount: 550,
          playCount: 20111,
          firstShowDate: "1995-04-15",
          lastShowDate: "2026-01-03",
        },
      ],
    });

    await setupWithRouter(<MusiciansPage />);

    const headers = screen.getAllByRole("columnheader").map((header) => header.textContent ?? "");
    const row = screen.getByRole("row", { name: /Aron Magner/ });
    const cells = Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent ?? "");
    const valueUnder = (label: string) => cells[headers.findIndex((header) => header.includes(label))];

    expect(valueUnder("Shows")).toBe("1899");
    expect(valueUnder("Songs")).toBe("550");
    expect(valueUnder("Plays")).toBe("20111");
  });
});

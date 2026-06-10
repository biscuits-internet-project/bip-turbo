import type { Instrument, MusicianRef, TrackMusicianDelta } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { deltasToRows, type PerformerRow, rowsToDeltas, TrackPerformerEditor } from "./track-performer-editor";

vi.mock("sonner", () => ({ toast: { loading: vi.fn(), success: vi.fn(), error: vi.fn() } }));

// Catalog the picker endpoints hit by the real MusicianSearch/InstrumentSearch
// so a click resolves to a known record.
const MUSICIANS: Record<string, { id: string; name: string; defaultInstrumentId: string | null }> = {
  "m-mike": { id: "m-mike", name: "Mike Gordon", defaultInstrumentId: "i-bass" },
};
const INSTRUMENTS: Record<string, { id: string; name: string }> = {
  "i-bass": { id: "i-bass", name: "Bass" },
};

function routeFetch(url: string): Response {
  const json = (body: unknown) => ({ ok: true, json: async () => body }) as Response;
  if (url.startsWith("/api/musicians/")) return json(MUSICIANS[url.split("/").pop() as string] ?? null);
  if (url.startsWith("/api/musicians")) return json(Object.values(MUSICIANS));
  if (url.startsWith("/api/instruments/")) return json(INSTRUMENTS[url.split("/").pop() as string] ?? null);
  if (url.startsWith("/api/instruments")) return json(Object.values(INSTRUMENTS));
  return json([]);
}

beforeEach(() => {
  globalThis.fetch = vi.fn((url: string) => Promise.resolve(routeFetch(url))) as unknown as typeof fetch;
});
afterEach(() => vi.restoreAllMocks());

// Controlled component — drive it through a stateful harness and read the
// current rows (minus the transient uid/autoOpen) back out of the DOM.
function Harness({ initialRows }: { initialRows: PerformerRow[] }) {
  const [rows, setRows] = useState(initialRows);
  return (
    <>
      <TrackPerformerEditor rows={rows} onChange={setRows} />
      <output data-testid="rows">
        {JSON.stringify(rows.map(({ musicianId, present, instrumentIds }) => ({ musicianId, present, instrumentIds })))}
      </output>
    </>
  );
}
function currentRows() {
  return JSON.parse(screen.getByTestId("rows").textContent as string);
}

async function pickInOpenPicker(user: UserEvent, name: string) {
  await user.type(await screen.findByPlaceholderText("Search musicians..."), name.slice(0, 4));
  await user.click(await screen.findByText(name, undefined, { timeout: 1500 }));
}

const ref = (id: string, name: string): MusicianRef => ({
  id,
  name,
  slug: id,
  knownFrom: null,
  defaultInstrument: null,
});
const inst = (id: string, name: string): Instrument =>
  ({ id, name, slug: id, createdAt: new Date(), updatedAt: new Date() }) as Instrument;

describe("rowsToDeltas", () => {
  // Rows with no musician picked are draft rows and never reach the API.
  test("drops rows with no musician", () => {
    const rows: PerformerRow[] = [
      { uid: "1", musicianId: "", present: true, instrumentIds: [] },
      { uid: "2", musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] },
    ];
    expect(rowsToDeltas(rows)).toEqual([{ musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] }]);
  });

  // A sat-out has no instruments — any instruments retained in the row (e.g.
  // from toggling back and forth) are stripped on the way out.
  test("clears instruments for a sat-out row", () => {
    const rows: PerformerRow[] = [{ uid: "1", musicianId: "m-marc", present: false, instrumentIds: ["i-bass"] }];
    expect(rowsToDeltas(rows)).toEqual([{ musicianId: "m-marc", present: false, instrumentIds: [] }]);
  });
});

describe("deltasToRows", () => {
  // Seeds the editor from the saved domain deltas (musician + instrument refs)
  // into the id-only row shape the pickers drive.
  test("maps domain deltas to id-only rows", () => {
    const deltas: TrackMusicianDelta[] = [
      { trackId: "t-1", musician: ref("m-mike", "Mike Gordon"), present: true, instruments: [inst("i-bass", "Bass")] },
      { trackId: "t-1", musician: ref("m-marc", "Marc Brownstein"), present: false, instruments: [] },
    ];
    expect(
      deltasToRows(deltas).map(({ musicianId, present, instrumentIds }) => ({ musicianId, present, instrumentIds })),
    ).toEqual([
      { musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] },
      { musicianId: "m-marc", present: false, instrumentIds: [] },
    ]);
  });
});

describe("TrackPerformerEditor", () => {
  // Instrument pickers belong to a sit-in only; a sat-out hides them.
  test("shows the instrument picker for 'Also played' and hides it for 'Sat out'", async () => {
    const { rerender } = await setupWithRouter(
      <Harness initialRows={[{ uid: "a", musicianId: "m-mike", present: true, instrumentIds: [] }]} />,
    );
    expect(screen.getByText("+ instrument")).toBeInTheDocument();

    rerender(<Harness initialRows={[{ uid: "a", musicianId: "m-mike", present: false, instrumentIds: [] }]} />);
    expect(screen.queryByText("+ instrument")).not.toBeInTheDocument();
  });

  // Add appends a fresh empty sit-in row; remove drops it.
  test("adds and removes rows", async () => {
    const { user } = await setupWithRouter(
      <Harness initialRows={[{ uid: "a", musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] }]} />,
    );

    await user.click(screen.getByRole("button", { name: /add performer/i }));
    expect(currentRows()).toHaveLength(2);
    expect(currentRows()[1]).toEqual({ musicianId: "", present: true, instrumentIds: [] });

    await user.click(screen.getAllByRole("button", { name: /remove performer/i })[1]);
    expect(currentRows()).toHaveLength(1);
  });

  // Picking a musician on an empty sit-in row seeds their default instrument.
  test("prefills the picked musician's default instrument on an empty row", async () => {
    const { user } = await setupWithRouter(
      <Harness initialRows={[{ uid: "a", musicianId: "", present: true, instrumentIds: [], autoOpen: true }]} />,
    );

    await pickInOpenPicker(user, "Mike Gordon");

    await waitFor(() =>
      expect(currentRows()[0]).toEqual({ musicianId: "m-mike", present: true, instrumentIds: ["i-bass"] }),
    );
  });
});

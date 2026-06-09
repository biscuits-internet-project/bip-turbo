import { setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ShowLineupManager } from "./show-lineup-manager";

vi.mock("sonner", () => ({
  toast: { loading: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

// Catalog the picker endpoints hit by the real MusicianSearch/InstrumentSearch
// so a click resolves to a known record. Tests assert behavior through the
// Save payload, which exercises the full pick → state → POST path.
const MUSICIANS: Record<string, { id: string; name: string; defaultInstrumentId: string | null }> = {
  "m-marc": { id: "m-marc", name: "Marc Brownstein", defaultInstrumentId: "i-bass" },
  "m-aron": { id: "m-aron", name: "Aron Magner", defaultInstrumentId: "i-keys" },
};
const INSTRUMENTS: Record<string, { id: string; name: string }> = {
  "i-bass": { id: "i-bass", name: "Bass" },
  "i-keys": { id: "i-keys", name: "Keys" },
};

function routeFetch(url: string, init?: RequestInit): Response {
  const json = (body: unknown) => ({ ok: true, json: async () => body }) as Response;
  if (url.startsWith("/api/musicians/")) return json(MUSICIANS[url.split("/").pop() as string] ?? null);
  if (url.startsWith("/api/musicians")) return json(Object.values(MUSICIANS));
  if (url.startsWith("/api/instruments/")) return json(INSTRUMENTS[url.split("/").pop() as string] ?? null);
  if (url.startsWith("/api/instruments")) return json(Object.values(INSTRUMENTS));
  if (url.includes("/lineup") && init?.method === "POST") return json({ ok: true, lineup: [] });
  return json([]);
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn((url: string, init?: RequestInit) => Promise.resolve(routeFetch(url, init)));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});
afterEach(() => vi.restoreAllMocks());

const instrument = (id: string, name: string) => ({ id, name, slug: id, createdAt: new Date(), updatedAt: new Date() });
function member(id: string, name: string, slug: string, instruments: ReturnType<typeof instrument>[]) {
  return { musician: { id, name, slug, knownFrom: null, defaultInstrument: null }, instruments };
}

// Pick a musician in an already-open picker (autoOpen row) by typing and clicking.
async function pickInOpenPicker(user: UserEvent, name: string) {
  await user.type(await screen.findByPlaceholderText("Search musicians..."), name.slice(0, 4));
  await user.click(await screen.findByText(name, undefined, { timeout: 1500 }));
}

// Open the first (closed) musician picker, then pick.
async function openAndPick(user: UserEvent, name: string) {
  await user.click(screen.getAllByRole("combobox")[0]);
  await pickInOpenPicker(user, name);
}

function savedEntries(): unknown {
  const post = fetchMock.mock.calls.find((c) => String(c[0]).includes("/lineup") && c[1]?.method === "POST");
  return JSON.parse(post?.[1]?.body as string).entries;
}

describe("ShowLineupManager", () => {
  // Read-only by default, using the same render as the public show page.
  test("renders the lineup read-only with an Edit button and no pickers", async () => {
    await setupWithRouter(
      <ShowLineupManager
        showId="show-1"
        initialLineup={[member("m-marc", "Marc Brownstein", "marc-brownstein", [instrument("i-bass", "Bass")])]}
      />,
    );

    expect(screen.getByText("Marc Brownstein")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit lineup/i })).toBeInTheDocument();
    expect(screen.queryAllByRole("combobox")).toHaveLength(0);
  });

  // Clicking Edit swaps the whole section into the picker editor.
  test("clicking Edit reveals the pickers and Save/Cancel", async () => {
    const { user } = await setupWithRouter(
      <ShowLineupManager
        showId="show-1"
        initialLineup={[member("m-aron", "Aron Magner", "aron-magner", [instrument("i-keys", "Keys")])]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));

    expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /save lineup/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^cancel$/i })).toBeInTheDocument();
  });

  // Adding a row auto-opens its musician picker so the admin can type the name
  // immediately.
  test("Add opens the new musician picker focused", async () => {
    const { user } = await setupWithRouter(<ShowLineupManager showId="show-1" initialLineup={[]} />);

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));
    await user.click(screen.getByRole("button", { name: /add musician/i }));

    expect(await screen.findByPlaceholderText("Search musicians...")).toBeInTheDocument();
  });

  // Picking a musician on an empty row seeds their default instrument.
  test("prefills the picked musician's default instrument on an empty row", async () => {
    const { user } = await setupWithRouter(<ShowLineupManager showId="show-1" initialLineup={[]} />);

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));
    await user.click(screen.getByRole("button", { name: /add musician/i }));
    await pickInOpenPicker(user, "Marc Brownstein");
    await user.click(screen.getByRole("button", { name: /save lineup/i }));

    await waitFor(() => expect(savedEntries()).toEqual([{ musicianId: "m-marc", instrumentIds: ["i-bass"] }]));
  });

  // Changing the musician on a row that already has instruments keeps them.
  test("does not overwrite existing instruments when the musician changes", async () => {
    const { user } = await setupWithRouter(
      <ShowLineupManager
        showId="show-1"
        initialLineup={[member("m-aron", "Aron Magner", "aron-magner", [instrument("i-keys", "Keys")])]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));
    await openAndPick(user, "Marc Brownstein");
    await user.click(screen.getByRole("button", { name: /save lineup/i }));

    await waitFor(() => expect(savedEntries()).toEqual([{ musicianId: "m-marc", instrumentIds: ["i-keys"] }]));
  });

  // Empty rows (added but no musician picked) are excluded from the save.
  test("excludes empty rows from the saved payload", async () => {
    const { user } = await setupWithRouter(
      <ShowLineupManager
        showId="show-1"
        initialLineup={[member("m-marc", "Marc Brownstein", "marc-brownstein", [instrument("i-bass", "Bass")])]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));
    await user.click(screen.getByRole("button", { name: /add musician/i }));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /save lineup/i }));

    await waitFor(() => expect(savedEntries()).toEqual([{ musicianId: "m-marc", instrumentIds: ["i-bass"] }]));
  });

  // Cancel discards the draft and returns to read-only without saving.
  test("Cancel returns to read-only without posting", async () => {
    const { user } = await setupWithRouter(
      <ShowLineupManager
        showId="show-1"
        initialLineup={[member("m-marc", "Marc Brownstein", "marc-brownstein", [instrument("i-bass", "Bass")])]}
      />,
    );

    await user.click(screen.getByRole("button", { name: /edit lineup/i }));
    await user.click(screen.getByRole("button", { name: /add musician/i }));
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: /^cancel$/i }));

    expect(screen.getByRole("button", { name: /edit lineup/i })).toBeInTheDocument();
    expect(fetchMock.mock.calls.some((c) => c[1]?.method === "POST")).toBe(false);
  });
});

import type { Song } from "@bip/domain";
import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { SongSearch } from "./song-search";

// SongSearch only reads `id` and `title`; the rest of the Song shape is
// noise for these tests, so cast through `unknown`.
function makeSong(id: string, title: string): Song {
  return { id, title } as unknown as Song;
}

describe("SongSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // The Disco Biscuits' song catalog is too big to load up front, so
  // SongSearch requires 2+ chars before hitting the API. Below that, the
  // user sees a "Type to search" hint and no network call fires.
  test("does not call the search endpoint for queries shorter than 2 chars", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<SongSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search songs...");
    await user.type(input, "a");

    // Give the debounce a chance to fire if it were going to.
    await new Promise((r) => setTimeout(r, 400));
    const apiCalls = fetchMock.mock.calls.filter((c) => String(c[0]).startsWith("/api/songs"));
    expect(apiCalls).toHaveLength(0);
  });

  // 2+ chars triggers a debounced fetch to /api/songs?q=… with the query
  // URL-encoded.
  test("calls /api/songs?q=… for 2+ char queries", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<SongSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search songs...");
    await user.type(input, "wav");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/songs?q=wav");
      },
      { timeout: 1500 },
    );
  });

  // initialSong renders on the trigger before the user opens the
  // popover — important for the track-edit form, which lands with a
  // pre-selected song.
  test("renders the initialSong title on the trigger when value matches", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    const initialSong = makeSong("s1", "Above the Waves");

    await setup(<SongSearch value="s1" initialSong={initialSong} onValueChange={vi.fn()} />);

    expect(screen.getByRole("combobox")).toHaveTextContent("Above the Waves");
  });

  // initialSong is kept in the results list even when the user's query
  // doesn't match — so re-selecting the current value doesn't require
  // clearing first. Critical for the track-edit form: opening the
  // popover should always show the currently-selected song.
  test("keeps initialSong in the results even when the API returns no matches", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    const initialSong = makeSong("s1", "Above the Waves");

    const { user } = await setup(<SongSearch value="s1" initialSong={initialSong} onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    // initial empty-query branch returns [initialSong] from the wrapper.
    await screen.findAllByText("Above the Waves");
  });

  // Above the Waves should still appear when the query returns a list
  // that doesn't include it (the wrapper prepends initialSong to results).
  test("prepends initialSong to results when the API returns a non-matching list", async () => {
    const initialSong = makeSong("s1", "Above the Waves");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [makeSong("s2", "Floes"), makeSong("s3", "Run Like Hell")],
    });

    const { user } = await setup(<SongSearch value="s1" initialSong={initialSong} onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search songs...");
    await user.type(input, "flo");

    // Wait for the debounced fetch to render its results — "Floes" only
    // appears once that happens.
    await screen.findByText("Floes", undefined, { timeout: 1500 });
    // initialSong appears in the list (in addition to its presence on the
    // trigger), so it shows up twice in the DOM.
    expect(screen.getAllByText("Above the Waves").length).toBeGreaterThanOrEqual(2);
  });

  // The "No song" row is the clear affordance — selecting it should
  // translate null back to "none" for the form state. The wrapper owns
  // this translation so consumers using form fields don't have to.
  test("clicking 'No song' fires onValueChange('none')", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    const onValueChange = vi.fn();
    const initialSong = makeSong("s1", "Above the Waves");

    const { user } = await setup(<SongSearch value="s1" initialSong={initialSong} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("No song"));

    expect(onValueChange).toHaveBeenCalledWith("none");
  });

  // Selecting a song fires onValueChange with the song's id. Together
  // with the "No song" test above, this verifies both legs of the
  // form-state ↔ id translation.
  test("clicking a song fires onValueChange with the song id", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [makeSong("s2", "Floes")] });
    const onValueChange = vi.fn();

    const { user } = await setup(<SongSearch onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search songs...");
    await user.type(input, "flo");

    const row = await screen.findByText("Floes", undefined, { timeout: 1500 });
    await user.click(row);

    expect(onValueChange).toHaveBeenCalledWith("s2");
  });
});

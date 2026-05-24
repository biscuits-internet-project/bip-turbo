import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: { success: (...args: unknown[]) => toastSuccess(...args), error: (...args: unknown[]) => toastError(...args) },
}));

import { ShowYoutubeManager } from "./show-youtube-manager";

describe("ShowYoutubeManager", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // On mount, the component fetches the show's current videos so the admin
  // sees what's already curated before adding/removing.
  test("loads existing videos on mount and renders each URL as a link", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: "row-1", videoId: "abc12345678", url: "https://www.youtube.com/watch?v=abc12345678" },
        { id: "row-2", videoId: "xyz12345678", url: "https://www.youtube.com/watch?v=xyz12345678" },
      ],
    });

    await setup(<ShowYoutubeManager showId="show-1" />);

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/show-youtubes?showId=show-1");
    const first = await screen.findByText("https://www.youtube.com/watch?v=abc12345678");
    expect(first).toBeInTheDocument();
    expect(screen.getByText("https://www.youtube.com/watch?v=xyz12345678")).toBeInTheDocument();
  });

  // The "No videos yet" hint is the empty-state copy that should only appear
  // when the GET returns zero rows. It's a visual signal that the editor
  // loaded — not an error.
  test("shows the empty-state hint when no videos exist", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => [] });

    await setup(<ShowYoutubeManager showId="show-1" />);

    expect(await screen.findByPlaceholderText(/YouTube URL/i)).toBeInTheDocument();
    // No <li> rows render in the empty state.
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  // Add flow: typing input + clicking Add posts the raw input to the server
  // (server is responsible for extracting the video id). On success, the new
  // row is appended to the list optimistically using the server response.
  test("clicking Add posts the input and appends the returned row", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "row-new",
          videoId: "dQw4w9WgXcQ",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        }),
      });
    globalThis.fetch = fetchMock;

    const { user } = await setup(<ShowYoutubeManager showId="show-1" />);

    const input = await screen.findByPlaceholderText(/YouTube URL/i);
    await user.type(input, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe("/api/show-youtubes");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({
      showId: "show-1",
      input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });

    expect(await screen.findByText("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBeInTheDocument();
    expect(toastSuccess).toHaveBeenCalled();
  });

  // Pressing Enter inside the input fires the same add flow as clicking Add,
  // so admins curating from the keyboard don't have to reach for the mouse.
  test("pressing Enter in the input submits the add", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "row-new",
          videoId: "newvideo123",
          url: "https://www.youtube.com/watch?v=newvideo123",
        }),
      });
    globalThis.fetch = fetchMock;

    const { user } = await setup(<ShowYoutubeManager showId="show-1" />);

    const input = await screen.findByPlaceholderText(/YouTube URL/i);
    await user.type(input, "newvideo123{Enter}");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock.mock.calls[1][0]).toBe("/api/show-youtubes");
    expect(fetchMock.mock.calls[1][1].method).toBe("POST");
  });

  // The Add button is disabled while the input is empty/whitespace so the
  // admin can't fire a no-op POST.
  test("Add button is disabled when the input is empty", async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => [] });

    await setup(<ShowYoutubeManager showId="show-1" />);

    expect(await screen.findByRole("button", { name: /add/i })).toBeDisabled();
  });

  // When the server rejects the input (e.g. couldn't extract a video id), the
  // error message in the response body surfaces to the toast — the admin
  // sees what went wrong, not a generic "failed".
  test("surfaces the server error message via toast on a 400", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Could not extract a YouTube video id from that input." }),
      });
    globalThis.fetch = fetchMock;

    const { user } = await setup(<ShowYoutubeManager showId="show-1" />);

    const input = await screen.findByPlaceholderText(/YouTube URL/i);
    await user.type(input, "garbage");
    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Could not extract a YouTube video id from that input."),
    );
  });

  // Delete flow: clicking the trash button on a row sends DELETE with the
  // row's id and removes it from the list on success.
  test("clicking delete sends DELETE and removes the row", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: "row-1", videoId: "abc12345678", url: "https://www.youtube.com/watch?v=abc12345678" }],
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
    globalThis.fetch = fetchMock;

    const { user } = await setup(<ShowYoutubeManager showId="show-1" />);

    await screen.findByText("https://www.youtube.com/watch?v=abc12345678");

    // The list row has exactly one button (trash); pick it by its parent <li>.
    const row = screen.getByText("https://www.youtube.com/watch?v=abc12345678").closest("li");
    const deleteBtn = row?.querySelector("button");
    if (!deleteBtn) throw new Error("delete button not found");
    await user.click(deleteBtn);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const [url, options] = fetchMock.mock.calls[1];
    expect(url).toBe("/api/show-youtubes");
    expect(options.method).toBe("DELETE");
    expect(JSON.parse(options.body)).toEqual({ id: "row-1" });

    await waitFor(() =>
      expect(screen.queryByText("https://www.youtube.com/watch?v=abc12345678")).not.toBeInTheDocument(),
    );
    expect(toastSuccess).toHaveBeenCalledWith("Video removed");
  });

  // Delete failure should surface the server's error message — same
  // contract as the Add flow. Without this, a non-2xx delete would
  // show a generic "Failed to remove video" even when the API returned
  // a specific reason (e.g. "Video belongs to a different show").
  test("surfaces the server error message via toast when delete returns non-ok", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: "row-1", videoId: "abc12345678", url: "https://www.youtube.com/watch?v=abc12345678" }],
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Video belongs to a different show." }),
      });
    globalThis.fetch = fetchMock;

    const { user } = await setup(<ShowYoutubeManager showId="show-1" />);

    await screen.findByText("https://www.youtube.com/watch?v=abc12345678");

    const row = screen.getByText("https://www.youtube.com/watch?v=abc12345678").closest("li");
    const deleteBtn = row?.querySelector("button");
    if (!deleteBtn) throw new Error("delete button not found");
    await user.click(deleteBtn);

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Video belongs to a different show."));
    // Row stays on screen — failed delete shouldn't optimistically remove it.
    expect(screen.getByText("https://www.youtube.com/watch?v=abc12345678")).toBeInTheDocument();
  });
});

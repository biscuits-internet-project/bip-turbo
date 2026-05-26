import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { AuthorSearch } from "./author-search";

describe("AuthorSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // loadOnOpen contract: opening the popover with no query hits
  // /api/authors?top=10 so the user sees the most-active authors before
  // they type. Without this the list would start empty.
  test("fetches /api/authors?top=10 when the popover opens with no query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<AuthorSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((c) => c[0]);
      expect(urls).toContain("/api/authors?top=10");
    });
  });

  // 2+ char query switches to the scoped search endpoint with a higher
  // limit. Below 2 chars stays on the top-10 endpoint (handled by the
  // empty-query branch above).
  test("fetches /api/authors?q=…&limit=20 with a 2+ char query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<AuthorSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search authors...");
    await user.type(input, "tre");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/authors?q=tre&limit=20");
      },
      { timeout: 1500 },
    );
  });

  // The clear-selection row is labeled "All Authors" (the noneLabel for
  // this wrapper) so users can drop the current filter from inside the
  // popover.
  test("renders the 'All Authors' clear row", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ id: "a1", name: "Author One" }] });

    const { user } = await setup(<AuthorSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByText("All Authors")).toBeInTheDocument();
  });

  // With allowCreate=true, typing a non-matching name and clicking the
  // "Create …" row POSTs to /api/admin/authors with the trimmed name,
  // then selects the new author. The admin path is gated by allowCreate
  // so non-admin consumers don't accidentally surface it.
  test("allowCreate posts to /api/admin/authors and selects the new row", async () => {
    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url === "/api/admin/authors" && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: "new-1", name: "New Author" }),
        } as Response);
      }
      // Every other call (top-10, debounced search) returns an empty list.
      return Promise.resolve({ ok: true, json: async () => [] } as Response);
    });
    const onValueChange = vi.fn();

    const { user } = await setup(<AuthorSearch onValueChange={onValueChange} allowCreate />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search authors...");
    await user.type(input, "New Author");

    const createRow = await screen.findByText('Create "New Author"', undefined, { timeout: 1500 });
    await user.click(createRow);

    await waitFor(() => {
      const postCall = fetchMock.mock.calls.find((c) => c[0] === "/api/admin/authors");
      expect(postCall).toBeDefined();
      expect(postCall?.[1]?.method).toBe("POST");
      expect(JSON.parse(postCall?.[1]?.body as string)).toEqual({ name: "New Author" });
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("new-1"));
  });

  // Without allowCreate, the create row never appears — even with a
  // novel query.
  test("does not show a create row when allowCreate is not set", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<AuthorSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search authors...");
    await user.type(input, "Novel Name");

    // Wait for the debounced fetch to settle so any create row would have
    // had a chance to render.
    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/authors?q=Novel%20Name&limit=20");
      },
      { timeout: 1500 },
    );
    expect(screen.queryByText(/Create "/)).not.toBeInTheDocument();
  });

  // Selecting "All Authors" fires onValueChange(null) — the parent
  // (PerformanceFilterControls) maps null to "drop the author filter".
  test("clicking 'All Authors' fires onValueChange(null)", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ id: "a1", name: "Author One" }] });
    const onValueChange = vi.fn();

    const { user } = await setup(<AuthorSearch value="a1" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("All Authors"));

    expect(onValueChange).toHaveBeenCalledWith(null);
  });
});

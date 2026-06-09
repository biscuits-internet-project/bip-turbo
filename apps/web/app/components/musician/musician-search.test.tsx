import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { MusicianSearch } from "./musician-search";

describe("MusicianSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // loadOnOpen contract: opening the popover with no query hits the top list.
  test("fetches /api/musicians?top=10 when the popover opens with no query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<MusicianSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((c) => c[0]);
      expect(urls).toContain("/api/musicians?top=10");
    });
  });

  test("fetches /api/musicians?q=…&limit=20 with a 2+ char query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<MusicianSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search musicians...");
    await user.type(input, "aro");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/musicians?q=aro&limit=20");
      },
      { timeout: 1500 },
    );
  });

  // allowCreate POSTs the trimmed name to the admin endpoint, then selects the
  // new musician's id.
  test("allowCreate posts name-only to /api/admin/musicians and threads the new id", async () => {
    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url === "/api/admin/musicians" && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: "new-1", name: "Sammy Altman" }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => [] } as Response);
    });
    const onValueChange = vi.fn();

    const { user } = await setup(<MusicianSearch onValueChange={onValueChange} allowCreate />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search musicians...");
    await user.type(input, "Sammy Altman");

    const createRow = await screen.findByText('Create "Sammy Altman"', undefined, { timeout: 1500 });
    await user.click(createRow);

    await waitFor(() => {
      const postCall = fetchMock.mock.calls.find((c) => c[0] === "/api/admin/musicians");
      expect(postCall).toBeDefined();
      expect(postCall?.[1]?.method).toBe("POST");
      expect(JSON.parse(postCall?.[1]?.body as string)).toEqual({ name: "Sammy Altman" });
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("new-1"));
  });

  test("does not show a create row when allowCreate is not set", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<MusicianSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search musicians...");
    await user.type(input, "Novel Name");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/musicians?q=Novel%20Name&limit=20");
      },
      { timeout: 1500 },
    );
    expect(screen.queryByText(/Create "/)).not.toBeInTheDocument();
  });
});

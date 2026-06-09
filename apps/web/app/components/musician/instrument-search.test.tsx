import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { InstrumentSearch } from "./instrument-search";

describe("InstrumentSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // loadOnOpen contract: opening the popover with no query hits
  // /api/instruments?top=10 so the user sees the most-used instruments before
  // they type.
  test("fetches /api/instruments?top=10 when the popover opens with no query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<InstrumentSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    await waitFor(() => {
      const urls = fetchMock.mock.calls.map((c) => c[0]);
      expect(urls).toContain("/api/instruments?top=10");
    });
  });

  // 2+ char query switches to the scoped search endpoint with a higher limit.
  test("fetches /api/instruments?q=…&limit=20 with a 2+ char query", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<InstrumentSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search instruments...");
    await user.type(input, "gui");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/instruments?q=gui&limit=20");
      },
      { timeout: 1500 },
    );
  });

  // With allowCreate=true, typing a non-matching name and clicking the
  // "Create …" row POSTs to /api/admin/instruments with the trimmed name, then
  // selects the new instrument's id.
  test("allowCreate posts to /api/admin/instruments and threads the new id", async () => {
    fetchMock.mockImplementation((url: string, init?: RequestInit) => {
      if (url === "/api/admin/instruments" && init?.method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: "new-1", name: "Theremin" }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => [] } as Response);
    });
    const onValueChange = vi.fn();

    const { user } = await setup(<InstrumentSearch onValueChange={onValueChange} allowCreate />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search instruments...");
    await user.type(input, "Theremin");

    const createRow = await screen.findByText('Create "Theremin"', undefined, { timeout: 1500 });
    await user.click(createRow);

    await waitFor(() => {
      const postCall = fetchMock.mock.calls.find((c) => c[0] === "/api/admin/instruments");
      expect(postCall).toBeDefined();
      expect(postCall?.[1]?.method).toBe("POST");
      expect(JSON.parse(postCall?.[1]?.body as string)).toEqual({ name: "Theremin" });
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("new-1"));
  });

  // Without allowCreate, the create row never appears — even with a novel query.
  test("does not show a create row when allowCreate is not set", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<InstrumentSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search instruments...");
    await user.type(input, "Novel Name");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/instruments?q=Novel%20Name&limit=20");
      },
      { timeout: 1500 },
    );
    expect(screen.queryByText(/Create "/)).not.toBeInTheDocument();
  });
});

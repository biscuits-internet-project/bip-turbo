import type { Venue } from "@bip/domain";
import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { VenueSearch } from "./venue-search";

// VenueSearch only reads name/city/state for label formatting; the rest
// of the Venue shape is irrelevant, so cast through `unknown`.
function makeVenue(overrides: Partial<Venue> & { id: string; name: string }): Venue {
  return overrides as unknown as Venue;
}

describe("VenueSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Same min-query rule as SongSearch: <2 chars never hits the catalog
  // search endpoint. Below 2 the user sees a "Type to search venues" hint.
  test("does not call /api/venues for queries shorter than 2 chars", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<VenueSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search venues...");
    await user.type(input, "w");

    await new Promise((r) => setTimeout(r, 400));
    const apiCalls = fetchMock.mock.calls.filter(
      (c) => String(c[0]).startsWith("/api/venues") && !String(c[0]).match(/\/api\/venues\/[^?]+$/),
    );
    expect(apiCalls).toHaveLength(0);
  });

  // 2+ chars triggers a debounced fetch to /api/venues?q=…
  test("calls /api/venues?q=… for 2+ char queries", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });

    const { user } = await setup(<VenueSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search venues...");
    await user.type(input, "wet");

    await waitFor(
      () => {
        const urls = fetchMock.mock.calls.map((c) => c[0]);
        expect(urls).toContain("/api/venues?q=wet");
      },
      { timeout: 1500 },
    );
  });

  // The trigger seeds itself by fetching the selected venue by id so a
  // pre-existing selection (e.g. from a show edit loader) renders
  // immediately without opening the popover.
  test("fetches /api/venues/:id to seed the trigger when value is set", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/venues/v1") {
        return Promise.resolve({
          ok: true,
          json: async () => makeVenue({ id: "v1", name: "Wetlands Preserve", city: "New York", state: "NY" }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => [] } as Response);
    });

    await setup(<VenueSearch value="v1" onValueChange={vi.fn()} />);

    await waitFor(() => expect(screen.getByRole("combobox")).toHaveTextContent("Wetlands Preserve (New York, NY)"));
  });

  // formatVenueLabel: when city + state are present, the label reads
  // "Name (City, State)" so visually similar venues in different
  // locations are distinguishable.
  test("formats venue label as 'Name (City, State)' when location is present", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [makeVenue({ id: "v1", name: "Red Rocks", city: "Morrison", state: "CO" })],
    });

    const { user } = await setup(<VenueSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search venues...");
    await user.type(input, "red");

    expect(await screen.findByText("Red Rocks (Morrison, CO)", undefined, { timeout: 1500 })).toBeInTheDocument();
  });

  // formatVenueLabel: when both city and state are missing, the label is
  // just the venue name — no empty parens.
  test("formats venue label as just 'Name' when city and state are both missing", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [makeVenue({ id: "v1", name: "Mystery Venue", city: undefined, state: undefined })],
    });

    const { user } = await setup(<VenueSearch onValueChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search venues...");
    await user.type(input, "mys");

    expect(await screen.findByText("Mystery Venue", undefined, { timeout: 1500 })).toBeInTheDocument();
    // No empty "()" should render.
    expect(screen.queryByText(/Mystery Venue \(\)/)).not.toBeInTheDocument();
  });

  // Clear path: "No venue" translates null back to "none" for form-state
  // compatibility.
  test("clicking 'No venue' fires onValueChange('none')", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/venues/v1") {
        return Promise.resolve({
          ok: true,
          json: async () => makeVenue({ id: "v1", name: "Wetlands", city: "NYC", state: "NY" }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => [] } as Response);
    });
    const onValueChange = vi.fn();

    const { user } = await setup(<VenueSearch value="v1" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByText("No venue"));

    expect(onValueChange).toHaveBeenCalledWith("none");
  });

  // Selecting a venue fires onValueChange with the venue's id (the other
  // half of the form-state ↔ id translation contract).
  test("clicking a venue fires onValueChange with the venue id", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [makeVenue({ id: "v2", name: "Red Rocks", city: "Morrison", state: "CO" })],
    });
    const onValueChange = vi.fn();

    const { user } = await setup(<VenueSearch onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox"));
    const input = await screen.findByPlaceholderText("Search venues...");
    await user.type(input, "red");

    const row = await screen.findByText("Red Rocks (Morrison, CO)", undefined, { timeout: 1500 });
    await user.click(row);

    expect(onValueChange).toHaveBeenCalledWith("v2");
  });
});

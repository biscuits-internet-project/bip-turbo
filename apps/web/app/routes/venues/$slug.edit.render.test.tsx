import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Mock `useNavigate` so we can assert where the form sends the user after save.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({
  adminLoader: (fn: unknown) => fn,
  adminAction: (fn: unknown) => fn,
}));
vi.mock("~/lib/errors", () => ({ notFound: (msg: string) => new Response(msg, { status: 404 }) }));

// VenueForm fires onSubmit with fixed values, standing in for a rename.
vi.mock("~/components/venue/venue-form", () => ({
  VenueForm: ({ onSubmit }: { onSubmit: (values: Record<string, unknown>) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({ name: "Red Rocks Amphitheater", city: "Morrison", state: "CO", country: "United States" })
      }
    >
      Update Venue
    </button>
  ),
}));
vi.mock("~/components/ui/page-header", () => ({ PageHeader: () => null }));

const loaderData = {
  venue: { slug: "the-caverns", name: "The Caverns", city: "Pelham", state: "TN", country: "United States" },
};
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => loaderData),
}));

import EditVenue from "./$slug.edit";

describe("venues/$slug.edit redirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Renaming a venue re-slugs it, so the form must land on the slug the action
  // redirects to (carried by response.url), not the stale loader slug → 404.
  test("navigates to the redirect target (re-slugged URL), not the loader slug", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      url: "http://localhost/venues/red-rocks-amphitheater",
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<EditVenue />);

    await user.click(await screen.findByRole("button", { name: /update venue/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/venues/red-rocks-amphitheater");
    });
    expect(mockNavigate).not.toHaveBeenCalledWith("/venues/the-caverns");
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Mock `useNavigate` so we can assert where the form sends the user after save,
// without needing a Routes definition.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Strip server modules + auth wrappers; this test only drives the component.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({
  adminLoader: (fn: unknown) => fn,
  adminAction: (fn: unknown) => fn,
}));
vi.mock("~/lib/errors", () => ({ notFound: (msg: string) => new Response(msg, { status: 404 }) }));
vi.mock("sonner", () => ({ toast: { loading: vi.fn(() => "toast-id"), success: vi.fn(), error: vi.fn() } }));

// Stub heavy children. ShowForm exposes a button that fires onSubmit with fixed
// values, standing in for a real edit (here: a venue change that re-slugs).
vi.mock("~/components/show/show-form", () => ({
  ShowForm: ({ onSubmit }: { onSubmit: (values: Record<string, unknown>) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSubmit({
          date: "2017-07-22",
          venueId: "venue-2",
          bandId: "none",
          notes: "",
          relistenUrl: "",
          countForStats: true,
          rockOperaIds: [],
        })
      }
    >
      Update Show
    </button>
  ),
}));
vi.mock("~/components/show/show-lineup-manager", () => ({ ShowLineupManager: () => null }));
vi.mock("~/components/show/show-day-order-manager", () => ({ ShowDayOrderManager: () => null }));
vi.mock("~/components/track/track-manager", () => ({ TrackManager: () => null }));
vi.mock("~/components/admin/delete-entity-button", () => ({ DeleteEntityButton: () => null }));
vi.mock("~/components/ui/page-header", () => ({ PageHeader: () => null }));

const loaderData = {
  show: {
    id: "show-1",
    slug: "2017-07-22-red-rocks",
    date: "2017-07-22",
    venueId: "venue-1",
    bandId: null,
    notes: "",
    relistenUrl: "",
    countForStats: true,
  },
  bands: [],
  tracks: [],
  footnoteSetlist: null,
  sameDateShows: [],
  rockOperas: [],
  currentRockOperaIds: [],
  initialLineup: [],
};
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => loaderData),
}));

import EditShow from "./$slug.edit";

describe("shows/$slug.edit redirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Changing date/venue re-slugs the show. The action redirects to the new
  // slug; fetch follows it, so response.url carries the canonical path. The
  // form must navigate there, not to the stale loader slug, or the user 404s.
  test("navigates to the redirect target (re-slugged URL), not the loader slug", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      url: "http://localhost/shows/2017-07-22-new-venue",
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    render(<EditShow />);

    await user.click(await screen.findByRole("button", { name: /update show/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/shows/2017-07-22-new-venue");
    });
    expect(mockNavigate).not.toHaveBeenCalledWith("/shows/2017-07-22-red-rocks");
  });
});

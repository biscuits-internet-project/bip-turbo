import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ShowDayOrderManager, type ShowDayOrderRow } from "./show-day-order-manager";

// Capture the onDragEnd handler the component hands to DndContext so tests can
// drive a reorder without simulating real pointer/keyboard drags in jsdom.
let capturedOnDragEnd: ((event: { active: { id: string }; over: { id: string } | null }) => void) | undefined;
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual<typeof import("@dnd-kit/core")>("@dnd-kit/core");
  return {
    ...actual,
    DndContext: ({ onDragEnd, children }: { onDragEnd?: typeof capturedOnDragEnd; children: React.ReactNode }) => {
      capturedOnDragEnd = onDragEnd;
      return children;
    },
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

// Two same-date shows at Red Rocks — what the loader hands the widget when an
// admin opens either one of them.
const sameDateShows: ShowDayOrderRow[] = [
  {
    id: "show-early",
    slug: "2017-07-22-red-rocks-early",
    date: "2017-07-22",
    dayOrder: 1,
    venueName: "Red Rocks (early)",
  },
  {
    id: "show-late",
    slug: "2017-07-22-red-rocks-late",
    date: "2017-07-22",
    dayOrder: 2,
    venueName: "Red Rocks (late)",
  },
];

describe("ShowDayOrderManager", () => {
  // Single-show case: nothing to reorder, panel must collapse so it doesn't
  // take edit-page real estate on the 99% of shows that have no same-date
  // sibling.
  test("renders nothing when fewer than 2 shows share the date", async () => {
    const { container } = await setup(
      <ShowDayOrderManager currentShowId="show-early" date="2017-07-22" initialShows={[sameDateShows[0]]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  // Multi-show case: every same-date show appears, in the order the loader
  // delivered, with its venue label and 1-indexed position.
  test("renders each show in the supplied order with position numbers", async () => {
    await setup(<ShowDayOrderManager currentShowId="show-early" date="2017-07-22" initialShows={sameDateShows} />);

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Red Rocks (early)");
    expect(rows[0]).toHaveTextContent("1");
    expect(rows[1]).toHaveTextContent("Red Rocks (late)");
    expect(rows[1]).toHaveTextContent("2");
  });

  // The currently-edited show is visually flagged so the admin sees which row
  // corresponds to "this show I'm editing" inside the same-date group.
  test("flags the currently-edited show row", async () => {
    await setup(<ShowDayOrderManager currentShowId="show-late" date="2017-07-22" initialShows={sameDateShows} />);

    expect(screen.getByText(/this show/i)).toBeInTheDocument();
  });
});

describe("ShowDayOrderManager drag persistence", () => {
  beforeEach(() => {
    capturedOnDragEnd = undefined;
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();
  });

  // Successful drag: optimistic state flips immediately, the new id sequence is
  // POSTed to /api/shows/reorder with the original date, and the success toast
  // fires. This is the core auto-save behavior the admin relies on.
  test("posts the new id order to /api/shows/reorder on drag end and toasts success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await setup(<ShowDayOrderManager currentShowId="show-early" date="2017-07-22" initialShows={sameDateShows} />);

    expect(capturedOnDragEnd).toBeDefined();
    capturedOnDragEnd?.({ active: { id: "show-late" }, over: { id: "show-early" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/shows/reorder");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      date: "2017-07-22",
      orderedIds: ["show-late", "show-early"],
    });
    await waitFor(() => expect(toast.success).toHaveBeenCalled());

    vi.unstubAllGlobals();
  });

  // Failure path: visible order rolls back so the UI can't drift from the DB,
  // and the admin sees an error toast. Without rollback, a failed save would
  // leave the dragged row visually persisted in its new spot.
  test("rolls visible order back and toasts error when the POST fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal("fetch", fetchMock);

    await setup(<ShowDayOrderManager currentShowId="show-early" date="2017-07-22" initialShows={sameDateShows} />);

    capturedOnDragEnd?.({ active: { id: "show-late" }, over: { id: "show-early" } });

    await waitFor(() => expect(toast.error).toHaveBeenCalled());

    // After rollback, the original loader-provided order is back on screen
    // (early show first, late show second).
    const rows = screen.getAllByRole("listitem");
    expect(rows[0]).toHaveTextContent("Red Rocks (early)");
    expect(rows[1]).toHaveTextContent("Red Rocks (late)");

    vi.unstubAllGlobals();
  });

  // Drop-on-self / drop-outside: dnd-kit fires onDragEnd with no `over` (or
  // active===over). The component must skip the persist call entirely instead
  // of POSTing a no-op reorder.
  test("ignores drag end when there is no over target", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await setup(<ShowDayOrderManager currentShowId="show-early" date="2017-07-22" initialShows={sameDateShows} />);

    capturedOnDragEnd?.({ active: { id: "show-early" }, over: null });
    capturedOnDragEnd?.({ active: { id: "show-early" }, over: { id: "show-early" } });

    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

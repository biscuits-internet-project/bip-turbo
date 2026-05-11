import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Strip the auth wrappers so we can drive the loader/action directly with
// fabricated args. The wrappers' real job is auth gating, which is covered by
// integration tests of admin-gated routes elsewhere.
vi.mock("~/lib/base-loaders", () => ({
  adminLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const findBySlug = vi.fn();
const findByDate = vi.fn();
const findVenues = vi.fn();
const findTracksByShowId = vi.fn();
const updateShow = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    shows: { findBySlug, findByDate, update: updateShow },
    venues: { findMany: findVenues },
    tracks: { findByShowId: findTracksByShowId },
  },
}));

vi.mock("~/lib/errors", () => ({
  notFound: (msg: string) => new Response(msg, { status: 404 }),
}));

const { loader, action } = await import("./$slug.edit");

const showEarly = {
  id: "show-early",
  slug: "2017-07-22-red-rocks-early",
  date: "2017-07-22",
  countForStats: true,
  dayOrder: 1,
  venueId: "venue-1",
  venue: { name: "Red Rocks (early)" },
};
const showLate = {
  id: "show-late",
  slug: "2017-07-22-red-rocks-late",
  date: "2017-07-22",
  countForStats: true,
  dayOrder: 2,
  venueId: "venue-1",
  venue: { name: "Red Rocks (late)" },
};

describe("shows/$slug.edit loader", () => {
  beforeEach(() => {
    findBySlug.mockReset();
    findByDate.mockReset();
    findVenues.mockReset().mockResolvedValue([]);
    findTracksByShowId.mockReset().mockResolvedValue([]);
  });

  // The loader's main new responsibility is seeding the same-date reorder
  // widget. It must call findByDate with the loaded show's date and project
  // each row down to the minimal shape the widget consumes (id, slug, date,
  // dayOrder, venueName).
  test("returns sameDateShows mapped from findByDate(show.date)", async () => {
    findBySlug.mockResolvedValue(showEarly);
    findByDate.mockResolvedValue([showEarly, showLate]);

    const result = (await loader({
      params: { slug: showEarly.slug },
    } as unknown as LoaderFunctionArgs)) as {
      sameDateShows: Array<{
        id: string;
        slug: string;
        date: string;
        dayOrder: number | null;
        venueName: string | null;
      }>;
    };

    expect(findByDate).toHaveBeenCalledWith("2017-07-22");
    expect(result.sameDateShows).toEqual([
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
    ]);
  });

  // Defensive: if a show somehow has no venue join (legacy data), the widget
  // expects venueName: null so it can fall back to the slug — the loader must
  // not throw.
  test("maps a missing venue to venueName: null without throwing", async () => {
    const orphan = { ...showEarly, venue: undefined };
    findBySlug.mockResolvedValue(orphan);
    findByDate.mockResolvedValue([orphan]);

    const result = (await loader({
      params: { slug: orphan.slug },
    } as unknown as LoaderFunctionArgs)) as { sameDateShows: Array<{ venueName: string | null }> };

    expect(result.sameDateShows[0].venueName).toBeNull();
  });
});

describe("shows/$slug.edit action", () => {
  beforeEach(() => {
    updateShow.mockReset().mockResolvedValue(showEarly);
  });

  function makeAction(form: Record<string, string>) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(form)) fd.append(k, v);
    return action({
      request: new Request("http://localhost/shows/x/edit", { method: "POST", body: fd }),
      params: { slug: showEarly.slug },
    } as unknown as ActionFunctionArgs);
  }

  // The new behavior the action wires: countForStats must arrive at the
  // service as a real boolean. The form posts the string "true"/"false"; the
  // action is responsible for the conversion.
  test('converts countForStats="false" string into a boolean false on the service call', async () => {
    await makeAction({
      date: "2017-07-22",
      venueId: "venue-1",
      bandId: "none",
      notes: "",
      relistenUrl: "",
      countForStats: "false",
    });

    expect(updateShow).toHaveBeenCalledTimes(1);
    expect(updateShow.mock.calls[0][1]).toMatchObject({ countForStats: false });
  });

  // Symmetric case: the "true" string must round-trip to true so that
  // unticking-then-reticking reliably re-includes a show in stats.
  test('converts countForStats="true" string into a boolean true on the service call', async () => {
    await makeAction({
      date: "2017-07-22",
      venueId: "venue-1",
      bandId: "none",
      notes: "",
      relistenUrl: "",
      countForStats: "true",
    });

    expect(updateShow.mock.calls[0][1]).toMatchObject({ countForStats: true });
  });

  // venueId="none" / bandId="none" sentinels (used by the form's "no venue"
  // selection) must collapse to undefined so Prisma doesn't try to connect to
  // a venue named "none".
  test('collapses venueId/bandId sentinel "none" into undefined', async () => {
    await makeAction({
      date: "2017-07-22",
      venueId: "none",
      bandId: "none",
      notes: "",
      relistenUrl: "",
      countForStats: "true",
    });

    const payload = updateShow.mock.calls[0][1];
    expect(payload.venueId).toBeUndefined();
    expect(payload.bandId).toBeUndefined();
  });
});

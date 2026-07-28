import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { type ShowCountFacets, showFacetMask } from "~/lib/show-count-facets";

// Server-side modules, stubbed so importing the route never pulls
// Prisma/Supabase into the test bundle.
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/server/services", () => ({ services: {} }));

// Chrome the component composes but doesn't decide anything about.
vi.mock("~/components/admin/admin-only", () => ({ AdminOnly: () => null }));
vi.mock("~/components/show-filters-nav", () => ({ ShowFiltersNav: () => null }));
vi.mock("~/components/show/shows-view-toggle", () => ({ ShowsViewToggle: () => null }));
vi.mock("~/components/ui/collapsible-section", () => ({
  CollapsibleSection: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const setlistListMock = vi.fn();
vi.mock("~/components/setlist/setlist-list", () => ({
  SetlistList: (props: object) => {
    setlistListMock(props);
    return <div data-testid="SetlistList" />;
  },
}));

const yearFilterNavMock = vi.fn();
vi.mock("~/components/year-filter-nav", () => ({
  YearFilterNav: (props: object) => {
    yearFilterNavMock(props);
    return <div data-testid="YearFilterNav" />;
  },
}));

vi.mock("~/hooks/use-serialized-loader-data", () => ({ useSerializedLoaderData: vi.fn() }));

import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import ShowsByYear from "./$year";

/** The loader only ships structural setlist data; these are the fields filters read. */
function setlist(id: string, date: string, { photos = 0, youtube = 0 } = {}) {
  return { show: { id, date, showPhotosCount: photos, showYoutubesCount: youtube } };
}

function sources(partial: Partial<ShowExternalSources>): ShowExternalSources {
  return partial as ShowExternalSources;
}

const SETLISTS = [
  setlist("astronaut", "2001-03-17", { photos: 4 }),
  setlist("basis", "2001-03-24"),
  setlist("crickets", "2001-08-10", { photos: 2 }),
];

const EXTERNAL_SOURCES: Record<string, ShowExternalSources> = {
  astronaut: sources({ nugsUrls: ["https://play.nugs.net/release/1"] }),
  basis: sources({}),
  crickets: sources({}),
};

function renderAt(search: string, overrides: Record<string, unknown> = {}) {
  vi.mocked(useSerializedLoaderData).mockReturnValue({
    setlists: SETLISTS,
    year: 2001,
    externalSources: EXTERNAL_SOURCES,
    showCountFacets: {},
    dehydratedState: { mutations: [], queries: [] },
    ...overrides,
  });
  return render(
    <MemoryRouter initialEntries={[`/shows/year/2001${search}`]}>
      <ShowsByYear />
    </MemoryRouter>,
  );
}

/** Ids of the setlists the page actually handed SetlistList. */
function renderedIds(): string[] {
  const props = setlistListMock.mock.calls.at(-1)?.[0] as { setlists: Array<{ show: { id: string } }> };
  return props.setlists.map((s) => s.show.id);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ShowsByYear filtering", () => {
  test("renders the whole year when no filter is active", () => {
    renderAt("");

    expect(renderedIds()).toEqual(["astronaut", "basis", "crickets"]);
  });

  // Media filters read the show's denormalized counts, which ride along in the
  // payload — no loader round trip needed to apply them.
  test("narrows by the media filters in the URL", () => {
    renderAt("?photos=yes");

    expect(renderedIds()).toEqual(["astronaut", "crickets"]);
  });

  test("narrows by the negative branch of a media filter", () => {
    renderAt("?photos=no");

    expect(renderedIds()).toEqual(["basis"]);
  });

  // External-source filters read the externalSources map the loader already
  // returns for every show, filtered or not.
  test("narrows by the external-source filters in the URL", () => {
    renderAt("?nugs=yes");

    expect(renderedIds()).toEqual(["astronaut"]);
  });

  test("combines media and external-source filters with AND", () => {
    renderAt("?photos=yes&nugs=no");

    expect(renderedIds()).toEqual(["crickets"]);
  });

  // Search replaces the browse nav, filter bar included, so a filter left over
  // from browsing must not silently narrow what the search turned up.
  test("leaves search results unfiltered", () => {
    renderAt("?q=wetlands&photos=yes", { searchQuery: "wetlands" });

    expect(renderedIds()).toEqual(["astronaut", "basis", "crickets"]);
  });
});

describe("ShowsByYear derived counts", () => {
  // Jump-to-Month counts what's actually on the page, so they track the filter
  // rather than the year's totals.
  test("month counts follow the filtered list", () => {
    const { container } = renderAt("");
    expect(container.querySelector('a[href="#month-2"]')?.textContent).toBe("MAR(2)");
    expect(container.querySelector('a[href="#month-7"]')?.textContent).toBe("AUG(1)");

    const filtered = renderAt("?photos=yes").container;
    expect(filtered.querySelector('a[href="#month-2"]')?.textContent).toBe("MAR(1)");
  });

  // A month with nothing left after filtering loses its jump anchor.
  test("drops the month anchor when a filter empties the month", () => {
    const { container } = renderAt("?nugs=yes");

    expect(container.querySelector('a[href="#month-2"]')).not.toBeNull();
    expect(container.querySelector('a[href="#month-7"]')).toBeNull();
  });

  // Filter-by-Year spans every year, so its counts come from the facet blob
  // rather than the one year the page holds.
  test("derives Filter-by-Year counts from the facet blob", () => {
    const withPhotos = showFacetMask({ photos: true, youtube: false, nugs: false, archive: false, relisten: false });
    const showCountFacets: ShowCountFacets = {
      1998: { 0: 100, [withPhotos]: 63 },
      2001: { 0: 40, [withPhotos]: 63 },
    };

    renderAt("", { showCountFacets });
    expect(yearFilterNavMock.mock.calls.at(-1)?.[0].counts).toEqual({ 1998: 163, 2001: 103 });

    renderAt("?photos=yes", { showCountFacets });
    expect(yearFilterNavMock.mock.calls.at(-1)?.[0].counts).toEqual({ 1998: 63, 2001: 63 });
  });
});

describe("ShowsByYear per-user data", () => {
  // The loader prefetches user data for the whole year. Keying on the filtered
  // subset instead would miss that hydrated entry and refetch on every toggle.
  test("keys per-user data on the whole year, not the filtered subset", () => {
    renderAt("?photos=yes");

    const props = setlistListMock.mock.calls.at(-1)?.[0] as { userDataShowIds: string[] };
    expect(props.userDataShowIds).toEqual(["astronaut", "basis", "crickets"]);
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Mock the loader module so importing the route component never pulls
// @bip/core / Prisma into the test bundle (the component only needs the type).
vi.mock("~/routes/shows/top-rated-shows", () => ({ getTopRatedShows: vi.fn() }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/components/setlist/setlist-list", () => ({
  SetlistList: () => <div data-testid="SetlistList" />,
}));
// Surface YearFilterNav's qualifier so we can assert the mode-aware copy.
vi.mock("~/components/year-filter-nav", () => ({
  YearFilterNav: ({ additionalText }: { additionalText: string }) => (
    <div data-testid="qualifier">{additionalText}</div>
  ),
}));
vi.mock("~/hooks/use-serialized-loader-data", () => ({ useSerializedLoaderData: vi.fn() }));

import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import TopRated from "./top-rated";

const base = {
  setlists: [],
  year: null,
  countsByYear: {},
  allCount: 0,
  externalSources: {},
  dehydratedState: { mutations: [], queries: [] },
};

// The top-rated list qualifier reflects the viewer's mode: the simple average
// keeps a ratings floor (its only guard against a single-vote show topping the
// list), while the calibrated score shrinks thin shows and needs no floor.
describe("TopRated qualifier copy", () => {
  test("simple mode shows the ratings floor", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({ ...base, mode: "simple", minShowRatings: 10 });
    render(<TopRated />);
    expect(screen.getByTestId("qualifier")).toHaveTextContent("min 10 ratings");
  });

  test("calibrated mode drops the floor", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({ ...base, mode: "calibrated", minShowRatings: 0 });
    render(<TopRated />);
    expect(screen.getByTestId("qualifier")).toHaveTextContent("all rated shows");
  });
});

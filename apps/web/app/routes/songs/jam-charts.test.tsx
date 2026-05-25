import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("@bip/domain", () => ({
  CacheKeys: { songs: { jamCharts: () => "test-key" } },
}));
vi.mock("~/lib/noteworthy-performance-loader", () => ({
  createNoteworthyLoader: vi.fn(),
}));
vi.mock("~/lib/noteworthy-performance-page", () => ({
  NoteworthyPerformancePage: (props: object) => mockShallowComponent("NoteworthyPerformancePage", props),
}));

import JamChartsPage from "./jam-charts";

describe("JamChartsPage", () => {
  // The page delegates to NoteworthyPerformancePage with the
  // jam-charts API endpoint. Only the Jam Chart toggle chip is hidden
  // — the All-Timer chip stays visible because jam-charts is a
  // superset of all-timers and users may want to narrow further.
  test("renders NoteworthyPerformancePage with the jam-charts API url and only the Jam Chart toggle hidden", () => {
    render(
      <MemoryRouter initialEntries={["/songs/jam-charts"]}>
        <JamChartsPage />
      </MemoryRouter>,
    );

    const page = screen.getByTestId("NoteworthyPerformancePage");
    expect(page).toBeInTheDocument();
    expect(page.textContent).toContain('"apiUrl":"/api/jam-charts"');
    expect(page.textContent).toContain('"hideJamChartToggle":true');
    expect(page.textContent).not.toContain('"hideAllTimerToggle":true');
  });
});

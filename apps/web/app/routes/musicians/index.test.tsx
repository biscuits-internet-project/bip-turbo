import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// AdminOnly currently renders its children unconditionally; mock it as a
// passthrough so this test asserts the links' structure, not the gating.
vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: () => ({ musicians: [] }),
}));

// The loader pulls in the server services + env modules; stub both so importing
// the route component in jsdom doesn't drag in the database client or env check.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: <T,>(fn: T) => fn }));

import MusiciansPage from "./index";

describe("MusiciansPage admin links", () => {
  test("admins can create a musician and manage instruments from the public page", async () => {
    await setupWithRouter(<MusiciansPage />);

    expect(screen.getByRole("link", { name: /create musician/i })).toHaveAttribute("href", "/admin/musicians/new");
    expect(screen.getByRole("link", { name: /manage instruments/i })).toHaveAttribute("href", "/admin/instruments");
  });
});

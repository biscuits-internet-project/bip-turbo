import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// useRevalidator needs a data router; MemoryRouter isn't one, so stub it.
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useRevalidator: () => ({ revalidate: vi.fn(), state: "idle" }) };
});

vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: () => ({ authors: [] }),
}));
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ adminLoader: <T,>(fn: T) => fn }));

import AdminAuthorsIndex from "./index";

describe("AdminAuthorsIndex header", () => {
  test("links to the public songs page and the create form", async () => {
    await setupWithRouter(<AdminAuthorsIndex />);

    expect(screen.getByRole("link", { name: /all songs/i })).toHaveAttribute("href", "/songs");
    expect(screen.getByRole("link", { name: /create author/i })).toHaveAttribute("href", "/admin/authors/new");
  });
});

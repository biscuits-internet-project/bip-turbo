import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { AdminFormPage } from "./admin-form-page";

describe("AdminFormPage", () => {
  test("renders the title, the back link, and the form children", async () => {
    await setupWithRouter(
      <AdminFormPage title="Edit Author" backHref="/admin/authors" backLabel="Back to Authors">
        <div>the form</div>
      </AdminFormPage>,
    );

    expect(screen.getByRole("heading", { name: "Edit Author" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Authors" })).toHaveAttribute("href", "/admin/authors");
    expect(screen.getByText("the form")).toBeInTheDocument();
  });

  test("renders the footer only when one is provided", async () => {
    const { unmount } = await setupWithRouter(
      <AdminFormPage title="t" backHref="/x" backLabel="b">
        <div>form</div>
      </AdminFormPage>,
    );
    expect(screen.queryByText("delete control")).not.toBeInTheDocument();
    unmount();

    await setupWithRouter(
      <AdminFormPage title="t" backHref="/x" backLabel="b" footer={<div>delete control</div>}>
        <div>form</div>
      </AdminFormPage>,
    );
    expect(screen.getByText("delete control")).toBeInTheDocument();
  });
});

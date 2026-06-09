import { setup } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { DeleteEntityButton } from "./delete-entity-button";

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
  toast: {
    success: (msg: string) => toastSuccess(msg),
    error: (msg: string) => toastError(msg),
  },
}));

describe("DeleteEntityButton", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Confirming the dialog DELETEs to the given endpoint with the id and, on
  // success, runs the caller's onDeleted.
  test("confirming DELETEs to the endpoint and calls onDeleted", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    const onDeleted = vi.fn();

    const { user } = await setup(
      <DeleteEntityButton
        entityId="g1"
        entityName="Guitar"
        entityLabel="instrument"
        endpoint="/api/admin/instruments"
        onDeleted={onDeleted}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete Guitar" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => {
      const call = fetchMock.mock.calls.find((c) => c[0] === "/api/admin/instruments");
      expect(call?.[1]?.method).toBe("DELETE");
      expect(JSON.parse(call?.[1]?.body as string)).toEqual({ id: "g1" });
    });
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(toastSuccess).toHaveBeenCalledWith("Instrument deleted");
  });

  // The in-use guard returns 400 with a message; surface it as an error toast
  // and do NOT run onDeleted (nothing was deleted).
  test("surfaces the in-use 400 as an error toast and skips onDeleted", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Cannot delete author with 5 associated song(s)" }),
    });
    const onDeleted = vi.fn();

    const { user } = await setup(
      <DeleteEntityButton
        entityId="jg"
        entityName="Jon Gutwillig"
        entityLabel="author"
        endpoint="/api/admin/authors"
        onDeleted={onDeleted}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Delete Jon Gutwillig" }));
    await user.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Cannot delete author with 5 associated song(s)"));
    expect(onDeleted).not.toHaveBeenCalled();
  });
});

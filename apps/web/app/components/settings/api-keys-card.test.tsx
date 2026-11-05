import { setupWithRouter } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/components/contact/contact-dialog", () => ({
  ContactDialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { ApiKeysCard } from "./api-keys-card";

const EXISTING = {
  id: "k1",
  name: "old script",
  prefix: "bip_abcd1234",
  createdAt: "2026-11-01T12:00:00Z",
  lastUsedAt: null,
};

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

afterEach(() => vi.unstubAllGlobals());

function respond(body: unknown, status = 200) {
  fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status }));
}

describe("ApiKeysCard", () => {
  test("says when there are no keys", async () => {
    await setupWithRouter(<ApiKeysCard initialKeys={[]} />);
    expect(screen.getByText("You don't have any API keys.")).toBeInTheDocument();
  });

  test("lists each key by name and prefix, never a secret", async () => {
    await setupWithRouter(<ApiKeysCard initialKeys={[EXISTING]} />);

    expect(screen.getByText("old script")).toBeInTheDocument();
    expect(screen.getByText("bip_abcd1234…")).toBeInTheDocument();
    expect(screen.getByText(/last used never/)).toBeInTheDocument();
  });

  test("shows a new key's secret once, and adds it to the list", async () => {
    respond({
      apiKey: {
        id: "k2",
        name: "importer",
        prefix: "bip_wxyz9876",
        createdAt: "2026-11-05T12:00:00Z",
        lastUsedAt: null,
      },
      secret: "bip_wxyz9876-the-whole-secret",
    });
    const { user } = await setupWithRouter(<ApiKeysCard initialKeys={[]} />);

    await user.type(screen.getByLabelText("New key"), "importer");
    await user.click(screen.getByRole("button", { name: "Create key" }));

    const reveal = await screen.findByTestId("new-api-key");
    expect(within(reveal).getByLabelText("New API key")).toHaveValue("bip_wxyz9876-the-whole-secret");
    expect(screen.getByText("importer")).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ name: "importer" });

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByTestId("new-api-key")).not.toBeInTheDocument();
  });

  test("removes a key once it's revoked", async () => {
    respond({ revoked: "k1" });
    const { user } = await setupWithRouter(<ApiKeysCard initialKeys={[EXISTING]} />);

    await user.click(screen.getByRole("button", { name: "Revoke old script" }));

    await vi.waitFor(() => expect(screen.queryByText("old script")).not.toBeInTheDocument());
    expect(fetchMock.mock.calls[0][1].method).toBe("DELETE");
  });

  test("keeps a key listed when revoking fails", async () => {
    respond({ error: "Key not found" }, 404);
    const { user } = await setupWithRouter(<ApiKeysCard initialKeys={[EXISTING]} />);

    await user.click(screen.getByRole("button", { name: "Revoke old script" }));

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(screen.getByText("old script")).toBeInTheDocument();
  });
});

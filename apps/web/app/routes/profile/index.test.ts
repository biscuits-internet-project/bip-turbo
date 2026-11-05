import type { LoaderFunctionArgs } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

const findByEmail = vi.fn();
vi.mock("~/server/services", () => ({ services: { users: { findByEmail: (email: string) => findByEmail(email) } } }));
vi.mock("~/lib/base-loaders", () => ({
  protectedLoader: (fn: (args: unknown) => unknown) => (args: object) =>
    fn({ ...args, context: { currentUser: { email: "test-user@example.com" } } }),
}));

import { loader } from "./index";

const callLoader = () => loader({ request: new Request("https://discobiscuits.net/profile") } as LoaderFunctionArgs);

describe("/profile", () => {
  beforeEach(() => findByEmail.mockReset());

  test("redirects to the signed-in user's own profile, escaping the username", async () => {
    findByEmail.mockResolvedValue({ username: "disco biscuit" });

    const response = (await callLoader()) as Response;

    expect(findByEmail).toHaveBeenCalledWith("test-user@example.com");
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("/users/disco%20biscuit");
  });

  test("404s when the account has no local user", async () => {
    findByEmail.mockResolvedValue(null);

    await expect(callLoader()).rejects.toMatchObject({ status: 404 });
  });
});

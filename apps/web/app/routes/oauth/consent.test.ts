import type { LoaderFunctionArgs } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { getSafeRedirectUrl } from "~/lib/utils";

vi.mock("~/server/supabase", () => ({
  getServerClient: () => ({
    supabase: { auth: { getUser: async () => ({ data: { user: null }, error: null }) } },
    headers: new Headers(),
  }),
}));

import { clientName, loader } from "./consent";

describe("oauth consent loader", () => {
  // Login reads `next` and discards anything that isn't a same-origin path, so the
  // consent page must hand it exactly that or the user never comes back here.
  test("sends a logged-out user to login with a next that returns to this consent page", async () => {
    const request = new Request("https://discobiscuits.net/oauth/consent?authorization_id=abc123");

    const response = (await loader({ request } as LoaderFunctionArgs)) as Response;

    const location = new URL(response.headers.get("Location") ?? "", "https://discobiscuits.net");
    expect(location.pathname).toBe("/auth/login");
    expect(getSafeRedirectUrl(location.searchParams.get("next"))).toBe("/oauth/consent?authorization_id=abc123");
  });
});

describe("clientName", () => {
  test("reads the typed `name`, or the `client_name` some Auth versions send", () => {
    expect(clientName({ name: "Claude" })).toBe("Claude");
    expect(clientName({ client_name: "Codex" })).toBe("Codex");
  });

  test("is undefined when the app registered no name, so the screen falls back to 'An application'", () => {
    expect(clientName({ name: "", client_name: "" })).toBeUndefined();
    expect(clientName(undefined)).toBeUndefined();
  });
});

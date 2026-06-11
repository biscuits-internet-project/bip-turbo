import { describe, expect, test, vi } from "vitest";

import { handleAdminCrud } from "./admin-crud-action";

const makeConfig = (overrides: Partial<Parameters<typeof handleAdminCrud>[1]> = {}) => ({
  label: "instrument",
  create: vi.fn(async (name: string) => ({ id: "new-id", name })),
  update: vi.fn(async (_slug: string, name: string) => ({ id: "g1", name })),
  remove: vi.fn(async () => true),
  ...overrides,
});

const jsonRequest = (method: string, body: unknown) =>
  new Request("http://test/api/admin/instruments", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("handleAdminCrud", () => {
  test("POST creates and returns 201", async () => {
    const config = makeConfig();
    const res = await handleAdminCrud(jsonRequest("POST", { name: "Theremin" }), config);

    expect(res.status).toBe(201);
    expect(config.create).toHaveBeenCalledWith("Theremin");
    expect(await res.json()).toMatchObject({ id: "new-id", name: "Theremin" });
  });

  test("POST without a name is a 400", async () => {
    const res = await handleAdminCrud(jsonRequest("POST", {}), makeConfig());
    expect(res.status).toBe(400);
  });

  test("PUT updates by slug and returns 200", async () => {
    const config = makeConfig();
    const res = await handleAdminCrud(jsonRequest("PUT", { slug: "guitar", name: "Electric Guitar" }), config);

    expect(res.status).toBe(200);
    expect(config.update).toHaveBeenCalledWith("guitar", "Electric Guitar");
  });

  test("DELETE removes and returns 200", async () => {
    const config = makeConfig();
    const res = await handleAdminCrud(jsonRequest("DELETE", { id: "g1" }), config);

    expect(res.status).toBe(200);
    expect(config.remove).toHaveBeenCalledWith("g1");
  });

  // The in-use guard throws "Cannot delete <label> …"; that's a client error.
  test("DELETE of an in-use entity surfaces the guard as a 400", async () => {
    const config = makeConfig({
      remove: vi.fn(async () => {
        throw new Error("Cannot delete instrument with 3 reference(s)");
      }),
    });
    const res = await handleAdminCrud(jsonRequest("DELETE", { id: "g1" }), config);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Cannot delete instrument with 3 reference(s)" });
  });

  test("an unsupported method is a 405", async () => {
    const res = await handleAdminCrud(jsonRequest("PATCH", {}), makeConfig());
    expect(res.status).toBe(405);
  });

  // DELETE-only resources (e.g. venues) omit create/update; those methods 405
  // instead of crashing on an undefined handler.
  test("POST/PUT 405 when create/update are not configured", async () => {
    const config = { label: "venue", remove: vi.fn(async () => true) };
    expect((await handleAdminCrud(jsonRequest("POST", { name: "X" }), config)).status).toBe(405);
    expect((await handleAdminCrud(jsonRequest("PUT", { slug: "x", name: "X" }), config)).status).toBe(405);
    expect((await handleAdminCrud(jsonRequest("DELETE", { id: "x" }), config)).status).toBe(200);
  });
});

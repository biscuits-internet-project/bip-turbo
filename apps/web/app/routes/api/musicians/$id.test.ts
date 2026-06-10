import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs & { context: unknown }) => Promise<T>) => fn,
}));

const findById = vi.fn();
const findBySlug = vi.fn();
vi.mock("~/server/services", () => ({
  services: { musicians: { findById, findBySlug } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { loader } = await import("./$id");

function makeArgs(id: string | undefined): LoaderFunctionArgs & { context: unknown } {
  return {
    request: new Request("http://localhost/api/musicians/x"),
    params: { id },
    context: {},
  } as unknown as LoaderFunctionArgs & { context: unknown };
}

const MUSICIAN_UUID = "11111111-1111-1111-1111-111111111111";

describe("GET /api/musicians/:id", () => {
  beforeEach(() => {
    findById.mockReset();
    findBySlug.mockReset();
  });

  // A uuid-shaped param looks up by id (admin editors pre-fill this way).
  test("looks up by id when the param is a uuid", async () => {
    const musician = { id: MUSICIAN_UUID, name: "Aron Magner", slug: "aron-magner", defaultInstrumentId: "keys-id" };
    findById.mockResolvedValue(musician);

    const response = (await loader(makeArgs(MUSICIAN_UUID))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(musician);
    expect(findById).toHaveBeenCalledWith(MUSICIAN_UUID);
    expect(findBySlug).not.toHaveBeenCalled();
  });

  // A non-uuid param looks up by slug — the shareable ?musician= filter
  // pre-fills the picker this way.
  test("looks up by slug when the param is not a uuid", async () => {
    const musician = { id: MUSICIAN_UUID, name: "Aron Magner", slug: "aron-magner", defaultInstrumentId: "keys-id" };
    findBySlug.mockResolvedValue(musician);

    const response = (await loader(makeArgs("aron-magner"))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(musician);
    expect(findBySlug).toHaveBeenCalledWith("aron-magner");
    expect(findById).not.toHaveBeenCalled();
  });

  test("returns 404 when no musician matches", async () => {
    findBySlug.mockResolvedValue(null);

    const response = (await loader(makeArgs("nobody"))) as Response;

    expect(response.status).toBe(404);
  });
});

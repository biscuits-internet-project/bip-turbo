import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs & { context: unknown }) => Promise<T>) => fn,
}));

const findById = vi.fn();
vi.mock("~/server/services", () => ({
  services: { musicians: { findById } },
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

describe("GET /api/musicians/:id", () => {
  beforeEach(() => {
    findById.mockReset();
  });

  test("returns the musician when found", async () => {
    const musician = { id: "am", name: "Aron Magner", slug: "aron-magner", defaultInstrumentId: "keys-id" };
    findById.mockResolvedValue(musician);

    const response = (await loader(makeArgs("am"))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(musician);
  });

  test("returns 404 when no musician matches the id", async () => {
    findById.mockResolvedValue(null);

    const response = (await loader(makeArgs("nobody"))) as Response;

    expect(response.status).toBe(404);
  });
});

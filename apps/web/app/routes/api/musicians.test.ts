import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs & { context: unknown }) => Promise<T>) => fn,
}));

const search = vi.fn();
const findTopBySongCount = vi.fn();
vi.mock("~/server/services", () => ({
  services: { musicians: { search, findTopBySongCount } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { loader } = await import("./musicians");

function makeArgs(url: string): LoaderFunctionArgs & { context: unknown } {
  return { request: new Request(url), params: {}, context: {} } as unknown as LoaderFunctionArgs & { context: unknown };
}

describe("GET /api/musicians", () => {
  beforeEach(() => {
    search.mockReset();
    findTopBySongCount.mockReset();
  });

  // The picker's loadOnOpen hits ?top=N for the initial list, ordered by song
  // count (most-played first) rather than alphabetically.
  test("returns the top musicians by song count for ?top=N, without searching", async () => {
    const top = [{ id: "jg", name: "Jon Gutwillig", slug: "jon-gutwillig" }];
    findTopBySongCount.mockResolvedValue(top);

    const response = (await loader(makeArgs("http://localhost/api/musicians?top=5"))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(top);
    expect(findTopBySongCount).toHaveBeenCalledWith(5);
    expect(search).not.toHaveBeenCalled();
  });

  test("searches when ?q has at least 2 characters", async () => {
    const results = [{ id: "am", name: "Aron Magner", slug: "aron-magner" }];
    search.mockResolvedValue(results);

    const response = (await loader(makeArgs("http://localhost/api/musicians?q=aron&limit=20"))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(results);
    expect(search).toHaveBeenCalledWith("aron", 20);
  });

  test("returns an empty list for a too-short query, without searching", async () => {
    const response = (await loader(makeArgs("http://localhost/api/musicians?q=a"))) as Response;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([]);
    expect(search).not.toHaveBeenCalled();
  });
});

import { beforeEach, describe, expect, test, vi } from "vitest";

const envMock: { ADMIN_API_KEY?: string } = {};

vi.mock("~/server/env", () => ({ env: envMock }));

const { isAuthorizedAdminRequest } = await import("./admin-api-key");

function requestWith(headers: Record<string, string>): Request {
  return new Request("http://localhost/api/cron/recompute-ratings", { method: "POST", headers });
}

describe("isAuthorizedAdminRequest", () => {
  beforeEach(() => {
    envMock.ADMIN_API_KEY = "s3cret-key";
  });

  test("accepts the configured key as a bearer token", () => {
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Bearer s3cret-key" }))).toBe(true);
  });

  test("rejects a wrong key of the same length", () => {
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Bearer s3cret-keY" }))).toBe(false);
  });

  test("rejects a key of a different length", () => {
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Bearer short" }))).toBe(false);
  });

  test("rejects a missing Authorization header", () => {
    expect(isAuthorizedAdminRequest(requestWith({}))).toBe(false);
  });

  test("rejects a non-bearer scheme", () => {
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Basic s3cret-key" }))).toBe(false);
  });

  test("rejects the raw key without the Bearer prefix", () => {
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "s3cret-key" }))).toBe(false);
  });

  // The env entry is optional so a missing value can't crash boot, which makes this the
  // load-bearing case: no key configured must mean nobody is authorized, not everybody.
  test("fails closed when no key is configured", () => {
    envMock.ADMIN_API_KEY = undefined;

    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Bearer s3cret-key" }))).toBe(false);
    expect(isAuthorizedAdminRequest(requestWith({ authorization: "Bearer " }))).toBe(false);
    expect(isAuthorizedAdminRequest(requestWith({}))).toBe(false);
  });
});

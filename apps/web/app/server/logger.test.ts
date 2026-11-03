import { describe, expect, test } from "vitest";
import { serializeThrownMeta } from "./logger";

/** Run the format over one log entry the way winston would. */
function format(info: Record<string, unknown>) {
  return serializeThrownMeta().transform({ level: "error", message: "❌ Request failed", ...info }) as Record<
    string,
    unknown
  >;
}

describe("serializeThrownMeta", () => {
  // JSON.stringify(new Error()) is "{}", so without this every logged error
  // reaches the container log as `"error":{}` with its message and stack lost.
  test("turns an Error in the metadata into its name, message and stack", () => {
    const out = format({ error: new TypeError("Venue not found") });

    expect(out.error).toMatchObject({ name: "TypeError", message: "Venue not found" });
    expect((out.error as { stack: string }).stack).toContain("Venue not found");
    expect(JSON.stringify(out)).toContain("Venue not found");
  });

  // Loaders throw Responses for redirects and not-found pages. A Response also
  // stringifies to "{}", so the status is the only way to tell them apart from
  // real failures.
  test("turns a thrown Response into its status and redirect target", () => {
    const out = format({ error: new Response(null, { status: 302, headers: { Location: "/login" } }) });

    expect(out.error).toEqual({ status: 302, statusText: "", location: "/login" });
  });

  test("keeps the cause chain of a wrapped Error", () => {
    const out = format({ error: new Error("loader failed", { cause: new Error("connection reset") }) });

    expect(out.error).toMatchObject({ message: "loader failed", cause: { message: "connection reset" } });
  });

  // Prisma errors carry `code` and `meta` as own fields, and those are what
  // say which query failed. JSON.stringify kept them, so the description must too.
  test("keeps an Error's own fields, such as a Prisma error code", () => {
    const prismaError = Object.assign(new Error("Record to update not found."), {
      code: "P2025",
      meta: { modelName: "Venue" },
    });

    const out = format({ error: prismaError });

    expect(out.error).toMatchObject({
      message: "Record to update not found.",
      code: "P2025",
      meta: { modelName: "Venue" },
    });
  });

  // A logger that throws loses the line and can escape a catch block, so a
  // cause chain that loops back on itself must still produce a line.
  test("stops at a cause chain that loops back on itself", () => {
    const first = new Error("first");
    const second = new Error("second", { cause: first });
    first.cause = second;

    const out = format({ error: first });

    expect(JSON.stringify(out)).toContain("second");
  });

  test("leaves plain metadata untouched", () => {
    const out = format({ path: "/shows/stats", count: 3 });

    expect(out).toMatchObject({ path: "/shows/stats", count: 3 });
  });
});

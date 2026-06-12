import { describe, expect, test } from "vitest";
import { parseMusicianForm } from "./parse-musician-form";

function form(entries: Record<string, string>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }
  return formData;
}

describe("parseMusicianForm", () => {
  test("reads name, knownFrom, the default instrument, and the linked author", () => {
    const result = parseMusicianForm(
      form({ name: "Aron Magner", knownFrom: "Conspirator", defaultInstrumentId: "keys-id", authorId: "author-id" }),
    );

    expect(result).toEqual({
      name: "Aron Magner",
      knownFrom: "Conspirator",
      defaultInstrumentId: "keys-id",
      authorId: "author-id",
    });
  });

  test("trims the name and nulls empty optional fields so an edit can clear them", () => {
    const result = parseMusicianForm(
      form({ name: "  Marc Brownstein  ", knownFrom: "", defaultInstrumentId: "", authorId: "" }),
    );

    expect(result).toEqual({ name: "Marc Brownstein", knownFrom: null, defaultInstrumentId: null, authorId: null });
  });

  test("nulls missing optional fields", () => {
    const result = parseMusicianForm(form({ name: "Allen Aucoin" }));

    expect(result).toEqual({ name: "Allen Aucoin", knownFrom: null, defaultInstrumentId: null, authorId: null });
  });
});

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
  test("reads name, knownFrom, and the default instrument", () => {
    const result = parseMusicianForm(
      form({ name: "Aron Magner", knownFrom: "Conspirator", defaultInstrumentId: "keys-id" }),
    );

    expect(result).toEqual({ name: "Aron Magner", knownFrom: "Conspirator", defaultInstrumentId: "keys-id" });
  });

  test("trims the name and nulls empty optional fields so an edit can clear them", () => {
    const result = parseMusicianForm(form({ name: "  Marc Brownstein  ", knownFrom: "", defaultInstrumentId: "" }));

    expect(result).toEqual({ name: "Marc Brownstein", knownFrom: null, defaultInstrumentId: null });
  });

  test("nulls missing optional fields", () => {
    const result = parseMusicianForm(form({ name: "Allen Aucoin" }));

    expect(result).toEqual({ name: "Allen Aucoin", knownFrom: null, defaultInstrumentId: null });
  });
});

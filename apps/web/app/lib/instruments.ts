import type { Instrument } from "@bip/domain";

// Case-insensitive name sort so multi-instrument lists read the same regardless
// of the order instruments were attached in the DB.
const byName = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });

/**
 * A musician's instruments joined for display, sorted alphabetically by name.
 * Stored order reflects DB insertion (which floats "vocals" wherever it was
 * added); sorting keeps the rendered list stable, e.g. "guitar, vocals".
 */
export function formatInstrumentNames(instruments: Instrument[]): string {
  return [...instruments]
    .map((instrument) => instrument.name)
    .sort(byName)
    .join(", ");
}

/** Same alphabetical ordering for instrument names already reduced to strings. */
export function sortInstrumentNames(names: string[]): string[] {
  return [...names].sort(byName);
}

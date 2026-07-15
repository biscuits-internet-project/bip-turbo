/**
 * Recursively freeze a value that an in-process memo will hand to every
 * request for its lifetime. An accidental mutation by one caller would
 * silently corrupt what all other requests see; freezing makes it throw at
 * the mutation site instead. Callers pass plain JSON-shaped data (no cycles).
 */
export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

/**
 * Track/set/show durations are stored as integer seconds. These pure helpers
 * convert between that storage form and the human-facing `m:ss` / `h:mm:ss`
 * strings shown in setlists and tables and typed into the admin editor.
 * Domain-only (no Prisma) so they're safe in client bundles.
 */

/**
 * Render a second count as `m:ss` under an hour or `h:mm:ss` at/over an hour.
 * Set and show totals routinely cross an hour, so the hour form is the common
 * case for aggregates. Fractional input (archive.org reports lengths as
 * floats) is rounded. Invalid input (negative/NaN) renders as an empty string
 * so callers can drop the cell rather than print garbage.
 */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const ss = secs.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

/**
 * Parse an admin-entered duration into integer seconds, accepting `h:mm:ss`,
 * `m:ss`, or a raw whole-second count. Colon-separated lower parts must be in
 * range (0–59) so a typo like `8:60` is rejected rather than silently
 * misread. Returns null for anything unparseable so the caller can surface a
 * validation error instead of storing a bad value.
 */
export function parseDuration(input: string | number): number | null {
  if (typeof input === "number") {
    return Number.isInteger(input) && input >= 0 ? input : null;
  }
  const trimmed = input.trim();
  if (trimmed === "") return null;

  if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);

  const parts = trimmed.split(":");
  if (parts.length !== 2 && parts.length !== 3) return null;
  if (!parts.every((p) => /^\d+$/.test(p))) return null;

  const nums = parts.map((p) => Number.parseInt(p, 10));
  // Every part after the first (the largest unit) must be a valid 0–59 subunit.
  if (nums.slice(1).some((n) => n > 59)) return null;

  return parts.length === 3 ? nums[0] * 3600 + nums[1] * 60 + nums[2] : nums[0] * 60 + nums[1];
}

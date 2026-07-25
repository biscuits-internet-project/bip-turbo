import { describe, expect, test } from "vitest";
import { isNewPodcastEpisode, PODCAST_NEW_EPISODE_DAYS } from "./podcast-recency";

const NOW = new Date("2026-07-25T12:00:00Z");

describe("isNewPodcastEpisode", () => {
  // An episode published today is new, so the homepage card opens itself.
  test("treats an episode published today as new", () => {
    expect(isNewPodcastEpisode("2026-07-25T09:00:00Z", NOW)).toBe(true);
  });

  // The window is inclusive at its far edge: exactly 14 days old still counts.
  test("treats an episode exactly at the threshold as new", () => {
    expect(isNewPodcastEpisode("2026-07-11T12:00:00Z", NOW)).toBe(true);
  });

  // One minute past the window flips it to collapsed, pinning the boundary.
  test("treats an episode just past the threshold as not new", () => {
    expect(isNewPodcastEpisode("2026-07-11T11:59:00Z", NOW)).toBe(false);
  });

  // The case that motivated the collapse: a podcast dormant for months.
  test("treats a months-old episode as not new", () => {
    expect(isNewPodcastEpisode("2026-01-12T00:00:00Z", NOW)).toBe(false);
  });

  // A feed clock running ahead of ours must not read as ancient.
  test("treats a future publish date as new", () => {
    expect(isNewPodcastEpisode("2026-08-01T00:00:00Z", NOW)).toBe(true);
  });

  // Acast omits publishDate on occasion; the card must not claim freshness.
  test("treats a missing publish date as not new", () => {
    expect(isNewPodcastEpisode("", NOW)).toBe(false);
  });

  // An unparseable date yields NaN arithmetic, which must not read as new.
  test("treats an unparseable publish date as not new", () => {
    expect(isNewPodcastEpisode("not a date", NOW)).toBe(false);
  });

  test("uses a two-week window", () => {
    expect(PODCAST_NEW_EPISODE_DAYS).toBe(14);
  });
});

// Client-safe constants for the musicians/performers GUI. Imports nothing — in
// particular nothing from @bip/core — so route components can
// reference these values without the server-import-leak guardrail dragging
// core into the client bundle.

import { DRUMMER_ERA_INFO, eraDateWindow, type ShowLineupMember } from "@bip/domain";

// Mirrors MARLON_LINEUP_SLUGS in @bip/core/musicians/musician-constants. Kept
// as a literal here rather than imported so this module stays free of any
// @bip/core import (see server-import-leak.test.ts).
const MARLON_LINEUP_SLUGS = ["jon-gutwillig", "marc-brownstein", "aron-magner", "marlon-lewis"];

/**
 * Drummer-era windows keyed by the drummer's musician slug. A drummer's
 * everyday appearances fall inside their window; the notable signal on a
 * drummer's profile is an appearance OUTSIDE it (a sit-in before or after their
 * tenure). Derived from DRUMMER_ERA_INFO (@bip/domain) so the boundary dates
 * live in one place.
 */
export const DRUMMER_ERAS: Record<string, { startDate?: Date; endDate?: Date }> = Object.fromEntries(
  DRUMMER_ERA_INFO.map((info) => [info.musicianSlug, eraDateWindow(info)]),
);

/**
 * True when a date sits outside the given era window (before its start or after
 * its end). An open-ended bound never excludes on that side.
 */
export function isOutsideEra(date: Date, era: { startDate?: Date; endDate?: Date }): boolean {
  if (era.startDate && date < era.startDate) return true;
  if (era.endDate && date > era.endDate) return true;
  return false;
}

/** An expected member of the standard lineup, for absence detection. */
export type ExpectedMember = { slug: string; name: string; instrument: string };

/**
 * The era-independent permanent members. When one of these is missing from a
 * show's lineup, the show ran without them (e.g. a fill-in guitarist), which is
 * worth an automatic note.
 */
export const EXPECTED_CORE_MEMBERS: ExpectedMember[] = [
  { slug: "jon-gutwillig", name: "Jon Gutwillig", instrument: "guitar" },
  { slug: "marc-brownstein", name: "Marc Brownstein", instrument: "bass" },
  { slug: "aron-magner", name: "Aron Magner", instrument: "keys" },
];

/** Drummer names keyed by slug, paired with their era window in DRUMMER_ERAS. */
const DRUMMER_NAMES: Record<string, string> = Object.fromEntries(
  DRUMMER_ERA_INFO.map((info) => [info.musicianSlug, info.drummerName]),
);

/**
 * The members expected in the lineup for a show on the given date: the three
 * core members plus the drummer whose era contains the date (if any). Used to
 * flag who is absent from a show's recorded lineup.
 */
export function expectedMembersForDate(date: Date): ExpectedMember[] {
  const members = [...EXPECTED_CORE_MEMBERS];
  for (const [slug, era] of Object.entries(DRUMMER_ERAS)) {
    if (!isOutsideEra(date, era)) {
      members.push({ slug, name: DRUMMER_NAMES[slug], instrument: "drums" });
      break;
    }
  }
  return members;
}

/** A drummer-era boundary that falls on this show: its first or last show. */
export type DrummerMilestone = { slug: string; name: string; ordinal: "1st" | "last" };

/**
 * ISO `YYYY-MM-DD` of each drummer era's start/end, for exact-date milestone
 * matching. Derived from DRUMMER_ERAS; kept as strings so a show's date string
 * compares without timezone drift.
 */
function eraBoundaryIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Drummer first/last-show milestones that land on the given show date. A show on
 * a drummer's era start is their "1st show"; a show on the era end is their
 * "last show". Sam Altman's first show is intentionally never reported (his era
 * has no start date — the real first show date is unknown).
 */
export function drummerMilestonesForDate(date: string): DrummerMilestone[] {
  const milestones: DrummerMilestone[] = [];
  for (const [slug, era] of Object.entries(DRUMMER_ERAS)) {
    if (era.startDate && eraBoundaryIso(era.startDate) === date) {
      milestones.push({ slug, name: DRUMMER_NAMES[slug], ordinal: "1st" });
    }
    if (era.endDate && eraBoundaryIso(era.endDate) === date) {
      milestones.push({ slug, name: DRUMMER_NAMES[slug], ordinal: "last" });
    }
  }
  return milestones;
}

export type MusicianTier = "core" | "drummer" | "guest";

/**
 * The pinned (preset) filter params for a musician profile's song tables — the
 * By Song and All Performances tables both ride these. Always pins the musician
 * slug; a drummer additionally pins their era as an exclude window so only
 * out-of-era plays surface (the SQL mirror of `isOutsideEra`). Bounds are ISO
 * `YYYY-MM-DD` strings, each present only when the era defines that side.
 */
export function musicianTablePreset(slug: string, tier: MusicianTier): Record<string, string> {
  const preset: Record<string, string> = { musician: slug };
  const era = tier === "drummer" ? DRUMMER_ERAS[slug] : undefined;
  if (era?.startDate) preset.excludeStart = era.startDate.toISOString().slice(0, 10);
  if (era?.endDate) preset.excludeEnd = era.endDate.toISOString().slice(0, 10);
  return preset;
}

/**
 * Classify a musician for the profile page's table strategy:
 * - "drummer": a current or former drummer. Their everyday shows are implied;
 *   the profile lists only appearances outside their drummer era.
 * - "core": a permanent guitar/bass/keys member. Every show is implied, so the
 *   profile shows counts only, no appearance table.
 * - "guest": everyone else. Every appearance is notable, so full tables.
 */
export function classifyMusician(slug: string): MusicianTier {
  if (slug in DRUMMER_ERAS) return "drummer";
  if (MARLON_LINEUP_SLUGS.includes(slug)) return "core";
  return "guest";
}

/** Fixed display order of the three permanent guitar/bass/keys members. */
const CORE_ORDER = ["jon-gutwillig", "aron-magner", "marc-brownstein"];

/** Sort key by tier: core first, then the drummer, then guests. */
const TIER_RANK: Record<MusicianTier, number> = { core: 0, drummer: 1, guest: 2 };

/**
 * The lineup in a stable display order independent of how the database returned
 * it: the three core members in their fixed Jon/Aron/Marc order, then the
 * drummer, then whole-show sit-ins alphabetized by name. Returns a new array.
 */
export function sortLineup(lineup: ShowLineupMember[]): ShowLineupMember[] {
  return [...lineup].sort((a, b) => {
    const tierA = classifyMusician(a.musician.slug);
    const tierB = classifyMusician(b.musician.slug);
    if (TIER_RANK[tierA] !== TIER_RANK[tierB]) return TIER_RANK[tierA] - TIER_RANK[tierB];
    if (tierA === "core") return CORE_ORDER.indexOf(a.musician.slug) - CORE_ORDER.indexOf(b.musician.slug);
    return a.musician.name.localeCompare(b.musician.name);
  });
}

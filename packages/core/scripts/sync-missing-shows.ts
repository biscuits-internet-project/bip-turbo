/**
 * Pull Disco Biscuits shows/setlists/songs that are missing from the local DB
 * down from the prod MCP endpoint at https://discobiscuits.net/mcp.
 *
 * Why: this repo deploys to discobiscuits.net, and the prod DB is the source of
 * truth. Local developers can't always get a prod dump, so this script uses the
 * public read-only JSON-RPC API to pull year-scoped data and upsert it locally.
 * Designed to be rerun idempotently throughout the year.
 *
 * Why NOT `services.shows.create()` / `services.songs.create()` / etc.: every
 * service regenerates slugs from content (show = date+venue, song = title,
 * venue = name, track = showDate+songTitle). That's correct for minting new
 * rows, but this script must MIRROR prod rows, so the upstream slug is
 * authoritative and must be preserved verbatim — any drift (apostrophes,
 * special chars, collision suffixes) would fork the local DB from prod.
 * We therefore write directly via Prisma with the prod-supplied slugs.
 */

import type { Prisma, TrackFlag } from "@prisma/client";
import { CacheInvalidationService, CacheService } from "../src/_shared/cache";
import prisma from "../src/_shared/prisma/client";
import { RedisService } from "../src/_shared/redis";
import { createTestLogger } from "../src/_shared/test-logger";
import { InstrumentService, MusicianService } from "../src/musicians/musician-service";
import { RatingService } from "../src/ratings/rating-service";
import { SegueRunGeneratorService } from "../src/segue-run/segue-run-generator-service";
import { StatsService } from "../src/stats/stats-service";
import { recomputeShowDuration } from "../src/tracks/show-duration";

const MCP_URL = process.env.MCP_URL ?? "https://discobiscuits.net/mcp";
const DEFAULT_BAND_SLUG = "the-disco-biscuits";

// --- MCP response types (match apps/web/app/routes/mcp/index.tsx handlers).
// No shared Zod schemas exist between server and client for these shapes, so
// they're duplicated here as the only description of the wire contract.

export interface McpShowSummary {
  slug: string | null;
  date: string;
  venueName: string;
  venueCity: string;
  averageRating: number | null;
}

// Richer shape returned by the `get_shows` tool (vs the summary from
// `get_shows_by_year`). Carries the aggregate fields we mirror: ratingsCount,
// notes, relistenUrl, and the admin-controlled stat flags countForStats /
// dayOrder. The flags are optional so older MCP deploys (pre-this-change)
// keep parsing cleanly — see showNeedsUpdate for the "omit means no opinion"
// drift semantics.
export interface McpShow {
  // Prod's Show.id, preserved cross-environment so rating/attendance rows
  // (which reference show id) FK-resolve locally. Optional for back-compat
  // with pre-deploy MCP responses; falls back to Prisma-generated UUID on
  // local insert when missing — but in that case Show ratings and
  // attendances on that show won't sync.
  id?: string;
  slug: string;
  date: string;
  venueName: string | null;
  venueCity: string | null;
  averageRating: number | null;
  ratingsCount: number;
  notes: string | null;
  relistenUrl: string | null;
  countForStats?: boolean;
  dayOrder?: number | null;
  // Admin-curated rock opera tagging. Same optional + drift semantics as
  // `countForStats`: undefined = pre-deploy MCP, explicit array (including
  // empty) = authoritative. See buildRockOperaAssignmentDiff.
  rockOperaSlugs?: string[];
}

export interface McpRockOpera {
  slug: string;
  name: string;
  shortName: string;
}

export interface McpSetlistTrack {
  // Prod's Track.id, preserved cross-environment so Track-type ratings
  // FK-resolve locally. Optional for back-compat; when missing, local
  // insert generates a fresh UUID and any prod ratings on that track will
  // FK-skip. The setlist reconciler detects same-(set,position)-but-
  // different-id and rebuilds the local track with prod's id.
  id?: string;
  position: number;
  songTitle: string;
  songSlug: string;
  segue: string | null;
  // Admin-curated; optional on the wire so older MCP responses parse cleanly.
  allTimer?: boolean | null;
  note?: string | null;
  // Track duration (seconds) + its provenance, mirrored from prod so local
  // dev DBs get the durations prod resolved from nugs/archive without each
  // dev re-hitting those APIs. Optional on the wire = "no opinion" (pre-deploy
  // MCP) so a sparse upstream can't clobber locally resolved/edited values.
  duration?: number | null;
  durationSource?: string | null;
  // Per-track annotations from the Annotation table. `undefined` means
  // "no opinion" (pre-deploy MCP); an explicit empty array means "prod has
  // zero". Replace-not-merge semantics on sync — see diffTrackAnnotations.
  annotations?: string[];
  // Per-track musician deltas (sit-ins / sat-outs). Each carries the
  // musician + the instruments played, keyed by slug (the stable cross-env
  // id). `undefined` = no opinion (pre-deploy MCP); explicit empty = "prod
  // has zero deltas on this track". See diffTrackMusicians.
  trackMusicians?: McpTrackMusician[];
  // Structured track flags (DYSLEXIC / INVERTED / UNFINISHED / *_ONLY).
  // Wire shape is the enum name strings. `undefined` = no opinion; explicit
  // empty = "prod cleared this track's flags". The recurrence columns
  // (flag_gap / flag_version_gap / flag_previous_show_id) are DERIVED locally
  // by the end-of-batch stats rebuild and never travel on the wire.
  flags?: string[];
  // Completion links where THIS track is the later (completing) one. Each
  // entry is the natural key of the earlier (unfinished) track it completes.
  // `undefined` = no opinion; explicit empty = "prod cleared this track's
  // completions". See resolveCompletionLinks / diffCompletions.
  completes?: McpTrackCompletion[];
}

// An instrument carried by slug (the stable cross-env id) plus its name, so
// the sync can idempotently create the row when the local DB lacks it.
export interface McpInstrumentRef {
  slug: string;
  name: string;
}

// One lineup member (whole-show performer) on the wire. Name + knownFrom +
// default instrument are carried so the sync can seed a missing Musician row.
export interface McpLineupMember {
  musicianSlug: string;
  musicianName: string;
  knownFrom: string | null;
  defaultInstrument: McpInstrumentRef | null;
  instruments: McpInstrumentRef[];
}

// One per-track musician delta on the wire. `present` distinguishes a sit-in
// (true) from a sat-out (false).
export interface McpTrackMusician {
  musicianSlug: string;
  musicianName: string;
  present: boolean;
  defaultInstrument: McpInstrumentRef | null;
  instruments: McpInstrumentRef[];
}

// The earlier (unfinished) track a completion points at, by natural key.
// Tracks are matched cross-environment by (show slug, set, position) — the
// same key buildSetlistReconciliation uses — not by id, so a completion
// resolves even when the earlier track's local id drifted from prod.
export interface McpTrackCompletion {
  showSlug: string;
  set: string;
  position: number;
}

export interface McpSetlistSet {
  label: string;
  tracks: McpSetlistTrack[];
}

export interface McpSetlist {
  showSlug: string;
  showDate: string;
  venue: { name: string | null; city: string | null; state: string | null };
  sets: McpSetlistSet[];
  // Whole-show performer lineup. Same optional + replace-not-merge semantics
  // as the per-track fields: `undefined` = pre-deploy MCP (no opinion),
  // explicit empty = "prod has no lineup for this show". See diffShowMusicians.
  lineup?: McpLineupMember[];
}

export interface McpSong {
  slug: string;
  title: string;
  author: string | null;
  lyrics: string | null;
  timesPlayed: number;
  // MCP serializes these as ISO strings (JSON.stringify of Date); tolerate both.
  dateFirstPlayed: string | Date | null;
  dateLastPlayed: string | Date | null;
  // Curated admin fields. Optional on the wire so pre-deploy MCP responses
  // parse, and treated as "no opinion" in drift detection — see
  // buildSongDriftUpdate. `null` is distinct from `undefined` here: explicit
  // null means "prod has cleared the value" and DOES drift.
  kind?: string | null;
  legacyAuthor?: string | null;
  featuredLyric?: string | null;
  tabs?: string | null;
  notes?: string | null;
  history?: string | null;
  guitarTabsUrl?: string | null;
}

export interface McpVenue {
  slug: string;
  name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  timesPlayed: number;
  // Contact + geocode columns. Optional on the wire so pre-deploy MCP parses;
  // `undefined` = "no opinion" in drift detection.
  street?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface McpSearchVenueResult {
  slug: string;
  name: string | null;
  city: string | null;
  state: string | null;
}

// User-activity sync shapes. Match apps/web/app/routes/mcp/index.tsx
// list_users_since / list_ratings_since / list_attendances_since. Strictly
// non-PII: no email, no real name, no auth secrets. The owning user row is
// inserted locally as a stub (synthetic email + placeholder digest) so the
// real ratings/attendance rows have a valid FK.
export interface McpSyncUser {
  id: string;
  username: string | null;
  avatarFileId: string | null;
  avatarFileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface McpSyncRating {
  id: string;
  userId: string;
  value: number;
  rateableType: string;
  rateableId: string;
  createdAt: string;
  updatedAt: string;
}

export interface McpSyncAttendance {
  id: string;
  userId: string;
  showId: string;
  createdAt: string;
  updatedAt: string;
}

const SYNC_PAGE_LIMIT = 2000;

/**
 * No-op CacheInvalidationService used when the script runs without REDIS.
 * RatingService.rebuildAggregatesFor doesn't call any of these methods, but
 * the constructor still requires the dependency.
 */
function createNoopCacheInvalidation(): Record<string, () => Promise<void>> {
  const noop = async () => {};
  return new Proxy({}, { get: () => noop }) as Record<string, () => Promise<void>>;
}

/**
 * Synthetic email used for every stub user mirrored from prod. The real
 * email never leaves prod, but User.email is NOT NULL UNIQUE, so we
 * generate a deterministic placeholder from the prod uuid. Tests assert
 * this shape — change with care.
 */
export function stubUserEmail(userId: string): string {
  return `stub-${userId}@local.invalid`;
}

/**
 * Placeholder for User.passwordDigest (NOT NULL). Matches the convention
 * used by sync-supabase-users.ts which sets a literal placeholder for
 * auth-provider-managed users.
 */
export const STUB_USER_PASSWORD_DIGEST = "STUB";

// --- Pure helpers (unit-tested) ---

export function isStubSlug(slug: string | null): boolean {
  return !!slug && /^\d{4}-\d{2}-\d{2}$/.test(slug);
}

/**
 * Parse `--years=` into a deduplicated, sorted year list. Accepts single
 * years, ranges (`2010-2026`), and comma-separated mixes of the two
 * (`2010-2015,2020,2025`). Range bounds are inclusive on both ends.
 */
export function parseYearsArg(argv: string[], now: Date): number[] {
  const flag = argv.find((a) => a.startsWith("--years="));
  if (!flag) return [now.getUTCFullYear()];
  const raw = flag.slice("--years=".length);
  const pieces = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const collected = new Set<number>();
  for (const piece of pieces) {
    if (piece.includes("-")) {
      const [startStr, endStr, ...rest] = piece.split("-");
      if (rest.length > 0 || !startStr || !endStr) {
        throw new Error(`Invalid year range in --years: ${piece}`);
      }
      const start = Number(startStr);
      const end = Number(endStr);
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`Invalid year in range: ${piece}`);
      }
      if (end < start) {
        throw new Error(`Year range end before start: ${piece}`);
      }
      for (let y = start; y <= end; y++) collected.add(y);
      continue;
    }
    const n = Number(piece);
    if (!Number.isInteger(n)) throw new Error(`Invalid year in --years: ${piece}`);
    collected.add(n);
  }
  if (collected.size === 0) throw new Error("--years must contain at least one year");
  return Array.from(collected).sort((a, b) => a - b);
}

export function collectSongSlugs(setlists: McpSetlist[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const setlist of setlists) {
    for (const set of setlist.sets) {
      for (const track of set.tracks) {
        if (track.songSlug && !seen.has(track.songSlug)) {
          seen.add(track.songSlug);
          ordered.push(track.songSlug);
        }
      }
    }
  }
  return ordered;
}

export function collectVenueKeys(setlists: McpSetlist[]): Array<{ name: string; city: string; state: string }> {
  const seen = new Set<string>();
  const keys: Array<{ name: string; city: string; state: string }> = [];
  for (const setlist of setlists) {
    const { name, city, state } = setlist.venue;
    if (!name) continue;
    const dedupe = `${name}|${city ?? ""}|${state ?? ""}`;
    if (seen.has(dedupe)) continue;
    seen.add(dedupe);
    keys.push({ name, city: city ?? "", state: state ?? "" });
  }
  return keys;
}

export function matchVenue(
  candidates: McpSearchVenueResult[],
  target: { name: string; city: string; state: string },
): string | null {
  const wantName = target.name.toLowerCase();
  const wantCity = target.city.toLowerCase();
  const wantState = target.state.toLowerCase();
  // Name is a required discriminator — without it, any large city (NYC,
  // Las Vegas) returns multiple search hits sharing city+state and the match
  // collapses to "ambiguous". See Brooklyn Bowl Las Vegas regression test.
  const matches = candidates.filter(
    (c) =>
      (c.name ?? "").toLowerCase() === wantName &&
      (c.city ?? "").toLowerCase() === wantCity &&
      (c.state ?? "").toLowerCase() === wantState,
  );
  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0]?.slug ?? null;
  // True duplicates on prod (same name + city + state across multiple Venue
  // rows, e.g. Higher Ground / South Burlington / VT). Tiebreak deterministically
  // on lex-min slug — re-runs always pick the same canonical row, and any
  // later prod-side dedupe just re-points us at the survivor.
  return matches.map((c) => c.slug).sort()[0] ?? null;
}

export function buildShowCreateInput(
  show: McpShow,
  now: Date,
  opts: { venueId?: string | null; bandId?: string | null } = {},
): Prisma.ShowUncheckedCreateInput {
  return {
    // Preserve prod's Show.id when present. Falls back to Prisma's
    // default uuid() when MCP omits it (pre-deploy) — but then user
    // activity referencing this show won't FK-resolve.
    ...(show.id ? { id: show.id } : {}),
    slug: show.slug,
    date: show.date,
    averageRating: show.averageRating,
    ratingsCount: show.ratingsCount,
    notes: show.notes,
    relistenUrl: show.relistenUrl,
    // Fall back to schema defaults when MCP omits the flags. `??` is critical:
    // a pre-deploy MCP returns `undefined`, which Prisma would otherwise pass
    // through as "no opinion" (fine on insert) but the explicit default makes
    // the contract obvious in tests and avoids surprises if Prisma's behavior
    // ever shifts.
    countForStats: show.countForStats ?? true,
    dayOrder: show.dayOrder ?? null,
    venueId: opts.venueId ?? null,
    bandId: opts.bandId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Pair prod shows that look "missing" (no local row under their slug) against
 * local rows carrying the same prod id under a DIFFERENT slug. Those are slug
 * renames (an admin changed the show slug on prod), not new shows: handling
 * them as insert-new would collide on the primary key, and the stale-slug local
 * row would then trip the ghost-delete (FK from its ratings/attendances).
 * Match by id (the stable cross-environment key) since the slug is exactly what
 * drifted. Returns the (oldSlug to newSlug) updates to apply in place.
 */
export function planShowRenames(
  missingRemote: Array<{ id?: string; slug: string }>,
  localById: Map<string, { slug: string | null }>,
): Array<{ id: string; oldSlug: string | null; newSlug: string }> {
  const renames: Array<{ id: string; oldSlug: string | null; newSlug: string }> = [];
  for (const remote of missingRemote) {
    if (!remote.id) continue;
    const local = localById.get(remote.id);
    if (!local) continue; // genuinely new show — leave it for the insert path
    if (local.slug === remote.slug) continue; // already aligned (defensive)
    renames.push({ id: remote.id, oldSlug: local.slug, newSlug: remote.slug });
  }
  return renames;
}

// Shape-minimal view of a local Show row (only the aggregate fields we mirror)
// — used as the left operand to showNeedsUpdate.
export interface LocalShowAggregates {
  date: string;
  averageRating: number | null;
  ratingsCount: number;
  notes: string | null;
  relistenUrl: string | null;
  countForStats?: boolean;
  dayOrder?: number | null;
}

const AVERAGE_RATING_TOLERANCE = 1e-6;

export function showNeedsUpdate(local: LocalShowAggregates, remote: McpShow): boolean {
  if (local.date !== remote.date) return true;
  if (local.ratingsCount !== remote.ratingsCount) return true;
  if (local.notes !== remote.notes) return true;
  if (local.relistenUrl !== remote.relistenUrl) return true;
  // countForStats / dayOrder: only compare when remote actually reports them.
  // A pre-deploy MCP omits these, and treating `undefined` as a drift would
  // claim every show needs an update — flapping `countForStats` to its default
  // and clobbering admin-set values.
  if (remote.countForStats !== undefined && (local.countForStats ?? true) !== remote.countForStats) return true;
  if (remote.dayOrder !== undefined && (local.dayOrder ?? null) !== remote.dayOrder) return true;
  const la = local.averageRating;
  const ra = remote.averageRating;
  if (la === null || ra === null) return la !== ra;
  return Math.abs(la - ra) > AVERAGE_RATING_TOLERANCE;
}

// Shape-minimal local row for the drift-update path. Includes venueId so we
// can detect shows that landed without a venue under an older sync version
// and back-fill them once resolution succeeds.
export interface LocalShowForDrift extends LocalShowAggregates {
  venueId: string | null;
}

// Patch returned by buildShowDriftUpdate. Empty object means "skip" (handled
// by returning null). venueId is only present when local was null and
// resolution succeeded — we never overwrite an already-set venueId from the
// drift path; rename/merge is a separate concern.
export interface ShowDriftUpdate {
  date?: string;
  averageRating?: number | null;
  ratingsCount?: number;
  notes?: string | null;
  relistenUrl?: string | null;
  venueId?: string | null;
  countForStats?: boolean;
  dayOrder?: number | null;
}

/**
 * Compute the patch to apply to an already-local show row. Independent
 * triggers: aggregate drift (rating/notes/relistenUrl/ratingsCount), the
 * admin-controlled flags (countForStats, dayOrder), and venue back-fill (local
 * venueId is null but the venue is now resolvable). Returns null when nothing
 * changed so callers can skip the UPDATE entirely and keep re-runs idempotent.
 *
 * countForStats and dayOrder are emitted independently from the aggregate
 * block — flipping the flag shouldn't churn updatedAt with an identical
 * rating payload, and vice versa.
 */
export function buildShowDriftUpdate(
  local: LocalShowForDrift,
  remote: McpShow,
  resolvedVenueId: string | null,
): ShowDriftUpdate | null {
  const dateDrift = local.date !== remote.date;
  const aggregatesDrift =
    local.ratingsCount !== remote.ratingsCount ||
    local.notes !== remote.notes ||
    local.relistenUrl !== remote.relistenUrl ||
    averageRatingDrift(local.averageRating, remote.averageRating);
  const countForStatsDrift =
    remote.countForStats !== undefined && (local.countForStats ?? true) !== remote.countForStats;
  const dayOrderDrift = remote.dayOrder !== undefined && (local.dayOrder ?? null) !== remote.dayOrder;
  const venueDrift = local.venueId === null && resolvedVenueId !== null;
  if (!dateDrift && !aggregatesDrift && !countForStatsDrift && !dayOrderDrift && !venueDrift) return null;
  const update: ShowDriftUpdate = {};
  if (dateDrift) update.date = remote.date;
  if (aggregatesDrift) {
    update.averageRating = remote.averageRating;
    update.ratingsCount = remote.ratingsCount;
    update.notes = remote.notes;
    update.relistenUrl = remote.relistenUrl;
  }
  if (countForStatsDrift) update.countForStats = remote.countForStats;
  if (dayOrderDrift) update.dayOrder = remote.dayOrder ?? null;
  if (venueDrift) update.venueId = resolvedVenueId;
  return update;
}

function averageRatingDrift(local: number | null, remote: number | null): boolean {
  if (local === null || remote === null) return local !== remote;
  return Math.abs(local - remote) > AVERAGE_RATING_TOLERANCE;
}

export function buildSongCreateInput(song: McpSong, now: Date): Prisma.SongUncheckedCreateInput {
  return {
    slug: song.slug,
    title: song.title,
    lyrics: song.lyrics,
    timesPlayed: song.timesPlayed,
    dateFirstPlayed: song.dateFirstPlayed ? new Date(song.dateFirstPlayed) : null,
    dateLastPlayed: song.dateLastPlayed ? new Date(song.dateLastPlayed) : null,
    // Optional curated fields — `?? null` collapses `undefined` (older MCP)
    // to a stable explicit value, matching the existing buildShowCreateInput
    // pattern.
    kind: song.kind ?? null,
    legacyAuthor: song.legacyAuthor ?? null,
    featuredLyric: song.featuredLyric ?? null,
    tabs: song.tabs ?? null,
    notes: song.notes ?? null,
    history: song.history ?? null,
    guitarTabsUrl: song.guitarTabsUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

// Shape-minimal view of a local Song row for drift detection. Mirrors the
// curated fields buildSongDriftUpdate compares; derived stats columns are
// intentionally omitted (the post-sync rebuild owns them).
export interface LocalSongCurated {
  title: string;
  lyrics: string | null;
  kind: string | null;
  legacyAuthor: string | null;
  featuredLyric: string | null;
  tabs: string | null;
  notes: string | null;
  history: string | null;
  guitarTabsUrl: string | null;
}

export interface SongDriftUpdate {
  title?: string;
  lyrics?: string | null;
  kind?: string | null;
  legacyAuthor?: string | null;
  featuredLyric?: string | null;
  tabs?: string | null;
  notes?: string | null;
  history?: string | null;
  guitarTabsUrl?: string | null;
}

/**
 * Compute the patch to mirror prod's curated Song fields onto an existing
 * local row. Returns null when nothing changed. Derived stats columns
 * (timesPlayed, dateFirstPlayed/LastPlayed, yearlyPlayData) are owned by
 * `rebuildGapsAndSongStatsSince` and intentionally never appear in the patch.
 *
 * Fields whose remote value is `undefined` are treated as "no opinion" — a
 * pre-deploy MCP that doesn't return `kind` shouldn't clobber a locally set
 * value. Explicit `null` from MCP IS drift (prod cleared the field).
 */
export function buildSongDriftUpdate(local: LocalSongCurated, remote: McpSong): SongDriftUpdate | null {
  const patch: SongDriftUpdate = {};
  if (local.title !== remote.title) patch.title = remote.title;
  if (local.lyrics !== remote.lyrics) patch.lyrics = remote.lyrics;
  if (remote.kind !== undefined && local.kind !== remote.kind) patch.kind = remote.kind;
  if (remote.legacyAuthor !== undefined && local.legacyAuthor !== remote.legacyAuthor) {
    patch.legacyAuthor = remote.legacyAuthor;
  }
  if (remote.featuredLyric !== undefined && local.featuredLyric !== remote.featuredLyric) {
    patch.featuredLyric = remote.featuredLyric;
  }
  if (remote.tabs !== undefined && local.tabs !== remote.tabs) patch.tabs = remote.tabs;
  if (remote.notes !== undefined && local.notes !== remote.notes) patch.notes = remote.notes;
  if (remote.history !== undefined && local.history !== remote.history) patch.history = remote.history;
  if (remote.guitarTabsUrl !== undefined && local.guitarTabsUrl !== remote.guitarTabsUrl) {
    patch.guitarTabsUrl = remote.guitarTabsUrl;
  }
  return Object.keys(patch).length === 0 ? null : patch;
}

export function buildVenueCreateInput(venue: McpVenue, now: Date): Prisma.VenueUncheckedCreateInput {
  return {
    slug: venue.slug,
    name: venue.name,
    city: venue.city,
    state: venue.state,
    country: venue.country,
    timesPlayed: venue.timesPlayed,
    street: venue.street ?? null,
    postalCode: venue.postalCode ?? null,
    phone: venue.phone ?? null,
    website: venue.website ?? null,
    latitude: venue.latitude ?? null,
    longitude: venue.longitude ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

// Shape-minimal local Venue row used by buildVenueDriftUpdate. Excludes
// timesPlayed (derived, not curated) and the search/legacy columns.
export interface LocalVenueCurated {
  name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  street: string | null;
  postalCode: string | null;
  phone: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface VenueDriftUpdate {
  name?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  street?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  website?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

/**
 * Diff a local Venue row against the latest MCP venue payload and return a
 * patch of the drifted curated fields, or null when nothing changed.
 *
 * timesPlayed is intentionally excluded — it's a derived count of shows at
 * the venue, not a curated value, and the search/legacy columns are likewise
 * out of scope. Fields whose remote value is `undefined` (older MCP that
 * doesn't return contact/geocode columns) are treated as "no opinion" so a
 * sparse upstream can't clobber locally populated columns.
 */
export function buildVenueDriftUpdate(local: LocalVenueCurated, remote: McpVenue): VenueDriftUpdate | null {
  const patch: VenueDriftUpdate = {};
  // name / city / state / country come from the base MCP shape and are
  // compared unconditionally (they were always synced on insert).
  if (local.name !== remote.name) patch.name = remote.name;
  if (local.city !== remote.city) patch.city = remote.city;
  if (local.state !== remote.state) patch.state = remote.state;
  if (local.country !== remote.country) patch.country = remote.country;
  if (remote.street !== undefined && local.street !== remote.street) patch.street = remote.street;
  if (remote.postalCode !== undefined && local.postalCode !== remote.postalCode) patch.postalCode = remote.postalCode;
  if (remote.phone !== undefined && local.phone !== remote.phone) patch.phone = remote.phone;
  if (remote.website !== undefined && local.website !== remote.website) patch.website = remote.website;
  if (remote.latitude !== undefined && local.latitude !== remote.latitude) patch.latitude = remote.latitude;
  if (remote.longitude !== undefined && local.longitude !== remote.longitude) patch.longitude = remote.longitude;
  return Object.keys(patch).length === 0 ? null : patch;
}

// Shape-minimal local venue row for orphan planning — slug identity plus the
// show count that gates a safe delete.
export interface LocalVenueForOrphan {
  id: string;
  slug: string;
  name: string | null;
  showCount: number;
}

export interface VenueOrphanPlan {
  toDelete: Array<{ id: string; slug: string }>;
  toWarn: Array<{ slug: string; name: string | null; showCount: number }>;
}

/**
 * Partition local venues that prod no longer returns (their slug erred on
 * get_venues) into safe deletes and manual-cleanup warnings. A zero-show orphan
 * is deleted — nothing references it (shows are the only FK to venues). An
 * orphan that still has local shows is a likely rename/merge upstream, so it's
 * surfaced for manual re-point rather than deleted (which would orphan shows).
 */
export function planVenueOrphans(localVenues: LocalVenueForOrphan[], orphanSlugs: Set<string>): VenueOrphanPlan {
  const toDelete: VenueOrphanPlan["toDelete"] = [];
  const toWarn: VenueOrphanPlan["toWarn"] = [];
  for (const venue of localVenues) {
    if (!orphanSlugs.has(venue.slug)) continue;
    if (venue.showCount === 0) {
      toDelete.push({ id: venue.id, slug: venue.slug });
    } else {
      toWarn.push({ slug: venue.slug, name: venue.name, showCount: venue.showCount });
    }
  }
  return { toDelete, toWarn };
}

// Shape-minimal local Track row used by the setlist reconciliation path.
// Annotations are inlined so the per-track annotation diff can run in the same
// pass without a second query.
export interface LocalTrackForReconcile {
  id: string;
  set: string;
  position: number;
  songId: string;
  segue: string | null;
  note: string | null;
  allTimer: boolean | null;
  duration: number | null;
  durationSource: string | null;
  annotations: Array<{ id: string; desc: string | null }>;
}

export interface TrackPatch {
  songId?: string;
  segue?: string | null;
  note?: string | null;
  allTimer?: boolean;
  duration?: number | null;
  durationSource?: string | null;
}

export interface TrackInsertOp {
  // Prod's Track.id when available, so the local insert preserves it.
  // Undefined when MCP didn't return one (pre-deploy) — fall back to
  // Prisma-generated UUID.
  id?: string;
  set: string;
  position: number;
  songId: string;
  segue: string | null;
  note: string | null;
  allTimer: boolean;
  duration: number | null;
  durationSource: string | null;
  annotationDescs: string[];
}

export interface TrackUpdateOp {
  trackId: string;
  patch: TrackPatch;
  annotationDiff: { toCreateDescs: string[]; toDeleteIds: string[] };
}

export interface TrackDeleteOp {
  trackId: string;
  annotationIds: string[];
}

export interface SetlistReconciliation {
  toInsert: TrackInsertOp[];
  toUpdate: TrackUpdateOp[];
  toDelete: TrackDeleteOp[];
  /**
   * True when an insert, delete, or songId change happened — i.e. the show's
   * setlist shape moved. Drives cache invalidation, SegueRun regen, and
   * stats-rebuild window expansion. Pure segue/note/allTimer/annotation drift
   * doesn't count as structural.
   */
  structurallyChanged: boolean;
  /** True when annotations, segue, note, or allTimer changed. */
  cosmeticallyChanged: boolean;
  /** Remote songSlugs we couldn't resolve to a local song id. Reported, not inserted. */
  unresolvedSongSlugs: string[];
}

/**
 * Diff a show's local tracks against the remote setlist and emit per-track
 * insert/update/delete ops. The match key is (set, position) because position
 * is unique only within a set — a show with three sets will reuse position 1
 * three times, so any position-only key collapses across sets.
 *
 * Same-key match: patch songId / segue / note / allTimer if drifted, and
 * compute the annotation delta. Remote-only key: insert a new track + its
 * annotations. Local-only key: delete the track and its annotations.
 *
 * `undefined` on remote.note / remote.allTimer / remote.annotations still means
 * "no opinion" (pre-deploy MCP) so admin-set values aren't clobbered.
 */
export function buildSetlistReconciliation(
  local: LocalTrackForReconcile[],
  remote: McpSetlist,
  songSlugToId: Map<string, string>,
): SetlistReconciliation {
  const keyOf = (set: string, position: number): string => `${set}|${position}`;

  const remoteByKey = new Map<string, { set: string; track: McpSetlistTrack }>();
  for (const set of remote.sets) {
    for (const track of set.tracks) {
      remoteByKey.set(keyOf(set.label, track.position), { set: set.label, track });
    }
  }
  const localByKey = new Map(local.map((t) => [keyOf(t.set, t.position), t]));

  const toInsert: TrackInsertOp[] = [];
  const toUpdate: TrackUpdateOp[] = [];
  const toDelete: TrackDeleteOp[] = [];
  const unresolvedSongSlugs: string[] = [];
  let structurallyChanged = false;
  let cosmeticallyChanged = false;

  for (const [key, { set, track }] of remoteByKey) {
    const localTrack = localByKey.get(key);
    if (!localTrack) {
      const songId = songSlugToId.get(track.songSlug);
      if (!songId) {
        unresolvedSongSlugs.push(track.songSlug);
        continue;
      }
      toInsert.push({
        id: track.id,
        set,
        position: track.position,
        songId,
        segue: track.segue,
        note: track.note ?? null,
        allTimer: track.allTimer ?? false,
        duration: track.duration ?? null,
        durationSource: track.durationSource ?? null,
        annotationDescs: track.annotations ?? [],
      });
      structurallyChanged = true;
      continue;
    }
    // Track-id mismatch: a previous sync inserted this track with a fresh
    // local UUID (the buggy default before id preservation landed). Prod
    // ratings reference prod's track id, so they FK-skip against the local
    // mismatched id. Treat as structural: delete the local row (cascading
    // annotations + Track-type ratings) and reinsert with prod's id so
    // subsequent rating sync FK-resolves.
    if (track.id && localTrack.id !== track.id) {
      const songId = songSlugToId.get(track.songSlug);
      if (!songId) {
        unresolvedSongSlugs.push(track.songSlug);
        continue;
      }
      toDelete.push({
        trackId: localTrack.id,
        annotationIds: localTrack.annotations.map((a) => a.id),
      });
      toInsert.push({
        id: track.id,
        set,
        position: track.position,
        songId,
        segue: track.segue,
        note: track.note ?? null,
        allTimer: track.allTimer ?? false,
        duration: track.duration ?? null,
        durationSource: track.durationSource ?? null,
        annotationDescs: track.annotations ?? [],
      });
      structurallyChanged = true;
      continue;
    }
    const patch: TrackPatch = {};
    const remoteSongId = songSlugToId.get(track.songSlug);
    if (remoteSongId === undefined) {
      // We have a local track at this slot but can't resolve the prod songId.
      // Don't drop the track; report and leave songId alone.
      unresolvedSongSlugs.push(track.songSlug);
    } else if (remoteSongId !== localTrack.songId) {
      patch.songId = remoteSongId;
      structurallyChanged = true;
    }
    if (localTrack.segue !== track.segue) {
      patch.segue = track.segue;
      cosmeticallyChanged = true;
    }
    if (track.note !== undefined && localTrack.note !== track.note) {
      patch.note = track.note;
      cosmeticallyChanged = true;
    }
    if (track.allTimer !== undefined) {
      const localFlag = localTrack.allTimer ?? false;
      const remoteFlag = track.allTimer ?? false;
      if (localFlag !== remoteFlag) {
        patch.allTimer = remoteFlag;
        cosmeticallyChanged = true;
      }
    }
    // Duration + its provenance move together; `undefined` remote = "no
    // opinion" so a pre-deploy MCP can't wipe locally resolved durations.
    if (track.duration !== undefined && localTrack.duration !== track.duration) {
      patch.duration = track.duration;
      patch.durationSource = track.durationSource ?? null;
      cosmeticallyChanged = true;
    }
    const annotationDiff = diffTrackAnnotations(localTrack.annotations, track.annotations);
    if (annotationDiff.toCreateDescs.length > 0 || annotationDiff.toDeleteIds.length > 0) {
      cosmeticallyChanged = true;
    }
    if (
      Object.keys(patch).length > 0 ||
      annotationDiff.toCreateDescs.length > 0 ||
      annotationDiff.toDeleteIds.length > 0
    ) {
      toUpdate.push({
        trackId: localTrack.id,
        patch,
        annotationDiff,
      });
    }
  }

  for (const [key, localTrack] of localByKey) {
    if (remoteByKey.has(key)) continue;
    toDelete.push({
      trackId: localTrack.id,
      annotationIds: localTrack.annotations.map((a) => a.id),
    });
    structurallyChanged = true;
  }

  return {
    toInsert,
    toUpdate,
    toDelete,
    structurallyChanged,
    cosmeticallyChanged,
    unresolvedSongSlugs,
  };
}

/**
 * Compute the minimum create/delete operations needed to replace one track's
 * local annotation set with whatever prod returned. Identity is by `desc`
 * text — Annotation has no other mutable content, so an edited description
 * surfaces as one delete + one create. `undefined` remote = "no opinion"
 * (older MCP) and produces empty deltas; an explicit empty array wipes local.
 */
/**
 * Compute the add/remove ops needed to align a show's local rock opera
 * tagging with prod. Identity is by rock opera slug (the stable wire id;
 * resource pages are routed by slug). `undefined` remote = "no opinion"
 * (pre-deploy MCP) and yields empty deltas so admin-set local tags aren't
 * clobbered; explicit empty array = "prod has cleared this show's tags"
 * and removes all local rows.
 */
export interface RockOperaAssignmentDiff {
  toAdd: string[];
  toRemove: string[];
}

export function buildRockOperaAssignmentDiff(local: string[], remote: string[] | undefined): RockOperaAssignmentDiff {
  if (remote === undefined) return { toAdd: [], toRemove: [] };
  const localSet = new Set(local);
  const remoteSet = new Set(remote);
  return {
    toAdd: remote.filter((slug) => !localSet.has(slug)),
    toRemove: local.filter((slug) => !remoteSet.has(slug)),
  };
}

export function diffTrackAnnotations(
  local: Array<{ id: string; desc: string | null }>,
  remote: string[] | undefined,
): { toCreateDescs: string[]; toDeleteIds: string[] } {
  if (remote === undefined) return { toCreateDescs: [], toDeleteIds: [] };
  const remoteSet = new Set(remote);
  const localSet = new Set(local.map((a) => a.desc ?? ""));
  const toDeleteIds = local.filter((a) => !remoteSet.has(a.desc ?? "")).map((a) => a.id);
  const toCreateDescs = remote.filter((d) => !localSet.has(d));
  return { toCreateDescs, toDeleteIds };
}

// --- Performer / flag / completion diffs ---
//
// All four share the diffTrackAnnotations contract: identity is by a stable
// slug / enum / natural key (never a per-env row id), `undefined` remote means
// "no opinion" (pre-deploy MCP) and yields empty deltas, and an explicit array
// (including empty) is authoritative replace-not-merge. The performer diffs add
// a second level — the many-to-many instruments a musician played — which is
// diffed per retained musician rather than cascade-replaced, so a re-run with
// unchanged instruments produces zero writes and doesn't churn row ids.

export interface LocalShowMusician {
  showMusicianId: string;
  musicianSlug: string;
  instrumentSlugs: string[];
}

export interface RemoteShowMusician {
  musicianSlug: string;
  instrumentSlugs: string[];
}

export interface ShowMusicianDiff {
  toCreate: Array<{ musicianSlug: string; instrumentSlugs: string[] }>;
  toDeleteShowMusicianIds: string[];
  toUpdateInstruments: Array<{ showMusicianId: string; addInstrumentSlugs: string[]; removeInstrumentSlugs: string[] }>;
}

export function diffShowMusicians(
  local: LocalShowMusician[],
  remote: RemoteShowMusician[] | undefined,
): ShowMusicianDiff {
  if (remote === undefined) return { toCreate: [], toDeleteShowMusicianIds: [], toUpdateInstruments: [] };
  const localBySlug = new Map(local.map((m) => [m.musicianSlug, m]));
  const remoteBySlug = new Map(remote.map((m) => [m.musicianSlug, m]));
  const toCreate = remote
    .filter((m) => !localBySlug.has(m.musicianSlug))
    .map((m) => ({ musicianSlug: m.musicianSlug, instrumentSlugs: m.instrumentSlugs }));
  const toDeleteShowMusicianIds = local.filter((m) => !remoteBySlug.has(m.musicianSlug)).map((m) => m.showMusicianId);
  const toUpdateInstruments: ShowMusicianDiff["toUpdateInstruments"] = [];
  for (const m of local) {
    const r = remoteBySlug.get(m.musicianSlug);
    if (!r) continue;
    const { add, remove } = diffSlugSets(m.instrumentSlugs, r.instrumentSlugs);
    if (add.length > 0 || remove.length > 0) {
      toUpdateInstruments.push({
        showMusicianId: m.showMusicianId,
        addInstrumentSlugs: add,
        removeInstrumentSlugs: remove,
      });
    }
  }
  return { toCreate, toDeleteShowMusicianIds, toUpdateInstruments };
}

export interface LocalTrackMusician {
  trackMusicianId: string;
  musicianSlug: string;
  present: boolean;
  instrumentSlugs: string[];
}

export interface RemoteTrackMusician {
  musicianSlug: string;
  present: boolean;
  instrumentSlugs: string[];
}

export interface TrackMusicianDiff {
  toCreate: Array<{ musicianSlug: string; present: boolean; instrumentSlugs: string[] }>;
  toDeleteTrackMusicianIds: string[];
  toUpdate: Array<{
    trackMusicianId: string;
    present?: boolean;
    addInstrumentSlugs: string[];
    removeInstrumentSlugs: string[];
  }>;
}

export function diffTrackMusicians(
  local: LocalTrackMusician[],
  remote: RemoteTrackMusician[] | undefined,
): TrackMusicianDiff {
  if (remote === undefined) return { toCreate: [], toDeleteTrackMusicianIds: [], toUpdate: [] };
  const localBySlug = new Map(local.map((m) => [m.musicianSlug, m]));
  const remoteBySlug = new Map(remote.map((m) => [m.musicianSlug, m]));
  const toCreate = remote
    .filter((m) => !localBySlug.has(m.musicianSlug))
    .map((m) => ({ musicianSlug: m.musicianSlug, present: m.present, instrumentSlugs: m.instrumentSlugs }));
  const toDeleteTrackMusicianIds = local.filter((m) => !remoteBySlug.has(m.musicianSlug)).map((m) => m.trackMusicianId);
  const toUpdate: TrackMusicianDiff["toUpdate"] = [];
  for (const m of local) {
    const r = remoteBySlug.get(m.musicianSlug);
    if (!r) continue;
    const { add, remove } = diffSlugSets(m.instrumentSlugs, r.instrumentSlugs);
    const presentChanged = m.present !== r.present;
    if (presentChanged || add.length > 0 || remove.length > 0) {
      toUpdate.push({
        trackMusicianId: m.trackMusicianId,
        ...(presentChanged ? { present: r.present } : {}),
        addInstrumentSlugs: add,
        removeInstrumentSlugs: remove,
      });
    }
  }
  return { toCreate, toDeleteTrackMusicianIds, toUpdate };
}

// Set add/remove over slug arrays — the shared instrument-sub-bridge diff for
// both performer helpers, so a musician kept across runs only churns the
// instrument rows that actually changed.
function diffSlugSets(local: string[], remote: string[]): { add: string[]; remove: string[] } {
  const localSet = new Set(local);
  const remoteSet = new Set(remote);
  return { add: remote.filter((s) => !localSet.has(s)), remove: local.filter((s) => !remoteSet.has(s)) };
}

// Track flags mirror diffTrackAnnotations exactly: identity by the flag enum
// string, replace-not-merge, `undefined` = no opinion. The derived recurrence
// columns are never part of this diff (see McpSetlistTrack.flags).
export function diffTrackFlags(local: string[], remote: string[] | undefined): { toAdd: string[]; toRemove: string[] } {
  if (remote === undefined) return { toAdd: [], toRemove: [] };
  const localSet = new Set(local);
  const remoteSet = new Set(remote);
  return { toAdd: remote.filter((f) => !localSet.has(f)), toRemove: local.filter((f) => !remoteSet.has(f)) };
}

export interface CompletionKey {
  showSlug: string;
  set: string;
  position: number;
}

export interface RemoteCompletionLink {
  // The later (completing) track — the one carrying the `completes` entry.
  later: CompletionKey;
  // The earlier (unfinished) track it completes.
  earlier: CompletionKey;
}

const completionKeyOf = (k: CompletionKey): string => `${k.showSlug}|${k.set}|${k.position}`;

/**
 * Resolve each completion link's two natural-key endpoints to local track ids.
 * A link whose earlier OR later track isn't local (e.g. a narrow --years window
 * synced one show of a cross-show completion) lands in `skipped`, not resolved —
 * the caller logs it and moves on rather than inserting a dangling FK.
 */
export function resolveCompletionLinks(
  links: RemoteCompletionLink[],
  trackKeyToLocalId: Map<string, string>,
): { resolved: Array<{ earlierTrackId: string; laterTrackId: string }>; skipped: RemoteCompletionLink[] } {
  const resolved: Array<{ earlierTrackId: string; laterTrackId: string }> = [];
  const skipped: RemoteCompletionLink[] = [];
  for (const link of links) {
    const earlierTrackId = trackKeyToLocalId.get(completionKeyOf(link.earlier));
    const laterTrackId = trackKeyToLocalId.get(completionKeyOf(link.later));
    if (earlierTrackId && laterTrackId) resolved.push({ earlierTrackId, laterTrackId });
    else skipped.push(link);
  }
  return { resolved, skipped };
}

/**
 * Diff local completion rows against the desired (already-resolved) set, keyed
 * by `earlierTrackId` — the UNIQUE column, so one earlier track has at most one
 * completer. A re-pointed completion (same earlier, new later) is an upsert, not
 * an insert, so it overwrites cleanly instead of hitting the unique constraint.
 * `local` MUST be scoped to completions whose earlier track is in the sync's
 * scope, or out-of-scope links would be spuriously deleted.
 */
export function diffCompletions(
  local: Array<{ earlierTrackId: string; laterTrackId: string }>,
  desired: Array<{ earlierTrackId: string; laterTrackId: string }>,
): { toUpsert: Array<{ earlierTrackId: string; laterTrackId: string }>; toDeleteEarlierTrackIds: string[] } {
  const localByEarlier = new Map(local.map((c) => [c.earlierTrackId, c.laterTrackId]));
  const desiredByEarlier = new Map(desired.map((c) => [c.earlierTrackId, c.laterTrackId]));
  const toUpsert = desired.filter((c) => localByEarlier.get(c.earlierTrackId) !== c.laterTrackId);
  const toDeleteEarlierTrackIds = local
    .filter((c) => !desiredByEarlier.has(c.earlierTrackId))
    .map((c) => c.earlierTrackId);
  return { toUpsert, toDeleteEarlierTrackIds };
}

// --- JSON-RPC transport ---

// Bun's default fetch timeout has been observed to abort the bigger sync
// calls (list_*_since pages and especially the list_all_*_ids dumps during
// epoch-pull). 5 minutes per request is enough headroom for those without
// silently hanging forever on a genuinely stuck request. Two-shot retry
// keeps a transient network blip or upstream cold-start from blowing up
// a 10-minute sync run.
const MCP_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
const MCP_MAX_ATTEMPTS = 3;

async function mcpCall<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MCP_MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), MCP_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(MCP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
        signal: controller.signal,
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/call",
          params: { name: toolName, arguments: args },
        }),
      });
      if (!response.ok) {
        throw new Error(`MCP ${toolName} HTTP ${response.status}: ${await response.text()}`);
      }
      const envelope = (await response.json()) as {
        error?: { message: string };
        result?: { content?: Array<{ type: string; text: string }>; isError?: boolean };
      };
      if (envelope.error) throw new Error(`MCP ${toolName} error: ${envelope.error.message}`);
      if (envelope.result?.isError) {
        throw new Error(`MCP ${toolName} tool error: ${envelope.result.content?.[0]?.text}`);
      }
      const text = envelope.result?.content?.[0]?.text;
      if (!text) throw new Error(`MCP ${toolName} returned no content`);
      return JSON.parse(text) as T;
    } catch (err) {
      lastErr = err;
      const isLast = attempt === MCP_MAX_ATTEMPTS;
      console.warn(
        `  ⚠️  MCP ${toolName} attempt ${attempt}/${MCP_MAX_ATTEMPTS} failed${isLast ? "" : "; retrying"}: ${err instanceof Error ? err.message : String(err)}`,
      );
      if (isLast) break;
      // Linear backoff: 2s, 4s. Keeps the total wait small while still
      // giving an upstream cold-start a chance to warm up.
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(`MCP ${toolName} failed after ${MCP_MAX_ATTEMPTS} attempts: ${String(lastErr)}`);
}

// Max slugs per bulk MCP call (get_shows, get_setlists, get_songs,
// get_venues). The upstream server computes one row per slug; passing the
// full historical slug list (~1900 shows) hits Cloudflare's ~100s gateway
// timeout. 100 keeps each round-trip well under that ceiling across all four
// tools. Cost is roughly N/100 additional requests on the largest runs.
const MCP_BULK_CHUNK = 100;

/**
 * Page through `mcpCall(toolName, { [argKey]: chunk, ...extraArgs })` for
 * each `MCP_BULK_CHUNK`-sized slice of `items`, concatenating the per-page
 * result arrays (and forwarding any per-page `errors`). Single-request
 * envelope shape (one array under `resultKey`, optional `errors` array) is
 * preserved so call sites stay unchanged.
 */
async function mcpBulkChunked<TItem, TRow>(
  toolName: string,
  argKey: string,
  items: TItem[],
  resultKey: string,
  extraArgs: Record<string, unknown> = {},
): Promise<{ rows: TRow[]; errors: Array<{ slug: string; error: string }> }> {
  const rows: TRow[] = [];
  const errors: Array<{ slug: string; error: string }> = [];
  if (items.length === 0) return { rows, errors };
  for (let i = 0; i < items.length; i += MCP_BULK_CHUNK) {
    const chunk = items.slice(i, i + MCP_BULK_CHUNK);
    const args = { ...extraArgs, [argKey]: chunk };
    const page = await mcpCall<Record<string, unknown>>(toolName, args);
    const pageRows = page[resultKey];
    if (Array.isArray(pageRows)) rows.push(...(pageRows as TRow[]));
    const pageErrors = page.errors;
    if (Array.isArray(pageErrors)) errors.push(...(pageErrors as Array<{ slug: string; error: string }>));
  }
  return { rows, errors };
}

// --- User activity sync (users + ratings + attendances) ---

// Compound-key strings mirroring the rating / attendance unique constraints
// (ratings_user_id_rateable_id_rateable_type_unique,
// attendances_user_id_show_id_unique). The space separator can't appear in a
// uuid or rateableType, so distinct tuples never collide. Detects id↔content
// divergence
// between local and prod — see findSquatterIds.
export function ratingBindingKey(userId: string, rateableId: string, rateableType: string): string {
  return `${userId} ${rateableId} ${rateableType}`;
}

export function attendanceBindingKey(userId: string, showId: string): string {
  return `${userId} ${showId}`;
}

/**
 * Local rows that squat on an id prod has assigned to DIFFERENT content.
 *
 * Prod owns the rating/attendance id namespace. A local row whose id maps (on
 * prod) to a different (user, rateable) binding blocks the id-preserving insert
 * of prod's real row — the compound-key upsert misses, falls to create, and
 * collides on the primary key. Such squatters must be deleted before the upsert
 * pass; the squatter's own content is re-created under its correct prod id later
 * in the same pass (or correctly dropped if prod no longer has it).
 *
 * Only sound with prod's complete id→binding map (epoch full-reconcile), where
 * every prod row is appliable so deleting a squatter never strands local data.
 * Returns the local ids to delete.
 */
export function findSquatterIds(
  localRows: Array<{ id: string; key: string }>,
  prodKeyById: Map<string, string>,
): string[] {
  const stale: string[] = [];
  for (const row of localRows) {
    const prodKey = prodKeyById.get(row.id);
    if (prodKey !== undefined && prodKey !== row.key) stale.push(row.id);
  }
  return stale;
}

interface UserActivityStats {
  usersCreated: number;
  usersUpdated: number;
  ratingsUpserted: number;
  ratingsFkSkipped: number;
  attendancesUpserted: number;
  attendancesFkSkipped: number;
  usersDeleted: number;
  ratingsDeleted: number;
  attendancesDeleted: number;
  // Squatter rows deleted by the epoch id-binding reconcile (re-inserted under
  // their correct prod id during the same upsert pass). Separate from the
  // prune's *Deleted counters, which remove rows prod no longer has at all.
  ratingsReconciled: number;
  attendancesReconciled: number;
  aggregatesRebuilt: number;
}

interface SyncUserActivityOptions {
  isDryRun: boolean;
  /**
   * Pull every user/rating/attendance since epoch (vs the local MAX
   * cursor). Needed when the local DB was seeded from a dump older than
   * the current data — a cursor-only sync can't reach rows whose
   * updatedAt sits below the current local MAX. Set by `--full-users`.
   */
  pullFromEpoch: boolean;
  /**
   * Pull every prod id and delete local rows that aren't on prod.
   * Set by `--full-users` and `--prune-users`. Cheap cleanup when set
   * alone (no extra wire traffic for re-fetch).
   */
  pruneOrphans: boolean;
  ratingService: RatingService;
  cacheInvalidation: CacheInvalidationService | null;
  changedSlugs: Set<string>;
  now: Date;
  // prod show/track id → local id, for rows whose local id drifted from prod
  // (seeded by an old dump under a different id, then matched by slug/natural
  // key in the show/track passes). Rating + attendance references resolve
  // through these before the FK check + upsert so an id-drifted show/track
  // doesn't orphan its user activity. Absent entry = ids already match.
  prodShowIdToLocalId?: Map<string, string>;
  prodTrackIdToLocalId?: Map<string, string>;
  // Injected to keep the function unit-testable without mocking globals.
  // Defaults to the real mcpCall in the production wiring below.
  mcp?: <T>(toolName: string, args: Record<string, unknown>) => Promise<T>;
}

/**
 * Pull users / ratings / attendances from prod and reconcile locally.
 *
 * Default mode is incremental: cursor = MAX(updatedAt) on each local table,
 * pull rows newer than that, upsert by id. Stateless — no `.sync-state.json`,
 * no cursor table. Skips deletes.
 *
 * --full-users adds a reconciliation pass: pull every prod id, delete the
 * local rows missing from prod. Run occasionally for a true mirror.
 *
 * Rating aggregates (Show.averageRating / Track.averageRating + ratingsCount)
 * are recomputed at the end via RatingService.rebuildAggregatesFor for every
 * (rateableType, rateableId) the sync touched. Affected show slugs are added
 * to changedSlugs so the outer cache-invalidation pass clears them.
 *
 * Ratings/attendances that reference a missing local user, show, or track
 * are warned and skipped — the shows pass should have already brought in
 * every show, but a fresh DB synced for a narrow year window may genuinely
 * lack older ones.
 */
export async function syncUserActivity(
  db: typeof prisma,
  options: SyncUserActivityOptions,
): Promise<UserActivityStats> {
  const { isDryRun, pullFromEpoch, pruneOrphans, ratingService, changedSlugs } = options;
  const mcp = options.mcp ?? mcpCall;
  const prodShowIdToLocalId = options.prodShowIdToLocalId ?? new Map<string, string>();
  const prodTrackIdToLocalId = options.prodTrackIdToLocalId ?? new Map<string, string>();
  const stats: UserActivityStats = {
    usersCreated: 0,
    usersUpdated: 0,
    ratingsUpserted: 0,
    ratingsFkSkipped: 0,
    attendancesUpserted: 0,
    attendancesFkSkipped: 0,
    usersDeleted: 0,
    ratingsDeleted: 0,
    attendancesDeleted: 0,
    ratingsReconciled: 0,
    attendancesReconciled: 0,
    aggregatesRebuilt: 0,
  };

  // Cursor = local MAX(updatedAt). First run on a fresh table yields null;
  // fall back to epoch so the first page pulls everything. Full mode forces
  // epoch on every table so missing-older rows get backfilled — the
  // single-cursor approach can't pull rows whose updatedAt is below the
  // current local MAX, which happens whenever the dump that seeded the DB
  // didn't cover those rows.
  async function localMaxUpdatedAt(table: "user" | "rating" | "attendance"): Promise<Date> {
    if (pullFromEpoch) return new Date(0);
    let row: { updatedAt: Date } | null;
    if (table === "user")
      row = await db.user.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } });
    else if (table === "rating")
      row = await db.rating.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } });
    else row = await db.attendance.findFirst({ orderBy: { updatedAt: "desc" }, select: { updatedAt: true } });
    return row?.updatedAt ?? new Date(0);
  }

  // Map from prod userId → local userId. The two diverge whenever a prod
  // user is synced via username-match (their local row already existed under
  // a different id, e.g. created independently in a prior dev session or
  // present in an older prod dump under a different id). Downstream
  // rating/attendance upserts consult this map to attach rows to the right
  // local user, not to a stub that doesn't exist.
  const prodIdToLocalId = new Map<string, string>();

  // --- Users ---
  const userCursor = await localMaxUpdatedAt("user");
  console.log(`👤 Users: ${pullFromEpoch ? "full epoch pull" : `incremental since ${userCursor.toISOString()}`}`);
  let pageCursor: string | null = null;
  do {
    const args: Record<string, unknown> = { since: userCursor.toISOString(), limit: SYNC_PAGE_LIMIT };
    if (pageCursor) args.cursor = pageCursor;
    const { users, nextCursor } = await mcp<{ users: McpSyncUser[]; nextCursor: string | null }>(
      "list_users_since",
      args,
    );
    // Batched local lookup by BOTH id and username. The two lookups together
    // cover three dispatch cases per incoming prod user:
    //   1. id matches a local row     → update by id, prod id == local id
    //   2. username matches (no id)   → update the local row, remap prodId → its local id
    //   3. neither matches            → create a stub with the prod id
    // Case 2 is what keeps id drift from orphaning ratings/attendance: a
    // local "evan" with a different id than prod's "evan" doesn't get
    // double-inserted (would hit users_username_unique) and his future
    // ratings remap onto his local id.
    const incomingUserIds = users.map((u) => u.id);
    const incomingUsernames = users.map((u) => u.username).filter((n): n is string => !!n);
    const [existingByIdRows, existingByUsernameRows] = await Promise.all([
      incomingUserIds.length > 0
        ? db.user.findMany({ where: { id: { in: incomingUserIds } }, select: { id: true } })
        : Promise.resolve([]),
      incomingUsernames.length > 0
        ? db.user.findMany({
            where: { username: { in: incomingUsernames } },
            select: { id: true, username: true },
          })
        : Promise.resolve([]),
    ]);
    const localIdSet = new Set(existingByIdRows.map((row) => row.id));
    const localIdByUsername = new Map<string, string>();
    for (const row of existingByUsernameRows) {
      if (row.username) localIdByUsername.set(row.username, row.id);
    }

    for (const u of users) {
      const idMatch = localIdSet.has(u.id);
      const usernameMatch = u.username ? localIdByUsername.get(u.username) : undefined;
      // Only record prodId → localId for the username-match case where the
      // two diverge. The rating/attendance loops fall back to prodId via
      // `prodIdToLocalId.get(...) ?? r.userId`, so the common idMatch /
      // stub-create cases (where prodId == localId) don't need an entry.
      if (usernameMatch && usernameMatch !== u.id) prodIdToLocalId.set(u.id, usernameMatch);
      if (isDryRun) {
        if (idMatch || (usernameMatch && usernameMatch !== u.id)) stats.usersUpdated++;
        else stats.usersCreated++;
        continue;
      }
      try {
        // avatarFileId is intentionally null: it FKs to File, and the File
        // table isn't synced — every avatar File on prod that wasn't in the
        // last db-restore dump would violate users_avatar_file_id_fkey.
        // avatarFileUrl is a plain VarChar with no FK, so we still get the
        // remote avatar URL for rendering.
        if (idMatch) {
          await db.user.update({
            where: { id: u.id },
            data: {
              username: u.username,
              avatarFileId: null,
              avatarFileUrl: u.avatarFileUrl,
              updatedAt: new Date(u.updatedAt),
            },
          });
          stats.usersUpdated++;
        } else if (usernameMatch) {
          // No id match, but a different local row owns this username.
          // Update that row in place (its id is the source of truth
          // locally). The map entry above remaps prodId → localId so
          // future rating/attendance syncs land here.
          await db.user.update({
            where: { id: usernameMatch },
            data: {
              avatarFileId: null,
              avatarFileUrl: u.avatarFileUrl,
              updatedAt: new Date(u.updatedAt),
            },
          });
          stats.usersUpdated++;
        } else {
          await db.user.create({
            data: {
              id: u.id,
              email: stubUserEmail(u.id),
              passwordDigest: STUB_USER_PASSWORD_DIGEST,
              username: u.username,
              avatarFileId: null,
              avatarFileUrl: u.avatarFileUrl,
              createdAt: new Date(u.createdAt),
              updatedAt: new Date(u.updatedAt),
            },
          });
          stats.usersCreated++;
        }
      } catch (err) {
        console.error(`  ❌ user ${u.id} sync failed:`, err);
      }
    }
    pageCursor = nextCursor;
  } while (pageCursor !== null);
  console.log(`👤 Users: +${stats.usersCreated} ~${stats.usersUpdated}`);

  // --- Ratings ---
  // Affected (rateableType, rateableId) pairs — used after the loop to
  // rebuild Show.averageRating / Track.averageRating + ratingsCount and to
  // resolve cache-invalidation slugs.
  const touchedRateables = new Map<string, { rateableId: string; rateableType: string }>();
  const ratingCursor = await localMaxUpdatedAt("rating");
  console.log(`⭐ Ratings: ${pullFromEpoch ? "full epoch pull" : `incremental since ${ratingCursor.toISOString()}`}`);

  // Buffer the whole prod stream before writing. Epoch mode needs prod's
  // complete id→(user, rateable) picture to reconcile stale id bindings up
  // front; incremental mode just buffers its small delta.
  const prodRatings: McpSyncRating[] = [];
  pageCursor = null;
  do {
    const args: Record<string, unknown> = { since: ratingCursor.toISOString(), limit: SYNC_PAGE_LIMIT };
    if (pageCursor) args.cursor = pageCursor;
    const { ratings, nextCursor } = await mcp<{ ratings: McpSyncRating[]; nextCursor: string | null }>(
      "list_ratings_since",
      args,
    );
    prodRatings.push(...ratings);
    pageCursor = nextCursor;
  } while (pageCursor !== null);

  // Resolve each rating's userId through prodIdToLocalId. The map is populated
  // above for every prod user we saw this run; rows owned by users we didn't
  // see fall through to their prod id (which equals the local id in the common
  // case where local was seeded from prod). The rateable resolves through the
  // show/track drift maps so a rating referencing prod's show/track id lands on
  // the local row even when that row was seeded under a different id. No-drift
  // case = the same id back.
  const resolvedRatings = prodRatings.map((r) => ({
    ...r,
    localUserId: prodIdToLocalId.get(r.userId) ?? r.userId,
    localRateableId:
      r.rateableType === "Show"
        ? (prodShowIdToLocalId.get(r.rateableId) ?? r.rateableId)
        : r.rateableType === "Track"
          ? (prodTrackIdToLocalId.get(r.rateableId) ?? r.rateableId)
          : r.rateableId,
  }));

  // Epoch id-binding reconcile. Prod owns the rating id namespace, so a local
  // row holding an id prod now binds to different content squats the slot the
  // id-preserving create below needs — and the compound-key upsert can't fix it
  // (different key → falls to create → primary-key collision). Delete those
  // squatters; each re-inserts under its correct prod id in the upsert pass.
  // Mark the squatter's old rateable touched so one whose content prod dropped
  // still gets its aggregate rebuilt. Epoch-only: the full picture guarantees a
  // deleted squatter's content is re-created (or rightly gone), never stranded.
  if (pullFromEpoch && !isDryRun) {
    const prodKeyById = new Map<string, string>();
    for (const r of resolvedRatings) {
      prodKeyById.set(r.id, ratingBindingKey(r.localUserId, r.localRateableId, r.rateableType));
    }
    const localRatings = await db.rating.findMany({
      select: { id: true, userId: true, rateableId: true, rateableType: true },
    });
    const squatterIds = new Set(
      findSquatterIds(
        localRatings.map((r) => ({
          id: r.id,
          key: ratingBindingKey(r.userId, r.rateableId, r.rateableType),
        })),
        prodKeyById,
      ),
    );
    if (squatterIds.size > 0) {
      for (const r of localRatings) {
        if (!squatterIds.has(r.id)) continue;
        touchedRateables.set(`${r.rateableType}|${r.rateableId}`, {
          rateableId: r.rateableId,
          rateableType: r.rateableType,
        });
      }
      await db.rating.deleteMany({ where: { id: { in: Array.from(squatterIds) } } });
      stats.ratingsReconciled = squatterIds.size;
      console.log(`🧩 Ratings: reconciled ${squatterIds.size} stale id binding(s)`);
    }
  }

  // Apply in chunks so the FK existence IN-lists stay bounded (same shape the
  // paged pull used). The realistic FK miss is show/track: a dev DB synced for
  // a narrow --years window legitimately lacks older shows that older ratings
  // reference. Squatters are gone, so the id-preserving create can't collide in
  // epoch mode.
  for (let offset = 0; offset < resolvedRatings.length; offset += SYNC_PAGE_LIMIT) {
    const chunk = resolvedRatings.slice(offset, offset + SYNC_PAGE_LIMIT);
    const ratingUserIds = Array.from(new Set(chunk.map((r) => r.localUserId)));
    const ratingShowIds = Array.from(
      new Set(chunk.filter((r) => r.rateableType === "Show").map((r) => r.localRateableId)),
    );
    const ratingTrackIds = Array.from(
      new Set(chunk.filter((r) => r.rateableType === "Track").map((r) => r.localRateableId)),
    );
    const [existingRatingUsers, existingRatingShows, existingRatingTracks] = await Promise.all([
      ratingUserIds.length > 0
        ? db.user.findMany({ where: { id: { in: ratingUserIds } }, select: { id: true } })
        : Promise.resolve([]),
      ratingShowIds.length > 0
        ? db.show.findMany({ where: { id: { in: ratingShowIds } }, select: { id: true } })
        : Promise.resolve([]),
      ratingTrackIds.length > 0
        ? db.track.findMany({ where: { id: { in: ratingTrackIds } }, select: { id: true } })
        : Promise.resolve([]),
    ]);
    const localRatingUserSet = new Set(existingRatingUsers.map((u) => u.id));
    const localRatingShowSet = new Set(existingRatingShows.map((s) => s.id));
    const localRatingTrackSet = new Set(existingRatingTracks.map((t) => t.id));

    for (const r of chunk) {
      if (!localRatingUserSet.has(r.localUserId)) {
        stats.ratingsFkSkipped++;
        console.warn(`  ⚠️  rating ${r.id}: skipping — user ${r.localUserId} not local`);
        continue;
      }
      if (r.rateableType === "Show" && !localRatingShowSet.has(r.localRateableId)) {
        stats.ratingsFkSkipped++;
        console.warn(`  ⚠️  rating ${r.id}: skipping — show ${r.localRateableId} not local`);
        continue;
      }
      if (r.rateableType === "Track" && !localRatingTrackSet.has(r.localRateableId)) {
        stats.ratingsFkSkipped++;
        console.warn(`  ⚠️  rating ${r.id}: skipping — track ${r.localRateableId} not local`);
        continue;
      }
      if (isDryRun) {
        stats.ratingsUpserted++;
        touchedRateables.set(`${r.rateableType}|${r.localRateableId}`, {
          rateableId: r.localRateableId,
          rateableType: r.rateableType,
        });
        continue;
      }
      try {
        // Upsert by the compound unique (userId, rateableId, rateableType)
        // instead of id. A local row with the same compound key but a different
        // id (older dump) absorbs the new value in place — upserting by id would
        // hit ratings_user_id_rateable_id_rateable_type_unique on insert. The
        // inverse — a local row with this id bound to a DIFFERENT compound key —
        // is cleared by the epoch reconcile above before we reach create.
        await db.rating.upsert({
          where: {
            userId_rateableId_rateableType: {
              userId: r.localUserId,
              rateableId: r.localRateableId,
              rateableType: r.rateableType,
            },
          },
          update: {
            value: r.value,
            updatedAt: new Date(r.updatedAt),
          },
          create: {
            id: r.id,
            userId: r.localUserId,
            value: r.value,
            rateableType: r.rateableType,
            rateableId: r.localRateableId,
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          },
        });
        stats.ratingsUpserted++;
        touchedRateables.set(`${r.rateableType}|${r.localRateableId}`, {
          rateableId: r.localRateableId,
          rateableType: r.rateableType,
        });
      } catch (err) {
        console.error(`  ❌ rating ${r.id} upsert failed:`, err);
      }
    }
  }
  console.log(`⭐ Ratings: +${stats.ratingsUpserted} (skipped ${stats.ratingsFkSkipped} on missing FK)`);

  // --- Attendances ---
  // Same buffer → resolve → epoch-reconcile → chunked-apply shape as ratings.
  const attCursor = await localMaxUpdatedAt("attendance");
  console.log(`🎫 Attendances: ${pullFromEpoch ? "full epoch pull" : `incremental since ${attCursor.toISOString()}`}`);
  const prodAttendances: McpSyncAttendance[] = [];
  pageCursor = null;
  do {
    const args: Record<string, unknown> = { since: attCursor.toISOString(), limit: SYNC_PAGE_LIMIT };
    if (pageCursor) args.cursor = pageCursor;
    const { attendances, nextCursor } = await mcp<{ attendances: McpSyncAttendance[]; nextCursor: string | null }>(
      "list_attendances_since",
      args,
    );
    prodAttendances.push(...attendances);
    pageCursor = nextCursor;
  } while (pageCursor !== null);

  // Same userId + show-id drift remap as the ratings loop.
  const resolvedAttendances = prodAttendances.map((a) => ({
    ...a,
    localUserId: prodIdToLocalId.get(a.userId) ?? a.userId,
    localShowId: prodShowIdToLocalId.get(a.showId) ?? a.showId,
  }));

  // Epoch id-binding reconcile — same rationale as ratings: clear local rows
  // squatting an id prod now binds to a different (user, show) before the
  // id-preserving create runs. Show slugs of cleared squatters land in
  // changedSlugs so the affected listings get their cache invalidated.
  if (pullFromEpoch && !isDryRun) {
    const prodKeyById = new Map<string, string>();
    for (const a of resolvedAttendances) {
      prodKeyById.set(a.id, attendanceBindingKey(a.localUserId, a.localShowId));
    }
    const localAttendances = await db.attendance.findMany({ select: { id: true, userId: true, showId: true } });
    const squatterIds = new Set(
      findSquatterIds(
        localAttendances.map((a) => ({ id: a.id, key: attendanceBindingKey(a.userId, a.showId) })),
        prodKeyById,
      ),
    );
    if (squatterIds.size > 0) {
      const squatterShowIds = new Set(localAttendances.filter((a) => squatterIds.has(a.id)).map((a) => a.showId));
      const squatterShows = await db.show.findMany({
        where: { id: { in: Array.from(squatterShowIds) } },
        select: { slug: true },
      });
      for (const s of squatterShows) if (s.slug) changedSlugs.add(s.slug);
      await db.attendance.deleteMany({ where: { id: { in: Array.from(squatterIds) } } });
      stats.attendancesReconciled = squatterIds.size;
      console.log(`🧩 Attendances: reconciled ${squatterIds.size} stale id binding(s)`);
    }
  }

  for (let offset = 0; offset < resolvedAttendances.length; offset += SYNC_PAGE_LIMIT) {
    const chunk = resolvedAttendances.slice(offset, offset + SYNC_PAGE_LIMIT);
    const attUserIds = Array.from(new Set(chunk.map((a) => a.localUserId)));
    const attShowIds = Array.from(new Set(chunk.map((a) => a.localShowId)));
    const [existingAttUsers, existingAttShows] = await Promise.all([
      attUserIds.length > 0
        ? db.user.findMany({ where: { id: { in: attUserIds } }, select: { id: true } })
        : Promise.resolve([]),
      attShowIds.length > 0
        ? db.show.findMany({ where: { id: { in: attShowIds } }, select: { id: true, slug: true } })
        : Promise.resolve([]),
    ]);
    const localAttUserSet = new Set(existingAttUsers.map((u) => u.id));
    const localAttShowBySlug = new Map(existingAttShows.map((s) => [s.id, s.slug]));

    for (const a of chunk) {
      if (!localAttUserSet.has(a.localUserId)) {
        stats.attendancesFkSkipped++;
        console.warn(`  ⚠️  attendance ${a.id}: skipping — user ${a.localUserId} not local`);
        continue;
      }
      if (!localAttShowBySlug.has(a.localShowId)) {
        stats.attendancesFkSkipped++;
        console.warn(`  ⚠️  attendance ${a.id}: skipping — show ${a.localShowId} not local`);
        continue;
      }
      const showSlug = localAttShowBySlug.get(a.localShowId) ?? null;
      if (isDryRun) {
        stats.attendancesUpserted++;
        if (showSlug) changedSlugs.add(showSlug);
        continue;
      }
      try {
        // Compound-key upsert: a local row with the same (userId, showId) but a
        // different id (older dump) absorbs the update in place. The inverse —
        // this id bound to a different (userId, showId) — is cleared by the
        // epoch reconcile above before we reach create.
        await db.attendance.upsert({
          where: { userId_showId: { userId: a.localUserId, showId: a.localShowId } },
          update: { updatedAt: new Date(a.updatedAt) },
          create: {
            id: a.id,
            userId: a.localUserId,
            showId: a.localShowId,
            createdAt: new Date(a.createdAt),
            updatedAt: new Date(a.updatedAt),
          },
        });
        stats.attendancesUpserted++;
        if (showSlug) changedSlugs.add(showSlug);
      } catch (err) {
        console.error(`  ❌ attendance ${a.id} upsert failed:`, err);
      }
    }
  }
  console.log(`🎫 Attendances: +${stats.attendancesUpserted} (skipped ${stats.attendancesFkSkipped} on missing FK)`);

  // --- Full-mode reconciliation: delete local rows not on prod ---
  if (pruneOrphans) {
    console.log("🧹 Pruning local rows missing from prod");

    // Attendances first (no FK back to users/ratings, but we want a stable
    // order anyway).
    const { ids: prodAttIds } = await mcp<{ ids: string[] }>("list_all_attendance_ids", {});
    const prodAttSet = new Set(prodAttIds);
    const localAtt = await db.attendance.findMany({ select: { id: true, showId: true } });
    const localShowIdsForAtt = new Set<string>();
    const attToDelete: string[] = [];
    for (const a of localAtt) {
      if (!prodAttSet.has(a.id)) {
        attToDelete.push(a.id);
        localShowIdsForAtt.add(a.showId);
      }
    }
    if (attToDelete.length > 0) {
      if (!isDryRun) {
        await db.attendance.deleteMany({ where: { id: { in: attToDelete } } });
      }
      stats.attendancesDeleted = attToDelete.length;
      const showsForDeleted = await db.show.findMany({
        where: { id: { in: Array.from(localShowIdsForAtt) } },
        select: { slug: true },
      });
      for (const s of showsForDeleted) if (s.slug) changedSlugs.add(s.slug);
    }
    console.log(`🎫 Attendances: -${stats.attendancesDeleted}`);

    // Ratings — same pattern. Mark the rateables touched so the aggregate
    // rebuild zeros them out if the last rating was deleted.
    const { ids: prodRatingIds } = await mcp<{ ids: string[] }>("list_all_rating_ids", {});
    const prodRatingSet = new Set(prodRatingIds);
    const localRatings = await db.rating.findMany({
      select: { id: true, rateableId: true, rateableType: true },
    });
    const ratingsToDelete: string[] = [];
    for (const r of localRatings) {
      if (!prodRatingSet.has(r.id)) {
        ratingsToDelete.push(r.id);
        touchedRateables.set(`${r.rateableType}|${r.rateableId}`, {
          rateableId: r.rateableId,
          rateableType: r.rateableType,
        });
      }
    }
    if (ratingsToDelete.length > 0) {
      if (!isDryRun) {
        await db.rating.deleteMany({ where: { id: { in: ratingsToDelete } } });
      }
      stats.ratingsDeleted = ratingsToDelete.length;
    }
    console.log(`⭐ Ratings: -${stats.ratingsDeleted}`);

    // Users last. Two FKs (ratings, attendances) — we've already deleted any
    // we're going to delete above, so a delete here for a user whose data
    // is still local would FK-fail. In practice users on prod aren't deleted,
    // but to be safe we only delete users with no remaining local refs.
    const { ids: prodUserIds } = await mcp<{ ids: string[] }>("list_all_user_ids", {});
    const prodUserSet = new Set(prodUserIds);
    const localUsers = await db.user.findMany({
      select: { id: true, _count: { select: { ratings: true, attendances: true, reviews: true, blogPosts: true } } },
    });
    const usersToDelete: string[] = [];
    for (const u of localUsers) {
      if (prodUserSet.has(u.id)) continue;
      const hasRefs = u._count.ratings + u._count.attendances + u._count.reviews + u._count.blogPosts > 0;
      if (hasRefs) {
        console.warn(`  ⚠️  user ${u.id} not on prod but has local refs; skipping`);
        continue;
      }
      usersToDelete.push(u.id);
    }
    if (usersToDelete.length > 0) {
      if (!isDryRun) {
        await db.user.deleteMany({ where: { id: { in: usersToDelete } } });
      }
      stats.usersDeleted = usersToDelete.length;
    }
    console.log(`👤 Users: -${stats.usersDeleted}`);
  }

  // --- Rating aggregate rebuild ---
  if (touchedRateables.size > 0) {
    const pairs = Array.from(touchedRateables.values());
    console.log(`📐 Rebuilding rating aggregates for ${pairs.length} rateable(s)`);
    if (!isDryRun) {
      try {
        await ratingService.rebuildAggregatesFor(pairs);
        stats.aggregatesRebuilt = pairs.length;
      } catch (err) {
        console.error("  ❌ rating aggregate rebuild failed:", err);
      }
    }

    // Add affected show slugs to changedSlugs so the outer cache-invalidation
    // pass clears show.data + setlist.data (which embed Track.averageRating).
    const showIds = pairs.filter((p) => p.rateableType === "Show").map((p) => p.rateableId);
    const trackIds = pairs.filter((p) => p.rateableType === "Track").map((p) => p.rateableId);
    if (showIds.length > 0) {
      const shows = await db.show.findMany({ where: { id: { in: showIds } }, select: { slug: true } });
      for (const s of shows) if (s.slug) changedSlugs.add(s.slug);
    }
    if (trackIds.length > 0) {
      const tracks = await db.track.findMany({
        where: { id: { in: trackIds } },
        select: { show: { select: { slug: true } } },
      });
      for (const t of tracks) if (t.show.slug) changedSlugs.add(t.show.slug);
    }
  }

  return stats;
}

// --- Main ---

interface SyncStats {
  yearsSynced: number[];
  showsRemote: number;
  stubsSkipped: number;
  showsAlreadyLocal: number;
  showsUpdated: number;
  showsUnchanged: number;
  showsCreated: number;
  // Local shows whose slug was realigned to prod's after an admin renamed the
  // show on prod (matched by id). See planShowRenames.
  showsRenamed: number;
  songsFetched: number;
  songsCreated: number;
  songsOrphanedDeleted: number;
  songsOrphanedWithTracks: number;
  showsOrphanedDeleted: number;
  showsOrphanedWithUserData: number;
  venuesCreated: number;
  venuesLinked: number;
  venuesUnmatched: number;
  venuesOrphanedDeleted: number;
  venuesOrphanedWithShows: number;
  setlistsReconciled: number;
  setlistsStructurallyChanged: number;
  tracksCreated: number;
  tracksUpdated: number;
  tracksDeleted: number;
  annotationsCreated: number;
  annotationsDeleted: number;
  segueRunsRegenerated: number;
  unresolvedSongSlugs: number;
  rockOperasUpserted: number;
  rockOperaAssignmentsAdded: number;
  rockOperaAssignmentsRemoved: number;
  musiciansCreated: number;
  instrumentsCreated: number;
  showMusiciansUpserted: number;
  showMusiciansDeleted: number;
  trackMusiciansUpserted: number;
  trackMusiciansDeleted: number;
  trackFlagsAdded: number;
  trackFlagsRemoved: number;
  completionsUpserted: number;
  completionsDeleted: number;
  completionsSkipped: number;
  userActivity: UserActivityStats | null;
  errors: number;
}

function printUsage(): void {
  console.log(`Usage: bun run scripts/sync-missing-shows.ts [options]

Pull Disco Biscuits shows/setlists/songs from prod (${MCP_URL}) into the local DB.
Mirrors every in-scope show's full setlist: inserts new tracks, deletes tracks
prod removed, patches songId/segue/note/allTimer drift, and replaces
annotations. Idempotent — re-running only writes the rows that drifted.

Options:
  --years=SPEC             Years to sync, as a comma-separated list of single
                           years and/or inclusive ranges. Default: current
                           calendar year (UTC). Examples:
                             --years=2025
                             --years=2024,2025
                             --years=2010-2026
                             --years=2010-2015,2020,2024-2026
  --dry-run                Log every change without writing to the DB or Redis.
  --prune-ghost-shows      Cascade-delete local shows in synced years that prod
                           no longer has, even when attendance / favorite /
                           review / photo / youtube / rating rows are attached
                           (those are dump-frozen prod data; the equivalent
                           shows on prod under the new slug still carry them).
                           Without this flag, ghost shows with user data are
                           logged and skipped.
  --no-users               Skip the user-activity pass (users, ratings,
                           attendances). The default pulls incrementally,
                           keyed on local MAX(updatedAt) per table.
  --full-users             Full bidirectional reconcile: pull every user /
                           rating / attendance since epoch (catches rows
                           older than the local MAX cursor) AND delete any
                           local rows missing from prod. Use when the local
                           DB is stale (e.g. seeded from an old dump and
                           missing months of rating activity).
  --prune-users            Delete-only reconcile: incremental cursor pull,
                           then delete local rows missing from prod. Cheap
                           cleanup when you know the data is current and
                           just want to remove orphans. No epoch pull.
  --help, -h               Show this message and exit.

Examples:
  bun run scripts/sync-missing-shows.ts --years=2025
  bun run scripts/sync-missing-shows.ts --years=2010-2026 --dry-run
  bun run scripts/sync-missing-shows.ts --years=2010-2026 --prune-ghost-shows
  bun run scripts/sync-missing-shows.ts --full-users
  bun run scripts/sync-missing-shows.ts --prune-users

Recommended cadence:

  Routine (daily / before testing against current data):
    make db-sync-missing-shows PRUNE_USERS=1
      Default --years=<current year>. Catches new shows, current-year
      admin edits (notes, setlists, rock opera tags), all rating /
      attendance inserts + updates via the incremental cursor, and all
      rating / attendance DELETES via --prune-users. Fast (~30s typical).

  Weekly / when an admin tells you they touched an older show:
    make db-sync-missing-shows YEARS=2024-2026 PRUNE_USERS=1
      Widen --years to span whatever was edited. Picks up note/setlist/
      track changes on those older shows; still gets routine user
      activity through the inherited flags.

  Rare (clean-slate reconcile, e.g. after a fresh dump or suspected drift):
    make db-sync-missing-shows YEARS=1995-2026 PRUNE_GHOST_SHOWS=1 FULL_USERS=1
      Reconciles everything against prod in both directions.
      --full-users does epoch-pull + delete (catches missing-older rows
      the cursor can't reach). --prune-ghost-shows removes local shows
      prod deleted/renamed. Rename-with-collision cases (a local row
      under the prod-renamed-from slug that prod's new slug now claims)
      still need manual SQL cleanup.

  What you lose by skipping each flag in the routine run:
    no --prune-users      → rating/attendance DELETES on prod stay local.
                            Inserts + updates still come through.
    default --years only  → admin edits to OLDER shows don't sync.
                            Current-year edits still come through.
    no --full-users       → not needed in steady state. Only required
                            when local is missing rows older than the
                            cursor (typically just after a stale dump).
`);
}

async function syncMissingShows(): Promise<void> {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }
  const isDryRun = process.argv.includes("--dry-run");
  // --prune-ghost-shows: delete local shows in synced years that prod
  // doesn't have, even when user data (attendance, favorite, review, photo,
  // youtube) is attached. Default skip-with-user-data is safe for shared
  // DBs but blocks cleanup on dev DBs seeded from a prod dump (every old
  // show carries prod's user data, which then prevents rename cleanup).
  const pruneGhostShows = process.argv.includes("--prune-ghost-shows");
  const skipUsers = process.argv.includes("--no-users");
  const fullUsers = process.argv.includes("--full-users");
  const pruneUsers = process.argv.includes("--prune-users");
  const years = parseYearsArg(process.argv.slice(2), new Date());
  const now = new Date();
  const db = prisma;

  // Wire up the same cache invalidation stack the app uses, so re-runs make
  // freshly-synced shows immediately visible at /shows/year/{year} and
  // /shows/{slug} (which both go through services.cache.getOrSet on Redis).
  // Cloudflare cache is intentionally omitted — it's prod-only and the script
  // runs against the local DB.
  const logger = createTestLogger();
  const redisUrl = process.env.REDIS_URL;
  const redis = redisUrl ? new RedisService(redisUrl, logger) : null;
  const cache = redis ? new CacheService(redis, logger) : null;
  const cacheInvalidation = cache ? new CacheInvalidationService(cache, logger) : null;
  // StatsService is wired without a cache here — the script never reads
  // cached aggregates, only triggers the post-batch gap rebuild.
  const statsService = new StatsService(prisma, cache ?? undefined);
  // RatingService.rebuildAggregatesFor is the bulk version of the per-row
  // recompute used by the live mutation path. The user-activity pass calls
  // it once at the end for every (rateableType, rateableId) it touched.
  // cacheInvalidation is only used by the per-row mutation methods (upsert /
  // clearForUser), not by rebuildAggregatesFor — the script does its own
  // outer invalidation pass on changedSlugs — so a no-op stub is sufficient
  // in REDIS-less local runs.
  const ratingService = new RatingService(
    prisma,
    cacheInvalidation ?? (createNoopCacheInvalidation() as unknown as CacheInvalidationService),
  );
  // SegueRun rows reference Track ids in a non-FK String[] array. When the
  // setlist reconcile inserts or deletes a track, those arrays go stale; we
  // call generateSegueRunsForShow per structurally-changed show to rebuild.
  const segueRunService = new SegueRunGeneratorService(prisma, logger);
  // Both dedupe-by-slug on create (return the existing row), so the performer
  // mirroring pass can resolve-or-seed musicians/instruments idempotently.
  const instrumentService = new InstrumentService(prisma, logger);
  const musicianService = new MusicianService(prisma, logger);
  if (redis) await redis.connect();

  // Track every show whose row materially changed this run — used at the end
  // to invalidate the per-slug show.data + setlist.data cache entries.
  const changedSlugs = new Set<string>();
  // The earliest date of any show INSERTED this run (drift updates don't
  // shift gap math). Scopes the post-batch gap rebuild — pre-this-date
  // chains are unaffected. ISO YYYY-MM-DD strings compare lexicographically
  // the same as chronologically, so `<` works directly.
  let earliestInsertedDate: string | null = null;
  let songsChanged = false;
  // prod row id → local row id, for shows/tracks whose local id drifted from
  // prod (seeded under a different id by an old dump, then matched by slug).
  // The user-activity pass falls back through these so a rating/attendance that
  // references prod's show/track id still lands on the local row — mirroring the
  // existing prodIdToLocalId remap for users. Empty entry = ids already match.
  const prodShowIdToLocalId = new Map<string, string>();
  const prodTrackIdToLocalId = new Map<string, string>();

  const stats: SyncStats = {
    yearsSynced: years,
    showsRemote: 0,
    stubsSkipped: 0,
    showsAlreadyLocal: 0,
    showsUpdated: 0,
    showsUnchanged: 0,
    showsCreated: 0,
    showsRenamed: 0,
    songsFetched: 0,
    songsCreated: 0,
    songsOrphanedDeleted: 0,
    songsOrphanedWithTracks: 0,
    showsOrphanedDeleted: 0,
    showsOrphanedWithUserData: 0,
    venuesCreated: 0,
    venuesLinked: 0,
    venuesUnmatched: 0,
    venuesOrphanedDeleted: 0,
    venuesOrphanedWithShows: 0,
    setlistsReconciled: 0,
    setlistsStructurallyChanged: 0,
    tracksCreated: 0,
    tracksUpdated: 0,
    tracksDeleted: 0,
    annotationsCreated: 0,
    annotationsDeleted: 0,
    segueRunsRegenerated: 0,
    unresolvedSongSlugs: 0,
    rockOperasUpserted: 0,
    rockOperaAssignmentsAdded: 0,
    rockOperaAssignmentsRemoved: 0,
    musiciansCreated: 0,
    instrumentsCreated: 0,
    showMusiciansUpserted: 0,
    showMusiciansDeleted: 0,
    trackMusiciansUpserted: 0,
    trackMusiciansDeleted: 0,
    trackFlagsAdded: 0,
    trackFlagsRemoved: 0,
    completionsUpserted: 0,
    completionsDeleted: 0,
    completionsSkipped: 0,
    userActivity: null,
    errors: 0,
  };

  console.log(`🔄 Sync missing shows ${isDryRun ? "(DRY RUN)" : "(LIVE)"} — years: ${years.join(", ")}`);
  console.log(`🌐 MCP URL: ${MCP_URL}`);

  try {
    // Step 1: pull candidate show slugs per year.
    const remoteShows: McpShowSummary[] = [];
    for (const year of years) {
      const { shows } = await mcpCall<{ shows: McpShowSummary[] }>("get_shows_by_year", { year, limit: 500 });
      console.log(`📅 ${year}: ${shows.length} shows on prod`);
      remoteShows.push(...shows);
    }
    stats.showsRemote = remoteShows.length;

    // Step 2a: drop prod stub rows that have a bare YYYY-MM-DD slug AND no
    // venue — those are placeholder rows for unhappened/unconfirmed dates.
    // A bare-date slug WITH a venue (e.g. 2009-03-08 Langerado Festival) is a
    // real prod show; admins skipped the venue-suffix slug for historical
    // reasons. Mirror those so per-year counts stay aligned with prod.
    const realShows = remoteShows.filter((s) => {
      if (isStubSlug(s.slug) && !s.venueName) {
        stats.stubsSkipped++;
        return false;
      }
      return true;
    });
    if (stats.stubsSkipped > 0) {
      console.log(`🚫 Skipped ${stats.stubsSkipped} date-only stub row(s) on prod`);
    }

    // Step 2b: fetch richer per-show data (ratingsCount, notes, relistenUrl)
    // for ALL in-scope slugs in a single batched call. Replaces using the
    // sparse `get_shows_by_year` summary for inserts and enables drift detection
    // against existing local rows.
    const realSlugs = realShows.map((s) => s.slug).filter((s): s is string => !!s);
    const { rows: remoteFullShows, errors: fullShowErrors } = await mcpBulkChunked<string, McpShow>(
      "get_shows",
      "slugs",
      realSlugs,
      "shows",
    );
    if (fullShowErrors.length) {
      console.warn(`⚠️  ${fullShowErrors.length} get_shows fetch errors:`, fullShowErrors);
      stats.errors += fullShowErrors.length;
    }

    // Step 2c: partition into missing-locally vs already-local. We pull venueId
    // for existing rows so the drift-update branch can back-fill venues that
    // landed NULL under an older sync (caused 404s on /shows/:slug).
    const localShowSelect = {
      id: true,
      slug: true,
      date: true,
      averageRating: true,
      ratingsCount: true,
      notes: true,
      relistenUrl: true,
      venueId: true,
      countForStats: true,
      dayOrder: true,
    } as const;
    const existingLocal = await db.show.findMany({ where: { slug: { in: realSlugs } }, select: localShowSelect });
    // Local Show.slug is nullable in the schema, but every show this script
    // touches has a slug (we filter the prod summary by slug earlier in step
    // 2). Narrowing here keeps `existingBySlug` keyed by `string` so every
    // downstream `changedSlugs.add(slug)` typechecks against the
    // `Set<string>`.
    const existingBySlug = new Map(
      existingLocal.filter((s): s is typeof s & { slug: string } => s.slug !== null).map((s) => [s.slug, s]),
    );

    // Step 2d: realign renamed shows. A prod show with no local row under its
    // slug, but whose prod id already exists locally under a different slug, is
    // a slug rename (admin renamed it on prod), not a new show. Update the local
    // row's slug in place and fold it into existingBySlug so it flows through
    // the drift/setlist reconcile as an existing show. Without this the show
    // would insert-collide on the primary key and then FK-fail when the
    // stale-slug ghost is pruned.
    const slugRenameCandidates = remoteFullShows.filter((s) => !existingBySlug.has(s.slug));
    const renameCandidateIds = slugRenameCandidates.flatMap((s) => (s.id ? [s.id] : []));
    const renameLocalRows =
      renameCandidateIds.length > 0
        ? await db.show.findMany({ where: { id: { in: renameCandidateIds } }, select: localShowSelect })
        : [];
    const renameLocalById = new Map(renameLocalRows.map((r) => [r.id, r]));
    for (const rename of planShowRenames(slugRenameCandidates, renameLocalById)) {
      const localRow = renameLocalById.get(rename.id);
      if (!localRow) continue;
      if (!isDryRun) {
        await db.show.update({ where: { id: rename.id }, data: { slug: rename.newSlug, updatedAt: now } });
      }
      if (rename.oldSlug) changedSlugs.add(rename.oldSlug);
      changedSlugs.add(rename.newSlug);
      existingBySlug.set(rename.newSlug, { ...localRow, slug: rename.newSlug });
      stats.showsRenamed++;
      console.log(`  🔀 show slug realigned ${rename.oldSlug ?? "(null)"} → ${rename.newSlug}`);
    }

    stats.showsAlreadyLocal = existingBySlug.size;
    const missingShows = remoteFullShows.filter((s) => !existingBySlug.has(s.slug));
    const existingRemoteShows = remoteFullShows.filter((s) => existingBySlug.has(s.slug));
    // Existing shows whose venue we still need to resolve so the drift loop
    // can back-fill venueId. Their setlists MUST be fetched alongside missing
    // shows so we know the (name, city, state) tuple to search by. Sourced from
    // existingBySlug (not existingLocal) so realigned renames are covered too.
    const needsVenueSlugs = Array.from(existingBySlug.values())
      .filter((s) => s.venueId === null)
      .map((s) => s.slug);
    console.log(
      `📥 ${missingShows.length} missing locally (${stats.showsAlreadyLocal} already present, ${needsVenueSlugs.length} need venue back-fill)`,
    );

    // Step 3: fetch the full setlist for EVERY in-scope show in one batched
    // call. Drives both the missing-show inserts and the per-existing-show
    // setlist reconciliation below. Prod admins can add / remove / swap
    // tracks on already-local shows, so every show in scope needs its setlist
    // fetched, not just the inserts.
    const { rows: setlists, errors: setlistErrors } = await mcpBulkChunked<string, McpSetlist>(
      "get_setlists",
      "showSlugs",
      realSlugs,
      "setlists",
    );
    if (setlistErrors.length) {
      console.warn(`⚠️  ${setlistErrors.length} setlist fetch errors:`, setlistErrors);
      stats.errors += setlistErrors.length;
    }
    const setlistBySlug = new Map(setlists.map((s) => [s.showSlug, s]));

    // Step 4: default band lookup. Only one band in practice (Disco Biscuits);
    // bandId is nullable, so a missing band just means shows land without band FK.
    const band = await db.band.findFirst({ where: { slug: DEFAULT_BAND_SLUG } });
    if (!band) console.warn(`⚠️  No band with slug "${DEFAULT_BAND_SLUG}" in local DB; bandId will be NULL`);

    // Step 4b: rock opera lookup table. Independent of the per-show data —
    // mirror the small (3-row) lookup so the per-show assignment diff in step
    // 7b can resolve every slug from the McpShow.rockOperaSlugs payload.
    // Pre-deploy MCP returns no such tool; tolerate by skipping rock opera
    // sync entirely for this run.
    const rockOperaSlugToId = new Map<string, string>();
    try {
      const { rockOperas } = await mcpCall<{ rockOperas: McpRockOpera[] }>("get_rock_operas", {});
      const existingRockOperas = await db.rockOpera.findMany({
        select: { id: true, slug: true, name: true, shortName: true },
      });
      const existingBySlugRO = new Map(existingRockOperas.map((r) => [r.slug, r]));
      for (const remote of rockOperas) {
        const local = existingBySlugRO.get(remote.slug);
        if (local) {
          rockOperaSlugToId.set(local.slug, local.id);
          // Cheap name / shortName drift — patch when prod renames an opera.
          if (local.name !== remote.name || local.shortName !== remote.shortName) {
            if (isDryRun) {
              console.log(`  🔄 rock_opera ${remote.slug} would update name/shortName (dry run)`);
              stats.rockOperasUpserted++;
              continue;
            }
            try {
              await db.rockOpera.update({
                where: { id: local.id },
                data: { name: remote.name, shortName: remote.shortName, updatedAt: now },
              });
              stats.rockOperasUpserted++;
              console.log(`  🔄 rock_opera ${remote.slug} updated`);
            } catch (err) {
              console.error(`  ❌ failed to update rock_opera ${remote.slug}:`, err);
              stats.errors++;
            }
          }
        } else {
          if (isDryRun) {
            rockOperaSlugToId.set(remote.slug, `dry-run-rock-opera-${remote.slug}`);
            stats.rockOperasUpserted++;
            console.log(`  🆕 rock_opera ${remote.slug} (dry run)`);
            continue;
          }
          try {
            const created = await db.rockOpera.create({
              data: { slug: remote.slug, name: remote.name, shortName: remote.shortName, updatedAt: now },
            });
            rockOperaSlugToId.set(created.slug, created.id);
            stats.rockOperasUpserted++;
            console.log(`  🆕 rock_opera ${remote.slug}`);
          } catch (err) {
            console.error(`  ❌ failed to create rock_opera ${remote.slug}:`, err);
            stats.errors++;
          }
        }
      }
    } catch (err) {
      console.warn(`⚠️  get_rock_operas failed — skipping rock opera assignment sync:`, err);
    }

    // Step 5: resolve venues. For each unique (name, city, state) from the
    // setlists, search_venues by name and disambiguate on city+state. Cache the
    // resolved (name|city|state) → venueSlug map, then upsert missing Venues
    // locally from get_venues.
    const venueKeys = collectVenueKeys(setlists);
    const venueKeyToSlug = new Map<string, string>(); // "name|city|state" -> slug
    for (const key of venueKeys) {
      try {
        // Query by name only, then disambiguate on city+state in matchVenue.
        // The limit must exceed the largest count of venues sharing a name, or
        // the exact city+state match can be truncated away (16 "House of Blues"
        // rows overflowed the old limit of 10, leaving those shows venue-less).
        // 50 is the prod search default and comfortably covers real name reuse.
        const { results } = await mcpCall<{ results: McpSearchVenueResult[] }>("search_venues", {
          query: key.name,
          limit: 50,
        });
        const slug = matchVenue(results, key);
        if (slug) {
          venueKeyToSlug.set(`${key.name}|${key.city}|${key.state}`, slug);
        } else {
          stats.venuesUnmatched++;
          console.warn(`⚠️  No unambiguous venue match for ${key.name} / ${key.city}, ${key.state}`);
        }
      } catch (err) {
        console.error(`  ❌ search_venues failed for ${key.name}:`, err);
        stats.errors++;
      }
    }

    // Pull the full curated shape locally for every resolved venue slug so the
    // same data drives both the "missing → create" branch and the
    // "already-local → diff" branch below. No second DB round-trip needed.
    const neededVenueSlugs = Array.from(new Set(venueKeyToSlug.values()));
    const localVenueRows = await db.venue.findMany({
      where: { slug: { in: neededVenueSlugs } },
      select: {
        slug: true,
        id: true,
        name: true,
        city: true,
        state: true,
        country: true,
        street: true,
        postalCode: true,
        phone: true,
        website: true,
        latitude: true,
        longitude: true,
      },
    });
    const venueSlugToId = new Map<string, string>(localVenueRows.map((v) => [v.slug, v.id]));
    const localVenueBySlug = new Map(localVenueRows.map((v) => [v.slug, v]));
    // Fetch the full MCP venue shape for every in-scope slug — missing ones
    // get created, already-local ones get diffed against buildVenueDriftUpdate.
    if (neededVenueSlugs.length > 0) {
      const { rows: remoteVenues, errors: venueErrors } = await mcpBulkChunked<string, McpVenue>(
        "get_venues",
        "slugs",
        neededVenueSlugs,
        "venues",
      );
      if (venueErrors.length) stats.errors += venueErrors.length;
      for (const venue of remoteVenues) {
        const localId = venueSlugToId.get(venue.slug);
        if (localId === undefined) {
          if (isDryRun) {
            venueSlugToId.set(venue.slug, `dry-run-venue-${venue.slug}`);
            stats.venuesCreated++;
            continue;
          }
          try {
            const created = await db.venue.create({ data: buildVenueCreateInput(venue, now) });
            venueSlugToId.set(created.slug, created.id);
            stats.venuesCreated++;
          } catch (err) {
            console.error(`  ❌ failed to create venue ${venue.slug}:`, err);
            stats.errors++;
          }
          continue;
        }
        const localVenue = localVenueBySlug.get(venue.slug);
        if (!localVenue) continue;
        const patch = buildVenueDriftUpdate(localVenue, venue);
        if (patch === null) continue;
        if (isDryRun) {
          console.log(`  🔄 venue ${venue.slug} would update ${JSON.stringify(patch)} (dry run)`);
          continue;
        }
        try {
          await db.venue.update({ where: { id: localId }, data: { ...patch, updatedAt: now } });
          console.log(`  🔄 venue ${venue.slug} ${JSON.stringify(patch)}`);
        } catch (err) {
          console.error(`  ❌ failed to update venue ${venue.slug}:`, err);
          stats.errors++;
        }
      }
    }

    // Step 5b: drift-update existing local shows. Runs AFTER venue resolution
    // so shows that landed with venueId=NULL under an older sync version can
    // self-heal — their patch will include venueId once the (name, city, state)
    // tuple resolves. Aggregate-only drift (rating/notes/relistenUrl) lands
    // here too.
    for (const remote of existingRemoteShows) {
      const local = existingBySlug.get(remote.slug);
      if (!local) continue;
      const setlist = setlistBySlug.get(remote.slug);
      const venueKey = setlist?.venue?.name
        ? `${setlist.venue.name}|${setlist.venue.city ?? ""}|${setlist.venue.state ?? ""}`
        : null;
      const venueSlug = venueKey ? venueKeyToSlug.get(venueKey) : null;
      const resolvedVenueId = venueSlug ? (venueSlugToId.get(venueSlug) ?? null) : null;
      const patch = buildShowDriftUpdate(local, remote, resolvedVenueId);
      if (patch === null) {
        stats.showsUnchanged++;
        continue;
      }
      if (isDryRun) {
        console.log(`  🔄 ${remote.slug} would update ${JSON.stringify(patch)} (dry run)`);
        stats.showsUpdated++;
        continue;
      }
      try {
        await db.show.update({ where: { slug: remote.slug }, data: { ...patch, updatedAt: now } });
        changedSlugs.add(remote.slug);
        if (patch.venueId) stats.venuesLinked++;
        // countForStats flip → expand the rebuild window to cover this show.
        if (patch.countForStats !== undefined) {
          const showDate = String(local.date);
          if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
            earliestInsertedDate = showDate;
          }
        }
        // date drift shifts the show's chronological position. Expand the
        // rebuild window to the EARLIER of (old date, new date) so the gap
        // chain gets recomputed in both directions.
        if (patch.date !== undefined) {
          const oldDate = String(local.date);
          const newDate = patch.date;
          const earlier = oldDate < newDate ? oldDate : newDate;
          if (earliestInsertedDate === null || earlier < earliestInsertedDate) {
            earliestInsertedDate = earlier;
          }
        }
        stats.showsUpdated++;
        console.log(`  🔄 ${remote.slug} ${JSON.stringify(patch)}`);
      } catch (err) {
        console.error(`  ❌ failed to update show ${remote.slug}:`, err);
        stats.errors++;
      }
    }
    console.log(`📊 Existing shows: ${stats.showsUpdated} updated, ${stats.showsUnchanged} unchanged`);

    // Step 6: resolve songs (local + remote) into an id map the track builder
    // can consume. Songs already in the DB reuse their existing id; new songs
    // get created via get_songs fetch. We fetch the full MCP shape for EVERY
    // in-scope song (not just missing ones) so the same call doubles as the
    // source for buildSongDriftUpdate — admin edits to lyrics / kind /
    // featuredLyric on prod mirror locally without a second round-trip.
    const allSongSlugs = collectSongSlugs(setlists);
    const localSongRows = await db.song.findMany({
      where: { slug: { in: allSongSlugs } },
      select: {
        slug: true,
        id: true,
        title: true,
        lyrics: true,
        kind: true,
        legacyAuthor: true,
        featuredLyric: true,
        tabs: true,
        notes: true,
        history: true,
        guitarTabsUrl: true,
      },
    });
    const songSlugToId = new Map<string, string>(localSongRows.map((s) => [s.slug, s.id]));
    const localSongBySlug = new Map(localSongRows.map((s) => [s.slug, s]));
    const missingSongSlugs = allSongSlugs.filter((slug) => !songSlugToId.has(slug));
    console.log(`🎵 ${allSongSlugs.length} distinct songs in setlists; ${missingSongSlugs.length} missing locally`);

    if (allSongSlugs.length > 0) {
      const { rows: remoteSongs, errors: songErrors } = await mcpBulkChunked<string, McpSong>(
        "get_songs",
        "slugs",
        allSongSlugs,
        "songs",
      );
      stats.songsFetched = remoteSongs.length;
      if (songErrors.length) {
        console.warn(`⚠️  ${songErrors.length} song fetch errors:`, songErrors);
        stats.errors += songErrors.length;
      }
      for (const song of remoteSongs) {
        const localId = songSlugToId.get(song.slug);
        if (localId === undefined) {
          // Not local yet → create.
          if (isDryRun) {
            songSlugToId.set(song.slug, `dry-run-song-${song.slug}`);
            stats.songsCreated++;
            continue;
          }
          try {
            const created = await db.song.create({ data: buildSongCreateInput(song, now) });
            songSlugToId.set(created.slug, created.id);
            stats.songsCreated++;
            songsChanged = true;
          } catch (err) {
            console.error(`  ❌ failed to create song ${song.slug}:`, err);
            stats.errors++;
          }
          continue;
        }
        // Already local → diff curated admin fields and patch if drifted.
        const localSong = localSongBySlug.get(song.slug);
        if (!localSong) continue;
        const patch = buildSongDriftUpdate(localSong, song);
        if (patch === null) continue;
        if (isDryRun) {
          console.log(`  🔄 song ${song.slug} would update ${JSON.stringify(patch)} (dry run)`);
          continue;
        }
        try {
          await db.song.update({ where: { id: localId }, data: { ...patch, updatedAt: now } });
          songsChanged = true;
          console.log(`  🔄 song ${song.slug} ${JSON.stringify(patch)}`);
        } catch (err) {
          console.error(`  ❌ failed to update song ${song.slug}:`, err);
          stats.errors++;
        }
      }
    }

    // Step 7: insert missing show rows (no tracks yet — those land in step 8).
    // Splitting insert-show from insert-tracks lets step 8 run one unified
    // reconcile loop over every in-scope show, missing or existing, using the
    // same buildSetlistReconciliation helper.
    for (const show of missingShows) {
      const slug = show.slug;
      const setlist = setlistBySlug.get(slug);
      const venueKey = setlist?.venue?.name
        ? `${setlist.venue.name}|${setlist.venue.city ?? ""}|${setlist.venue.state ?? ""}`
        : null;
      const venueSlug = venueKey ? venueKeyToSlug.get(venueKey) : null;
      const venueId = venueSlug ? (venueSlugToId.get(venueSlug) ?? null) : null;
      if (venueId) stats.venuesLinked++;

      if (isDryRun) {
        console.log(`  🆕 show ${slug} (venue=${venueId ? "✓" : "—"}) (dry run)`);
        stats.showsCreated++;
        // Synthesize an existingLocal entry so the reconcile loop below also
        // logs the would-be track inserts for this slug.
        existingBySlug.set(slug, {
          id: `dry-run-show-${slug}`,
          slug,
          date: show.date,
          averageRating: show.averageRating,
          ratingsCount: show.ratingsCount,
          notes: show.notes,
          relistenUrl: show.relistenUrl,
          venueId,
          countForStats: show.countForStats ?? true,
          dayOrder: show.dayOrder ?? null,
        });
        const showDate = String(show.date);
        if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
          earliestInsertedDate = showDate;
        }
        continue;
      }
      try {
        const createdShow = await db.show.create({
          data: buildShowCreateInput(show, now, { venueId, bandId: band?.id ?? null }),
        });
        existingBySlug.set(slug, {
          id: createdShow.id,
          slug,
          date: createdShow.date,
          averageRating: createdShow.averageRating,
          ratingsCount: createdShow.ratingsCount,
          notes: createdShow.notes,
          relistenUrl: createdShow.relistenUrl,
          venueId: createdShow.venueId,
          countForStats: createdShow.countForStats,
          dayOrder: createdShow.dayOrder,
        });
        changedSlugs.add(slug);
        const showDate = String(show.date);
        if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
          earliestInsertedDate = showDate;
        }
        stats.showsCreated++;
        console.log(`  🆕 show ${slug} (venue=${venueId ? "✓" : "—"})`);
      } catch (err) {
        console.error(`  ❌ failed to insert show ${slug}:`, err);
        stats.errors++;
      }
    }

    // Step 7b: mirror rock opera assignments for every in-scope show. Runs
    // after show inserts (step 7) so every prod slug exists in `existingBySlug`
    // with a real local id. Skipped silently when rockOperaSlugToId is empty
    // (pre-deploy MCP couldn't serve get_rock_operas) — the per-show diff
    // logic still wouldn't have ids to write to.
    if (rockOperaSlugToId.size > 0) {
      const reconcileShowIds = Array.from(existingBySlug.values())
        .filter((s) => !String(s.id).startsWith("dry-run-show-"))
        .map((s) => s.id);
      const localTagRows =
        reconcileShowIds.length === 0
          ? []
          : await db.rockOperaPerformance.findMany({
              where: { showId: { in: reconcileShowIds } },
              include: { rockOpera: { select: { slug: true } } },
            });
      const localTagsByShowId = new Map<string, string[]>();
      for (const row of localTagRows) {
        const arr = localTagsByShowId.get(row.showId);
        if (arr) arr.push(row.rockOpera.slug);
        else localTagsByShowId.set(row.showId, [row.rockOpera.slug]);
      }

      // remoteFullShows still has the rockOperaSlugs from get_shows. Loop
      // those and diff against local for every in-scope show — captures both
      // newly-inserted shows (which have empty local tags) and existing
      // shows whose admin-curated tags changed on prod.
      // remoteFullShows comes from get_shows which only returns shows with
      // a slug, so the explicit type assertion is safe.
      const remoteShowsBySlug = new Map<string, (typeof remoteFullShows)[number]>(
        remoteFullShows.map((s) => [s.slug, s]),
      );
      for (const [slug, local] of existingBySlug) {
        const remote = remoteShowsBySlug.get(slug);
        if (!remote) continue;
        const isDryRunShow = String(local.id).startsWith("dry-run-show-");
        const localSlugs = isDryRunShow ? [] : (localTagsByShowId.get(local.id) ?? []);
        const diff = buildRockOperaAssignmentDiff(localSlugs, remote.rockOperaSlugs);
        if (diff.toAdd.length === 0 && diff.toRemove.length === 0) continue;

        if (isDryRun || isDryRunShow) {
          console.log(
            `  🎭 ${slug}: +[${diff.toAdd.join(",")}] -[${diff.toRemove.join(",")}] rock opera tag(s) (dry run)`,
          );
          stats.rockOperaAssignmentsAdded += diff.toAdd.length;
          stats.rockOperaAssignmentsRemoved += diff.toRemove.length;
          continue;
        }

        const addIds = diff.toAdd.map((s) => rockOperaSlugToId.get(s)).filter((id): id is string => id !== undefined);
        const removeIds = diff.toRemove
          .map((s) => rockOperaSlugToId.get(s))
          .filter((id): id is string => id !== undefined);
        try {
          await db.$transaction(async (tx) => {
            if (removeIds.length > 0) {
              await tx.rockOperaPerformance.deleteMany({
                where: { showId: local.id, rockOperaId: { in: removeIds } },
              });
            }
            if (addIds.length > 0) {
              await tx.rockOperaPerformance.createMany({
                data: addIds.map((rockOperaId) => ({ showId: local.id, rockOperaId })),
              });
            }
          });
          stats.rockOperaAssignmentsAdded += diff.toAdd.length;
          stats.rockOperaAssignmentsRemoved += diff.toRemove.length;
          changedSlugs.add(slug);
          // Invalidate rock opera resource-page caches for every slug
          // whose performance list changed. Neighbor invalidation
          // (other shows' show.data entries whose annotations shifted)
          // is handled by invalidateShowListings at the end of the run.
          if (cacheInvalidation) {
            const affectedSlugs = Array.from(new Set([...diff.toAdd, ...diff.toRemove]));
            await cacheInvalidation.invalidateRockOperaAssignment(affectedSlugs);
          }
          console.log(`  🎭 ${slug}: +${diff.toAdd.length} -${diff.toRemove.length} rock opera tag(s)`);
        } catch (err) {
          console.error(`  ❌ failed to sync rock opera tags for ${slug}:`, err);
          stats.errors++;
        }
      }
    }

    // Step 8: reconcile every in-scope show's setlist against prod. One DB
    // query pulls the local track + annotation graph for every show; the pure
    // buildSetlistReconciliation helper diffs against the remote setlist
    // matched on (set, position) and emits insert / update / delete ops. The
    // SegueRun regen + stats-rebuild-window expansion fire only for shows
    // whose setlist shape actually moved (insert / delete / songId change),
    // not for cosmetic-only diffs.
    const showIdsToReconcile = Array.from(existingBySlug.values())
      .filter((s) => !String(s.id).startsWith("dry-run-show-"))
      .map((s) => s.id);
    const localTracksByShowId = new Map<string, LocalTrackForReconcile[]>();
    if (showIdsToReconcile.length > 0) {
      const localTrackRows = await db.track.findMany({
        where: { showId: { in: showIdsToReconcile } },
        select: {
          id: true,
          showId: true,
          set: true,
          position: true,
          songId: true,
          segue: true,
          note: true,
          allTimer: true,
          duration: true,
          durationSource: true,
          annotations: { select: { id: true, desc: true } },
        },
      });
      for (const row of localTrackRows) {
        const arr = localTracksByShowId.get(row.showId);
        const tr: LocalTrackForReconcile = {
          id: row.id,
          set: row.set,
          position: row.position,
          songId: row.songId,
          segue: row.segue,
          note: row.note,
          allTimer: row.allTimer,
          duration: row.duration,
          durationSource: row.durationSource,
          annotations: row.annotations,
        };
        if (arr) arr.push(tr);
        else localTracksByShowId.set(row.showId, [tr]);
      }
    }

    for (const [slug, local] of existingBySlug) {
      const setlist = setlistBySlug.get(slug);
      if (!setlist) continue;
      const localTracks = localTracksByShowId.get(local.id) ?? [];
      const recon = buildSetlistReconciliation(localTracks, setlist, songSlugToId);
      if (recon.unresolvedSongSlugs.length > 0) {
        stats.unresolvedSongSlugs += recon.unresolvedSongSlugs.length;
        console.warn(
          `⚠️  ${slug}: ${recon.unresolvedSongSlugs.length} unresolved songSlug(s): ${recon.unresolvedSongSlugs.join(", ")}`,
        );
      }
      if (recon.toInsert.length === 0 && recon.toUpdate.length === 0 && recon.toDelete.length === 0) {
        continue;
      }
      stats.setlistsReconciled++;
      if (recon.structurallyChanged) stats.setlistsStructurallyChanged++;
      const showDate = String(local.date);

      if (isDryRun) {
        if (recon.toInsert.length > 0) {
          console.log(`  ➕ ${slug}: +${recon.toInsert.length} track(s) (dry run)`);
        }
        if (recon.toUpdate.length > 0) {
          console.log(`  🔄 ${slug}: ~${recon.toUpdate.length} track(s) (dry run)`);
        }
        if (recon.toDelete.length > 0) {
          console.log(`  ➖ ${slug}: -${recon.toDelete.length} track(s) (dry run)`);
        }
        // Match the live counters: only count an update when the track row
        // itself has a non-empty patch. Annotation-only updates are reflected
        // in the annotation counters, not tracksUpdated.
        stats.tracksCreated += recon.toInsert.length;
        stats.tracksUpdated += recon.toUpdate.filter((u) => Object.keys(u.patch).length > 0).length;
        stats.tracksDeleted += recon.toDelete.length;
        for (const ins of recon.toInsert) stats.annotationsCreated += ins.annotationDescs.length;
        for (const upd of recon.toUpdate) {
          stats.annotationsCreated += upd.annotationDiff.toCreateDescs.length;
          stats.annotationsDeleted += upd.annotationDiff.toDeleteIds.length;
        }
        for (const del of recon.toDelete) stats.annotationsDeleted += del.annotationIds.length;
        changedSlugs.add(slug);
        if (
          recon.structurallyChanged &&
          local.countForStats &&
          (earliestInsertedDate === null || showDate < earliestInsertedDate)
        ) {
          earliestInsertedDate = showDate;
        }
        continue;
      }

      try {
        await db.$transaction(async (tx) => {
          // Deletes run before inserts so an id-mismatch reconcile (delete
          // old (set, position) row then insert with same key under prod's
          // id) doesn't transiently violate the (showId, set, position)
          // unique. The buggy default before id preservation gave the same
          // slot two different ids — this loop converges them.
          for (const del of recon.toDelete) {
            if (del.annotationIds.length > 0) {
              await tx.annotation.deleteMany({ where: { id: { in: del.annotationIds } } });
              stats.annotationsDeleted += del.annotationIds.length;
            }
            // Track-type ratings reference rateableId by Track.id. The local
            // track id is going away; its ratings would orphan otherwise.
            // Prod ratings will re-sync against the new (prod) id on the
            // next rating pass, so this drop is recoverable.
            await tx.rating.deleteMany({
              where: { rateableType: "Track", rateableId: del.trackId },
            });
            await tx.track.delete({ where: { id: del.trackId } });
            stats.tracksDeleted++;
          }
          for (const ins of recon.toInsert) {
            await tx.track.create({
              data: {
                // Preserve prod's Track.id when present so subsequent rating
                // syncs FK-resolve cross-environment.
                ...(ins.id ? { id: ins.id } : {}),
                showId: local.id,
                songId: ins.songId,
                set: ins.set,
                position: ins.position,
                segue: ins.segue,
                note: ins.note,
                allTimer: ins.allTimer,
                duration: ins.duration,
                durationSource: ins.durationSource,
                createdAt: now,
                updatedAt: now,
                annotations:
                  ins.annotationDescs.length > 0
                    ? {
                        create: ins.annotationDescs.map((desc) => ({ desc, createdAt: now, updatedAt: now })),
                      }
                    : undefined,
              },
            });
            stats.tracksCreated++;
            stats.annotationsCreated += ins.annotationDescs.length;
          }
          for (const upd of recon.toUpdate) {
            if (Object.keys(upd.patch).length > 0) {
              await tx.track.update({
                where: { id: upd.trackId },
                data: { ...upd.patch, updatedAt: now },
              });
              stats.tracksUpdated++;
            }
            if (upd.annotationDiff.toDeleteIds.length > 0) {
              await tx.annotation.deleteMany({ where: { id: { in: upd.annotationDiff.toDeleteIds } } });
              stats.annotationsDeleted += upd.annotationDiff.toDeleteIds.length;
            }
            if (upd.annotationDiff.toCreateDescs.length > 0) {
              await tx.annotation.createMany({
                data: upd.annotationDiff.toCreateDescs.map((desc) => ({
                  trackId: upd.trackId,
                  desc,
                  createdAt: now,
                  updatedAt: now,
                })),
              });
              stats.annotationsCreated += upd.annotationDiff.toCreateDescs.length;
            }
          }
        });
        changedSlugs.add(slug);
        // Keep the denormalized Show.duration in step with the mirrored track
        // durations. Cheap (one aggregate + one update) and idempotent.
        await recomputeShowDuration(db, local.id);
        console.log(
          `  📝 ${slug}: +${recon.toInsert.length} ~${recon.toUpdate.length} -${recon.toDelete.length} track(s)`,
        );
        if (recon.structurallyChanged) {
          try {
            const showWithTracks = await db.show.findUnique({
              where: { id: local.id },
              include: { tracks: { include: { song: true }, orderBy: [{ set: "asc" }, { position: "asc" }] } },
            });
            if (showWithTracks) {
              const count = await segueRunService.generateSegueRunsForShow(showWithTracks);
              stats.segueRunsRegenerated += count;
            }
          } catch (err) {
            console.error(`  ❌ SegueRun regen failed for ${slug}:`, err);
            stats.errors++;
          }
          if (local.countForStats && (earliestInsertedDate === null || showDate < earliestInsertedDate)) {
            earliestInsertedDate = showDate;
          }
        }
      } catch (err) {
        console.error(`  ❌ failed to reconcile setlist for ${slug}:`, err);
        stats.errors++;
      }
    }

    // Build prodShowIdToLocalId for any show whose local id drifted from prod's
    // (matched by slug above, kept its old local id). The user-activity pass
    // remaps rating/attendance show references through this so they don't FK-skip.
    {
      const remoteIdBySlug = new Map(remoteFullShows.map((s) => [s.slug, s.id]));
      for (const [slug, local] of existingBySlug) {
        if (String(local.id).startsWith("dry-run-show-")) continue;
        const prodId = remoteIdBySlug.get(slug);
        if (prodId && prodId !== local.id) prodShowIdToLocalId.set(prodId, local.id);
      }
    }

    // Step 8c: mirror performer data (whole-show lineup + per-track sit-ins /
    // sat-outs), track flags, and completion links for every in-scope show.
    // Runs after the setlist reconcile so every track exists locally under its
    // prod id. The diffs key musicians by slug and tracks by (slug, set,
    // position) — never a per-env row id — so they survive id drift. Each
    // per-entity diff treats `undefined` remote as "no opinion" (pre-deploy
    // MCP), so this whole step is a no-op until the MCP route change deploys.
    const performerShowIds = Array.from(existingBySlug.values())
      .filter((s) => !String(s.id).startsWith("dry-run-show-"))
      .map((s) => s.id);
    if (performerShowIds.length > 0 || isDryRun) {
      // 8c.1 — resolve every musician + instrument referenced across the
      // in-scope setlists to a local id, seeding missing rows idempotently by
      // slug. Instruments first so a musician's defaultInstrument FK resolves.
      const instrumentNameBySlug = new Map<string, string>();
      const musicianRefBySlug = new Map<
        string,
        { name: string; knownFrom: string | null; defaultInstrumentSlug: string | null }
      >();
      const noteInstrument = (i: { slug: string; name: string } | null | undefined): void => {
        if (i) instrumentNameBySlug.set(i.slug, i.name);
      };
      for (const setlist of setlistBySlug.values()) {
        for (const member of setlist.lineup ?? []) {
          noteInstrument(member.defaultInstrument);
          for (const i of member.instruments) noteInstrument(i);
          if (!musicianRefBySlug.has(member.musicianSlug)) {
            musicianRefBySlug.set(member.musicianSlug, {
              name: member.musicianName,
              knownFrom: member.knownFrom,
              defaultInstrumentSlug: member.defaultInstrument?.slug ?? null,
            });
          }
        }
        for (const set of setlist.sets) {
          for (const track of set.tracks) {
            for (const tm of track.trackMusicians ?? []) {
              noteInstrument(tm.defaultInstrument);
              for (const i of tm.instruments) noteInstrument(i);
              if (!musicianRefBySlug.has(tm.musicianSlug)) {
                musicianRefBySlug.set(tm.musicianSlug, {
                  name: tm.musicianName,
                  knownFrom: null,
                  defaultInstrumentSlug: tm.defaultInstrument?.slug ?? null,
                });
              }
            }
          }
        }
      }

      const instrumentSlugToId = new Map<string, string>();
      const musicianSlugToId = new Map<string, string>();
      if (instrumentNameBySlug.size > 0) {
        const existing = await db.instrument.findMany({
          where: { slug: { in: Array.from(instrumentNameBySlug.keys()) } },
          select: { id: true, slug: true },
        });
        for (const row of existing) instrumentSlugToId.set(row.slug, row.id);
        for (const [slug, name] of instrumentNameBySlug) {
          if (instrumentSlugToId.has(slug)) continue;
          if (isDryRun) {
            instrumentSlugToId.set(slug, `dry-run-instrument-${slug}`);
          } else {
            const created = await instrumentService.create({ name });
            instrumentSlugToId.set(created.slug, created.id);
          }
          stats.instrumentsCreated++;
        }
      }
      if (musicianRefBySlug.size > 0) {
        const existing = await db.musician.findMany({
          where: { slug: { in: Array.from(musicianRefBySlug.keys()) } },
          select: { id: true, slug: true },
        });
        for (const row of existing) musicianSlugToId.set(row.slug, row.id);
        for (const [slug, ref] of musicianRefBySlug) {
          if (musicianSlugToId.has(slug)) continue;
          if (isDryRun) {
            musicianSlugToId.set(slug, `dry-run-musician-${slug}`);
          } else {
            const created = await musicianService.create({
              name: ref.name,
              knownFrom: ref.knownFrom,
              defaultInstrumentId: ref.defaultInstrumentSlug
                ? (instrumentSlugToId.get(ref.defaultInstrumentSlug) ?? null)
                : null,
            });
            musicianSlugToId.set(created.slug, created.id);
          }
          stats.musiciansCreated++;
        }
      }
      const instrumentIdsFor = (slugs: string[]): string[] =>
        slugs.map((s) => instrumentSlugToId.get(s)).filter((id): id is string => id !== undefined);

      // 8c.2 — re-load local tracks (fresh, post-reconcile) and build the
      // (slug, set, position) → local track id map plus prodTrackIdToLocalId.
      const showIdToSlug = new Map<string, string>();
      for (const [slug, local] of existingBySlug) {
        if (!String(local.id).startsWith("dry-run-show-")) showIdToSlug.set(local.id, slug);
      }
      const localTrackRows =
        performerShowIds.length === 0
          ? []
          : await db.track.findMany({
              where: { showId: { in: performerShowIds } },
              select: { id: true, showId: true, set: true, position: true },
            });
      const trackKeyToLocalId = new Map<string, string>();
      const allTrackIds: string[] = [];
      for (const row of localTrackRows) {
        const slug = showIdToSlug.get(row.showId);
        if (!slug) continue;
        trackKeyToLocalId.set(`${slug}|${row.set}|${row.position}`, row.id);
        allTrackIds.push(row.id);
      }
      // prodTrackIdToLocalId: where a remote track's prod id differs from the
      // local id at the same (slug, set, position) — residual drift the step-8
      // id-rebuild didn't converge (e.g. a track only ever ratings-referenced).
      for (const [slug, setlist] of setlistBySlug) {
        for (const set of setlist.sets) {
          for (const track of set.tracks) {
            if (!track.id) continue;
            const localId = trackKeyToLocalId.get(`${slug}|${set.label}|${track.position}`);
            if (localId && localId !== track.id) prodTrackIdToLocalId.set(track.id, localId);
          }
        }
      }

      // 8c.3 — load local performer + flag rows for the in-scope shows/tracks.
      const localShowMusicianRows =
        performerShowIds.length === 0
          ? []
          : await db.showMusician.findMany({
              where: { showId: { in: performerShowIds } },
              select: {
                id: true,
                showId: true,
                musician: { select: { slug: true } },
                instruments: { select: { instrument: { select: { slug: true } } } },
              },
            });
      const localShowMusiciansByShowId = new Map<string, LocalShowMusician[]>();
      for (const row of localShowMusicianRows) {
        const entry: LocalShowMusician = {
          showMusicianId: row.id,
          musicianSlug: row.musician.slug,
          instrumentSlugs: row.instruments.map((r) => r.instrument.slug),
        };
        const arr = localShowMusiciansByShowId.get(row.showId);
        if (arr) arr.push(entry);
        else localShowMusiciansByShowId.set(row.showId, [entry]);
      }

      // Filter the per-track rows by the show relation (showId IN performerShowIds,
      // bounded by show count) rather than `trackId IN allTrackIds`: an all-years
      // sync has tens of thousands of track ids, which blows past the database's
      // bound-parameter limit.
      const localTrackMusicianRows =
        allTrackIds.length === 0
          ? []
          : await db.trackMusician.findMany({
              where: { track: { showId: { in: performerShowIds } } },
              select: {
                id: true,
                trackId: true,
                present: true,
                musician: { select: { slug: true } },
                instruments: { select: { instrument: { select: { slug: true } } } },
              },
            });
      const localTrackMusiciansByTrackId = new Map<string, LocalTrackMusician[]>();
      for (const row of localTrackMusicianRows) {
        const entry: LocalTrackMusician = {
          trackMusicianId: row.id,
          musicianSlug: row.musician.slug,
          present: row.present,
          instrumentSlugs: row.instruments.map((r) => r.instrument.slug),
        };
        const arr = localTrackMusiciansByTrackId.get(row.trackId);
        if (arr) arr.push(entry);
        else localTrackMusiciansByTrackId.set(row.trackId, [entry]);
      }

      const localFlagRows =
        allTrackIds.length === 0
          ? []
          : await db.trackFlagAssignment.findMany({
              where: { track: { showId: { in: performerShowIds } } },
              select: { trackId: true, flag: true },
            });
      const localFlagsByTrackId = new Map<string, string[]>();
      for (const row of localFlagRows) {
        const arr = localFlagsByTrackId.get(row.trackId);
        if (arr) arr.push(row.flag);
        else localFlagsByTrackId.set(row.trackId, [row.flag]);
      }

      // 8c.4 — per show: apply the lineup diff, then per track the musician +
      // flag diffs. A flag change also widens the stats-rebuild window so the
      // derived recurrence columns recompute (the structural-only gate in step 8
      // would otherwise miss a flag-only edit on an already-local show).
      for (const [slug, local] of existingBySlug) {
        const setlist = setlistBySlug.get(slug);
        if (!setlist) continue;
        const isDryRunShow = String(local.id).startsWith("dry-run-show-");

        const localSM = localShowMusiciansByShowId.get(local.id) ?? [];
        const remoteSM = setlist.lineup?.map((m) => ({
          musicianSlug: m.musicianSlug,
          instrumentSlugs: m.instruments.map((i) => i.slug),
        }));
        const smDiff = diffShowMusicians(localSM, remoteSM);

        type TrackPerformerWork = {
          trackId: string;
          tmDiff: TrackMusicianDiff;
          flagDiff: { toAdd: string[]; toRemove: string[] };
        };
        const trackWork: TrackPerformerWork[] = [];
        for (const set of setlist.sets) {
          for (const track of set.tracks) {
            const trackId = trackKeyToLocalId.get(`${slug}|${set.label}|${track.position}`);
            if (!trackId) continue;
            const localTM = localTrackMusiciansByTrackId.get(trackId) ?? [];
            const remoteTM = track.trackMusicians?.map((tm) => ({
              musicianSlug: tm.musicianSlug,
              present: tm.present,
              instrumentSlugs: tm.instruments.map((i) => i.slug),
            }));
            const tmDiff = diffTrackMusicians(localTM, remoteTM);
            const flagDiff = diffTrackFlags(localFlagsByTrackId.get(trackId) ?? [], track.flags);
            if (
              tmDiff.toCreate.length > 0 ||
              tmDiff.toDeleteTrackMusicianIds.length > 0 ||
              tmDiff.toUpdate.length > 0 ||
              flagDiff.toAdd.length > 0 ||
              flagDiff.toRemove.length > 0
            ) {
              trackWork.push({ trackId, tmDiff, flagDiff });
            }
          }
        }

        const lineupChanged =
          smDiff.toCreate.length > 0 ||
          smDiff.toDeleteShowMusicianIds.length > 0 ||
          smDiff.toUpdateInstruments.length > 0;
        if (!lineupChanged && trackWork.length === 0) continue;

        // +adds -deletes ~instrument-only-updates, so a lineup change that only
        // re-instruments an existing member still shows in the log.
        const lineupSummary = `lineup +${smDiff.toCreate.length} -${smDiff.toDeleteShowMusicianIds.length} ~${smDiff.toUpdateInstruments.length}, ${trackWork.length} track delta(s)`;
        const flagChanged = trackWork.some((w) => w.flagDiff.toAdd.length > 0 || w.flagDiff.toRemove.length > 0);
        // Tally before the write so dry runs report the same numbers.
        stats.showMusiciansUpserted += smDiff.toCreate.length + smDiff.toUpdateInstruments.length;
        stats.showMusiciansDeleted += smDiff.toDeleteShowMusicianIds.length;
        for (const w of trackWork) {
          stats.trackMusiciansUpserted += w.tmDiff.toCreate.length + w.tmDiff.toUpdate.length;
          stats.trackMusiciansDeleted += w.tmDiff.toDeleteTrackMusicianIds.length;
          stats.trackFlagsAdded += w.flagDiff.toAdd.length;
          stats.trackFlagsRemoved += w.flagDiff.toRemove.length;
        }

        if (isDryRun || isDryRunShow) {
          console.log(`  🎙️  ${slug}: ${lineupSummary} (dry run)`);
          changedSlugs.add(slug);
          continue;
        }

        try {
          await db.$transaction(async (tx) => {
            if (smDiff.toDeleteShowMusicianIds.length > 0) {
              await tx.showMusician.deleteMany({ where: { id: { in: smDiff.toDeleteShowMusicianIds } } });
            }
            for (const c of smDiff.toCreate) {
              const musicianId = musicianSlugToId.get(c.musicianSlug);
              if (!musicianId) continue;
              const instrumentIds = instrumentIdsFor(c.instrumentSlugs);
              await tx.showMusician.create({
                data: {
                  showId: local.id,
                  musicianId,
                  createdAt: now,
                  updatedAt: now,
                  instruments:
                    instrumentIds.length > 0
                      ? { create: instrumentIds.map((instrumentId) => ({ instrumentId })) }
                      : undefined,
                },
              });
            }
            for (const u of smDiff.toUpdateInstruments) {
              const removeIds = instrumentIdsFor(u.removeInstrumentSlugs);
              const addIds = instrumentIdsFor(u.addInstrumentSlugs);
              if (removeIds.length > 0) {
                await tx.showMusicianInstrument.deleteMany({
                  where: { showMusicianId: u.showMusicianId, instrumentId: { in: removeIds } },
                });
              }
              if (addIds.length > 0) {
                await tx.showMusicianInstrument.createMany({
                  data: addIds.map((instrumentId) => ({ showMusicianId: u.showMusicianId, instrumentId })),
                });
              }
            }
            for (const w of trackWork) {
              if (w.tmDiff.toDeleteTrackMusicianIds.length > 0) {
                await tx.trackMusician.deleteMany({ where: { id: { in: w.tmDiff.toDeleteTrackMusicianIds } } });
              }
              for (const c of w.tmDiff.toCreate) {
                const musicianId = musicianSlugToId.get(c.musicianSlug);
                if (!musicianId) continue;
                const instrumentIds = instrumentIdsFor(c.instrumentSlugs);
                await tx.trackMusician.create({
                  data: {
                    trackId: w.trackId,
                    musicianId,
                    present: c.present,
                    createdAt: now,
                    updatedAt: now,
                    instruments:
                      instrumentIds.length > 0
                        ? { create: instrumentIds.map((instrumentId) => ({ instrumentId })) }
                        : undefined,
                  },
                });
              }
              for (const u of w.tmDiff.toUpdate) {
                if (u.present !== undefined) {
                  await tx.trackMusician.update({
                    where: { id: u.trackMusicianId },
                    data: { present: u.present, updatedAt: now },
                  });
                }
                const removeIds = instrumentIdsFor(u.removeInstrumentSlugs);
                const addIds = instrumentIdsFor(u.addInstrumentSlugs);
                if (removeIds.length > 0) {
                  await tx.trackMusicianInstrument.deleteMany({
                    where: { trackMusicianId: u.trackMusicianId, instrumentId: { in: removeIds } },
                  });
                }
                if (addIds.length > 0) {
                  await tx.trackMusicianInstrument.createMany({
                    data: addIds.map((instrumentId) => ({ trackMusicianId: u.trackMusicianId, instrumentId })),
                  });
                }
              }
              if (w.flagDiff.toRemove.length > 0) {
                await tx.trackFlagAssignment.deleteMany({
                  where: { trackId: w.trackId, flag: { in: w.flagDiff.toRemove as TrackFlag[] } },
                });
              }
              if (w.flagDiff.toAdd.length > 0) {
                await tx.trackFlagAssignment.createMany({
                  data: w.flagDiff.toAdd.map((flag) => ({
                    trackId: w.trackId,
                    flag: flag as TrackFlag,
                    createdAt: now,
                    updatedAt: now,
                  })),
                });
              }
            }
          });
          changedSlugs.add(slug);
          // A flag add/remove shifts the derived recurrence columns; widen the
          // rebuild window to this show's date so the end-of-batch recompute
          // picks it up (step 8 only widens on structural setlist changes).
          if (flagChanged) {
            const showDate = String(local.date);
            if (earliestInsertedDate === null || showDate < earliestInsertedDate) earliestInsertedDate = showDate;
          }
          console.log(`  🎙️  ${slug}: ${lineupSummary}`);
        } catch (err) {
          console.error(`  ❌ failed to mirror performers for ${slug}:`, err);
          stats.errors++;
        }
      }

      // Step 8d: completion links. Cross-show, so resolved after all tracks
      // exist, keyed by the UNIQUE earlier track. Gated on prod having served
      // completion data for at least one in-scope track — pre-deploy MCP omits
      // `completes` entirely (no opinion), and without the gate the empty
      // desired set would wrongly delete every local completion.
      const completionLinks: RemoteCompletionLink[] = [];
      let completionsServed = false;
      for (const [slug, setlist] of setlistBySlug) {
        for (const set of setlist.sets) {
          for (const track of set.tracks) {
            if (track.completes === undefined) continue;
            completionsServed = true;
            for (const c of track.completes) {
              completionLinks.push({
                later: { showSlug: slug, set: set.label, position: track.position },
                earlier: { showSlug: c.showSlug, set: c.set, position: c.position },
              });
            }
          }
        }
      }
      if (completionsServed && allTrackIds.length > 0) {
        const { resolved, skipped } = resolveCompletionLinks(completionLinks, trackKeyToLocalId);
        stats.completionsSkipped += skipped.length;
        // Only completions with BOTH ends in scope are authoritatively managed
        // here. A completion whose later track is in an un-synced show would
        // otherwise be absent from `resolved` (its link rides the later track's
        // payload, which we never fetched) and get wrongly deleted.
        const localCompletionRows = await db.trackCompletion.findMany({
          where: {
            earlierTrack: { showId: { in: performerShowIds } },
            laterTrack: { showId: { in: performerShowIds } },
          },
          select: { earlierTrackId: true, laterTrackId: true },
        });
        const compDiff = diffCompletions(localCompletionRows, resolved);
        stats.completionsUpserted += compDiff.toUpsert.length;
        stats.completionsDeleted += compDiff.toDeleteEarlierTrackIds.length;
        if (!isDryRun && (compDiff.toUpsert.length > 0 || compDiff.toDeleteEarlierTrackIds.length > 0)) {
          try {
            await db.$transaction(async (tx) => {
              if (compDiff.toDeleteEarlierTrackIds.length > 0) {
                await tx.trackCompletion.deleteMany({
                  where: { earlierTrackId: { in: compDiff.toDeleteEarlierTrackIds } },
                });
              }
              for (const link of compDiff.toUpsert) {
                await tx.trackCompletion.upsert({
                  where: { earlierTrackId: link.earlierTrackId },
                  update: { laterTrackId: link.laterTrackId, updatedAt: now },
                  create: {
                    earlierTrackId: link.earlierTrackId,
                    laterTrackId: link.laterTrackId,
                    createdAt: now,
                    updatedAt: now,
                  },
                });
              }
            });
            // Invalidate the show on each end of every touched link (both
            // upserts and deletes — the deleted link's later track lives in the
            // localCompletionRows snapshot).
            const showIdByTrackId = new Map(localTrackRows.map((t) => [t.id, t.showId]));
            const deletedSet = new Set(compDiff.toDeleteEarlierTrackIds);
            const touchedTrackIds = [
              ...compDiff.toUpsert.flatMap((l) => [l.earlierTrackId, l.laterTrackId]),
              ...localCompletionRows
                .filter((c) => deletedSet.has(c.earlierTrackId))
                .flatMap((c) => [c.earlierTrackId, c.laterTrackId]),
            ];
            for (const trackId of touchedTrackIds) {
              const slug = showIdToSlug.get(showIdByTrackId.get(trackId) ?? "");
              if (slug) changedSlugs.add(slug);
            }
          } catch (err) {
            console.error("  ❌ failed to mirror completion links:", err);
            stats.errors++;
          }
        }
        if (compDiff.toUpsert.length > 0 || compDiff.toDeleteEarlierTrackIds.length > 0) {
          console.log(
            `  🔗 completions: ~${compDiff.toUpsert.length} -${compDiff.toDeleteEarlierTrackIds.length}${skipped.length > 0 ? ` (skipped ${skipped.length} out-of-scope)` : ""}`,
          );
        }
      }
    }

    // Step 8b: ghost-show detection. Local shows in the synced years whose
    // slug isn't in prod's per-year list are renames / merges / deletes
    // upstream — the step 8 reconcile loop never touches them because it
    // only iterates prod's shows. Cascade-delete the sync-managed rows
    // (annotations → tracks → segueRuns → showYoutubes → show) when no
    // user data references the show; log + skip otherwise.
    const yearSet = new Set(years);
    const prodSlugSet = new Set(realSlugs);
    const inYearLocalShows = await db.show.findMany({
      where: {
        OR: years.map((y) => ({
          AND: [{ date: { gte: `${y}-01-01` } }, { date: { lte: `${y}-12-31` } }],
        })),
      },
      select: {
        id: true,
        slug: true,
        date: true,
        _count: {
          select: {
            tracks: true,
            attendances: true,
            favorites: true,
            reviews: true,
            showPhotos: true,
            showYoutubes: true,
          },
        },
      },
    });
    const ghostShows = inYearLocalShows.filter((s) => {
      if (!s.slug) return false;
      if (!prodSlugSet.has(s.slug)) {
        const showYear = Number(s.date.slice(0, 4));
        return yearSet.has(showYear);
      }
      return false;
    });
    if (ghostShows.length > 0) {
      console.log(`👻 ${ghostShows.length} ghost show(s) found in synced years (local but not on prod)`);
    }
    for (const ghost of ghostShows) {
      const userDataCount =
        ghost._count.attendances +
        ghost._count.favorites +
        ghost._count.reviews +
        ghost._count.showPhotos +
        ghost._count.showYoutubes;
      if (userDataCount > 0 && !pruneGhostShows) {
        stats.showsOrphanedWithUserData++;
        console.warn(
          `  ⚠️  show ${ghost.slug} (${ghost._count.tracks} tracks, ${userDataCount} user-data row(s)); skipping — re-run with --prune-ghost-shows to delete`,
        );
        continue;
      }
      if (isDryRun) {
        console.log(`  🗑️  show ${ghost.slug} (${ghost._count.tracks} tracks) would be deleted (not on prod) (dry run)`);
        stats.showsOrphanedDeleted++;
        continue;
      }
      try {
        await db.$transaction(async (tx) => {
          const localTrackRows = await tx.track.findMany({
            where: { showId: ghost.id },
            select: { id: true },
          });
          const trackIds = localTrackRows.map((t) => t.id);
          if (trackIds.length > 0) {
            // Ratings are polymorphic — drop Show + Track ratings for this show.
            await tx.rating.deleteMany({
              where: { rateableType: "Track", rateableId: { in: trackIds } },
            });
            await tx.annotation.deleteMany({ where: { trackId: { in: trackIds } } });
            await tx.track.deleteMany({ where: { showId: ghost.id } });
          }
          // Other Tracks may still reference the ghost as previousPerformanceShow.
          // Null those out — rebuildGapsAndSongStatsSince at end of run rebuilds.
          await tx.track.updateMany({
            where: { previousPerformanceShowId: ghost.id },
            data: { previousPerformanceShowId: null },
          });
          await tx.segueRun.deleteMany({ where: { showId: ghost.id } });
          // User-data tables: only present when --prune-ghost-shows opted in
          // (without the flag, the loop already `continue`d above). All five
          // tables have NoAction onDelete so we have to wipe them manually.
          await tx.attendance.deleteMany({ where: { showId: ghost.id } });
          await tx.favorite.deleteMany({ where: { showId: ghost.id } });
          await tx.review.deleteMany({ where: { showId: ghost.id } });
          await tx.showPhoto.deleteMany({ where: { showId: ghost.id } });
          await tx.showYoutube.deleteMany({ where: { showId: ghost.id } });
          await tx.rating.deleteMany({
            where: { rateableType: "Show", rateableId: ghost.id },
          });
          await tx.show.delete({ where: { id: ghost.id } });
        });
        changedSlugs.add(ghost.slug ?? "");
        songsChanged = true;
        if (earliestInsertedDate === null || ghost.date < earliestInsertedDate) {
          earliestInsertedDate = ghost.date;
        }
        stats.showsOrphanedDeleted++;
        console.log(`  🗑️  show ${ghost.slug} (${ghost._count.tracks} tracks) deleted (not on prod)`);
      } catch (err) {
        console.error(`  ❌ failed to delete ghost show ${ghost.slug}:`, err);
        stats.errors++;
      }
    }

    // Step 8c: orphan-song detection. Local songs whose slug prod doesn't
    // return on get_songs are renames / merges / deletes upstream. Delete the
    // zero-track orphans (safe — nothing references them) and log the rest
    // with their track count so the user can do the manual re-point. Runs
    // after ghost-show deletion so songs that became zero-track via that
    // cleanup get auto-deleted here.
    const localSongCountRows = await db.song.findMany({
      select: { id: true, slug: true, title: true, _count: { select: { tracks: true } } },
    });
    if (localSongCountRows.length > 0) {
      const { errors: orphanErrors } = await mcpBulkChunked<string, McpSong>(
        "get_songs",
        "slugs",
        localSongCountRows.map((s) => s.slug),
        "songs",
      );
      const orphanSlugs = new Set(orphanErrors.map((e) => e.slug));
      const localSongBySlugMap = new Map(localSongCountRows.map((s) => [s.slug, s]));
      for (const orphanSlug of orphanSlugs) {
        const local = localSongBySlugMap.get(orphanSlug);
        if (!local) continue;
        if (local._count.tracks === 0) {
          if (isDryRun) {
            console.log(`  🗑️  song ${orphanSlug} (0 tracks) would be deleted (not on prod) (dry run)`);
          } else {
            try {
              await db.song.delete({ where: { id: local.id } });
              songsChanged = true;
              console.log(`  🗑️  song ${orphanSlug} (0 tracks) deleted (not on prod)`);
            } catch (err) {
              console.error(`  ❌ failed to delete orphan song ${orphanSlug}:`, err);
              stats.errors++;
              continue;
            }
          }
          stats.songsOrphanedDeleted++;
        } else {
          stats.songsOrphanedWithTracks++;
          console.warn(
            `  ⚠️  song ${orphanSlug} ("${local.title}") has ${local._count.tracks} local track(s) but isn't on prod — likely a rename or merge upstream; manual cleanup needed`,
          );
        }
      }
    }

    // Step 8d: orphan-venue detection. Local venues whose slug prod doesn't
    // return on get_venues are renames / merges / deletes upstream. Delete the
    // zero-show orphans (FK-safe: shows are the only reference to a venue) and
    // log the rest for manual re-point. Runs after ghost-show deletion so
    // venues that became zero-show via that cleanup get auto-deleted here.
    const localVenueCountRows = await db.venue.findMany({
      select: { id: true, slug: true, name: true, _count: { select: { shows: true } } },
    });
    if (localVenueCountRows.length > 0) {
      const { errors: venueOrphanErrors } = await mcpBulkChunked<string, McpVenue>(
        "get_venues",
        "slugs",
        localVenueCountRows.map((v) => v.slug),
        "venues",
      );
      const orphanVenueSlugs = new Set(venueOrphanErrors.map((e) => e.slug));
      const { toDelete, toWarn } = planVenueOrphans(
        localVenueCountRows.map((v) => ({ id: v.id, slug: v.slug, name: v.name, showCount: v._count.shows })),
        orphanVenueSlugs,
      );
      for (const venue of toDelete) {
        if (isDryRun) {
          console.log(`  🗑️  venue ${venue.slug} (0 shows) would be deleted (not on prod) (dry run)`);
        } else {
          try {
            await db.venue.delete({ where: { id: venue.id } });
            console.log(`  🗑️  venue ${venue.slug} (0 shows) deleted (not on prod)`);
          } catch (err) {
            console.error(`  ❌ failed to delete orphan venue ${venue.slug}:`, err);
            stats.errors++;
            continue;
          }
        }
        stats.venuesOrphanedDeleted++;
      }
      for (const venue of toWarn) {
        stats.venuesOrphanedWithShows++;
        console.warn(
          `  ⚠️  venue ${venue.slug} ("${venue.name}") has ${venue.showCount} local show(s) but isn't on prod; likely a rename or merge upstream, manual cleanup needed`,
        );
      }
    }

    // Step 9: user-activity sync (users + ratings + attendances). Runs
    // after the show/song/venue/track passes so FK lookups can resolve
    // (every show/track a rating or attendance might reference is already
    // local). The pass updates changedSlugs with the affected show slugs so
    // the outer cache invalidation below clears the show.data + setlist.data
    // payloads that embed Show.averageRating + Track.averageRating.
    if (!skipUsers) {
      try {
        const userActivityStats = await syncUserActivity(db, {
          isDryRun,
          pullFromEpoch: fullUsers,
          pruneOrphans: fullUsers || pruneUsers,
          ratingService,
          cacheInvalidation,
          changedSlugs,
          now,
          prodShowIdToLocalId,
          prodTrackIdToLocalId,
        });
        stats.userActivity = userActivityStats;
      } catch (err) {
        console.error("💥 User activity sync failed:", err);
        stats.errors++;
      }
    } else {
      console.log("👤 Skipping user-activity pass (--no-users)");
    }

    // Cache invalidation: mirrors what ShowService.create + TrackService.create
    // call on the canonical app paths. Per-slug `invalidateShow` clears
    // show.data + setlist.data; `invalidateShowListings` covers shows:list:* +
    // home:*; `invalidateSongCaches` covers songs:index + songs:filtered:*.
    if (!isDryRun && cacheInvalidation && (changedSlugs.size > 0 || songsChanged)) {
      console.log(`🧹 Invalidating caches: ${changedSlugs.size} show slug(s)${songsChanged ? " + song caches" : ""}`);
      for (const slug of changedSlugs) {
        await cacheInvalidation.invalidateShow(slug);
      }
      if (changedSlugs.size > 0) {
        // Derive the Cloudflare year-tag set from every changed slug (slugs
        // start YYYY-MM-DD-…). User-activity sync can touch ratings on shows
        // older than the --years window, so the year set is wider than
        // `years` and we union both. invalidateShowListings purges the
        // matching /shows/year/:year edge entries.
        const yearsToPurge = new Set<number>(years);
        for (const slug of changedSlugs) {
          const y = Number(slug.slice(0, 4));
          if (Number.isFinite(y)) yearsToPurge.add(y);
        }
        await cacheInvalidation.invalidateShowListings(Array.from(yearsToPurge));
      }
      if (songsChanged) await cacheInvalidation.invalidateSongCaches();
    } else if (!isDryRun && !cacheInvalidation && (changedSlugs.size > 0 || songsChanged)) {
      console.warn(
        "⚠️  REDIS_URL not set; skipping cache invalidation. Cached pages may show stale data until TTL expires or you restart the app.",
      );
    }

    // Rebuild Track.gap + Song.* aggregates once for the whole batch. Bulk
    // operation — a single rebuild covering the earliest inserted date is
    // cheaper than N per-show rebuilds, and it captures every chain that
    // could have shifted as a result of these inserts.
    if (!isDryRun && earliestInsertedDate !== null) {
      console.log(`📐 Rebuilding gaps + song stats since ${earliestInsertedDate}`);
      try {
        await statsService.rebuildGapsAndSongStatsSince(earliestInsertedDate);
      } catch (err) {
        console.error("  ❌ stats rebuild failed:", err);
        stats.errors++;
      }
    }

    printSummary(stats, isDryRun);
  } catch (err) {
    console.error("💥 Sync failed:", err);
    stats.errors++;
  } finally {
    await db.$disconnect();
    if (redis) await redis.disconnect();
  }
}

function printSummary(stats: SyncStats, isDryRun: boolean): void {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📊 SUMMARY ${isDryRun ? "(DRY RUN)" : "(LIVE)"}`);
  console.log("=".repeat(50));
  console.log(`Years: ${stats.yearsSynced.join(", ")}`);
  console.log(`Remote shows: ${stats.showsRemote}`);
  console.log(`Stubs skipped: ${stats.stubsSkipped}`);
  console.log(`Already local: ${stats.showsAlreadyLocal}`);
  console.log(`Shows updated (drift): ${stats.showsUpdated}`);
  console.log(`Shows unchanged: ${stats.showsUnchanged}`);
  console.log(`Shows created: ${stats.showsCreated}`);
  console.log(`Shows renamed (slug realigned): ${stats.showsRenamed}`);
  console.log(`Songs fetched: ${stats.songsFetched}`);
  console.log(`Songs created: ${stats.songsCreated}`);
  console.log(
    `Songs orphaned (deleted / with tracks): ${stats.songsOrphanedDeleted} / ${stats.songsOrphanedWithTracks}`,
  );
  console.log(
    `Shows orphaned (deleted / with user data): ${stats.showsOrphanedDeleted} / ${stats.showsOrphanedWithUserData}`,
  );
  console.log(`Venues created: ${stats.venuesCreated}`);
  console.log(`Venues linked on shows: ${stats.venuesLinked}`);
  console.log(`Venues unmatched (left NULL): ${stats.venuesUnmatched}`);
  console.log(
    `Venues orphaned (deleted / with shows): ${stats.venuesOrphanedDeleted} / ${stats.venuesOrphanedWithShows}`,
  );
  console.log(`Setlists reconciled: ${stats.setlistsReconciled}`);
  console.log(`Setlists structurally changed: ${stats.setlistsStructurallyChanged}`);
  console.log(
    `Tracks created / updated / deleted: ${stats.tracksCreated} / ${stats.tracksUpdated} / ${stats.tracksDeleted}`,
  );
  console.log(`Annotations created / deleted: ${stats.annotationsCreated} / ${stats.annotationsDeleted}`);
  console.log(`SegueRuns regenerated: ${stats.segueRunsRegenerated}`);
  console.log(`Unresolved song slugs: ${stats.unresolvedSongSlugs}`);
  console.log(`Rock operas upserted: ${stats.rockOperasUpserted}`);
  console.log(
    `Rock opera assignments added / removed: ${stats.rockOperaAssignmentsAdded} / ${stats.rockOperaAssignmentsRemoved}`,
  );
  console.log(`Musicians / instruments created: ${stats.musiciansCreated} / ${stats.instrumentsCreated}`);
  console.log(`Show lineup (upserted / deleted): ${stats.showMusiciansUpserted} / ${stats.showMusiciansDeleted}`);
  console.log(`Track musicians (upserted / deleted): ${stats.trackMusiciansUpserted} / ${stats.trackMusiciansDeleted}`);
  console.log(`Track flags (added / removed): ${stats.trackFlagsAdded} / ${stats.trackFlagsRemoved}`);
  console.log(
    `Completions (upserted / deleted / skipped): ${stats.completionsUpserted} / ${stats.completionsDeleted} / ${stats.completionsSkipped}`,
  );
  if (stats.userActivity) {
    const ua = stats.userActivity;
    console.log(`Users (created / updated / deleted): ${ua.usersCreated} / ${ua.usersUpdated} / ${ua.usersDeleted}`);
    console.log(
      `Ratings (upserted / deleted / reconciled / FK skipped): ${ua.ratingsUpserted} / ${ua.ratingsDeleted} / ${ua.ratingsReconciled} / ${ua.ratingsFkSkipped}`,
    );
    console.log(
      `Attendances (upserted / deleted / reconciled / FK skipped): ${ua.attendancesUpserted} / ${ua.attendancesDeleted} / ${ua.attendancesReconciled} / ${ua.attendancesFkSkipped}`,
    );
    console.log(`Rating aggregates rebuilt: ${ua.aggregatesRebuilt}`);
  } else {
    console.log(`User activity sync: skipped`);
  }
  console.log(`Errors: ${stats.errors}`);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  await syncMissingShows();
}

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

import { Prisma } from "@prisma/client";
import { CacheInvalidationService, CacheService } from "../src/_shared/cache";
import prisma from "../src/_shared/prisma/client";
import { RedisService } from "../src/_shared/redis";
import { StatsService } from "../src/stats/stats-service";
import { createTestLogger } from "../src/_shared/test-logger";

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
}

export interface McpSetlistTrack {
  position: number;
  songTitle: string;
  songSlug: string;
  segue: string | null;
  // Admin-curated; optional on the wire so older MCP responses parse cleanly.
  allTimer?: boolean | null;
  note?: string | null;
  // Per-track annotations from the Annotation table. `undefined` means
  // "no opinion" (pre-deploy MCP); an explicit empty array means "prod has
  // zero". Replace-not-merge semantics on sync — see diffTrackAnnotations.
  annotations?: string[];
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
  cover?: boolean | null;
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

// --- Pure helpers (unit-tested) ---

export function isStubSlug(slug: string | null): boolean {
  return !!slug && /^\d{4}-\d{2}-\d{2}$/.test(slug);
}

export function parseYearsArg(argv: string[], now: Date): number[] {
  const flag = argv.find((a) => a.startsWith("--years="));
  if (!flag) return [now.getUTCFullYear()];
  const raw = flag.slice("--years=".length);
  const years = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const n = Number(s);
      if (!Number.isInteger(n)) throw new Error(`Invalid year in --years: ${s}`);
      return n;
    });
  if (years.length === 0) throw new Error("--years must contain at least one year");
  return years;
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

export function collectVenueKeys(
  setlists: McpSetlist[],
): Array<{ name: string; city: string; state: string }> {
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

// Shape-minimal view of a local Show row (only the aggregate fields we mirror)
// — used as the left operand to showNeedsUpdate.
export interface LocalShowAggregates {
  averageRating: number | null;
  ratingsCount: number;
  notes: string | null;
  relistenUrl: string | null;
  countForStats?: boolean;
  dayOrder?: number | null;
}

const AVERAGE_RATING_TOLERANCE = 1e-6;

export function showNeedsUpdate(local: LocalShowAggregates, remote: McpShow): boolean {
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
  const aggregatesDrift =
    local.ratingsCount !== remote.ratingsCount ||
    local.notes !== remote.notes ||
    local.relistenUrl !== remote.relistenUrl ||
    averageRatingDrift(local.averageRating, remote.averageRating);
  const countForStatsDrift =
    remote.countForStats !== undefined && (local.countForStats ?? true) !== remote.countForStats;
  const dayOrderDrift =
    remote.dayOrder !== undefined && (local.dayOrder ?? null) !== remote.dayOrder;
  const venueDrift = local.venueId === null && resolvedVenueId !== null;
  if (!aggregatesDrift && !countForStatsDrift && !dayOrderDrift && !venueDrift) return null;
  const update: ShowDriftUpdate = {};
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
    cover: song.cover ?? null,
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
  cover: boolean | null;
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
  cover?: boolean | null;
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
 * pre-deploy MCP that doesn't return `cover` shouldn't clobber a locally set
 * value. Explicit `null` from MCP IS drift (prod cleared the field).
 */
export function buildSongDriftUpdate(local: LocalSongCurated, remote: McpSong): SongDriftUpdate | null {
  const patch: SongDriftUpdate = {};
  if (local.title !== remote.title) patch.title = remote.title;
  if (local.lyrics !== remote.lyrics) patch.lyrics = remote.lyrics;
  if (remote.cover !== undefined && local.cover !== remote.cover) patch.cover = remote.cover;
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

export function buildTrackCreateInputs(
  setlist: McpSetlist,
  showId: string,
  songSlugToId: Map<string, string>,
): Prisma.TrackCreateManyInput[] {
  const tracks: Prisma.TrackCreateManyInput[] = [];
  for (const set of setlist.sets) {
    for (const track of set.tracks) {
      const songId = songSlugToId.get(track.songSlug);
      if (!songId) continue;
      tracks.push({
        showId,
        songId,
        set: set.label,
        position: track.position,
        segue: track.segue,
        // Defaults mirror the Prisma schema so a pre-deploy MCP (no allTimer
        // / note in payload) still produces explicit, predictable inserts.
        note: track.note ?? null,
        allTimer: track.allTimer ?? false,
      });
    }
  }
  return tracks;
}

// Shape-minimal local Track row used by the drift-update path. Keyed by
// (showId, position) at the call site — `id` is the primary key we patch.
export interface LocalTrackForDrift {
  id: string;
  position: number;
  segue: string | null;
  note: string | null;
  allTimer: boolean | null;
}

export interface TrackDriftPatch {
  segue?: string | null;
  note?: string | null;
  allTimer?: boolean;
}

/**
 * Diff the local tracks of a single show against the remote setlist payload
 * and return one {trackId, patch} per drifted track. Drift fields: segue,
 * note, allTimer. Pre-deploy MCP omits allTimer/note entirely — those keys
 * are treated as "no opinion" and never produce a patch, so an older upstream
 * can't clobber admin-set values.
 */
export function buildTrackDriftUpdates(
  local: LocalTrackForDrift[],
  remote: McpSetlist,
): Array<{ trackId: string; patch: TrackDriftPatch }> {
  const remoteByPosition = new Map<number, McpSetlistTrack>();
  for (const set of remote.sets) {
    for (const track of set.tracks) {
      remoteByPosition.set(track.position, track);
    }
  }
  const out: Array<{ trackId: string; patch: TrackDriftPatch }> = [];
  for (const localTrack of local) {
    const remoteTrack = remoteByPosition.get(localTrack.position);
    if (!remoteTrack) continue;
    const patch: TrackDriftPatch = {};
    if (localTrack.segue !== remoteTrack.segue) patch.segue = remoteTrack.segue;
    if (remoteTrack.note !== undefined && localTrack.note !== remoteTrack.note) {
      patch.note = remoteTrack.note;
    }
    if (remoteTrack.allTimer !== undefined) {
      const localFlag = localTrack.allTimer ?? false;
      const remoteFlag = remoteTrack.allTimer ?? false;
      if (localFlag !== remoteFlag) patch.allTimer = remoteFlag;
    }
    if (Object.keys(patch).length > 0) out.push({ trackId: localTrack.id, patch });
  }
  return out;
}

/**
 * Compute the minimum create/delete operations needed to replace one track's
 * local annotation set with whatever prod returned. Identity is by `desc`
 * text — Annotation has no other mutable content, so an edited description
 * surfaces as one delete + one create. `undefined` remote = "no opinion"
 * (older MCP) and produces empty deltas; an explicit empty array wipes local.
 */
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

// --- JSON-RPC transport ---

async function mcpCall<T>(toolName: string, args: Record<string, unknown>): Promise<T> {
  const response = await fetch(MCP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
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
  songsFetched: number;
  songsCreated: number;
  venuesCreated: number;
  venuesLinked: number;
  venuesUnmatched: number;
  tracksCreated: number;
  errors: number;
}

async function syncMissingShows(): Promise<void> {
  const isDryRun = process.argv.includes("--dry-run");
  // --full-track-sync: fetch setlists for every existing local show in scope,
  // not just missing-or-needs-venue. Catches Track.allTimer / Track.note /
  // Track.segue / annotation edits on shows that haven't otherwise changed.
  // Default run stays fast; opt in for periodic catch-up.
  const isFullTrackSync = process.argv.includes("--full-track-sync");
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

  const stats: SyncStats = {
    yearsSynced: years,
    showsRemote: 0,
    stubsSkipped: 0,
    showsAlreadyLocal: 0,
    showsUpdated: 0,
    showsUnchanged: 0,
    showsCreated: 0,
    songsFetched: 0,
    songsCreated: 0,
    venuesCreated: 0,
    venuesLinked: 0,
    venuesUnmatched: 0,
    tracksCreated: 0,
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

    // Step 2a: drop prod stub rows (bare YYYY-MM-DD slug). These are orphan
    // duplicates that coexist with the real show on the same date — they have
    // no venue and no setlist, so we don't mirror them locally.
    const realShows = remoteShows.filter((s) => {
      if (isStubSlug(s.slug)) {
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
    const { shows: remoteFullShows, errors: fullShowErrors } = await mcpCall<{
      shows: McpShow[];
      errors?: Array<{ slug: string; error: string }>;
    }>("get_shows", { slugs: realSlugs });
    if (fullShowErrors?.length) {
      console.warn(`⚠️  ${fullShowErrors.length} get_shows fetch errors:`, fullShowErrors);
      stats.errors += fullShowErrors.length;
    }
    const remoteBySlug = new Map<string, McpShow>(remoteFullShows.map((s) => [s.slug, s]));

    // Step 2c: partition into missing-locally vs already-local. We pull venueId
    // for existing rows so the drift-update branch can back-fill venues that
    // landed NULL under an older sync (caused 404s on /shows/:slug).
    const existingLocal = await db.show.findMany({
      where: { slug: { in: realSlugs } },
      select: {
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
      },
    });
    const existingBySlug = new Map(existingLocal.map((s) => [s.slug, s]));
    stats.showsAlreadyLocal = existingBySlug.size;
    const missingShows = remoteFullShows.filter((s) => !existingBySlug.has(s.slug));
    const existingRemoteShows = remoteFullShows.filter((s) => existingBySlug.has(s.slug));
    // Existing shows whose venue we still need to resolve so the drift loop
    // can back-fill venueId. Their setlists MUST be fetched alongside missing
    // shows so we know the (name, city, state) tuple to search by.
    const needsVenueSlugs = existingLocal.filter((s) => s.venueId === null).map((s) => s.slug);
    console.log(`📥 ${missingShows.length} missing locally (${stats.showsAlreadyLocal} already present, ${needsVenueSlugs.length} need venue back-fill)`);

    if (missingShows.length === 0 && needsVenueSlugs.length === 0 && !isFullTrackSync) {
      // Pure aggregate-drift run: do the simple update loop and bail out.
      // (When --full-track-sync is set we fall through to the full pipeline so
      // every existing show's setlist gets diffed for Track / Annotation drift.)
      for (const remote of existingRemoteShows) {
        const local = existingBySlug.get(remote.slug);
        if (!local) continue;
        const patch = buildShowDriftUpdate(local, remote, local.venueId);
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
          // countForStats flip on an existing show invalidates the gap chain
          // from that show's date forward — feed the date into the rebuild
          // trigger so the post-batch stats sweep picks it up. (Aggregate
          // drift alone doesn't shift gap math.)
          if (patch.countForStats !== undefined) {
            const showDate = String(local.date);
            if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
              earliestInsertedDate = showDate;
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
      // Even a pure aggregate-drift run can trip the rebuild trigger if a
      // countForStats flip was observed above.
      if (!isDryRun && earliestInsertedDate !== null) {
        console.log(`📐 Rebuilding gaps + song stats since ${earliestInsertedDate} (countForStats flip)`);
        try {
          await statsService.rebuildGapsAndSongStatsSince(earliestInsertedDate);
        } catch (err) {
          console.error("  ❌ stats rebuild failed:", err);
          stats.errors++;
        }
      }
      printSummary(stats, isDryRun);
      return;
    }

    // Step 3: fetch setlists for missing shows AND existing shows that need
    // venue back-fill, in one batched call. --full-track-sync adds every
    // remaining existing-local slug so Track / Annotation drift can be diffed
    // against the latest prod state, not just the inserts + venue back-fills.
    const fullTrackSyncSlugs = isFullTrackSync
      ? existingLocal.filter((s) => s.venueId !== null).map((s) => s.slug)
      : [];
    const setlistFetchSlugs = [
      ...missingShows.map((s) => s.slug),
      ...needsVenueSlugs,
      ...fullTrackSyncSlugs,
    ];
    const { setlists, errors: setlistErrors } = await mcpCall<{
      setlists: McpSetlist[];
      errors?: Array<{ slug: string; error: string }>;
    }>("get_setlists", { showSlugs: setlistFetchSlugs });
    if (setlistErrors?.length) {
      console.warn(`⚠️  ${setlistErrors.length} setlist fetch errors:`, setlistErrors);
      stats.errors += setlistErrors.length;
    }
    const setlistBySlug = new Map(setlists.map((s) => [s.showSlug, s]));

    // Step 4: default band lookup. Only one band in practice (Disco Biscuits);
    // bandId is nullable, so a missing band just means shows land without band FK.
    const band = await db.band.findFirst({ where: { slug: DEFAULT_BAND_SLUG } });
    if (!band) console.warn(`⚠️  No band with slug "${DEFAULT_BAND_SLUG}" in local DB; bandId will be NULL`);

    // Step 5: resolve venues. For each unique (name, city, state) from the
    // setlists, search_venues by name and disambiguate on city+state. Cache the
    // resolved (name|city|state) → venueSlug map, then upsert missing Venues
    // locally from get_venues.
    const venueKeys = collectVenueKeys(setlists);
    const venueKeyToSlug = new Map<string, string>(); // "name|city|state" -> slug
    for (const key of venueKeys) {
      try {
        const { results } = await mcpCall<{ results: McpSearchVenueResult[] }>("search_venues", {
          query: key.name,
          limit: 10,
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
      const { venues: remoteVenues, errors: venueErrors } = await mcpCall<{
        venues: McpVenue[];
        errors?: Array<{ slug: string; error: string }>;
      }>("get_venues", { slugs: neededVenueSlugs });
      if (venueErrors?.length) stats.errors += venueErrors.length;
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
      const resolvedVenueId = venueSlug ? venueSlugToId.get(venueSlug) ?? null : null;
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
    // source for buildSongDriftUpdate — admin edits to lyrics / cover /
    // featuredLyric on prod mirror locally without a second round-trip.
    const allSongSlugs = collectSongSlugs(setlists);
    const localSongRows = await db.song.findMany({
      where: { slug: { in: allSongSlugs } },
      select: {
        slug: true,
        id: true,
        title: true,
        lyrics: true,
        cover: true,
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
      const { songs: remoteSongs, errors: songErrors } = await mcpCall<{
        songs: McpSong[];
        errors?: Array<{ slug: string; error: string }>;
      }>("get_songs", { slugs: allSongSlugs });
      stats.songsFetched = remoteSongs.length;
      if (songErrors?.length) {
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

    // Step 7: per-show transaction — insert Show (with venueId + bandId resolved),
    // then its Tracks.
    for (const show of missingShows) {
      const slug = show.slug;
      const setlist = setlistBySlug.get(slug);
      const venueKey = setlist?.venue?.name
        ? `${setlist.venue.name}|${setlist.venue.city ?? ""}|${setlist.venue.state ?? ""}`
        : null;
      const venueSlug = venueKey ? venueKeyToSlug.get(venueKey) : null;
      const venueId = venueSlug ? venueSlugToId.get(venueSlug) ?? null : null;
      if (venueId) stats.venuesLinked++;

      try {
        if (isDryRun) {
          const trackCount = setlist ? buildTrackCreateInputs(setlist, "dry-run-show", songSlugToId).length : 0;
          console.log(`  🆕 show ${slug} (${trackCount} tracks, venue=${venueId ? "✓" : "—"}) (dry run)`);
          stats.showsCreated++;
          stats.tracksCreated += trackCount;
          continue;
        }
        await db.$transaction(async (tx) => {
          const createdShow = await tx.show.create({
            data: buildShowCreateInput(show, now, { venueId, bandId: band?.id ?? null }),
          });
          let trackCount = 0;
          if (setlist) {
            const trackInputs = buildTrackCreateInputs(setlist, createdShow.id, songSlugToId);
            if (trackInputs.length > 0) {
              const result = await tx.track.createMany({ data: trackInputs });
              trackCount = result.count;
            }
          }
          changedSlugs.add(slug);
          const showDate = String(show.date);
          if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
            earliestInsertedDate = showDate;
          }
          stats.showsCreated++;
          stats.tracksCreated += trackCount;
          console.log(`  ✅ ${slug} (${trackCount} tracks, venue=${venueId ? "✓" : "—"})`);
        });
      } catch (err) {
        console.error(`  ❌ failed to insert show ${slug}:`, err);
        stats.errors++;
      }
    }

    // Step 8: track + annotation drift for existing shows whose setlists
    // were fetched (venue back-fill + --full-track-sync). Catches admin edits
    // to Track.allTimer / Track.note / Track.segue and the per-track
    // Annotation set without re-doing the show row itself. countForStats is
    // pulled in so we know whether a flip should expand the rebuild window.
    const driftShowSlugs = Array.from(new Set([...needsVenueSlugs, ...fullTrackSyncSlugs]));
    if (driftShowSlugs.length > 0) {
      const driftShows = await db.show.findMany({
        where: { slug: { in: driftShowSlugs } },
        select: {
          slug: true,
          date: true,
          countForStats: true,
          tracks: {
            select: {
              id: true,
              position: true,
              segue: true,
              note: true,
              allTimer: true,
              annotations: { select: { id: true, desc: true } },
            },
          },
        },
      });
      for (const show of driftShows) {
        const setlist = setlistBySlug.get(show.slug);
        if (!setlist) continue;
        const trackPatches = buildTrackDriftUpdates(show.tracks, setlist);
        // Map track-id → its remote annotation list for the per-track annotation diff.
        const remoteAnnotationsByPosition = new Map<number, string[] | undefined>();
        for (const set of setlist.sets) {
          for (const track of set.tracks) {
            remoteAnnotationsByPosition.set(track.position, track.annotations);
          }
        }
        let touchedShow = false;
        for (const { trackId, patch } of trackPatches) {
          if (isDryRun) {
            console.log(`  🔄 track ${trackId} would update ${JSON.stringify(patch)} (dry run)`);
            touchedShow = true;
            continue;
          }
          try {
            await db.track.update({ where: { id: trackId }, data: { ...patch, updatedAt: now } });
            touchedShow = true;
            console.log(`  🔄 track ${trackId} ${JSON.stringify(patch)}`);
          } catch (err) {
            console.error(`  ❌ failed to update track ${trackId}:`, err);
            stats.errors++;
          }
        }
        // Annotation set replace: for each local track, compare to the remote
        // annotation strings and apply the minimal create/delete delta.
        for (const localTrack of show.tracks) {
          const remoteAnnotations = remoteAnnotationsByPosition.get(localTrack.position);
          const diff = diffTrackAnnotations(localTrack.annotations, remoteAnnotations);
          if (diff.toCreateDescs.length === 0 && diff.toDeleteIds.length === 0) continue;
          if (isDryRun) {
            console.log(
              `  🔄 track ${localTrack.id} annotations: +${diff.toCreateDescs.length} -${diff.toDeleteIds.length} (dry run)`,
            );
            touchedShow = true;
            continue;
          }
          try {
            if (diff.toDeleteIds.length > 0) {
              await db.annotation.deleteMany({ where: { id: { in: diff.toDeleteIds } } });
            }
            if (diff.toCreateDescs.length > 0) {
              await db.annotation.createMany({
                data: diff.toCreateDescs.map((desc) => ({
                  trackId: localTrack.id,
                  desc,
                  createdAt: now,
                  updatedAt: now,
                })),
              });
            }
            touchedShow = true;
            console.log(
              `  🔄 track ${localTrack.id} annotations: +${diff.toCreateDescs.length} -${diff.toDeleteIds.length}`,
            );
          } catch (err) {
            console.error(`  ❌ failed to sync annotations for track ${localTrack.id}:`, err);
            stats.errors++;
          }
        }
        if (touchedShow) {
          changedSlugs.add(show.slug);
          // Track / annotation drift on a stats-counting show shifts the gap
          // chain (e.g. an all-timer flag change is cosmetic, but a segue
          // change affects ordering; play it safe and expand the window).
          if (show.countForStats) {
            const showDate = String(show.date);
            if (earliestInsertedDate === null || showDate < earliestInsertedDate) {
              earliestInsertedDate = showDate;
            }
          }
        }
      }
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
      if (changedSlugs.size > 0) await cacheInvalidation.invalidateShowListings();
      if (songsChanged) await cacheInvalidation.invalidateSongCaches();
    } else if (!isDryRun && !cacheInvalidation && (changedSlugs.size > 0 || songsChanged)) {
      console.warn("⚠️  REDIS_URL not set; skipping cache invalidation. Cached pages may show stale data until TTL expires or you restart the app.");
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
  console.log(`Songs fetched: ${stats.songsFetched}`);
  console.log(`Songs created: ${stats.songsCreated}`);
  console.log(`Venues created: ${stats.venuesCreated}`);
  console.log(`Venues linked on shows: ${stats.venuesLinked}`);
  console.log(`Venues unmatched (left NULL): ${stats.venuesUnmatched}`);
  console.log(`Tracks created: ${stats.tracksCreated}`);
  console.log(`Errors: ${stats.errors}`);
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  await syncMissingShows();
}

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
import prisma from "../src/_shared/prisma/client";

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
// notes, relistenUrl.
export interface McpShow {
  slug: string;
  date: string;
  venueName: string | null;
  venueCity: string | null;
  averageRating: number | null;
  ratingsCount: number;
  notes: string | null;
  relistenUrl: string | null;
}

export interface McpSetlistTrack {
  position: number;
  songTitle: string;
  songSlug: string;
  segue: string | null;
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
}

export interface McpVenue {
  slug: string;
  name: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  timesPlayed: number;
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
  const wantCity = target.city.toLowerCase();
  const wantState = target.state.toLowerCase();
  const matches = candidates.filter(
    (c) =>
      (c.city ?? "").toLowerCase() === wantCity && (c.state ?? "").toLowerCase() === wantState,
  );
  if (matches.length === 1) return matches[0]?.slug ?? null;
  return null;
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
}

const AVERAGE_RATING_TOLERANCE = 1e-6;

export function showNeedsUpdate(local: LocalShowAggregates, remote: McpShow): boolean {
  if (local.ratingsCount !== remote.ratingsCount) return true;
  if (local.notes !== remote.notes) return true;
  if (local.relistenUrl !== remote.relistenUrl) return true;
  const la = local.averageRating;
  const ra = remote.averageRating;
  if (la === null || ra === null) return la !== ra;
  return Math.abs(la - ra) > AVERAGE_RATING_TOLERANCE;
}

export function buildSongCreateInput(song: McpSong, now: Date): Prisma.SongUncheckedCreateInput {
  return {
    slug: song.slug,
    title: song.title,
    lyrics: song.lyrics,
    timesPlayed: song.timesPlayed,
    dateFirstPlayed: song.dateFirstPlayed ? new Date(song.dateFirstPlayed) : null,
    dateLastPlayed: song.dateLastPlayed ? new Date(song.dateLastPlayed) : null,
    createdAt: now,
    updatedAt: now,
  };
}

export function buildVenueCreateInput(venue: McpVenue, now: Date): Prisma.VenueUncheckedCreateInput {
  return {
    slug: venue.slug,
    name: venue.name,
    city: venue.city,
    state: venue.state,
    country: venue.country,
    timesPlayed: venue.timesPlayed,
    createdAt: now,
    updatedAt: now,
  };
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
      });
    }
  }
  return tracks;
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
  const years = parseYearsArg(process.argv.slice(2), new Date());
  const now = new Date();
  const db = prisma;

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

    // Step 2c: partition into missing-locally vs already-local.
    const existingLocal = await db.show.findMany({
      where: { slug: { in: realSlugs } },
      select: { id: true, slug: true, averageRating: true, ratingsCount: true, notes: true, relistenUrl: true },
    });
    const existingBySlug = new Map(existingLocal.map((s) => [s.slug, s]));
    stats.showsAlreadyLocal = existingBySlug.size;
    const missingShows = remoteFullShows.filter((s) => !existingBySlug.has(s.slug));
    const existingRemoteShows = remoteFullShows.filter((s) => existingBySlug.has(s.slug));
    console.log(`📥 ${missingShows.length} missing locally (${stats.showsAlreadyLocal} already present)`);

    // Step 2d: drift-detection update loop for existing local shows. Only
    // rewrites the four aggregate fields we mirror from prod; does NOT touch
    // tracks, songs, or venues for already-local shows.
    for (const remote of existingRemoteShows) {
      const local = existingBySlug.get(remote.slug);
      if (!local) continue;
      if (!showNeedsUpdate(local, remote)) {
        stats.showsUnchanged++;
        continue;
      }
      if (isDryRun) {
        console.log(`  🔄 ${remote.slug} would update (rating ${local.averageRating}→${remote.averageRating}, count ${local.ratingsCount}→${remote.ratingsCount}) (dry run)`);
        stats.showsUpdated++;
        continue;
      }
      try {
        await db.show.update({
          where: { slug: remote.slug },
          data: {
            averageRating: remote.averageRating,
            ratingsCount: remote.ratingsCount,
            notes: remote.notes,
            relistenUrl: remote.relistenUrl,
            updatedAt: now,
          },
        });
        stats.showsUpdated++;
        console.log(`  🔄 ${remote.slug} (rating ${local.averageRating}→${remote.averageRating}, count ${local.ratingsCount}→${remote.ratingsCount})`);
      } catch (err) {
        console.error(`  ❌ failed to update show ${remote.slug}:`, err);
        stats.errors++;
      }
    }
    console.log(`📊 Existing shows: ${stats.showsUpdated} updated, ${stats.showsUnchanged} unchanged`);

    if (missingShows.length === 0) {
      printSummary(stats, isDryRun);
      return;
    }

    // Step 3: fetch setlists for the missing shows in a single batch.
    const missingSlugs = missingShows.map((s) => s.slug);
    const { setlists, errors: setlistErrors } = await mcpCall<{
      setlists: McpSetlist[];
      errors?: Array<{ slug: string; error: string }>;
    }>("get_setlists", { showSlugs: missingSlugs });
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

    // Any resolved venue slugs missing locally get pulled from get_venues and inserted.
    const neededVenueSlugs = Array.from(new Set(venueKeyToSlug.values()));
    const localVenues = await db.venue.findMany({
      where: { slug: { in: neededVenueSlugs } },
      select: { slug: true, id: true },
    });
    const venueSlugToId = new Map<string, string>(localVenues.map((v) => [v.slug, v.id]));
    const missingVenueSlugs = neededVenueSlugs.filter((slug) => !venueSlugToId.has(slug));
    if (missingVenueSlugs.length > 0) {
      const { venues: remoteVenues, errors: venueErrors } = await mcpCall<{
        venues: McpVenue[];
        errors?: Array<{ slug: string; error: string }>;
      }>("get_venues", { slugs: missingVenueSlugs });
      if (venueErrors?.length) stats.errors += venueErrors.length;
      for (const venue of remoteVenues) {
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
      }
    }

    // Step 6: resolve songs (local + remote) into an id map the track builder
    // can consume. Songs already in the DB reuse their existing id; new songs
    // get created via get_songs fetch.
    const allSongSlugs = collectSongSlugs(setlists);
    const localSongs = await db.song.findMany({
      where: { slug: { in: allSongSlugs } },
      select: { slug: true, id: true },
    });
    const songSlugToId = new Map<string, string>(localSongs.map((s) => [s.slug, s.id]));
    const missingSongSlugs = allSongSlugs.filter((slug) => !songSlugToId.has(slug));
    console.log(`🎵 ${allSongSlugs.length} distinct songs in setlists; ${missingSongSlugs.length} missing locally`);

    if (missingSongSlugs.length > 0) {
      const { songs: remoteSongs, errors: songErrors } = await mcpCall<{
        songs: McpSong[];
        errors?: Array<{ slug: string; error: string }>;
      }>("get_songs", { slugs: missingSongSlugs });
      stats.songsFetched = remoteSongs.length;
      if (songErrors?.length) {
        console.warn(`⚠️  ${songErrors.length} song fetch errors:`, songErrors);
        stats.errors += songErrors.length;
      }
      for (const song of remoteSongs) {
        if (isDryRun) {
          songSlugToId.set(song.slug, `dry-run-song-${song.slug}`);
          stats.songsCreated++;
          continue;
        }
        try {
          const created = await db.song.create({ data: buildSongCreateInput(song, now) });
          songSlugToId.set(created.slug, created.id);
          stats.songsCreated++;
        } catch (err) {
          console.error(`  ❌ failed to create song ${song.slug}:`, err);
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
          stats.showsCreated++;
          stats.tracksCreated += trackCount;
          console.log(`  ✅ ${slug} (${trackCount} tracks, venue=${venueId ? "✓" : "—"})`);
        });
      } catch (err) {
        console.error(`  ❌ failed to insert show ${slug}:`, err);
        stats.errors++;
      }
    }

    printSummary(stats, isDryRun);
  } catch (err) {
    console.error("💥 Sync failed:", err);
    stats.errors++;
  } finally {
    await db.$disconnect();
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

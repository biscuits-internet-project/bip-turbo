import type { Logger } from "@bip/domain";
import type { CacheInvalidationService } from "../_shared/cache";
import { yearFromShowDate } from "../_shared/cache";
import { CATALOG_TTL_SECONDS } from "../_shared/catalog/date-indexed-catalog";
import type { DbClient } from "../_shared/database/models";
import { SHOW_ORDER_DESC, setSortKey } from "../_shared/show-ordering";
import type { ArchiveDotOrgService } from "../shows/archive-dot-org-service";
import type { NugsService } from "../shows/nugs-service";
import { type MatchableTrack, matchTrackDurations } from "./duration-matching";
import { recomputeShowDuration } from "./show-duration";

/** Which source filled a track's duration, lowest-to-highest authority. */
type DurationSource = "archive" | "nugs" | "manual";
const SOURCE_RANK: Record<DurationSource, number> = { archive: 1, nugs: 2, manual: 3 };

/**
 * Re-attempt resolution for a show this stale. Matches the catalog cache
 * lifetime, so a show becomes eligible to upgrade (e.g. archive to a
 * freshly-posted nugs release) on the same cadence the source catalogs
 * refresh. The per-container/per-recording detail fetches stay Redis-cached,
 * so a re-check that finds nothing new is cheap.
 */
const RECHECK_AFTER_MS = CATALOG_TTL_SECONDS * 1000;

/** Cap archive recordings averaged per show; diminishing returns past a few. */
const MAX_ARCHIVE_RECORDINGS = 4;

/**
 * Decide whether a freshly-resolved source may overwrite a track's existing
 * duration. Manual edits are never clobbered; a higher-authority source
 * replaces a lower one (nugs over archive); same-or-lower is left alone.
 */
function shouldOverwrite(existing: string | null, incoming: DurationSource): boolean {
  if (existing === "manual") return false;
  if (!existing) return true;
  return SOURCE_RANK[incoming] > (SOURCE_RANK[existing as DurationSource] ?? 0);
}

/**
 * Populates per-track durations for a show by matching our setlist against the
 * track lists external sources publish, persisting the result and the
 * denormalized show total. nugs.net is authoritative; archive.org (averaged
 * across the show's recordings) covers everything nugs lacks. Resolution is
 * lazy and idempotent — triggered as shows are browsed, throttled per show,
 * and a no-op once a show is up to date — so the catalog fills in over normal
 * traffic without a backfill.
 */
export class TrackDurationService {
  constructor(
    private readonly db: DbClient,
    private readonly nugs: NugsService,
    private readonly archive: ArchiveDotOrgService,
    private readonly cacheInvalidation: CacheInvalidationService,
    private readonly logger: Logger,
  ) {}

  /**
   * Resolve durations for up to `limit` of the given shows that are unresolved
   * or due for a re-check, marking each checked up front so concurrent requests
   * don't pile onto the same shows. Bounds external-fetch burst per request;
   * the rest of a page's shows get picked up on later loads.
   */
  async resolvePending(showIds: string[], limit = 5): Promise<void> {
    if (showIds.length === 0) return;

    const threshold = new Date(Date.now() - RECHECK_AFTER_MS);
    const candidates = await this.db.show.findMany({
      where: {
        id: { in: showIds },
        OR: [{ durationCheckedAt: null }, { durationCheckedAt: { lt: threshold } }],
      },
      // Newest-first: recent shows are the most likely to have a nugs release
      // (the best source) and the most likely to be viewed, so they pay off
      // first. Also makes the per-request pick deterministic.
      orderBy: SHOW_ORDER_DESC,
      select: { id: true, slug: true, date: true },
      take: limit,
    });

    for (const show of candidates) {
      try {
        await this.resolveShow(show.id, show.slug, show.date);
      } catch (error) {
        this.logger.error("track duration resolution failed", { showId: show.id, error });
      }
    }
  }

  /**
   * Resolve one show end to end: match the best available source, write the
   * durations precedence allows, recompute the show total, stamp the check
   * time, and invalidate the show's caches so the new times surface.
   */
  private async resolveShow(showId: string, slug: string | null, date: string): Promise<void> {
    const tracks = await this.loadOrderedTracks(showId);

    let assignments: Map<string, number> | null = null;
    let source: DurationSource | null = null;

    if (tracks.length > 0) {
      const nugsAssignments = await this.resolveFromNugs(date, tracks);
      if (nugsAssignments && nugsAssignments.size > 0) {
        assignments = nugsAssignments;
        source = "nugs";
      } else {
        const archiveAssignments = await this.resolveFromArchive(date, tracks);
        if (archiveAssignments && archiveAssignments.size > 0) {
          assignments = archiveAssignments;
          source = "archive";
        }
      }
    }

    let wroteAnyTrack = false;
    if (assignments && source) {
      const sourceTracks = source;
      const writes = tracks
        .filter((t) => assignments?.has(t.key) && shouldOverwrite(t.durationSource, sourceTracks))
        .map((t) =>
          this.db.track.update({
            where: { id: t.key },
            data: { duration: assignments?.get(t.key), durationSource: sourceTracks },
          }),
        );
      if (writes.length > 0) {
        await Promise.all(writes);
        await recomputeShowDuration(this.db, showId);
        wroteAnyTrack = true;
      }
    }

    await this.db.show.update({ where: { id: showId }, data: { durationCheckedAt: new Date() } });

    if (wroteAnyTrack && slug) {
      const year = yearFromShowDate(date);
      await this.cacheInvalidation.invalidateShowComprehensive(showId, slug, [year]);
    }
  }

  /** Load the show's tracks in setlist order with the data the matcher needs. */
  private async loadOrderedTracks(showId: string): Promise<(MatchableTrack & { durationSource: string | null })[]> {
    const rows = await this.db.track.findMany({
      where: { showId },
      select: { id: true, set: true, position: true, durationSource: true, song: { select: { title: true } } },
    });
    return rows
      .filter((r) => r.song?.title)
      .sort((a, b) => setSortKey(a.set) - setSortKey(b.set) || a.position - b.position)
      .map((r) => ({ key: r.id, title: r.song?.title ?? "", durationSource: r.durationSource }));
  }

  /**
   * Authoritative source: merge matches across every nugs release for the
   * date. A rare dual-billed night ships two releases (a Disco Biscuits
   * container and a Tractorbeam one), each holding only its own sets, so
   * combining them covers tracks no single release does. An overlapping track
   * keeps the first release's value — both are official, so they agree.
   */
  private async resolveFromNugs(date: string, tracks: MatchableTrack[]): Promise<Map<string, number> | null> {
    const releases = await this.nugs.findReleasesForDate(date);
    const combined = new Map<string, number>();
    for (const release of releases) {
      const external = await this.nugs.fetchContainerTracks(release.containerId);
      if (external.length === 0) continue;
      for (const [key, seconds] of matchTrackDurations(tracks, external)) {
        if (!combined.has(key)) combined.set(key, seconds);
      }
    }
    return combined.size > 0 ? combined : null;
  }

  /**
   * Fallback source: match each of the show's archive recordings (primary
   * first, capped) and average each track's duration across the recordings
   * that produced one, so a single noisy tape doesn't skew the value.
   */
  private async resolveFromArchive(date: string, tracks: MatchableTrack[]): Promise<Map<string, number> | null> {
    const recordings = await this.archive.findRecordingsForDate(date);
    if (recordings.length === 0) return null;

    const primary = this.archive.pickPrimary(recordings);
    const ordered = primary ? [primary, ...recordings.filter((r) => r.identifier !== primary.identifier)] : recordings;

    const samples = new Map<string, number[]>();
    for (const recording of ordered.slice(0, MAX_ARCHIVE_RECORDINGS)) {
      const external = await this.archive.fetchRecordingTracks(recording.identifier);
      if (external.length === 0) continue;
      const matched = matchTrackDurations(tracks, external);
      for (const [key, seconds] of matched) {
        const list = samples.get(key) ?? [];
        list.push(seconds);
        samples.set(key, list);
      }
    }

    if (samples.size === 0) return null;
    const averaged = new Map<string, number>();
    for (const [key, values] of samples) {
      averaged.set(key, Math.round(values.reduce((a, b) => a + b, 0) / values.length));
    }
    return averaged;
  }
}

import type {
  Annotation,
  FlagRecurrence,
  Logger,
  SegueRecurrence,
  Track,
  TrackFlag,
  TrackMusicianDelta as TrackMusicianDeltaView,
} from "@bip/domain";
import { type CacheInvalidationService, yearFromShowDate } from "../_shared/cache";
import type { DbAnnotation, DbClient, DbSong, DbTrack } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";
import {
  ANNOTATION_ORDER_BY,
  mapTrackMusicianToDelta,
  mapTrackToDomainEntity as mapTrackRowToFootnoteDomain,
  TRACK_FOOTNOTE_INCLUDE,
  TRACK_PERFORMER_INCLUDE,
} from "../setlists/setlist-service";
import type { StatsService } from "../stats/stats-service";
import { recomputeShowDuration } from "./show-duration";

/** A track's structured-flag footnote inputs: the flags plus their gated recurrence. */
export interface TrackFlagData {
  flags: TrackFlag[];
  flagRecurrences: FlagRecurrence[];
  segueRecurrences: SegueRecurrence[];
}

/** An earlier same-song performance offered in the completions picker. */
export interface EarlierPerformance {
  trackId: string;
  showDate: string;
  showSlug: string;
}

/** How many recent earlier performances the completions picker offers. */
const EARLIER_PERFORMANCES_LIMIT = 10;

/** Shape a track-with-show row as an EarlierPerformance, dropping any with no show slug. */
function mapToEarlierPerformance(track: {
  id: string;
  show: { date: string; slug: string | null } | null;
}): EarlierPerformance[] {
  const show = track.show;
  if (!show?.slug) return [];
  return [{ trackId: track.id, showDate: show.date, showSlug: show.slug }];
}

export interface TrackMusicianDelta {
  musicianId: string;
  /** true → sat in (also played); false → sat out. */
  present: boolean;
  /** Instruments the musician played on this track (a sit-in can be on several, e.g. guitar + vocals). Empty for a sat-out. */
  instrumentIds?: string[];
}

// Database query result that includes song and annotations
type DbTrackWithSongAndAnnotations = DbTrack & {
  song?: DbSong | null;
  annotations?: DbAnnotation[] | null;
};

// Mapper functions
function mapTrackToDomainEntity(
  dbTrack: DbTrack & { previousPerformanceShow?: { date: string; slug: string | null } | null },
): Track {
  const { slug, createdAt, updatedAt, previousPerformanceShow, ...rest } = dbTrack;

  return {
    ...rest,
    slug: slug || "",
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    previousPerformanceShow: previousPerformanceShow?.slug
      ? { date: String(previousPerformanceShow.date), slug: previousPerformanceShow.slug }
      : null,
    flags: [],
    flagRecurrences: [],
    segueRecurrences: [],
    completes: [],
    completedBy: [],
  };
}

function mapAnnotationToDomainEntity(dbAnnotation: DbAnnotation): Annotation {
  const { createdAt, updatedAt, ...rest } = dbAnnotation;

  return {
    ...rest,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

function mapTrackToDbModel(entity: Partial<Track>): Partial<DbTrack> {
  return entity as Partial<DbTrack>;
}

export class TrackService {
  constructor(
    protected readonly db: DbClient,
    protected readonly logger: Logger,
    protected readonly cacheInvalidation?: CacheInvalidationService,
    /**
     * Optional. Required only by `setTrackFlags`, which recomputes the edited
     * song's recurrence after a flag change. Other write paths don't need it,
     * so script contexts that wire TrackService without stats stay usable.
     */
    protected readonly stats?: StatsService,
  ) {}

  private async invalidateShowCaches(showId: string): Promise<void> {
    if (!this.cacheInvalidation) return;

    // slug keys the per-show Redis entries; date keys the Cloudflare
    // `year-YYYY` listing tag.
    const show = await this.db.show.findUnique({
      where: { id: showId },
      select: { slug: true, date: true },
    });

    if (show?.slug) {
      const year = yearFromShowDate(show.date);
      await this.cacheInvalidation.invalidateShowComprehensive(showId, show.slug, [year]);
    }
  }

  private async invalidatePerformanceListings(): Promise<void> {
    if (!this.cacheInvalidation) return;
    await this.cacheInvalidation.invalidatePerformanceListings();
  }

  private async generateTrackSlug(
    showId: string,
    songId: string,
    showDate: string,
    songTitle: string,
  ): Promise<string> {
    const baseSlug = slugify(`${showDate}-${songTitle}`);

    // Count how many times this song already appears in the show
    const existingTracks = await this.db.track.findMany({
      where: {
        showId,
        songId,
      },
      orderBy: { position: "asc" },
    });

    // Add random chars to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);

    // If this is a repeat, add a number suffix + random chars
    if (existingTracks.length > 0) {
      return `${baseSlug}-${existingTracks.length + 1}-${randomSuffix}`;
    }

    return `${baseSlug}-${randomSuffix}`;
  }

  async findById(id: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { id },
      include: {
        annotations: { orderBy: ANNOTATION_ORDER_BY },
        song: true,
      },
    });

    if (!result) return null;

    this.logger?.info("Raw DB result has ratingsCount", {
      hasRatingsCount: "ratingsCount" in result,
      ratingsCount: result.ratingsCount,
    });

    const track = mapTrackToDomainEntity(result);

    this.logger?.info("Mapped domain entity has ratingsCount", {
      hasRatingsCount: "ratingsCount" in track,
      ratingsCount: track.ratingsCount,
    });
    if (result.annotations) {
      track.annotations = result.annotations.map(mapAnnotationToDomainEntity);
    }
    // Note: song is excluded here - computed fields like actualLastPlayedDate
    // should be populated by song-page-composer when needed
    return track;
  }

  async findBySlug(slug: string): Promise<Track | null> {
    const result = await this.db.track.findUnique({
      where: { slug },
    });
    return result ? mapTrackToDomainEntity(result) : null;
  }

  async findMany(filter: QueryOptions<Track>): Promise<Track[]> {
    const where = filter?.filters ? buildWhereClause(filter.filters) : {};
    const orderBy = filter?.sort ? buildOrderByClause(filter.sort) : [{ createdAt: "desc" }];
    const skip =
      filter?.pagination?.page && filter?.pagination?.limit
        ? (filter.pagination.page - 1) * filter.pagination.limit
        : undefined;
    const take = filter?.pagination?.limit;
    const include = filter?.includes ? buildIncludeClause(filter.includes) : undefined;

    const results = await this.db.track.findMany({
      where,
      orderBy,
      skip,
      take,
      include,
    });

    return results.map((result) => {
      const track = mapTrackToDomainEntity(result as DbTrack);
      // Attach related data if included
      if ((result as DbTrackWithSongAndAnnotations).annotations) {
        track.annotations = (result as DbTrackWithSongAndAnnotations).annotations?.map(mapAnnotationToDomainEntity);
      }
      if ((result as unknown as { show?: unknown }).show) {
        (track as unknown as { show?: unknown }).show = (result as unknown as { show?: unknown }).show;
      }
      return track;
    });
  }

  async create(data: Partial<Track>): Promise<Track> {
    let slug: string | undefined;

    if (data.showId && data.songId) {
      const [show, song] = await Promise.all([
        this.db.show.findUnique({ where: { id: data.showId }, select: { date: true } }),
        this.db.song.findUnique({ where: { id: data.songId }, select: { title: true } }),
      ]);

      if (show && song) {
        slug = await this.generateTrackSlug(data.showId, data.songId, show.date, song.title);
      }
    }

    // An explicit duration at create time is an admin entry — mark it `manual`
    // so live resolution leaves it alone.
    const dbData = mapTrackToDbModel({
      ...data,
      slug,
      ...(data.duration != null ? { durationSource: "manual" } : {}),
    });
    const result = await this.db.track.create({
      // biome-ignore lint/suspicious/noExplicitAny: Prisma type requires any for dynamic data mapping
      data: dbData as any,
    });

    const track = mapTrackToDomainEntity(result);

    // Keep the denormalized show total consistent when a duration was set.
    if (data.duration != null && data.showId) {
      await recomputeShowDuration(this.db, data.showId);
    }

    // Invalidate show caches (track changes affect setlist data)
    if (this.cacheInvalidation && data.showId) {
      await this.invalidateShowCaches(data.showId);
    }

    // A new track's duration, all_timer flag, or note can all surface on the
    // All-Timers / Jam Charts / On-This-Day listings — wipe them.
    await this.invalidatePerformanceListings();

    return track;
  }

  async update(id: string, data: Partial<Track>): Promise<Track> {
    // Remove relation fields and computed fields that shouldn't be updated directly
    const { ...updateableData } = data;
    const updateData = mapTrackToDbModel(updateableData);

    // Get current track info for cache invalidation + duration-change detection.
    const currentTrack = await this.db.track.findUnique({
      where: { id },
      select: { showId: true, duration: true },
    });

    // The edit form always re-sends the duration, even when an admin only
    // touched the song/segue/note — so flip provenance only when the value
    // actually changed. A new value is a manual edit; clearing it resets the
    // source to null so live resolution can refill it; an unchanged value
    // leaves both the duration and its source untouched.
    const durationChanged = data.duration !== undefined && data.duration !== (currentTrack?.duration ?? null);
    if (durationChanged) {
      updateData.durationSource = data.duration === null ? null : "manual";
    } else {
      updateData.duration = undefined;
    }

    const result = await this.db.track.update({
      where: { id },
      // biome-ignore lint/suspicious/noExplicitAny: Prisma type requires any for dynamic data mapping
      data: updateData as any,
    });

    const track = mapTrackToDomainEntity(result);

    // Keep the denormalized show total in step with an edited track duration.
    if (durationChanged && currentTrack?.showId) {
      await recomputeShowDuration(this.db, currentTrack.showId);
    }

    // Invalidate show caches
    if (currentTrack?.showId) {
      await this.invalidateShowCaches(currentTrack.showId);
    }

    // An edited duration, all_timer flag, or note can all surface on the
    // All-Timers / Jam Charts / On-This-Day listings — wipe them.
    await this.invalidatePerformanceListings();

    return track;
  }

  async findByShowId(showId: string): Promise<Track[]> {
    const results = await this.db.track.findMany({
      where: { showId },
      orderBy: [{ position: "asc" }],
      include: {
        song: true,
        annotations: { orderBy: ANNOTATION_ORDER_BY },
      },
    });

    // Sort by set properly (S1, S2, S3, E1, E2, E3) then by position
    const sortedResults = results.sort((a, b) => {
      if (a.set !== b.set) {
        const setOrder = { S: 0, E: 1 };
        const aType = a.set.charAt(0) as "S" | "E";
        const bType = b.set.charAt(0) as "S" | "E";
        const aNum = Number.parseInt(a.set.slice(1), 10);
        const bNum = Number.parseInt(b.set.slice(1), 10);

        if (aType !== bType) {
          return setOrder[aType] - setOrder[bType];
        }
        return aNum - bNum;
      }
      return a.position - b.position;
    });

    return sortedResults.map((result: DbTrackWithSongAndAnnotations) => {
      const track = mapTrackToDomainEntity(result);
      if (result.annotations) {
        track.annotations = result.annotations.map(mapAnnotationToDomainEntity);
      }
      // Note: song is excluded here - computed fields like actualLastPlayedDate
      // should be populated by song-page-composer when needed
      return track;
    });
  }

  async delete(id: string): Promise<void> {
    // Get track info before deletion for cache invalidation
    const track = await this.db.track.findUnique({
      where: { id },
      select: { showId: true },
    });

    await this.db.track.delete({
      where: { id },
    });

    // Invalidate show caches
    if (track?.showId) {
      await this.invalidateShowCaches(track.showId);
    }

    // A deleted track may have appeared on the All-Timers / Jam Charts /
    // On-This-Day listings — wipe them.
    await this.invalidatePerformanceListings();
  }

  /**
   * Full-set replace of a track's performer deltas (sit-ins / sat-outs).
   * Deletes the track's existing TrackMusician rows, then inserts the passed
   * ones. Rejects a `present=true` (sat-in) delta for a musician already in
   * the show's lineup — that musician is already implied, so a sit-in row
   * would be redundant and would double-render in footnotes. Mirrors the
   * delete-all-then-insert shape of AnnotationService.upsertMultipleForTrack.
   */
  async setTrackMusicianDeltas(trackId: string, deltas: TrackMusicianDelta[]): Promise<void> {
    const track = await this.db.track.findUnique({
      where: { id: trackId },
      select: { showId: true },
    });
    if (!track) {
      throw new Error(`Track with id "${trackId}" not found`);
    }

    const satInIds = deltas.filter((delta) => delta.present).map((delta) => delta.musicianId);
    if (satInIds.length > 0) {
      const alreadyInLineup = await this.db.showMusician.findMany({
        where: { showId: track.showId, musicianId: { in: satInIds } },
        select: { musicianId: true },
      });
      if (alreadyInLineup.length > 0) {
        throw new Error(
          `Cannot add a sit-in delta for musician(s) already in the show lineup: ${alreadyInLineup
            .map((row) => row.musicianId)
            .join(", ")}`,
        );
      }
    }

    await this.db.$transaction([
      this.db.trackMusician.deleteMany({ where: { trackId } }),
      ...deltas.map((delta) =>
        this.db.trackMusician.create({
          data: {
            trackId,
            musicianId: delta.musicianId,
            present: delta.present,
            createdAt: new Date(),
            updatedAt: new Date(),
            instruments: {
              create: (delta.instrumentIds ?? []).map((instrumentId) => ({
                instrumentId,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
            },
          },
        }),
      ),
    ]);

    await this.invalidateShowCaches(track.showId);
  }

  /**
   * Reads a track's saved performer deltas back as domain entities (resolved
   * musician + instrument names), so the show-edit page can refresh its
   * read-only footnotes right after a save instead of waiting for a reload.
   */
  async getTrackMusicianDeltas(trackId: string): Promise<TrackMusicianDeltaView[]> {
    const track = await this.db.track.findUnique({
      where: { id: trackId },
      include: TRACK_PERFORMER_INCLUDE,
    });
    return (track?.trackMusicians ?? []).map((trackMusician) => mapTrackMusicianToDelta(trackMusician, trackId));
  }

  /**
   * Full-set replace of a track's structured flags. Flags drive derived
   * recurrence columns (`flag_gap` / `track_segue_recurrence`), so after
   * rewriting the rows this recomputes ONLY the edited song's recurrence —
   * cheap and scoped, unlike the date-wide `rebuildGapsAndSongStatsSince`.
   * Mirrors the delete-all-then-insert shape of `setTrackMusicianDeltas`.
   */
  async setTrackFlags(trackId: string, flags: TrackFlag[]): Promise<void> {
    if (!this.stats) {
      throw new Error("TrackService.setTrackFlags requires a StatsService; constructed without one");
    }
    const track = await this.db.track.findUnique({
      where: { id: trackId },
      select: { showId: true, songId: true },
    });
    if (!track) {
      throw new Error(`Track with id "${trackId}" not found`);
    }

    const uniqueFlags = [...new Set(flags)];
    await this.db.$transaction([
      this.db.trackFlagAssignment.deleteMany({ where: { trackId } }),
      ...uniqueFlags.map((flag) =>
        this.db.trackFlagAssignment.create({
          // Leave the derived recurrence columns null; the recompute fills them.
          data: { trackId, flag, createdAt: new Date(), updatedAt: new Date() },
        }),
      ),
    ]);

    await this.stats.recomputeSongRecurrence(track.songId);
    await this.invalidateShowCaches(track.showId);
    await this.cacheInvalidation?.invalidateSongCaches();
  }

  /**
   * Full-set replace of the completion links where `laterTrackId` is the
   * *completer* (the track that finishes earlier unfinished versions). The
   * `earlier_track_id` column is UNIQUE — an earlier track has at most one
   * completer — so this first rejects any earlier track another track already
   * completes. Busts caches on both shows of every link (each renders the
   * "completes …" / "completed by …" footnote). Display-only; no recompute.
   */
  async setTrackCompletions(laterTrackId: string, earlierTrackIds: string[]): Promise<void> {
    const laterTrack = await this.db.track.findUnique({
      where: { id: laterTrackId },
      select: { showId: true },
    });
    if (!laterTrack) {
      throw new Error(`Track with id "${laterTrackId}" not found`);
    }

    const uniqueEarlierIds = [...new Set(earlierTrackIds)];
    if (uniqueEarlierIds.length > 0) {
      const conflicting = await this.db.trackCompletion.findMany({
        where: { earlierTrackId: { in: uniqueEarlierIds }, laterTrackId: { not: laterTrackId } },
        select: { earlierTrackId: true },
      });
      if (conflicting.length > 0) {
        throw new Error(
          `These earlier tracks are already completed by another track: ${conflicting
            .map((row) => row.earlierTrackId)
            .join(", ")}`,
        );
      }
    }

    // The earlier tracks' shows also render the link, so bust their caches too.
    const earlierTracks = uniqueEarlierIds.length
      ? await this.db.track.findMany({ where: { id: { in: uniqueEarlierIds } }, select: { showId: true } })
      : [];

    await this.db.$transaction([
      this.db.trackCompletion.deleteMany({ where: { laterTrackId } }),
      ...uniqueEarlierIds.map((earlierTrackId) =>
        this.db.trackCompletion.create({
          data: { earlierTrackId, laterTrackId, createdAt: new Date(), updatedAt: new Date() },
        }),
      ),
    ]);

    const showIds = new Set<string>([laterTrack.showId, ...earlierTracks.map((track) => track.showId)]);
    for (const showId of showIds) {
      await this.invalidateShowCaches(showId);
    }
  }

  /**
   * The most recent earlier same-song performances (shows strictly before
   * `beforeDate`) for the completions picker, shaped for dated-chip display.
   * Capped at `EARLIER_PERFORMANCES_LIMIT` most-recent-first — a song completed
   * later was almost always left unfinished recently, so the full back-catalog
   * would just bloat the picker. Scoped to one song; cross-name completions
   * aren't offered in the UI.
   */
  async findEarlierPerformances(songId: string, beforeDate: string): Promise<EarlierPerformance[]> {
    const tracks = await this.db.track.findMany({
      where: { songId, show: { date: { lt: beforeDate } } },
      select: { id: true, show: { select: { date: true, slug: true } } },
      orderBy: [
        { show: { date: "desc" } },
        { show: { dayOrder: { sort: "desc", nulls: "first" } } },
        { position: "desc" },
        { show: { id: "desc" } },
      ],
      take: EARLIER_PERFORMANCES_LIMIT,
    });
    return tracks.flatMap((track) => mapToEarlierPerformance(track));
  }

  /**
   * Earlier-performance shapes for a specific set of track ids. Used to keep an
   * already-linked completion visible (with its date) in the editor even when it
   * falls outside the recent-performances cap above.
   */
  async findPerformancesByTrackIds(trackIds: string[]): Promise<EarlierPerformance[]> {
    if (trackIds.length === 0) return [];
    const tracks = await this.db.track.findMany({
      where: { id: { in: trackIds } },
      select: { id: true, show: { select: { date: true, slug: true } } },
    });
    return tracks.flatMap((track) => mapToEarlierPerformance(track));
  }

  /**
   * The earlier-track ids this (later) track currently completes. The completions
   * editor seeds its selection from these so a save's full-set replace preserves
   * existing links — the domain `completes` shape carries only show date/slug,
   * not the track id, so it can't drive the picker selection.
   */
  async getCompletionEarlierTrackIds(laterTrackId: string): Promise<string[]> {
    const rows = await this.db.trackCompletion.findMany({
      where: { laterTrackId },
      select: { earlierTrackId: true },
    });
    return rows.map((row) => row.earlierTrackId);
  }

  /**
   * Reads a track's flags and gated flag/segue recurrence back as the domain
   * footnote slice, so the show-edit page can refresh its read-only flag
   * footnotes right after a save (the recompute has already run) instead of
   * waiting for a reload.
   */
  async getTrackFlagData(trackId: string): Promise<TrackFlagData> {
    const mapped = await this.readTrackFootnoteDomain(trackId);
    if (!mapped) {
      return { flags: [], flagRecurrences: [], segueRecurrences: [] };
    }
    return {
      flags: mapped.flags,
      flagRecurrences: mapped.flagRecurrences,
      segueRecurrences: mapped.segueRecurrences,
    };
  }

  /**
   * Reads a track's completion links ("completes …") back as the domain shape,
   * so the editor can refresh that footnote after a completions save.
   */
  async getTrackCompletes(trackId: string): Promise<Track["completes"]> {
    const mapped = await this.readTrackFootnoteDomain(trackId);
    return mapped?.completes ?? [];
  }

  /** Load one track and map it to its footnote-bearing domain shape, or null. */
  private async readTrackFootnoteDomain(trackId: string): Promise<Track | null> {
    const track = await this.db.track.findUnique({
      where: { id: trackId },
      include: TRACK_FOOTNOTE_INCLUDE,
    });
    return track ? mapTrackRowToFootnoteDomain(track) : null;
  }
}

import type { Annotation, Logger, Track, TrackMusicianDelta as TrackMusicianDeltaView } from "@bip/domain";
import { type CacheInvalidationService, yearFromShowDate } from "../_shared/cache";
import type { DbAnnotation, DbClient, DbSong, DbTrack } from "../_shared/database/models";
import { buildIncludeClause, buildOrderByClause, buildWhereClause } from "../_shared/database/query-utils";
import type { QueryOptions } from "../_shared/database/types";
import { slugify } from "../_shared/utils/slugify";
import { mapTrackMusicianToDelta, TRACK_PERFORMER_INCLUDE } from "../setlists/setlist-service";
import { recomputeShowDuration } from "./show-duration";

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
        annotations: true,
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
        annotations: true,
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
}

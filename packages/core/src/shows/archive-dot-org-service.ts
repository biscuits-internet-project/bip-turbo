import type { ArchiveDotOrgRecording, Logger } from "@bip/domain";
import { CacheKeys, pickPrimaryArchiveRecording } from "@bip/domain";
import { DateIndexedCatalog } from "../_shared/catalog/date-indexed-catalog";
import type { RedisService } from "../_shared/redis";
import type { ExternalDurationTrack } from "../tracks/duration-matching";

/** Per-recording track-list cache lifetime — a recording's files are stable. */
const RECORDING_TTL_SECONDS = 60 * 60 * 24 * 7;

/** One file entry from archive.org's metadata API. */
interface ArchiveMetadataFile {
  name?: string;
  title?: string;
  track?: string;
  /** Either fractional seconds ("179.51") or "mm:ss" / "h:mm:ss". */
  length?: string;
  format?: string;
}

/** Envelope shape from archive.org's metadata endpoint. */
interface ArchiveMetadataResponse {
  files?: ArchiveMetadataFile[];
}

/**
 * Parse an archive.org `length` value into whole seconds. FLAC files report
 * fractional seconds ("179.51"); mp3/ogg derivatives report "mm:ss". Returns
 * null for anything unparseable.
 */
export function parseArchiveLength(raw: string): number | null {
  if (raw.includes(":")) {
    const parts = raw.split(":").map((p) => Number.parseInt(p, 10));
    if (parts.some((n) => Number.isNaN(n))) return null;
    const seconds = parts.reduce((acc, n) => acc * 60 + n, 0);
    return seconds > 0 ? seconds : null;
  }
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : null;
}

/**
 * Raw shape returned by archive.org's advancedsearch endpoint. Not exported —
 * the service normalizes field names and merges into {@link ArchiveDotOrgRecording}.
 */
interface ArchiveDotOrgSearchDoc {
  identifier?: string;
  title?: string;
  date?: string;
  source?: string;
  addeddate?: string;
}

/** Envelope shape from archive.org's advancedsearch endpoint. */
interface ArchiveDotOrgSearchResponse {
  response?: {
    docs?: ArchiveDotOrgSearchDoc[];
  };
}

const COLLECTION = "DiscoBiscuits";

function buildFetcher(logger?: Logger) {
  return async (): Promise<Record<string, ArchiveDotOrgRecording[]>> => {
    const url = `https://archive.org/advancedsearch.php?q=collection:${COLLECTION}&fl=identifier,date,title,source,addeddate&rows=10000&output=json`;
    logger?.info("Fetching archive.org catalog", { collection: COLLECTION });
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch archive.org catalog: ${response.status}`);
    }
    const data: ArchiveDotOrgSearchResponse = await response.json();
    const docs = data.response?.docs ?? [];

    const map: Record<string, ArchiveDotOrgRecording[]> = {};
    for (const doc of docs) {
      if (!doc.identifier || !doc.date) continue;
      const isoDate = doc.date.slice(0, 10);
      const recording: ArchiveDotOrgRecording = {
        identifier: doc.identifier,
        title: doc.title ?? doc.identifier,
        source: doc.source,
        addedDate: doc.addeddate,
        url: `https://archive.org/details/${doc.identifier}`,
      };
      if (!map[isoDate]) map[isoDate] = [];
      map[isoDate].push(recording);
    }
    return map;
  };
}

/**
 * Wraps archive.org's advanced-search endpoint for the DiscoBiscuits
 * collection. Archive.org can have multiple recordings per show (new tapes
 * surface years later; remasters replace the "best" pick). Consumers use this
 * service to get the ranked primary recording for the embedded player, the
 * full list for the alternates UI, and bulk URL maps for listing-page badges.
 */
export class ArchiveDotOrgService {
  private readonly catalog: DateIndexedCatalog<ArchiveDotOrgRecording[]>;

  /**
   * @param redis Shared Redis client for the underlying catalog cache.
   * @param logger Optional logger; fetch failures are swallowed so a show page
   *   never breaks on archive.org downtime.
   */
  constructor(
    private readonly redis: RedisService,
    private readonly logger?: Logger,
  ) {
    this.catalog = new DateIndexedCatalog<ArchiveDotOrgRecording[]>(
      this.redis,
      CacheKeys.archiveDotOrg.catalog(),
      buildFetcher(this.logger),
      this.logger,
    );
  }

  /**
   * Return every recording known for a show date, unsorted. Callers that want
   * a single best pick should feed the result through {@link pickPrimary}.
   */
  async findRecordingsForDate(date: string): Promise<ArchiveDotOrgRecording[]> {
    return (await this.catalog.findByDate(date)) ?? [];
  }

  /**
   * Cheap yes/no check for the listing-page badge strip. Prefer
   * {@link getPrimaryUrlsByDate} when you need many dates at once.
   */
  async hasRecordings(date: string): Promise<boolean> {
    return (await this.findRecordingsForDate(date)).length > 0;
  }

  /**
   * Build a date → archive.org-details-URL map for every show that has a
   * recording. Exists so listing pages can render a per-row archive badge
   * with a real link target via a single Redis read.
   */
  async getPrimaryUrlsByDate(): Promise<Record<string, string>> {
    const map = await this.catalog.getAll();
    const urls: Record<string, string> = {};
    for (const [date, recordings] of Object.entries(map)) {
      const primary = this.pickPrimary(recordings);
      if (primary) urls[date] = primary.url;
    }
    return urls;
  }

  /**
   * Thin wrapper over the pure {@link pickPrimaryArchiveRecording} helper so
   * service consumers don't have to import two places. Prefer the pure
   * function directly when you're not already holding a service reference
   * (e.g. React components).
   */
  pickPrimary(recordings: ArchiveDotOrgRecording[]): ArchiveDotOrgRecording | null {
    return pickPrimaryArchiveRecording(recordings);
  }

  /**
   * Fetch the ordered track list (title + duration seconds) for one recording
   * via the metadata API. Each track is published in several audio formats; we
   * keep one row per track, preferring the FLAC length (most precise). Cached
   * per identifier in Redis. Returns an empty list on any failure so duration
   * resolution degrades gracefully.
   */
  async fetchRecordingTracks(identifier: string): Promise<ExternalDurationTrack[]> {
    const cacheKey = CacheKeys.archiveDotOrg.recording(identifier);
    const cached = await this.redis.get<ExternalDurationTrack[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`https://archive.org/metadata/${identifier}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch archive.org metadata for ${identifier}: ${response.status}`);
      }
      const data: ArchiveMetadataResponse = await response.json();
      const files = data.files ?? [];

      // One row per track, preferring the FLAC length (most precise). Dedup on
      // the filename minus its extension: that collapses the same track's
      // flac/mp3/ogg copies into one entry while keeping multi-disc tracks
      // distinct (their `track` numbers repeat per disc, e.g. d1_01 / d2_01).
      const byTrack = new Map<string, { title: string; seconds: number; isFlac: boolean; name: string }>();
      for (const file of files) {
        if (!file.title || !file.length || !file.name) continue;
        const seconds = parseArchiveLength(file.length);
        if (seconds === null) continue;
        const stem = file.name.replace(/\.[^./]+$/, "");
        const isFlac = (file.format ?? "").toLowerCase().includes("flac");
        const existing = byTrack.get(stem);
        if (!existing || (isFlac && !existing.isFlac)) {
          byTrack.set(stem, { title: file.title, seconds, isFlac, name: file.name });
        }
      }

      // Filenames embed disc+track in zero-padded order, so a lexical sort
      // restores play order across discs.
      const tracks = [...byTrack.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ title, seconds }) => ({ title, seconds }));

      if (tracks.length > 0) {
        await this.redis.set<ExternalDurationTrack[]>(cacheKey, tracks, { EX: RECORDING_TTL_SECONDS });
      }
      return tracks;
    } catch (error) {
      this.logger?.error("archive.org recording fetch failed", { identifier, error });
      return [];
    }
  }
}

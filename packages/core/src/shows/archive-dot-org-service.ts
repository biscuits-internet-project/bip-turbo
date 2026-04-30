import type { ArchiveDotOrgRecording, Logger } from "@bip/domain";
import { CacheKeys, pickPrimaryArchiveRecording } from "@bip/domain";
import { DateIndexedCatalog } from "../_shared/catalog/date-indexed-catalog";
import type { RedisService } from "../_shared/redis";

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
  constructor(redis: RedisService, logger?: Logger) {
    this.catalog = new DateIndexedCatalog<ArchiveDotOrgRecording[]>(
      redis,
      CacheKeys.archiveDotOrg.catalog(),
      buildFetcher(logger),
      logger,
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
}

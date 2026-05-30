import type { ArchiveDotOrgRecording } from "@bip/domain";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../_shared/redis";
import { ArchiveDotOrgService, parseArchiveLength } from "./archive-dot-org-service";

describe("parseArchiveLength", () => {
  // archive.org reports FLAC lengths as fractional seconds and mp3/ogg lengths
  // as mm:ss / h:mm:ss; both must reduce to whole seconds.

  test("rounds fractional-second (FLAC) values", () => {
    expect(parseArchiveLength("179.51")).toBe(180);
    expect(parseArchiveLength("822.0")).toBe(822);
  });

  test("parses mm:ss and h:mm:ss (mp3/ogg) values", () => {
    expect(parseArchiveLength("13:43")).toBe(823);
    expect(parseArchiveLength("1:02:03")).toBe(3723);
  });

  test("rejects zero, negative, and unparseable values", () => {
    expect(parseArchiveLength("0")).toBeNull();
    expect(parseArchiveLength("0:00")).toBeNull();
    expect(parseArchiveLength("-5")).toBeNull();
    expect(parseArchiveLength("abc")).toBeNull();
  });
});

function makeRedisMock() {
  const store = new Map<string, unknown>();
  return {
    get: vi.fn(async <T>(key: string): Promise<T | null> => (store.has(key) ? (store.get(key) as T) : null)),
    set: vi.fn(async <T>(key: string, value: T): Promise<void> => {
      store.set(key, value);
    }),
    __store: store,
  } as unknown as RedisService & { __store: Map<string, unknown> };
}

function makeSearchResponse(docs: Array<{ identifier: string; date: string; title?: string; source?: string }>) {
  return {
    ok: true,
    json: async () => ({ response: { docs } }),
  } as unknown as Response;
}

// Real fixtures confirmed against archive.org's live advancedsearch API.
// 9/1/2001 has two recordings — the `mastered.flac` is a remaster and must
// win the pickPrimary ranking so users hear the best-sounding version by
// default. This is the canonical remaster test case.
const WETLANDS_2001_REMASTER: ArchiveDotOrgRecording = {
  identifier: "db2001-09-01.mastered.flac",
  title: "Disco Biscuits Live at Wetlands Preserve on 2001-09-01",
  source: "B&K 4011's > Lunatec V2 > AD1K > Sony D8",
  url: "https://archive.org/details/db2001-09-01.mastered.flac",
};
const WETLANDS_2001_ORIGINAL: ArchiveDotOrgRecording = {
  identifier: "db2001-09-01.shnf",
  title: "Disco Biscuits Live at Wetlands Preserve on 2001-09-01",
  source: "B + K 4011 -> Lunatec V2 -> AD1K -> D8",
  url: "https://archive.org/details/db2001-09-01.shnf",
};

// 12/28/2007 has three audience recordings and no remaster. None outrank
// each other on quality signals, so pickPrimary must produce a deterministic
// winner via alphabetical tiebreaker.
const HAMMERSTEIN_2007_A: ArchiveDotOrgRecording = {
  identifier: "db2007-12-28.ccm41.RM.flac16",
  title: "Disco Biscuits Live at Hammerstein Ballroom on 2007-12-28",
  source: "Schoeps CCM41>Edirol UA5 (Oade T+ mod)>Marantz PMD671@ 16/44.1",
  url: "https://archive.org/details/db2007-12-28.ccm41.RM.flac16",
};
const HAMMERSTEIN_2007_B: ArchiveDotOrgRecording = {
  identifier: "db2007-12-28.ka500.flac16",
  title: "Disco Biscuits Live at Hammerstein Ballroom on 2007-12-28",
  source: "MBHO ka500 (DINa) > 603a > Lunatec V3 > Sonic AD2K+ > Microtrack @ 24/48",
  url: "https://archive.org/details/db2007-12-28.ka500.flac16",
};
const HAMMERSTEIN_2007_C: ArchiveDotOrgRecording = {
  identifier: "db2007-12-28.mk41.flac16",
  title: "Disco Biscuits Live at Hammerstein Ballroom on 2007-12-28",
  source: "mk41>kc5>cmc6>v2>722",
  url: "https://archive.org/details/db2007-12-28.mk41.flac16",
};

describe("ArchiveDotOrgService.pickPrimary", () => {
  let service: ArchiveDotOrgService;

  beforeEach(() => {
    service = new ArchiveDotOrgService(makeRedisMock());
  });

  // Empty input must return null so loaders can render "no recording" state
  // without branching on array length before calling pickPrimary.
  test("empty array returns null", () => {
    expect(service.pickPrimary([])).toBeNull();
  });

  // Single-element input returns that element without running heuristics.
  test("single recording is returned as-is", () => {
    expect(service.pickPrimary([WETLANDS_2001_ORIGINAL])).toBe(WETLANDS_2001_ORIGINAL);
  });

  // The remaster scoring rule is the whole reason this heuristic exists.
  // For 9/1/2001, mastered.flac must beat the plain shnf — otherwise users
  // get the older transfer by default and miss the better-sounding release.
  test("remaster wins over plain recording (9/1/2001 fixture)", () => {
    const primary = service.pickPrimary([WETLANDS_2001_ORIGINAL, WETLANDS_2001_REMASTER]);
    expect(primary).toBe(WETLANDS_2001_REMASTER);
  });

  // Order of input should not change the pick — remaster still wins when
  // it's first in the list.
  test("remaster wins regardless of input order", () => {
    const primary = service.pickPrimary([WETLANDS_2001_REMASTER, WETLANDS_2001_ORIGINAL]);
    expect(primary).toBe(WETLANDS_2001_REMASTER);
  });

  // When nothing scores above the baseline, alphabetical identifier sort
  // picks a deterministic winner. For 12/28/2007 the three audience tapes
  // are effectively tied; .ccm41. comes first alphabetically.
  test("all-tied recordings pick alphabetically lowest identifier (12/28/2007 fixture)", () => {
    const primary = service.pickPrimary([HAMMERSTEIN_2007_C, HAMMERSTEIN_2007_B, HAMMERSTEIN_2007_A]);
    expect(primary).toBe(HAMMERSTEIN_2007_A);
  });

  // Explicit soundboard marker in the source string should outrank audience
  // recordings, matching what a fan would pick.
  test("soundboard in source beats audience", () => {
    const aud: ArchiveDotOrgRecording = {
      identifier: "db2010-05-01.aud.flac16",
      title: "aud",
      source: "Schoeps mk4 > V3",
      url: "https://archive.org/details/db2010-05-01.aud.flac16",
    };
    const sbd: ArchiveDotOrgRecording = {
      identifier: "db2010-05-01.sbd.flac16",
      title: "sbd",
      source: "Soundboard > Tascam DR-680",
      url: "https://archive.org/details/db2010-05-01.sbd.flac16",
    };
    expect(service.pickPrimary([aud, sbd])).toBe(sbd);
  });

  // Matrix recordings (SBD + AUD mixed) are generally the best-sounding
  // option when available and should outrank plain audience.
  test("matrix in identifier beats audience", () => {
    const aud: ArchiveDotOrgRecording = {
      identifier: "db2010-05-01.aud.flac16",
      title: "aud",
      url: "https://archive.org/details/db2010-05-01.aud.flac16",
    };
    const matrix: ArchiveDotOrgRecording = {
      identifier: "db2010-05-01.matrix.flac16",
      title: "matrix",
      url: "https://archive.org/details/db2010-05-01.matrix.flac16",
    };
    expect(service.pickPrimary([aud, matrix])).toBe(matrix);
  });
});

describe("ArchiveDotOrgService.findRecordingsForDate", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let service: ArchiveDotOrgService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redis = makeRedisMock();
    service = new ArchiveDotOrgService(redis);
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // The service should issue a single bulk query to archive.org's
  // advancedsearch endpoint (collection:DiscoBiscuits, no date filter),
  // then group the results by ISO date. This is the whole point of the
  // bulk-fetch pattern — 1 fetch feeds every subsequent date lookup.
  test("cache miss: one bulk fetch, then groups by date", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSearchResponse([
        { identifier: "db2001-09-01.shnf", date: "2001-09-01T00:00:00Z", title: "orig" },
        { identifier: "db2001-09-01.mastered.flac", date: "2001-09-01T00:00:00Z", title: "remaster" },
        { identifier: "db2007-12-28.mk41.flac16", date: "2007-12-28T00:00:00Z", title: "mk41" },
      ]),
    );

    const recordings2001 = await service.findRecordingsForDate("2001-09-01");
    expect(recordings2001).toHaveLength(2);
    expect(recordings2001.map((r) => r.identifier)).toEqual(
      expect.arrayContaining(["db2001-09-01.shnf", "db2001-09-01.mastered.flac"]),
    );

    // No second fetch for a different date on the same cache.
    const recordings2007 = await service.findRecordingsForDate("2007-12-28");
    expect(recordings2007).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // The fetch must be the bulk collection query, not a per-date query.
    const fetchedUrl = fetchMock.mock.calls[0][0] as string;
    expect(fetchedUrl).toContain("collection:DiscoBiscuits");
    expect(fetchedUrl).not.toContain("date:");
  });

  // Dates with no archive.org match return an empty array so loader code
  // can do `if (recordings.length > 0)` uniformly.
  test("unknown date returns empty array", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSearchResponse([{ identifier: "db1997-01-30.shnf", date: "1997-01-30T00:00:00Z", title: "x" }]),
    );

    const result = await service.findRecordingsForDate("1999-04-09");

    expect(result).toEqual([]);
  });

  // If the upstream throws, the show page must still render. Return empty
  // and do not cache, so a retry on the next request can recover.
  test("fetch throw: returns empty, does not crash", async () => {
    fetchMock.mockRejectedValue(new Error("archive down"));

    const result = await service.findRecordingsForDate("2001-09-01");

    expect(result).toEqual([]);
  });
});

describe("ArchiveDotOrgService.hasRecordings", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let service: ArchiveDotOrgService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redis = makeRedisMock();
    service = new ArchiveDotOrgService(redis);
    fetchMock = vi
      .fn()
      .mockResolvedValue(
        makeSearchResponse([{ identifier: "db2001-09-01.shnf", date: "2001-09-01T00:00:00Z", title: "x" }]),
      );
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Used by the badge code to render an archive.org icon next to a show
  // without building the full recording list client-side.
  test("returns true when at least one recording exists for the date", async () => {
    expect(await service.hasRecordings("2001-09-01")).toBe(true);
  });

  test("returns false when no recording matches", async () => {
    expect(await service.hasRecordings("1999-04-09")).toBe(false);
  });
});

describe("ArchiveDotOrgService.fetchRecordingTracks", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let service: ArchiveDotOrgService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redis = makeRedisMock();
    service = new ArchiveDotOrgService(redis);
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Fixture mirrors archive.org's metadata `files` array: each track repeats
  // across audio formats (flac/mp3), non-audio files lack title/length, and a
  // multi-disc show reuses track numbers per disc (d1t01 / d2t01).
  function makeMetadataResponse(
    files: Array<{ name?: string; title?: string; track?: string; length?: string; format?: string }>,
  ) {
    return { ok: true, json: async () => ({ files }) } as unknown as Response;
  }

  test("dedups formats (FLAC wins), keeps multi-disc tracks distinct, drops non-audio", async () => {
    fetchMock.mockResolvedValueOnce(
      makeMetadataResponse([
        { name: "db_d1t01_helicopters.mp3", title: "Helicopters", track: "01", length: "8:40", format: "VBR MP3" },
        { name: "db_d1t01_helicopters.flac", title: "Helicopters", track: "01", length: "520.0", format: "Flac" },
        // Disc 2 reuses track "01" — must NOT collapse into Helicopters.
        { name: "db_d2t01_spaga.flac", title: "Spaga", track: "01", length: "410.5", format: "Flac" },
        { name: "db_cover.jpg", format: "JPEG" },
        { name: "db_meta.xml", format: "Metadata" },
      ]),
    );

    const tracks = await service.fetchRecordingTracks("db-show");

    expect(tracks).toEqual([
      { title: "Helicopters", seconds: 520 },
      { title: "Spaga", seconds: 411 },
    ]);
  });

  test("returns [] without throwing on a non-ok response", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404 } as unknown as Response);
    expect(await service.fetchRecordingTracks("missing")).toEqual([]);
  });
});

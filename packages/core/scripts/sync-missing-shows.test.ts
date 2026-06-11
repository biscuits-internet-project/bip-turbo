import { describe, expect, test, vi } from "vitest";
import type { RatingService } from "../src/ratings/rating-service";
import {
  buildRockOperaAssignmentDiff,
  buildSetlistReconciliation,
  buildShowCreateInput,
  buildShowDriftUpdate,
  buildSongCreateInput,
  buildSongDriftUpdate,
  buildVenueCreateInput,
  buildVenueDriftUpdate,
  collectSongSlugs,
  collectVenueKeys,
  diffCompletions,
  diffShowMusicians,
  diffTrackAnnotations,
  diffTrackFlags,
  diffTrackMusicians,
  findSquatterIds,
  isStubSlug,
  type LocalTrackForReconcile,
  type McpSearchVenueResult,
  type McpSetlist,
  type McpShow,
  matchVenue,
  parseYearsArg,
  planShowRenames,
  planVenueOrphans,
  resolveCompletionLinks,
  STUB_USER_PASSWORD_DIGEST,
  showNeedsUpdate,
  stubUserEmail,
  syncUserActivity,
} from "./sync-missing-shows";

// Mirrors Prisma's P2002 on the ratings/attendances primary key — thrown by the
// stub db when a create reuses an id already held by a different compound-key
// row, the exact failure the epoch id-binding reconcile resolves.
function prismaUniqueIdError(): Error {
  return Object.assign(new Error("Unique constraint failed on the fields: (`id`)"), { code: "P2002" });
}

// parseYearsArg governs the "what years to sync" decision. Default (no flag)
// must be the current calendar year per the user's chosen behavior; explicit
// --years=... must override; malformed values must surface as an error so a
// typo doesn't silently sync nothing.
describe("parseYearsArg", () => {
  // No flag, no env override: fall back to current calendar year. This is the
  // documented default so `make db-sync-missing-shows` with no args just works.
  test("defaults to current year when no --years flag is passed", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    expect(parseYearsArg([], now)).toEqual([2026]);
  });

  // A single explicit year passes through.
  test("parses a single year", () => {
    expect(parseYearsArg(["--years=2025"], new Date())).toEqual([2025]);
  });

  // Comma-separated list: the script supports backfilling multiple years in one run.
  test("parses a comma-separated list of years", () => {
    expect(parseYearsArg(["--years=2024,2025,2026"], new Date())).toEqual([2024, 2025, 2026]);
  });

  // Whitespace tolerance: `--years=2024, 2025` is a plausible user input.
  test("tolerates whitespace around commas", () => {
    expect(parseYearsArg(["--years=2024, 2025 ,2026"], new Date())).toEqual([2024, 2025, 2026]);
  });

  // Garbage input must fail loudly rather than silently falling back to the default,
  // which would hide user intent (e.g. --years=abc shouldn't sync the current year).
  test("throws on non-numeric year values", () => {
    expect(() => parseYearsArg(["--years=abc"], new Date())).toThrow();
  });

  // Range syntax: backfilling a decade is a common request, and listing each
  // year manually is tedious. Bounds are inclusive on both ends.
  test("expands a YYYY-YYYY range to every year in the range", () => {
    expect(parseYearsArg(["--years=2010-2015"], new Date())).toEqual([2010, 2011, 2012, 2013, 2014, 2015]);
  });

  // Ranges and single years mix in one --years value. Output is deduplicated
  // and sorted so callers don't need to defend against either.
  test("mixes ranges and single years, deduplicating overlaps", () => {
    expect(parseYearsArg(["--years=2010-2012,2015,2011-2013"], new Date())).toEqual([2010, 2011, 2012, 2013, 2015]);
  });

  // A reversed range is almost always a typo (--years=2026-2010); throwing
  // tells the user instead of silently returning an empty list and syncing nothing.
  test("throws when range end is before start", () => {
    expect(() => parseYearsArg(["--years=2026-2010"], new Date())).toThrow();
  });

  // Three-part or empty-part ranges (2010-2015-2020, 2010-, -2026) are
  // malformed — fail loudly rather than guess what the user meant.
  test("throws on malformed ranges", () => {
    expect(() => parseYearsArg(["--years=2010-2015-2020"], new Date())).toThrow();
    expect(() => parseYearsArg(["--years=2010-"], new Date())).toThrow();
    expect(() => parseYearsArg(["--years=-2026"], new Date())).toThrow();
  });
});

// isStubSlug detects prod's date-only stub rows (e.g. "2025-10-31") that
// exist alongside the real show with a full slug like
// "2025-10-31-suwannee-music-park-live-oak-fl". Stubs have no setlist and no
// venue; syncing them would clutter the local DB with blank shows.
describe("isStubSlug", () => {
  // Bare YYYY-MM-DD is the stub pattern we want to skip.
  test("returns true for a bare date slug", () => {
    expect(isStubSlug("2025-10-31")).toBe(true);
  });

  // Real show slugs always have a venue suffix — must not be skipped.
  test("returns false for a full date+venue slug", () => {
    expect(isStubSlug("2025-10-31-suwannee-music-park-live-oak-fl")).toBe(false);
  });

  // Defensive: null/empty slugs aren't stubs — they fail earlier in the pipeline.
  test("returns false for null or empty slugs", () => {
    expect(isStubSlug(null)).toBe(false);
    expect(isStubSlug("")).toBe(false);
  });
});

// collectSongSlugs feeds step 4 of the data flow: figuring out which song slugs
// we need to upsert before tracks can reference them. Deduplication matters
// because the same song commonly appears multiple times across a multi-show batch.
describe("collectSongSlugs", () => {
  // Typical multi-set setlist: Basis > Shem-Rah-Boo across two sets with a repeat.
  // Result must be deduplicated and preserve first-seen ordering for stable logs.
  test("deduplicates song slugs across sets", () => {
    const setlists: McpSetlist[] = [
      {
        showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
        showDate: "2026-02-06",
        venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
        sets: [
          {
            label: "S1",
            tracks: [
              { position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: ">" },
              { position: 2, songTitle: "Shem-Rah-Boo", songSlug: "shem-rah-boo", segue: null },
            ],
          },
          {
            label: "S2",
            tracks: [
              // Basis reprise later in the show — same slug, must not appear twice.
              { position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: null },
              { position: 2, songTitle: "Munchkin Invasion", songSlug: "munchkin-invasion", segue: null },
            ],
          },
        ],
      },
    ];
    expect(collectSongSlugs(setlists)).toEqual(["basis-for-a-day", "shem-rah-boo", "munchkin-invasion"]);
  });

  // Empty-input robustness: the script may receive zero setlists if no shows are missing.
  test("returns an empty array for no setlists", () => {
    expect(collectSongSlugs([])).toEqual([]);
  });

  // Defensive: MCP sometimes returns an empty string for songSlug when a track's
  // song row was deleted. These must be filtered out so we don't try to look up
  // or create a blank-slug song.
  test("filters out empty song slugs", () => {
    const setlists: McpSetlist[] = [
      {
        showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
        showDate: "2026-02-06",
        venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
        sets: [
          {
            label: "S1",
            tracks: [
              { position: 1, songTitle: "Aceetobee", songSlug: "aceetobee", segue: null },
              { position: 2, songTitle: "", songSlug: "", segue: null },
            ],
          },
        ],
      },
    ];
    expect(collectSongSlugs(setlists)).toEqual(["aceetobee"]);
  });
});

// buildShowCreateInput maps the prod `get_shows` MCP shape to a Prisma Show
// insert. The critical constraints: Show.createdAt / updatedAt have no schema
// default — they must be set explicitly or Prisma errors; and the richer fields
// (ratingsCount, notes, relistenUrl) must flow through so local mirrors prod.
describe("buildShowCreateInput", () => {
  // Happy path: slug, date, aggregates, notes, relistenUrl, and timestamps all
  // populate. FK ids default to null when the caller didn't resolve them.
  test("maps a full MCP show to a Prisma create input with all aggregate fields", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildShowCreateInput(
      {
        slug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
        date: "2026-02-06",
        venueName: "Miami Beach Bandshell",
        venueCity: "Miami Beach",
        averageRating: 3.59,
        ratingsCount: 22,
        notes: "Festival opener",
        relistenUrl: "https://relisten.example/xyz",
      },
      now,
    );
    expect(input).toEqual({
      slug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      date: "2026-02-06",
      averageRating: 3.59,
      ratingsCount: 22,
      notes: "Festival opener",
      relistenUrl: "https://relisten.example/xyz",
      countForStats: true,
      dayOrder: null,
      venueId: null,
      bandId: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  // averageRating can legitimately be null for un-rated shows; must pass through.
  test("passes null averageRating / notes / relistenUrl through unchanged", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildShowCreateInput(
      {
        slug: "2026-04-18-the-uc-theatre-berkeley-ca",
        date: "2026-04-18",
        venueName: "The UC Theatre",
        venueCity: "Berkeley",
        averageRating: null,
        ratingsCount: 0,
        notes: null,
        relistenUrl: null,
      },
      now,
    );
    expect(input.averageRating).toBeNull();
    expect(input.notes).toBeNull();
    expect(input.relistenUrl).toBeNull();
  });

  // With both FKs resolved: they flow through so the inserted row is fully
  // linked to venue and band (the common path once venue search succeeds).
  test("includes venueId and bandId when provided", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildShowCreateInput(
      {
        slug: "2026-04-18-the-uc-theatre-berkeley-ca",
        date: "2026-04-18",
        venueName: "The UC Theatre",
        venueCity: "Berkeley",
        averageRating: 3.86,
        ratingsCount: 7,
        notes: null,
        relistenUrl: null,
      },
      now,
      { venueId: "venue-uc-uuid", bandId: "band-biscuits-uuid" },
    );
    expect(input.venueId).toBe("venue-uc-uuid");
    expect(input.bandId).toBe("band-biscuits-uuid");
  });

  // countForStats and dayOrder are admin-controlled on prod and gate every
  // downstream stat (countForStats → STATS_SHOWS_WHERE → gaps/timesPlayed;
  // dayOrder → same-day tiebreak). They must mirror verbatim — local default
  // of `countForStats=true`/`dayOrder=null` would mis-classify soundchecks
  // and mis-order same-day pairs.
  test("mirrors countForStats and dayOrder from MCP into the insert", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildShowCreateInput(
      {
        slug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
        date: "2026-02-06",
        venueName: "Miami Beach Bandshell",
        venueCity: "Miami Beach",
        averageRating: null,
        ratingsCount: 0,
        notes: null,
        relistenUrl: null,
        countForStats: false,
        dayOrder: 2,
      },
      now,
    );
    expect(input.countForStats).toBe(false);
    expect(input.dayOrder).toBe(2);
  });

  // Older MCP responses (pre-deploy) won't include countForStats/dayOrder. The
  // builder must tolerate undefined and fall back to schema defaults
  // (countForStats=true, dayOrder=null) — otherwise the next sync would
  // overwrite real values with `undefined` once the new fields ship.
  test("defaults countForStats=true and dayOrder=null when MCP omits them", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildShowCreateInput(
      {
        slug: "2026-04-18-the-uc-theatre-berkeley-ca",
        date: "2026-04-18",
        venueName: "The UC Theatre",
        venueCity: "Berkeley",
        averageRating: null,
        ratingsCount: 0,
        notes: null,
        relistenUrl: null,
      },
      now,
    );
    expect(input.countForStats).toBe(true);
    expect(input.dayOrder).toBeNull();
  });
});

// showNeedsUpdate drives the drift-detection branch: for every show already
// local and in-scope, compare its cached aggregates against what prod reports
// and return true if any field differs. The four mirrored fields are
// averageRating, ratingsCount, notes, relistenUrl.
describe("showNeedsUpdate", () => {
  const remote: McpShow = {
    slug: "2025-07-04-red-rocks-morrison-co",
    date: "2025-07-04",
    venueName: "Red Rocks",
    venueCity: "Morrison",
    averageRating: 4.2,
    ratingsCount: 19,
    notes: "Fourth of July run opener",
    relistenUrl: "https://relisten.example/rr",
  };

  // No drift: every aggregate matches the remote. Must return false so we
  // don't burn a write for nothing (idempotency on re-runs depends on this).
  test("returns false when every aggregate matches", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(false);
  });

  // New rating landed upstream — ratingsCount and averageRating both moved.
  // The primary user story for this helper: a show the user already had gets
  // fresher ratings after someone on prod votes.
  test("returns true when ratingsCount drifts", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 18,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(true);
  });

  // Float re-encoding (e.g. 4.1999999 vs 4.2) must NOT trip drift — otherwise
  // every run would update every show. Tolerance is 1e-6.
  test("returns false for averageRating differences within float tolerance", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.1999999,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(false);
  });

  // A real averageRating change (more than 1e-6) must trip drift.
  test("returns true for averageRating differences beyond float tolerance", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.1,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(true);
  });

  // Notes edited on prod (e.g. band added setlist annotation) should mirror.
  test("returns true when notes drifts", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "old note",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(true);
  });

  // relistenUrl added upstream (from null → string) is drift.
  test("returns true when relistenUrl drifts from null to a value", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: null,
        },
        remote,
      ),
    ).toBe(true);
  });

  // Both local and remote null on optional fields: no drift. Exercises the
  // null-equals-null branch that strict === already handles.
  test("treats local null equal to remote null as no drift", () => {
    const remoteWithNulls: McpShow = { ...remote, notes: null, relistenUrl: null };
    expect(
      showNeedsUpdate(
        { date: "2025-07-04", averageRating: 4.2, ratingsCount: 19, notes: null, relistenUrl: null },
        remoteWithNulls,
      ),
    ).toBe(false);
  });

  // countForStats drift is the headline reason for this whole change: admins
  // flip soundcheck/radio shows to `false` on prod and the local copy stays
  // `true` forever, inflating play counts and shrinking gaps. Must trip drift.
  test("returns true when countForStats drifts", () => {
    const remoteWithFlag: McpShow = { ...remote, countForStats: false };
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
          countForStats: true,
          dayOrder: null,
        },
        remoteWithFlag,
      ),
    ).toBe(true);
  });

  // dayOrder drift is rarer but real — a same-day pair gets re-ordered on
  // prod and local stays stale. Must trip drift.
  test("returns true when dayOrder drifts", () => {
    const remoteWithOrder: McpShow = { ...remote, dayOrder: 2 };
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
          countForStats: true,
          dayOrder: 1,
        },
        remoteWithOrder,
      ),
    ).toBe(true);
  });

  // Pre-deploy MCP responses omit the new fields entirely. When MCP doesn't
  // report a value, drift detection must NOT compare against `undefined` and
  // claim drift on every show. Treats missing remote field as "no opinion".
  test("ignores countForStats/dayOrder when remote omits them", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-04",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
          countForStats: false,
          dayOrder: 3,
        },
        remote,
      ),
    ).toBe(false);
  });

  // Date drift: the dev DB carries a few shows with a slug whose date prefix
  // doesn't match the date column (legacy data + slug-collision suffixes).
  // showNeedsUpdate must catch these so the orchestrator can rewrite the row.
  test("returns true when date drifts", () => {
    expect(
      showNeedsUpdate(
        {
          date: "2025-07-03",
          averageRating: 4.2,
          ratingsCount: 19,
          notes: "Fourth of July run opener",
          relistenUrl: "https://relisten.example/rr",
        },
        remote,
      ),
    ).toBe(true);
  });
});

// collectVenueKeys extracts the unique (name, city, state) tuples across the
// batch of setlists. These tuples are what we send to search_venues, so the
// dedupe is about minimizing MCP calls when the same venue hosts multi-night runs.
describe("collectVenueKeys", () => {
  // Two-night run at the same venue collapses to one key. Different venues in
  // the same city remain separate keys.
  test("deduplicates by name+city+state", () => {
    const setlists: McpSetlist[] = [
      {
        showSlug: "2026-04-11-gather-outdoors-stratton-vt",
        showDate: "2026-04-11",
        venue: { name: "Gather Outdoors", city: "Stratton", state: "VT" },
        sets: [],
      },
      {
        showSlug: "2026-04-12-gather-outdoors-stratton-vt",
        showDate: "2026-04-12",
        venue: { name: "Gather Outdoors", city: "Stratton", state: "VT" },
        sets: [],
      },
      {
        showSlug: "2026-04-18-the-uc-theatre-berkeley-ca",
        showDate: "2026-04-18",
        venue: { name: "The UC Theatre", city: "Berkeley", state: "CA" },
        sets: [],
      },
    ];
    expect(collectVenueKeys(setlists)).toEqual([
      { name: "Gather Outdoors", city: "Stratton", state: "VT" },
      { name: "The UC Theatre", city: "Berkeley", state: "CA" },
    ]);
  });

  // Setlists with a null venue name get skipped — no way to search without one.
  test("skips setlists with a missing venue name", () => {
    const setlists: McpSetlist[] = [
      {
        showSlug: "2026-02-07-msc-divina-the-open-seas-miami-fl",
        showDate: "2026-02-07",
        venue: { name: null, city: "Miami", state: "FL" },
        sets: [],
      },
    ];
    expect(collectVenueKeys(setlists)).toEqual([]);
  });
});

// planShowRenames detects prod shows that look "missing" (no local row under
// their slug) but already exist locally by id, i.e. the slug was renamed on
// prod. Matching by id (stable cross-env) lets the caller update the slug in
// place instead of insert-colliding on the primary key + FK-failing the ghost
// delete. The Disco Biscuits 9-30 Club / 930 Club rename is the live case.
describe("planShowRenames", () => {
  test("pairs a missing prod slug with the local row that shares its id", () => {
    const missingRemote = [
      { id: "show-fca", slug: "2009-10-02-930-club-washington-dc" },
      { id: "show-new", slug: "2024-08-12-cap-theatre" }, // genuinely new — no local row
    ];
    const localById = new Map([["show-fca", { slug: "2009-10-02-9-30-club-washington-dc" }]]);
    expect(planShowRenames(missingRemote, localById)).toEqual([
      {
        id: "show-fca",
        oldSlug: "2009-10-02-9-30-club-washington-dc",
        newSlug: "2009-10-02-930-club-washington-dc",
      },
    ]);
  });

  test("ignores remotes with no id (can't match cross-env)", () => {
    const localById = new Map([["show-fca", { slug: "old-slug" }]]);
    expect(planShowRenames([{ slug: "new-slug" }], localById)).toEqual([]);
  });

  test("skips a row whose local slug already equals the prod slug", () => {
    const localById = new Map([["show-fca", { slug: "same-slug" }]]);
    expect(planShowRenames([{ id: "show-fca", slug: "same-slug" }], localById)).toEqual([]);
  });
});

// matchVenue disambiguates search_venues results. Name alone is insufficient —
// "Fox Theatre" appears in multiple cities. We only return a match when city AND
// state both agree (case-insensitive). Anything else is null so the caller can
// fall back to leaving venueId NULL rather than linking the wrong venue.
describe("matchVenue", () => {
  // Case-insensitive match on city + state resolves to the right Fox Theatre.
  test("returns the candidate whose city and state match the target", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "fox-theatre", name: "Fox Theatre", city: "Boulder", state: "CO" },
      { slug: "fox-theater-atl", name: "Fox Theatre", city: "Atlanta", state: "GA" },
    ];
    expect(matchVenue(candidates, { name: "Fox Theatre", city: "Boulder", state: "CO" })).toBe("fox-theatre");
  });

  // Match is case-insensitive — prod data casing isn't always consistent with
  // whatever the setlist payload echoes back.
  test("matches case-insensitively", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "the-uc-theatre", name: "The UC Theatre", city: "Berkeley", state: "CA" },
    ];
    expect(matchVenue(candidates, { name: "the uc theatre", city: "BERKELEY", state: "ca" })).toBe("the-uc-theatre");
  });

  // No candidate matches the city/state: return null so the caller doesn't
  // link to the wrong venue.
  test("returns null when no candidate matches city+state", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "fox-theatre", name: "Fox Theatre", city: "Boulder", state: "CO" },
    ];
    expect(matchVenue(candidates, { name: "Fox Theatre", city: "Atlanta", state: "GA" })).toBeNull();
  });

  // Two candidates tie on name + city + state: prod actually has duplicate
  // venue rows for some venues (e.g. Higher Ground / South Burlington / VT
  // exists as both `higher-ground` and `the-new-higher-ground`). Returning
  // null here used to leave shows with `venueId = NULL`, which made the show
  // page 404 because the loader requires a venue. Tiebreak deterministically
  // on lex-min slug so re-runs always pick the same canonical row.
  test("breaks ties deterministically by lex-min slug when multiple candidates match", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "the-new-higher-ground", name: "Higher Ground", city: "South Burlington", state: "VT" },
      { slug: "higher-ground", name: "Higher Ground", city: "South Burlington", state: "VT" },
    ];
    expect(matchVenue(candidates, { name: "Higher Ground", city: "South Burlington", state: "VT" })).toBe(
      "higher-ground",
    );
  });

  // Regression for the Brooklyn Bowl Las Vegas bug: search_venues returned
  // four venues all in Las Vegas, NV (Brooklyn Bowl + 2x House of Blues +
  // Legends Lounge). Old logic ignored name and saw 4 ambiguous matches; the
  // correct behavior is to disambiguate by name and pick the one that matches.
  test("disambiguates by name when multiple candidates share city+state", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "brooklyn-bowl-las-vegas", name: "Brooklyn Bowl Las Vegas", city: "Las Vegas", state: "NV" },
      { slug: "house-of-blues-las-vegas-nv", name: "House of Blues", city: "Las Vegas", state: "NV" },
      { slug: "house-of-blues-las-vegas", name: "House of Blues", city: "Las Vegas", state: "NV" },
      { slug: "legends-lounge", name: "Legends Lounge", city: "Las Vegas", state: "NV" },
    ];
    expect(matchVenue(candidates, { name: "Brooklyn Bowl Las Vegas", city: "Las Vegas", state: "NV" })).toBe(
      "brooklyn-bowl-las-vegas",
    );
  });

  // Many venues share the exact name "House of Blues" across different cities.
  // Disambiguation must hold no matter how many same-name rows the search
  // returns — the bug was the *caller* truncating search_venues to 10 results
  // so the wanted city never reached matchVenue; given the full set it picks
  // the right one. Guards the city+state discriminator at scale.
  test("picks the right city among many same-name venues", () => {
    const cities = [
      ["West Hollywood", "CA"],
      ["Chicago", "IL"],
      ["Las Vegas", "NV"],
      ["Anaheim", "CA"],
      ["Atlantic City", "NJ"],
      ["San Diego", "CA"],
      ["Orlando", "FL"],
      ["New Orleans", "LA"],
      ["Boston", "MA"],
      ["Cleveland", "OH"],
      ["Myrtle Beach", "SC"],
      ["Dallas", "TX"],
      ["Houston", "TX"],
    ];
    const candidates: McpSearchVenueResult[] = cities.map(([city, state]) => ({
      slug: `house-of-blues-${city.toLowerCase().replace(/ /g, "-")}`,
      name: "House of Blues",
      city,
      state,
    }));
    expect(matchVenue(candidates, { name: "House of Blues", city: "Atlantic City", state: "NJ" })).toBe(
      "house-of-blues-atlantic-city",
    );
  });
});

// buildShowDriftUpdate computes the patch to apply to an existing local show
// row. Two independent triggers: aggregate drift (rating/notes/relisten) AND
// venue back-fill (local landed with venueId=NULL under an older sync, but the
// venue is now resolvable). Either one alone must yield an update; neither
// means we skip the write entirely so re-runs stay idempotent.
describe("buildShowDriftUpdate", () => {
  const remote: McpShow = {
    slug: "2025-11-15-brooklyn-steel-brooklyn-ny",
    date: "2025-11-15",
    venueName: "Brooklyn Steel",
    venueCity: "Brooklyn",
    averageRating: 3.7,
    ratingsCount: 12,
    notes: null,
    relistenUrl: null,
  };
  const localInSync = {
    date: "2025-11-15",
    averageRating: 3.7,
    ratingsCount: 12,
    notes: null,
    relistenUrl: null,
    venueId: "venue-brooklyn-steel-uuid",
  };

  // Nothing drifted, venue already linked: no patch — caller must skip the
  // UPDATE entirely so re-runs don't churn updatedAt for unchanged rows.
  test("returns null when aggregates match and venue is already linked", () => {
    expect(buildShowDriftUpdate(localInSync, remote, "venue-brooklyn-steel-uuid")).toBeNull();
  });

  // Pure aggregate drift, venue unchanged: patch contains the four mirrored
  // fields and does NOT touch venueId (avoid clobbering with same value).
  test("emits aggregate fields when ratingsCount drifts", () => {
    const patch = buildShowDriftUpdate({ ...localInSync, ratingsCount: 11 }, remote, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({
      averageRating: 3.7,
      ratingsCount: 12,
      notes: null,
      relistenUrl: null,
    });
  });

  // The Bug B fix: a show that landed with venueId=NULL under an older buggy
  // sync (e.g. 2025-11-15-brooklyn-steel-brooklyn-ny) must self-heal on the
  // next run when venue resolution now succeeds. Patch must include venueId.
  test("emits venueId when local has null venue and remote venue resolves", () => {
    const localMissingVenue = { ...localInSync, venueId: null };
    const patch = buildShowDriftUpdate(localMissingVenue, remote, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({ venueId: "venue-brooklyn-steel-uuid" });
  });

  // Combined case: aggregates drifted AND venue needs back-fill. Patch
  // must carry both — single UPDATE round-trip, not two.
  test("combines aggregate drift and venue back-fill into one patch", () => {
    const patch = buildShowDriftUpdate(
      { ...localInSync, ratingsCount: 11, venueId: null },
      remote,
      "venue-brooklyn-steel-uuid",
    );
    expect(patch).toEqual({
      averageRating: 3.7,
      ratingsCount: 12,
      notes: null,
      relistenUrl: null,
      venueId: "venue-brooklyn-steel-uuid",
    });
  });

  // Local is missing venue, but resolution still failed (e.g. unmatched search):
  // no venue back-fill patch component. If aggregates also match, return null
  // so we don't churn updatedAt on a show we can't fix yet.
  test("returns null when local has null venue but resolution also failed and aggregates match", () => {
    expect(buildShowDriftUpdate({ ...localInSync, venueId: null }, remote, null)).toBeNull();
  });

  // Local already has a venueId; never overwrite even if resolution returns a
  // different slug. The rename/dedupe path is a separate workflow — drift sync
  // is conservative.
  test("never overwrites an already-set venueId", () => {
    const patch = buildShowDriftUpdate(
      { ...localInSync, venueId: "existing-venue-uuid", ratingsCount: 11 },
      remote,
      "different-venue-uuid",
    );
    expect(patch).toEqual({
      averageRating: 3.7,
      ratingsCount: 12,
      notes: null,
      relistenUrl: null,
    });
  });

  // countForStats flip on an existing show is the primary stats divergence
  // fix: prod reclassifies a show as a soundcheck, local mirrors the change,
  // and the caller (orchestrator) feeds the show's date into the post-batch
  // rebuild. The patch itself just contains the flipped flag.
  test("emits countForStats when it drifts", () => {
    const remoteWithFlag: McpShow = { ...remote, countForStats: false };
    const localWithFlag = { ...localInSync, countForStats: true, dayOrder: null };
    const patch = buildShowDriftUpdate(localWithFlag, remoteWithFlag, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({ countForStats: false });
  });

  // dayOrder drift — patch carries only the changed field, doesn't churn the
  // aggregate block.
  test("emits dayOrder when it drifts", () => {
    const remoteWithOrder: McpShow = { ...remote, dayOrder: 2 };
    const localWithOrder = { ...localInSync, countForStats: true, dayOrder: 1 };
    const patch = buildShowDriftUpdate(localWithOrder, remoteWithOrder, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({ dayOrder: 2 });
  });

  // Combined drift: aggregate + flag + dayOrder all in one patch. Caller does
  // a single UPDATE, not three.
  test("combines aggregate, countForStats, and dayOrder drift into one patch", () => {
    const remoteWith: McpShow = { ...remote, ratingsCount: 13, countForStats: false, dayOrder: 2 };
    const localWith = { ...localInSync, ratingsCount: 12, countForStats: true, dayOrder: 1 };
    const patch = buildShowDriftUpdate(localWith, remoteWith, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({
      averageRating: 3.7,
      ratingsCount: 13,
      notes: null,
      relistenUrl: null,
      countForStats: false,
      dayOrder: 2,
    });
  });

  // Date drift in isolation: the row got dump-frozen with a date column that
  // doesn't match the slug (or doesn't match prod after a prod-side correction).
  // Patch contains only the date — caller does one UPDATE and the orchestrator
  // expands the gap rebuild window to the earlier of (old, new) date.
  test("emits the date field when it drifts", () => {
    const localWrongDate = { ...localInSync, date: "2025-11-14" };
    const patch = buildShowDriftUpdate(localWrongDate, remote, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({ date: "2025-11-15" });
  });

  // Date drift combined with aggregate drift: same UPDATE call carries both.
  test("combines date drift with aggregate drift in one patch", () => {
    const remoteWith: McpShow = { ...remote, ratingsCount: 13 };
    const localWrongBoth = { ...localInSync, date: "2025-11-14", ratingsCount: 12 };
    const patch = buildShowDriftUpdate(localWrongBoth, remoteWith, "venue-brooklyn-steel-uuid");
    expect(patch).toEqual({
      date: "2025-11-15",
      averageRating: 3.7,
      ratingsCount: 13,
      notes: null,
      relistenUrl: null,
    });
  });
});

// buildVenueCreateInput maps an MCP venue record to a Prisma Venue insert.
// Same explicit-timestamps constraint as Show/Song — Venue.createdAt/updatedAt
// have no default in the schema.
describe("buildVenueCreateInput", () => {
  test("maps a full MCP venue to a Prisma create input", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildVenueCreateInput(
      {
        slug: "the-uc-theatre",
        name: "The UC Theatre",
        city: "Berkeley",
        state: "CA",
        country: "US",
        timesPlayed: 3,
      },
      now,
    );
    expect(input).toEqual({
      slug: "the-uc-theatre",
      name: "The UC Theatre",
      city: "Berkeley",
      state: "CA",
      country: "US",
      timesPlayed: 3,
      street: null,
      postalCode: null,
      phone: null,
      website: null,
      latitude: null,
      longitude: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  // Contact + geocode fields land on insert when MCP supplies them. Previously
  // these were never written, so Venue pages on local sat blank even though
  // prod had street/phone/website populated.
  test("mirrors street/phone/website/lat-long/postalCode when MCP supplies them", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildVenueCreateInput(
      {
        slug: "red-rocks-amphitheatre",
        name: "Red Rocks Amphitheatre",
        city: "Morrison",
        state: "CO",
        country: "US",
        timesPlayed: 7,
        street: "18300 W Alameda Pkwy",
        postalCode: "80465",
        phone: "+1-720-865-2494",
        website: "https://redrocksonline.com",
        latitude: 39.6654,
        longitude: -105.2057,
      },
      now,
    );
    expect(input).toMatchObject({
      street: "18300 W Alameda Pkwy",
      postalCode: "80465",
      phone: "+1-720-865-2494",
      website: "https://redrocksonline.com",
      latitude: 39.6654,
      longitude: -105.2057,
    });
  });
});

// planVenueOrphans partitions local venues prod no longer returns into safe
// deletes (zero-show — nothing references them) and manual-cleanup warnings
// (still have local shows, likely a rename/merge upstream).
describe("planVenueOrphans", () => {
  const venues = [
    { id: "a", slug: "the-fillmore", name: "The Fillmore", showCount: 12 },
    { id: "b", slug: "stale-typo-venue", name: "Stale Typo Venue", showCount: 0 },
    { id: "c", slug: "renamed-venue", name: "Renamed Venue", showCount: 4 },
  ];

  // Only venues whose slug prod didn't return are candidates; a present venue
  // is never touched even if it has zero shows.
  test("ignores venues prod still returns", () => {
    const plan = planVenueOrphans(venues, new Set<string>());
    expect(plan.toDelete).toEqual([]);
    expect(plan.toWarn).toEqual([]);
  });

  test("deletes zero-show orphans and warns on orphans that still have shows", () => {
    const plan = planVenueOrphans(venues, new Set(["stale-typo-venue", "renamed-venue"]));

    expect(plan.toDelete).toEqual([{ id: "b", slug: "stale-typo-venue" }]);
    expect(plan.toWarn).toEqual([{ slug: "renamed-venue", name: "Renamed Venue", showCount: 4 }]);
  });
});

// buildVenueDriftUpdate mirrors prod's curated venue fields onto an existing
// local row. Identity is the venue slug; diff covers every column except
// `timesPlayed` (derived from Show count, not curated) and the search/legacy
// columns. Returns null when nothing drifted.
describe("buildVenueDriftUpdate", () => {
  const local = {
    name: "Red Rocks Amphitheatre",
    city: "Morrison",
    state: "CO",
    country: "US",
    street: "18300 W Alameda Pkwy",
    postalCode: "80465",
    phone: "+1-720-865-2494",
    website: "https://redrocksonline.com",
    latitude: 39.6654,
    longitude: -105.2057,
  };

  // Identical local + remote: skip the UPDATE. Re-runs idempotent.
  test("returns null when every mirrored field matches", () => {
    expect(
      buildVenueDriftUpdate(local, {
        slug: "red-rocks-amphitheatre",
        name: "Red Rocks Amphitheatre",
        city: "Morrison",
        state: "CO",
        country: "US",
        timesPlayed: 7,
        street: "18300 W Alameda Pkwy",
        postalCode: "80465",
        phone: "+1-720-865-2494",
        website: "https://redrocksonline.com",
        latitude: 39.6654,
        longitude: -105.2057,
      }),
    ).toBeNull();
  });

  // Website edit on prod — only `website` flows through.
  test("emits only the drifted field", () => {
    expect(
      buildVenueDriftUpdate(local, {
        slug: "red-rocks-amphitheatre",
        name: "Red Rocks Amphitheatre",
        city: "Morrison",
        state: "CO",
        country: "US",
        timesPlayed: 7,
        street: "18300 W Alameda Pkwy",
        postalCode: "80465",
        phone: "+1-720-865-2494",
        website: "https://redrocksonline.com/new-path",
        latitude: 39.6654,
        longitude: -105.2057,
      }),
    ).toEqual({ website: "https://redrocksonline.com/new-path" });
  });

  // Pre-deploy MCP omits contact + geocode columns. Sparse remote must not
  // claim drift on those fields — otherwise every existing venue would have
  // its phone/website/lat-long clobbered to null on the next sync.
  test("ignores contact and geocode fields when remote omits them", () => {
    expect(
      buildVenueDriftUpdate(local, {
        slug: "red-rocks-amphitheatre",
        name: "Red Rocks Amphitheatre",
        city: "Morrison",
        state: "CO",
        country: "US",
        timesPlayed: 7,
      }),
    ).toBeNull();
  });
});

// buildSongCreateInput handles songs that don't yet exist in the local DB.
// Title and slug are the only required scalars; everything else is best-effort
// from the MCP response. Timestamps must be set explicitly (same reason as Show).
describe("buildSongCreateInput", () => {
  // Full MCP song response: title/slug flow through; timesPlayed and play-date
  // fields are copied verbatim so local stats don't reset to zero on first sync.
  test("maps a full MCP song response", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildSongCreateInput(
      {
        slug: "basis-for-a-day",
        title: "Basis for a Day",
        author: "Disco Biscuits",
        lyrics: null,
        timesPlayed: 412,
        dateFirstPlayed: "1998-07-04",
        dateLastPlayed: "2026-02-06",
      },
      now,
    );
    expect(input).toEqual({
      slug: "basis-for-a-day",
      title: "Basis for a Day",
      lyrics: null,
      timesPlayed: 412,
      dateFirstPlayed: new Date("1998-07-04"),
      dateLastPlayed: new Date("2026-02-06"),
      kind: null,
      featuredLyric: null,
      tabs: null,
      notes: null,
      history: null,
      guitarTabsUrl: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  // Curated text fields (lyrics, tabs, notes, history, featuredLyric,
  // guitarTabsUrl) and the `kind` admin flag must mirror verbatim on insert.
  // These are the prod-curated columns the sync didn't previously write —
  // leaving them null on first insert meant Song pages looked empty on local
  // even though prod had content.
  test("mirrors curated admin fields when MCP supplies them", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildSongCreateInput(
      {
        slug: "crystal-ball",
        title: "Crystal Ball",
        author: "Disco Biscuits",
        lyrics: "And the sky lights up...",
        timesPlayed: 188,
        dateFirstPlayed: "2002-12-31",
        dateLastPlayed: "2025-07-04",
        kind: "original",
        featuredLyric: "And the sky lights up",
        tabs: "https://example/tabs",
        notes: "Type II launches frequent",
        history: "Debuted NYE 2002",
        guitarTabsUrl: "https://example/guitar",
      },
      now,
    );
    expect(input).toMatchObject({
      kind: "original",
      featuredLyric: "And the sky lights up",
      tabs: "https://example/tabs",
      notes: "Type II launches frequent",
      history: "Debuted NYE 2002",
      guitarTabsUrl: "https://example/guitar",
    });
  });

  // dateFirstPlayed / dateLastPlayed can be null for brand-new or unplayed songs.
  // Must NOT get coerced into an Invalid Date by `new Date(null)` — would poison
  // downstream queries that filter on these fields.
  test("passes null play dates through unchanged", () => {
    const now = new Date("2026-04-23T12:00:00Z");
    const input = buildSongCreateInput(
      {
        slug: "save-the-robots",
        title: "Save The Robots",
        author: null,
        lyrics: null,
        timesPlayed: 0,
        dateFirstPlayed: null,
        dateLastPlayed: null,
      },
      now,
    );
    expect(input.dateFirstPlayed).toBeNull();
    expect(input.dateLastPlayed).toBeNull();
  });
});

// buildSetlistReconciliation is the heart of the setlist sync: per-show
// insert / update / delete decisions, matched on (set, position). The key
// must be the composite tuple because position is unique only within a set —
// a three-set show reuses position 1 three times, so a position-only key
// collapses across sets. The structurallyChanged flag drives downstream
// effects (SegueRun regen, stats rebuild window), so the helper has to be
// precise about which diffs count as structural (insert / delete / songId
// change) vs cosmetic (segue / note / allTimer / annotation drift).
describe("buildSetlistReconciliation", () => {
  const songMap = new Map([
    ["basis-for-a-day", "song-basis-uuid"],
    ["aceetobee", "song-aceetobee-uuid"],
    ["crystal-ball", "song-crystal-uuid"],
    ["helicopters", "song-helicopters-uuid"],
    ["munchkin-invasion", "song-munchkin-uuid"],
    ["spacebirdmatingcall", "song-spacebird-uuid"],
    ["reactor", "song-reactor-uuid"],
  ]);

  // Canonical idempotent re-run: local already matches prod on every field.
  // No ops, neither structurally nor cosmetically changed.
  test("returns an empty reconciliation when local matches remote", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-basis-uuid",
        segue: ">",
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show-x",
      showDate: "2026-02-06",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              position: 1,
              songTitle: "Basis for a Day",
              songSlug: "basis-for-a-day",
              segue: ">",
              allTimer: false,
              note: null,
              annotations: [],
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon).toEqual({
      toInsert: [],
      toUpdate: [],
      toDelete: [],
      structurallyChanged: false,
      cosmeticallyChanged: false,
      unresolvedSongSlugs: [],
    });
  });

  // The Pine Creek failure mode: local has one track, prod has 15 across S1
  // / S2 / E1. Every (set, position) the local doesn't have becomes an insert,
  // every local key absent from remote becomes a delete. structurallyChanged
  // must flip on so SegueRun regen + stats rebuild fire.
  test("handles a near-empty local against a full prod setlist", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "lone-local-track",
        set: "S1",
        position: 1,
        songId: "song-spacebird-uuid", // local has the wrong song at S1/1
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "pine-creek",
      showDate: "2025-08-30",
      venue: { name: "Pine Creek Lodge", city: "Livingston", state: "MT" },
      sets: [
        {
          label: "S1",
          tracks: [
            // S1/1 exists in both but the songId differs → update + structural.
            { position: 1, songTitle: "Spectacle", songSlug: "basis-for-a-day", segue: ">" },
            { position: 2, songTitle: "Spacebird", songSlug: "spacebirdmatingcall", segue: ">" },
          ],
        },
        {
          label: "S2",
          tracks: [
            // S2/1 — note that a position-only key would collide with S1/1.
            { position: 1, songTitle: "Reactor", songSlug: "reactor", segue: ">" },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toInsert).toHaveLength(2);
    expect(recon.toInsert.map((i) => `${i.set}/${i.position}`).sort()).toEqual(["S1/2", "S2/1"]);
    expect(recon.toUpdate).toHaveLength(1);
    expect(recon.toUpdate[0]?.patch.songId).toBe("song-basis-uuid");
    expect(recon.toDelete).toHaveLength(0);
    expect(recon.structurallyChanged).toBe(true);
  });

  // Regression: a position-only key would collapse S1/1 and S2/1 into one
  // bucket. The composite key keeps them distinct so both ends of a track
  // that repeats across sets (e.g. set-ender → set-opener) sync correctly.
  test("treats the same position in different sets as distinct slots", () => {
    const local: LocalTrackForReconcile[] = [
      // Local has Reactor at S1/6 only — S2/1 is missing.
      {
        id: "track-s1-6",
        set: "S1",
        position: 6,
        songId: "song-reactor-uuid",
        segue: ">",
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "pine-creek",
      showDate: "2025-08-30",
      venue: { name: "Pine Creek Lodge", city: "Livingston", state: "MT" },
      sets: [
        {
          label: "S1",
          tracks: [{ position: 6, songTitle: "Reactor", songSlug: "reactor", segue: ">" }],
        },
        {
          label: "S2",
          tracks: [{ position: 1, songTitle: "Reactor", songSlug: "reactor", segue: ">" }],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    // S1/6 matches, S2/1 is inserted, nothing deleted.
    expect(recon.toUpdate).toHaveLength(0);
    expect(recon.toDelete).toHaveLength(0);
    expect(recon.toInsert).toHaveLength(1);
    expect(recon.toInsert[0]?.set).toBe("S2");
    expect(recon.toInsert[0]?.position).toBe(1);
    expect(recon.structurallyChanged).toBe(true);
  });

  // Local has a track at S1/3 that prod removed (setlist correction). The
  // delete op carries the annotation ids so the caller can wipe them in the
  // same transaction.
  test("emits delete ops for local tracks absent from remote, including their annotation ids", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-basis-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
      {
        id: "track-3-uuid",
        set: "S1",
        position: 3,
        songId: "song-aceetobee-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [
          { id: "ann-a-uuid", desc: "stray" },
          { id: "ann-b-uuid", desc: "still stray" },
        ],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [{ position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: null }],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toDelete).toHaveLength(1);
    expect(recon.toDelete[0]?.trackId).toBe("track-3-uuid");
    expect(recon.toDelete[0]?.annotationIds).toEqual(["ann-a-uuid", "ann-b-uuid"]);
    expect(recon.structurallyChanged).toBe(true);
  });

  // Same (set, position), different songId on prod — a setlist correction.
  // Patch songId, flag as structural so the gap rebuild window expands.
  test("treats a same-slot songId change as a structural update", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-helicopters-uuid", // local had Helicopters here
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [{ position: 1, songTitle: "Crystal Ball", songSlug: "crystal-ball", segue: null }],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toUpdate).toHaveLength(1);
    expect(recon.toUpdate[0]?.patch).toEqual({ songId: "song-crystal-uuid" });
    expect(recon.structurallyChanged).toBe(true);
    expect(recon.cosmeticallyChanged).toBe(false);
  });

  // Duration drift: prod resolved a duration our local row lacks. Patches the
  // value and its provenance together, counted as cosmetic (no SegueRun regen).
  test("patches a track duration mirrored from prod", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-crystal-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              position: 1,
              songTitle: "Crystal Ball",
              songSlug: "crystal-ball",
              segue: null,
              duration: 845,
              durationSource: "nugs",
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toUpdate[0]?.patch).toEqual({ duration: 845, durationSource: "nugs" });
    expect(recon.structurallyChanged).toBe(false);
    expect(recon.cosmeticallyChanged).toBe(true);
  });

  // A duration on a remote-only track rides onto the insert op.
  test("carries duration onto an inserted track", () => {
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              position: 1,
              songTitle: "Crystal Ball",
              songSlug: "crystal-ball",
              segue: null,
              duration: 845,
              durationSource: "archive",
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation([], remote, songMap);
    expect(recon.toInsert[0]).toMatchObject({ duration: 845, durationSource: "archive" });
  });

  // Cosmetic-only drift: segue / note / allTimer changed, songId is unchanged.
  // Must NOT flip structurallyChanged (no SegueRun regen needed for a segue
  // marker change — the trackIds array is still valid).
  test("flags cosmetic-only drift without setting structurallyChanged", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-crystal-uuid",
        segue: ">",
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              position: 1,
              songTitle: "Crystal Ball",
              songSlug: "crystal-ball",
              segue: ",",
              allTimer: true,
              note: "Glow-stick war peak",
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toUpdate[0]?.patch).toEqual({ segue: ",", allTimer: true, note: "Glow-stick war peak" });
    expect(recon.structurallyChanged).toBe(false);
    expect(recon.cosmeticallyChanged).toBe(true);
  });

  // Pre-deploy MCP shape: no allTimer / note / annotations keys. Don't claim
  // drift just because the payload is sparse, or admin-set values get wiped
  // on the next sync.
  test("ignores allTimer / note / annotations when remote omits them", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-crystal-uuid",
        segue: null,
        note: "kept locally",
        allTimer: true,
        duration: null,
        durationSource: null,
        annotations: [{ id: "ann-a-uuid", desc: "still here" }],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [{ position: 1, songTitle: "Crystal Ball", songSlug: "crystal-ball", segue: null }],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toUpdate).toEqual([]);
    expect(recon.structurallyChanged).toBe(false);
    expect(recon.cosmeticallyChanged).toBe(false);
  });

  // Annotation drift in isolation: track itself matches but the desc list
  // changed. Lands as a toUpdate op with the annotation delta — caller still
  // patches via track id, not a separate path.
  test("emits annotation delta on an otherwise-matching track", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-crystal-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [
          { id: "ann-keep-uuid", desc: "first time played" },
          { id: "ann-drop-uuid", desc: "to remove" },
        ],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show",
      showDate: "2025-08-30",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              position: 1,
              songTitle: "Crystal Ball",
              songSlug: "crystal-ball",
              segue: null,
              annotations: ["first time played", "with horns"],
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toUpdate).toHaveLength(1);
    expect(recon.toUpdate[0]?.patch).toEqual({});
    expect(recon.toUpdate[0]?.annotationDiff.toCreateDescs).toEqual(["with horns"]);
    expect(recon.toUpdate[0]?.annotationDiff.toDeleteIds).toEqual(["ann-drop-uuid"]);
    expect(recon.cosmeticallyChanged).toBe(true);
    expect(recon.structurallyChanged).toBe(false);
  });

  // Inserts carry their annotation strings inline (no track id exists yet)
  // so the caller can use a nested Prisma create. Defaults: allTimer=false,
  // note=null when the remote payload omits them.
  test("inserts carry inline annotation descs and default allTimer/note", () => {
    const recon = buildSetlistReconciliation(
      [],
      {
        showSlug: "show",
        showDate: "2025-08-30",
        venue: { name: "v", city: "c", state: "s" },
        sets: [
          {
            label: "S1",
            tracks: [
              {
                position: 1,
                songTitle: "Crystal Ball",
                songSlug: "crystal-ball",
                segue: ">",
                annotations: ["with horns"],
              },
              { position: 2, songTitle: "Helicopters", songSlug: "helicopters", segue: null, allTimer: true },
            ],
          },
        ],
      },
      songMap,
    );
    expect(recon.toInsert).toHaveLength(2);
    expect(recon.toInsert[0]).toMatchObject({
      set: "S1",
      position: 1,
      songId: "song-crystal-uuid",
      segue: ">",
      note: null,
      allTimer: false,
      annotationDescs: ["with horns"],
    });
    expect(recon.toInsert[1]).toMatchObject({ allTimer: true, annotationDescs: [] });
    expect(recon.structurallyChanged).toBe(true);
  });

  // Unresolved song slug on a remote-only slot: report it, don't insert. The
  // local row is untouched — better to skip than to insert with a wrong songId.
  test("reports unresolved song slugs on inserts without inserting them", () => {
    const recon = buildSetlistReconciliation(
      [],
      {
        showSlug: "show",
        showDate: "2025-08-30",
        venue: { name: "v", city: "c", state: "s" },
        sets: [
          {
            label: "S1",
            tracks: [{ position: 1, songTitle: "Mystery Song", songSlug: "mystery-song", segue: null }],
          },
        ],
      },
      songMap,
    );
    expect(recon.toInsert).toEqual([]);
    expect(recon.unresolvedSongSlugs).toEqual(["mystery-song"]);
    expect(recon.structurallyChanged).toBe(false);
  });

  // Unresolved song slug on an existing slot: don't drop the local track,
  // don't try to patch songId, but still process other drift on the row.
  test("reports unresolved song slugs on updates without clobbering songId", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "track-1-uuid",
        set: "S1",
        position: 1,
        songId: "song-crystal-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const recon = buildSetlistReconciliation(
      local,
      {
        showSlug: "show",
        showDate: "2025-08-30",
        venue: { name: "v", city: "c", state: "s" },
        sets: [
          {
            label: "S1",
            tracks: [{ position: 1, songTitle: "Mystery", songSlug: "mystery-song", segue: ">" }],
          },
        ],
      },
      songMap,
    );
    expect(recon.unresolvedSongSlugs).toEqual(["mystery-song"]);
    expect(recon.toUpdate).toHaveLength(1);
    expect(recon.toUpdate[0]?.patch).toEqual({ segue: ">" });
    expect(recon.toDelete).toEqual([]);
  });

  // Track-id mismatch: a previous sync inserted the local track with a
  // fresh Prisma-generated UUID (the buggy default before id preservation
  // landed). Same (set, position) but different id from prod's. The
  // reconciler must treat this as structural — emit a delete + reinsert
  // with prod's id so cross-environment ratings FK-resolve on the next
  // rating sync.
  test("treats same-(set,position)-but-different-id as a structural delete+reinsert", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "local-only-uuid-from-buggy-sync",
        set: "S1",
        position: 1,
        songId: "song-basis-uuid",
        segue: ">",
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [{ id: "ann-local", desc: "explosive intro" }],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show-x",
      showDate: "2026-02-06",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              id: "prod-track-uuid",
              position: 1,
              songTitle: "Basis for a Day",
              songSlug: "basis-for-a-day",
              segue: ">",
              allTimer: false,
              note: null,
              annotations: ["explosive intro"],
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.structurallyChanged).toBe(true);
    expect(recon.toDelete).toEqual([{ trackId: "local-only-uuid-from-buggy-sync", annotationIds: ["ann-local"] }]);
    expect(recon.toInsert).toHaveLength(1);
    expect(recon.toInsert[0]).toMatchObject({
      id: "prod-track-uuid",
      set: "S1",
      position: 1,
      songId: "song-basis-uuid",
      annotationDescs: ["explosive intro"],
    });
    // toUpdate is empty for this slot — the row is being rebuilt, not patched.
    expect(recon.toUpdate).toEqual([]);
  });

  // Same key, same id → normal patch path. Adding this case so the new
  // id-mismatch branch above doesn't silently swallow drift updates when
  // ids agree.
  test("ignores the id-mismatch branch when ids match (falls through to patch logic)", () => {
    const local: LocalTrackForReconcile[] = [
      {
        id: "shared-id",
        set: "S1",
        position: 1,
        songId: "song-basis-uuid",
        segue: null,
        note: null,
        allTimer: false,
        duration: null,
        durationSource: null,
        annotations: [],
      },
    ];
    const remote: McpSetlist = {
      showSlug: "show-x",
      showDate: "2026-02-06",
      venue: { name: "v", city: "c", state: "s" },
      sets: [
        {
          label: "S1",
          tracks: [
            {
              id: "shared-id",
              position: 1,
              songTitle: "Basis for a Day",
              songSlug: "basis-for-a-day",
              segue: ">", // segue drifts
              allTimer: false,
              note: null,
              annotations: [],
            },
          ],
        },
      ],
    };
    const recon = buildSetlistReconciliation(local, remote, songMap);
    expect(recon.toDelete).toEqual([]);
    expect(recon.toInsert).toEqual([]);
    expect(recon.toUpdate).toEqual([
      {
        trackId: "shared-id",
        patch: { segue: ">" },
        annotationDiff: { toCreateDescs: [], toDeleteIds: [] },
      },
    ]);
    expect(recon.structurallyChanged).toBe(false);
    expect(recon.cosmeticallyChanged).toBe(true);
  });
});

// diffTrackAnnotations replaces the local Annotation set for one track with
// whatever prod's MCP reports. Sync semantics are replace-not-merge: an
// annotation removed on prod must disappear locally on the next run.
// Identity is by `desc` text (the only content column) so a desc edit shows
// up as one delete + one create — the helper doesn't try to be clever about
// updates because Annotation has no other mutable content.
describe("diffTrackAnnotations", () => {
  // Canonical case: prod has [a, b], local has [a, c]. Keep a, delete c,
  // create b. The id of `c` is what the caller needs for the DELETE statement.
  test("returns the create/delete delta to reach the remote set", () => {
    const local = [
      { id: "ann-a-uuid", desc: "patches on patches" },
      { id: "ann-c-uuid", desc: "outdated annotation" },
    ];
    const remote = ["patches on patches", "tribal opener"];
    expect(diffTrackAnnotations(local, remote)).toEqual({
      toCreateDescs: ["tribal opener"],
      toDeleteIds: ["ann-c-uuid"],
    });
  });

  // No drift: identical sets in any order. No writes, no deletes — keeps
  // re-runs free of updatedAt churn on the parent track row.
  test("returns empty deltas when local and remote match (order-insensitive)", () => {
    const local = [
      { id: "ann-a-uuid", desc: "patches on patches" },
      { id: "ann-b-uuid", desc: "tribal opener" },
    ];
    const remote = ["tribal opener", "patches on patches"];
    expect(diffTrackAnnotations(local, remote)).toEqual({ toCreateDescs: [], toDeleteIds: [] });
  });

  // Pre-deploy MCP omits annotations entirely. `undefined` must mean "no
  // opinion" — never wipe out the local set. (Versus an explicit empty
  // array, which DOES mean "prod has zero annotations now; delete local".)
  test("returns empty deltas when remote annotations are undefined", () => {
    const local = [{ id: "ann-a-uuid", desc: "patches on patches" }];
    expect(diffTrackAnnotations(local, undefined)).toEqual({ toCreateDescs: [], toDeleteIds: [] });
  });

  // Explicit empty array means "prod has zero" — local must be wiped.
  test("deletes all local annotations when remote is explicitly empty", () => {
    const local = [
      { id: "ann-a-uuid", desc: "patches on patches" },
      { id: "ann-b-uuid", desc: "tribal opener" },
    ];
    expect(diffTrackAnnotations(local, [])).toEqual({
      toCreateDescs: [],
      toDeleteIds: ["ann-a-uuid", "ann-b-uuid"],
    });
  });
});

// buildRockOperaAssignmentDiff drives the show ↔ rock_operas join sync. Same
// "undefined means no opinion (pre-deploy MCP), explicit array is authoritative"
// semantics as diffTrackAnnotations / buildVenueDriftUpdate. Identity is by
// rock opera slug — slugs are the stable wire identifier (HAB resource page is
// served at /resources/hot-air-balloon regardless of UUID).
describe("buildRockOperaAssignmentDiff", () => {
  // Canonical case: local has the show tagged with CWB, prod has HAB + RIM.
  // Add HAB + RIM, remove CWB. Drives the sync transactional diff that mirrors
  // admin-curated rock-opera tagging.
  test("returns the add/remove delta to reach the remote set", () => {
    expect(
      buildRockOperaAssignmentDiff(["chemical-warfare-brigade"], ["hot-air-balloon", "revolution-in-motion"]),
    ).toEqual({
      toAdd: ["hot-air-balloon", "revolution-in-motion"],
      toRemove: ["chemical-warfare-brigade"],
    });
  });

  // No drift: same set in any order. No writes — keeps re-runs idempotent and
  // avoids churning updatedAt on either side.
  test("returns empty deltas when local and remote match (order-insensitive)", () => {
    expect(
      buildRockOperaAssignmentDiff(
        ["hot-air-balloon", "chemical-warfare-brigade"],
        ["chemical-warfare-brigade", "hot-air-balloon"],
      ),
    ).toEqual({ toAdd: [], toRemove: [] });
  });

  // Pre-deploy MCP omits rockOperaSlugs entirely. `undefined` means "no
  // opinion" — never wipe local tags. (Versus explicit empty array which
  // means "prod has cleared this show's tags; delete local".)
  test("returns empty deltas when remote is undefined (pre-deploy MCP)", () => {
    expect(buildRockOperaAssignmentDiff(["hot-air-balloon"], undefined)).toEqual({ toAdd: [], toRemove: [] });
  });

  // Explicit empty array: prod cleared all tags for this show — local must be
  // wiped. Distinguishing from `undefined` is the same pattern as
  // diffTrackAnnotations.
  test("removes all local tags when remote is explicitly empty", () => {
    expect(buildRockOperaAssignmentDiff(["hot-air-balloon", "chemical-warfare-brigade"], [])).toEqual({
      toAdd: [],
      toRemove: ["hot-air-balloon", "chemical-warfare-brigade"],
    });
  });
});

// diffShowMusicians mirrors a show's lineup the way diffTrackAnnotations
// mirrors annotations: identity by musician slug (the
// stable cross-env id), replace-not-merge, `undefined` = no opinion. The wrinkle
// is the second level — the instruments each musician played — which is diffed
// per retained musician so an unchanged re-run produces zero instrument writes.
describe("diffShowMusicians", () => {
  // Canonical case: prod adds Aron on keys, drops Marc. Sammy stays but picks
  // up a second instrument. Create Aron, delete Marc's row, add the new
  // instrument to Sammy without recreating his lineup row.
  test("returns create/delete plus per-musician instrument deltas", () => {
    const local = [
      { showMusicianId: "sm-marc", musicianSlug: "marc-brownstein", instrumentSlugs: ["bass"] },
      { showMusicianId: "sm-sammy", musicianSlug: "sam-altman", instrumentSlugs: ["drums"] },
    ];
    const remote = [
      { musicianSlug: "sam-altman", instrumentSlugs: ["drums", "percussion"] },
      { musicianSlug: "aron-magner", instrumentSlugs: ["keys"] },
    ];
    expect(diffShowMusicians(local, remote)).toEqual({
      toCreate: [{ musicianSlug: "aron-magner", instrumentSlugs: ["keys"] }],
      toDeleteShowMusicianIds: ["sm-marc"],
      toUpdateInstruments: [
        { showMusicianId: "sm-sammy", addInstrumentSlugs: ["percussion"], removeInstrumentSlugs: [] },
      ],
    });
  });

  // No drift: same musicians + instruments in any order. Zero ops keeps a
  // re-run from churning row ids or updatedAt on the lineup.
  test("returns empty deltas when local matches remote (order-insensitive)", () => {
    const local = [{ showMusicianId: "sm-1", musicianSlug: "jon-gutwillig", instrumentSlugs: ["guitar", "vocals"] }];
    const remote = [{ musicianSlug: "jon-gutwillig", instrumentSlugs: ["vocals", "guitar"] }];
    expect(diffShowMusicians(local, remote)).toEqual({
      toCreate: [],
      toDeleteShowMusicianIds: [],
      toUpdateInstruments: [],
    });
  });

  // Pre-deploy MCP omits lineup entirely → no opinion, never wipe local.
  test("returns empty deltas when remote is undefined", () => {
    const local = [{ showMusicianId: "sm-1", musicianSlug: "jon-gutwillig", instrumentSlugs: ["guitar"] }];
    expect(diffShowMusicians(local, undefined)).toEqual({
      toCreate: [],
      toDeleteShowMusicianIds: [],
      toUpdateInstruments: [],
    });
  });

  // Explicit empty array means prod cleared the lineup — delete every local row.
  test("deletes all lineup rows when remote is explicitly empty", () => {
    const local = [
      { showMusicianId: "sm-1", musicianSlug: "jon-gutwillig", instrumentSlugs: ["guitar"] },
      { showMusicianId: "sm-2", musicianSlug: "marc-brownstein", instrumentSlugs: ["bass"] },
    ];
    expect(diffShowMusicians(local, [])).toEqual({
      toCreate: [],
      toDeleteShowMusicianIds: ["sm-1", "sm-2"],
      toUpdateInstruments: [],
    });
  });
});

// diffTrackMusicians is diffShowMusicians plus a `present` boolean (sit-in vs
// sat-out). A flipped `present` on a retained musician is an update, not a
// delete+create, so the row id survives.
describe("diffTrackMusicians", () => {
  // Sammy was a sat-out (present=false), prod now records him as a sit-in
  // (present=true) on drums. Patch present, no row churn.
  test("patches present when a retained musician's sit-in/sat-out flips", () => {
    const local = [{ trackMusicianId: "tm-sammy", musicianSlug: "sam-altman", present: false, instrumentSlugs: [] }];
    const remote = [{ musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }];
    expect(diffTrackMusicians(local, remote)).toEqual({
      toCreate: [],
      toDeleteTrackMusicianIds: [],
      toUpdate: [
        { trackMusicianId: "tm-sammy", present: true, addInstrumentSlugs: ["drums"], removeInstrumentSlugs: [] },
      ],
    });
  });

  // New sit-in inserted, stale delta removed, untouched delta produces nothing.
  test("creates new deltas and deletes ones prod dropped", () => {
    const local = [
      { trackMusicianId: "tm-old", musicianSlug: "allen-aucoin", present: true, instrumentSlugs: ["drums"] },
    ];
    const remote = [{ musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }];
    expect(diffTrackMusicians(local, remote)).toEqual({
      toCreate: [{ musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }],
      toDeleteTrackMusicianIds: ["tm-old"],
      toUpdate: [],
    });
  });

  // No drift → no ops; omits `present` from the update when only instruments
  // (here: nothing) would change.
  test("returns empty deltas when local matches remote", () => {
    const local = [{ trackMusicianId: "tm-1", musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }];
    const remote = [{ musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }];
    expect(diffTrackMusicians(local, remote)).toEqual({ toCreate: [], toDeleteTrackMusicianIds: [], toUpdate: [] });
  });

  test("returns empty deltas when remote is undefined", () => {
    const local = [{ trackMusicianId: "tm-1", musicianSlug: "sam-altman", present: true, instrumentSlugs: ["drums"] }];
    expect(diffTrackMusicians(local, undefined)).toEqual({ toCreate: [], toDeleteTrackMusicianIds: [], toUpdate: [] });
  });
});

// diffTrackFlags is the diffTrackAnnotations contract over the flag enum names.
describe("diffTrackFlags", () => {
  test("returns the add/remove delta to reach the remote flag set", () => {
    expect(diffTrackFlags(["DYSLEXIC"], ["DYSLEXIC", "INVERTED"])).toEqual({ toAdd: ["INVERTED"], toRemove: [] });
    expect(diffTrackFlags(["DYSLEXIC", "UNFINISHED"], ["DYSLEXIC"])).toEqual({ toAdd: [], toRemove: ["UNFINISHED"] });
  });

  test("returns empty deltas when remote is undefined (pre-deploy MCP)", () => {
    expect(diffTrackFlags(["DYSLEXIC"], undefined)).toEqual({ toAdd: [], toRemove: [] });
  });

  test("removes all flags when remote is explicitly empty", () => {
    expect(diffTrackFlags(["DYSLEXIC", "INVERTED"], [])).toEqual({ toAdd: [], toRemove: ["DYSLEXIC", "INVERTED"] });
  });
});

// Completions cross shows and reference tracks by natural key. resolveCompletionLinks
// turns the (slug,set,position) endpoints into local track ids, dropping links
// whose other end isn't in the synced scope; diffCompletions then computes the
// upsert/delete set keyed by the UNIQUE earlier track.
describe("resolveCompletionLinks", () => {
  const keyMap = new Map([
    ["2026-01-01-show|S1|3", "track-earlier"],
    ["2026-01-01-show|S2|1", "track-later"],
  ]);

  // Both endpoints local → resolved to their local track ids.
  test("resolves links whose both endpoints are local", () => {
    const links = [
      {
        later: { showSlug: "2026-01-01-show", set: "S2", position: 1 },
        earlier: { showSlug: "2026-01-01-show", set: "S1", position: 3 },
      },
    ];
    expect(resolveCompletionLinks(links, keyMap)).toEqual({
      resolved: [{ earlierTrackId: "track-earlier", laterTrackId: "track-later" }],
      skipped: [],
    });
  });

  // Earlier track in an un-synced show → skipped, never a dangling FK.
  test("skips links whose earlier track is out of scope", () => {
    const links = [
      {
        later: { showSlug: "2026-01-01-show", set: "S2", position: 1 },
        earlier: { showSlug: "1999-12-31-other", set: "S1", position: 5 },
      },
    ];
    expect(resolveCompletionLinks(links, keyMap)).toEqual({ resolved: [], skipped: links });
  });
});

describe("diffCompletions", () => {
  // Re-point: the earlier track already has a completer locally, prod moved it
  // to a different later track. Keyed by earlierTrackId, that's an upsert (one
  // entry), not a second insert that would violate the unique constraint.
  test("upserts a re-pointed completion rather than duplicating it", () => {
    const local = [{ earlierTrackId: "e1", laterTrackId: "old-later" }];
    const desired = [{ earlierTrackId: "e1", laterTrackId: "new-later" }];
    expect(diffCompletions(local, desired)).toEqual({
      toUpsert: [{ earlierTrackId: "e1", laterTrackId: "new-later" }],
      toDeleteEarlierTrackIds: [],
    });
  });

  // A chain A→B→C: B completes A, C completes B. Two distinct earlier tracks,
  // two upserts, nothing deleted.
  test("upserts each link of a completion chain independently", () => {
    const desired = [
      { earlierTrackId: "track-a", laterTrackId: "track-b" },
      { earlierTrackId: "track-b", laterTrackId: "track-c" },
    ];
    expect(diffCompletions([], desired)).toEqual({ toUpsert: desired, toDeleteEarlierTrackIds: [] });
  });

  // Prod dropped a completion that exists locally → delete by earlier track id.
  test("deletes local completions prod no longer reports", () => {
    const local = [{ earlierTrackId: "e1", laterTrackId: "l1" }];
    expect(diffCompletions(local, [])).toEqual({ toUpsert: [], toDeleteEarlierTrackIds: ["e1"] });
  });

  // No drift → no ops.
  test("returns empty deltas when local matches desired", () => {
    const same = [{ earlierTrackId: "e1", laterTrackId: "l1" }];
    expect(diffCompletions(same, same)).toEqual({ toUpsert: [], toDeleteEarlierTrackIds: [] });
  });
});

// buildSongDriftUpdate diffs an existing local Song row against the latest
// MCP response and returns a patch — only the curated admin fields (title,
// lyrics, kind, featuredLyric, tabs, notes, history, guitarTabsUrl). It
// intentionally does NOT touch the derived stats columns
// (timesPlayed, dateFirstPlayed, dateLastPlayed, yearlyPlayData) — those are
// owned by the post-sync rebuild and would otherwise race against it.
describe("buildSongDriftUpdate", () => {
  const localBase = {
    title: "Crystal Ball",
    lyrics: "And the sky lights up...",
    kind: "original",
    featuredLyric: "And the sky lights up",
    tabs: null,
    notes: null,
    history: null,
    guitarTabsUrl: null,
  };

  // No drift across every mirrored field: skip the UPDATE. Re-runs stay
  // idempotent — updatedAt doesn't churn on unchanged songs.
  test("returns null when every curated field matches", () => {
    expect(
      buildSongDriftUpdate(localBase, {
        slug: "crystal-ball",
        title: "Crystal Ball",
        author: "Disco Biscuits",
        lyrics: "And the sky lights up...",
        timesPlayed: 188,
        dateFirstPlayed: null,
        dateLastPlayed: null,
        kind: "original",
        featuredLyric: "And the sky lights up",
      }),
    ).toBeNull();
  });

  // Lyrics edit on prod (typo fix or expansion) mirrors locally. Patch
  // contains only the lyrics field — no churn on the rest of the row.
  test("emits only the lyrics field when lyrics drifts", () => {
    const patch = buildSongDriftUpdate(localBase, {
      slug: "crystal-ball",
      title: "Crystal Ball",
      author: "Disco Biscuits",
      lyrics: "And the sky lights up (extended)",
      timesPlayed: 188,
      dateFirstPlayed: null,
      dateLastPlayed: null,
    });
    expect(patch).toEqual({ lyrics: "And the sky lights up (extended)" });
  });

  // Multi-field drift: title rename + new featuredLyric + kind change
  // bundle into one patch — one UPDATE round-trip instead of three.
  test("combines multiple drifted fields into one patch", () => {
    const patch = buildSongDriftUpdate(localBase, {
      slug: "crystal-ball",
      title: "Crystal Ball (Reprise)",
      author: "Disco Biscuits",
      lyrics: "And the sky lights up...",
      timesPlayed: 188,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      kind: "cover",
      featuredLyric: "Glow stick crescendo",
    });
    expect(patch).toEqual({
      title: "Crystal Ball (Reprise)",
      kind: "cover",
      featuredLyric: "Glow stick crescendo",
    });
  });

  // Pre-deploy MCP omits the new curated fields. Sparse remote payload must
  // never claim drift on `kind` / `featuredLyric` / `tabs` / `notes` /
  // `history` / `guitarTabsUrl` — otherwise every existing song would have
  // those fields clobbered to null on the next sync.
  test("ignores curated fields when remote omits them", () => {
    expect(
      buildSongDriftUpdate(localBase, {
        slug: "crystal-ball",
        title: "Crystal Ball",
        author: "Disco Biscuits",
        lyrics: "And the sky lights up...",
        timesPlayed: 188,
        dateFirstPlayed: null,
        dateLastPlayed: null,
      }),
    ).toBeNull();
  });

  // Patch never touches the derived stats columns even when the MCP payload
  // includes new play data. Stats are owned by the post-sync rebuild.
  test("never emits derived stats columns even when remote reports new values", () => {
    const patch = buildSongDriftUpdate(localBase, {
      slug: "crystal-ball",
      title: "Crystal Ball",
      author: "Disco Biscuits",
      lyrics: "Lyrics edit",
      timesPlayed: 999,
      dateFirstPlayed: "1999-01-01",
      dateLastPlayed: "2026-05-22",
    });
    expect(patch).not.toHaveProperty("timesPlayed");
    expect(patch).not.toHaveProperty("dateFirstPlayed");
    expect(patch).not.toHaveProperty("dateLastPlayed");
  });
});

describe("stubUserEmail / STUB_USER_PASSWORD_DIGEST", () => {
  // Stub users' email and passwordDigest satisfy NOT NULL constraints
  // without leaking real PII. The shape is asserted here as a regression
  // guard — production sync output uses these values and changing them
  // breaks existing local DBs.
  test("stubUserEmail is deterministic and prefixed with stub-", () => {
    expect(stubUserEmail("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe(
      "stub-a1b2c3d4-e5f6-7890-abcd-ef1234567890@local.invalid",
    );
  });

  test("STUB_USER_PASSWORD_DIGEST is a static placeholder, not a real digest", () => {
    expect(STUB_USER_PASSWORD_DIGEST).toBe("STUB");
  });
});

/**
 * Build a stub prisma client that responds to the calls syncUserActivity
 * makes. Each table is seeded with an array; lookups, upserts, and deletes
 * mutate the array directly so assertions can read the final state.
 */
type StubUserRow = {
  id: string;
  email: string;
  passwordDigest: string;
  username: string | null;
  avatarFileId: string | null;
  avatarFileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  _refs?: { ratings: number; attendances: number; reviews: number; blogPosts: number };
};
type StubRatingRow = {
  id: string;
  userId: string;
  value: number;
  rateableType: string;
  rateableId: string;
  createdAt: Date;
  updatedAt: Date;
};
type StubAttendanceRow = {
  id: string;
  userId: string;
  showId: string;
  createdAt: Date;
  updatedAt: Date;
};

function makeStubDb(seed: {
  users?: StubUserRow[];
  ratings?: StubRatingRow[];
  attendances?: StubAttendanceRow[];
  shows?: Array<{ id: string; slug: string }>;
  tracks?: Array<{ id: string; showId: string }>;
}) {
  const users = seed.users ?? [];
  const ratings = seed.ratings ?? [];
  const attendances = seed.attendances ?? [];
  const shows = seed.shows ?? [];
  const tracks = seed.tracks ?? [];

  const findFirstByMaxUpdatedAt = <T extends { updatedAt: Date }>(rows: T[]) => {
    if (rows.length === 0) return null;
    return rows.slice().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
  };

  const db = {
    user: {
      findFirst: vi.fn(async () => findFirstByMaxUpdatedAt(users)),
      findMany: vi.fn(
        async (args?: {
          where?: { id?: { in?: string[] }; username?: { in?: string[] } };
          select?: Record<string, unknown>;
        }) => {
          let matching = users;
          if (args?.where?.id?.in) {
            const idSet = new Set(args.where.id.in);
            matching = matching.filter((u) => idSet.has(u.id));
          }
          if (args?.where?.username?.in) {
            const unameSet = new Set(args.where.username.in);
            matching = matching.filter((u) => u.username !== null && unameSet.has(u.username));
          }
          if (args?.select && (args.select as Record<string, unknown>)._count) {
            return matching.map((u) => ({
              id: u.id,
              _count: u._refs ?? { ratings: 0, attendances: 0, reviews: 0, blogPosts: 0 },
            }));
          }
          if (args?.select && (args.select as Record<string, unknown>).username) {
            return matching.map((u) => ({ id: u.id, username: u.username }));
          }
          return matching.map((u) => ({ id: u.id }));
        },
      ),
      upsert: vi.fn(async (args: { where: { id: string }; create: StubUserRow; update: Partial<StubUserRow> }) => {
        const existing = users.find((u) => u.id === args.where.id);
        if (existing) {
          Object.assign(existing, args.update);
          return existing;
        }
        users.push(args.create);
        return args.create;
      }),
      create: vi.fn(async (args: { data: StubUserRow }) => {
        users.push(args.data);
        return args.data;
      }),
      update: vi.fn(async (args: { where: { id: string }; data: Partial<StubUserRow> }) => {
        const u = users.find((row) => row.id === args.where.id);
        if (!u) throw new Error("user not found");
        Object.assign(u, args.data);
        return u;
      }),
      deleteMany: vi.fn(async (args: { where: { id: { in: string[] } } }) => {
        const ids = new Set(args.where.id.in);
        for (let i = users.length - 1; i >= 0; i--) {
          if (ids.has(users[i].id)) users.splice(i, 1);
        }
        return { count: ids.size };
      }),
    },
    rating: {
      findFirst: vi.fn(async () => findFirstByMaxUpdatedAt(ratings)),
      findMany: vi.fn(async () =>
        ratings.map((r) => ({ id: r.id, userId: r.userId, rateableId: r.rateableId, rateableType: r.rateableType })),
      ),
      upsert: vi.fn(
        async (args: {
          where: {
            id?: string;
            userId_rateableId_rateableType?: { userId: string; rateableId: string; rateableType: string };
          };
          create: StubRatingRow;
          update: Partial<StubRatingRow>;
        }) => {
          // Mirror Prisma: look up by whichever unique key the caller passed.
          // The script uses the compound key to absorb stale-id rows; tests
          // that pre-seed a row with the same compound key should see it
          // matched, not a duplicate insert.
          const existing = args.where.id
            ? ratings.find((r) => r.id === args.where.id)
            : args.where.userId_rateableId_rateableType
              ? ratings.find(
                  (r) =>
                    r.userId === args.where.userId_rateableId_rateableType?.userId &&
                    r.rateableId === args.where.userId_rateableId_rateableType.rateableId &&
                    r.rateableType === args.where.userId_rateableId_rateableType.rateableType,
                )
              : undefined;
          if (existing) {
            Object.assign(existing, args.update);
            return existing;
          }
          // Mirror the primary-key constraint: a create whose id is already
          // taken by a different (compound-key) row throws P2002, exactly as
          // Postgres does on the id-preserving insert path.
          if (ratings.some((r) => r.id === args.create.id)) throw prismaUniqueIdError();
          ratings.push(args.create);
          return args.create;
        },
      ),
      deleteMany: vi.fn(async (args: { where: { id: { in: string[] } } }) => {
        const ids = new Set(args.where.id.in);
        for (let i = ratings.length - 1; i >= 0; i--) {
          if (ids.has(ratings[i].id)) ratings.splice(i, 1);
        }
        return { count: ids.size };
      }),
    },
    attendance: {
      findFirst: vi.fn(async () => findFirstByMaxUpdatedAt(attendances)),
      findMany: vi.fn(async () => attendances.map((a) => ({ id: a.id, userId: a.userId, showId: a.showId }))),
      upsert: vi.fn(
        async (args: {
          where: { id?: string; userId_showId?: { userId: string; showId: string } };
          create: StubAttendanceRow;
          update: Partial<StubAttendanceRow>;
        }) => {
          const existing = args.where.id
            ? attendances.find((a) => a.id === args.where.id)
            : args.where.userId_showId
              ? attendances.find(
                  (a) => a.userId === args.where.userId_showId?.userId && a.showId === args.where.userId_showId.showId,
                )
              : undefined;
          if (existing) {
            Object.assign(existing, args.update);
            return existing;
          }
          if (attendances.some((a) => a.id === args.create.id)) throw prismaUniqueIdError();
          attendances.push(args.create);
          return args.create;
        },
      ),
      deleteMany: vi.fn(async (args: { where: { id: { in: string[] } } }) => {
        const ids = new Set(args.where.id.in);
        for (let i = attendances.length - 1; i >= 0; i--) {
          if (ids.has(attendances[i].id)) attendances.splice(i, 1);
        }
        return { count: ids.size };
      }),
    },
    show: {
      findUnique: vi.fn(async (args: { where: { id: string } }) => {
        const s = shows.find((row) => row.id === args.where.id);
        return s ? { id: s.id, slug: s.slug } : null;
      }),
      findMany: vi.fn(async (args: { where: { id: { in: string[] } } }) => {
        const ids = new Set(args.where.id.in);
        return shows.filter((s) => ids.has(s.id)).map((s) => ({ slug: s.slug, id: s.id }));
      }),
    },
    track: {
      findUnique: vi.fn(async (args: { where: { id: string } }) => {
        const t = tracks.find((row) => row.id === args.where.id);
        return t ? { id: t.id } : null;
      }),
      findMany: vi.fn(async (args: { where: { id: { in: string[] } }; select?: { id?: boolean } }) => {
        const ids = new Set(args.where.id.in);
        const matching = tracks.filter((t) => ids.has(t.id));
        // The FK existence check selects { id }; the aggregate-rebuild slug
        // lookup selects { show: { slug } }. Return the requested shape.
        if (args.select?.id) return matching.map((t) => ({ id: t.id }));
        return matching.map((t) => {
          const show = shows.find((s) => s.id === t.showId);
          return { show: { slug: show?.slug ?? null } };
        });
      }),
    },
  };

  return { db, state: { users, ratings, attendances } };
}

/**
 * Build a stub mcp() callback that returns the prepared responses for each
 * (toolName, callIndex). Helps tests assemble fully-paginated mock streams.
 */
function makeStubMcp(responses: Record<string, unknown[]>) {
  const indexes: Record<string, number> = {};
  return async <T>(toolName: string, _args: Record<string, unknown>): Promise<T> => {
    const queue = responses[toolName];
    if (!queue) throw new Error(`No stub response for ${toolName}`);
    const i = indexes[toolName] ?? 0;
    indexes[toolName] = i + 1;
    return queue[i] as T;
  };
}

// Minimal RatingService stub for syncUserActivity tests. Only
// rebuildAggregatesFor is invoked — every other RatingService method is out
// of scope here. We cast through `unknown` to RatingService so call sites
// can pass this in where the real class is expected, and we expose the
// inner mock as `.rebuildAggregatesFor` directly so assertions stay terse.
const stubRatingService = (): RatingService & { rebuildAggregatesFor: ReturnType<typeof vi.fn> } =>
  ({
    rebuildAggregatesFor: vi.fn(async () => {}),
  }) as unknown as RatingService & { rebuildAggregatesFor: ReturnType<typeof vi.fn> };

describe("syncUserActivity — incremental mode", () => {
  // Stub user insert path: synthetic email + STUB digest, real id +
  // username + avatar + timestamps from prod. Guards against future
  // refactors leaking real email or names into the local DB.
  test("inserts a new stub user with synthetic email/passwordDigest and prod username/avatar", async () => {
    const { db, state } = makeStubDb({});
    const mcp = makeStubMcp({
      list_users_since: [
        {
          users: [
            {
              id: "u-marc",
              username: "trance-marc",
              avatarFileId: null,
              avatarFileUrl: "https://cdn.example/marc.jpg",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.users).toHaveLength(1);
    const created = state.users[0];
    expect(created).toMatchObject({
      id: "u-marc",
      email: "stub-u-marc@local.invalid",
      passwordDigest: "STUB",
      username: "trance-marc",
      avatarFileUrl: "https://cdn.example/marc.jpg",
    });
  });

  // Rating insert path: upsert by id, then collect the (Show, showId) pair
  // so the aggregate rebuild runs once at the end. The show's slug lands
  // in changedSlugs so the outer cache-invalidation pass clears the cached
  // show.data payload that embeds Show.averageRating.
  test("upserts a Show rating and triggers aggregate rebuild + cache invalidation", async () => {
    const ratingService = stubRatingService();
    const changedSlugs = new Set<string>();
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-1",
              userId: "u-marc",
              value: 5,
              rateableType: "Show",
              rateableId: "show-1",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService,
      cacheInvalidation: null,
      changedSlugs,
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(1);
    expect(state.ratings[0]).toMatchObject({ id: "r-1", userId: "u-marc", value: 5 });
    expect(ratingService.rebuildAggregatesFor).toHaveBeenCalledWith([{ rateableId: "show-1", rateableType: "Show" }]);
    expect(changedSlugs.has("2024-08-12-cap-theatre")).toBe(true);
  });

  // FK guard: ratings whose user / show / track isn't local must be
  // warned-and-skipped, not crashed. Sync narrows the year window for the
  // shows pass, so old shows referenced by ratings legitimately may not be
  // local — silently dropping would be wrong, but raising would block the
  // whole pass.
  test("skips a Track rating whose track isn't local", async () => {
    const ratingService = stubRatingService();
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      tracks: [], // No local tracks — the rating's rateableId can't resolve
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-orphan",
              userId: "u-marc",
              value: 4,
              rateableType: "Track",
              rateableId: "track-missing",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    const result = await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService,
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(0);
    expect(result.ratingsFkSkipped).toBe(1);
    expect(ratingService.rebuildAggregatesFor).not.toHaveBeenCalled();
  });

  // Attendance insert path: same upsert-by-id shape as ratings; show.slug
  // lands in changedSlugs so the outer cache-invalidation pass clears the
  // affected show's listing payload.
  test("upserts an attendance and stamps the show slug into changedSlugs", async () => {
    const changedSlugs = new Set<string>();
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [
        {
          attendances: [
            {
              id: "a-1",
              userId: "u-marc",
              showId: "show-1",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs,
      now: new Date(),
      mcp,
    });

    expect(state.attendances).toHaveLength(1);
    expect(state.attendances[0]).toMatchObject({ id: "a-1", userId: "u-marc", showId: "show-1" });
    expect(changedSlugs.has("2024-08-12-cap-theatre")).toBe(true);
  });

  // Cursor: MAX(updatedAt) on the local table is the implicit checkpoint.
  // Repeated runs ask prod for rows newer than that — the first run pulls
  // everything (cursor=epoch), the second pulls only the delta.
  test("uses local MAX(updatedAt) as the incremental cursor", async () => {
    const { db } = makeStubDb({
      users: [
        {
          id: "u-1",
          email: "stub-u-1@local.invalid",
          passwordDigest: "STUB",
          username: "user-1",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-08-12T00:00:00Z"),
        },
      ],
    });
    const calls: Array<{ tool: string; args: Record<string, unknown> }> = [];
    const mcp = async <T>(toolName: string, args: Record<string, unknown>): Promise<T> => {
      calls.push({ tool: toolName, args });
      if (toolName === "list_users_since") return { users: [], nextCursor: null } as T;
      if (toolName === "list_ratings_since") return { ratings: [], nextCursor: null } as T;
      if (toolName === "list_attendances_since") return { attendances: [], nextCursor: null } as T;
      throw new Error(`unexpected tool ${toolName}`);
    };

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    const usersCall = calls.find((c) => c.tool === "list_users_since");
    expect(usersCall?.args.since).toBe("2024-08-12T00:00:00.000Z");
  });
});

describe("syncUserActivity — full-users mode", () => {
  // Full mode reconciliation: ratings present locally but not on prod get
  // deleted, and the affected rateable lands in the aggregate-rebuild set so
  // its Show.averageRating / ratingsCount gets recomputed to zero.
  test("deletes a local rating that's not on prod and triggers aggregate rebuild", async () => {
    const ratingService = stubRatingService();
    const { db, state } = makeStubDb({
      users: [],
      ratings: [
        {
          id: "r-stale",
          userId: "u-marc",
          value: 5,
          rateableType: "Show",
          rateableId: "show-1",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
      list_all_attendance_ids: [{ ids: [] }],
      list_all_rating_ids: [{ ids: [] }],
      list_all_user_ids: [{ ids: [] }],
    });

    const result = await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: true,
      pruneOrphans: true,
      ratingService,
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(0);
    expect(result.ratingsDeleted).toBe(1);
    expect(ratingService.rebuildAggregatesFor).toHaveBeenCalledWith([{ rateableId: "show-1", rateableType: "Show" }]);
  });

  // Default (non-full) mode never deletes — additive sync is the safe
  // default so locally-created test data isn't wiped on every run.
  test("does NOT delete missing local rows in default incremental mode", async () => {
    const { db, state } = makeStubDb({
      ratings: [
        {
          id: "r-stale",
          userId: "u-marc",
          value: 5,
          rateableType: "Show",
          rateableId: "show-1",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    const result = await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(1);
    expect(result.ratingsDeleted).toBe(0);
  });
});

describe("syncUserActivity — compound-key upserts", () => {
  // Regression for the live-run failure: local DBs seeded from older prod
  // dumps can hold an attendance with the same (userId, showId) as prod but
  // a different id. Upserting by id would hit
  // attendances_user_id_show_id_unique on insert; upserting by the compound
  // key absorbs the existing row cleanly.
  test("attendance with same (userId, showId) but different id updates in place", async () => {
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
      attendances: [
        {
          id: "att-local-stale-id",
          userId: "u-marc",
          showId: "show-1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [
        {
          attendances: [
            {
              id: "att-prod-new-id",
              userId: "u-marc",
              showId: "show-1",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    // Only one local row — the stale-id local row absorbed the update via
    // the compound key. Its id stays local for now; --full-users converges
    // it back to prod on a later run.
    expect(state.attendances).toHaveLength(1);
    expect(state.attendances[0].id).toBe("att-local-stale-id");
    expect(state.attendances[0].updatedAt.toISOString()).toBe("2024-08-12T00:00:00.000Z");
  });

  // Same regression as above, for ratings. Local row with same
  // (userId, rateableId, rateableType) but different id absorbs the update
  // via ratings_user_id_rateable_id_rateable_type_unique.
  test("rating with same (userId, rateableId, rateableType) but different id updates in place", async () => {
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
      ratings: [
        {
          id: "r-local-stale-id",
          userId: "u-marc",
          value: 3,
          rateableType: "Show",
          rateableId: "show-1",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-prod-new-id",
              userId: "u-marc",
              value: 5,
              rateableType: "Show",
              rateableId: "show-1",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(1);
    expect(state.ratings[0].id).toBe("r-local-stale-id");
    expect(state.ratings[0].value).toBe(5);
  });
});

describe("findSquatterIds", () => {
  // A local row whose id prod binds to a DIFFERENT compound key is a squatter:
  // it occupies an id prod needs for other content. Only those ids are returned.
  test("flags local ids prod binds to a different compound key", () => {
    const prodKeyById = new Map([
      ["id-1", "user-a rate-cap Show"],
      ["id-2", "user-a rate-starland Show"],
    ]);
    const local = [
      { id: "id-1", key: "user-a rate-starland Show" }, // squatter: prod says id-1 is the cap rating
      { id: "id-2", key: "user-a rate-starland Show" }, // matches prod — not a squatter
    ];
    expect(findSquatterIds(local, prodKeyById)).toEqual(["id-1"]);
  });

  // A local id absent from prod's map is the prune's job (id not on prod at
  // all), not a binding conflict — the reconcile leaves it alone.
  test("ignores local ids prod doesn't have", () => {
    const prodKeyById = new Map([["id-1", "user-a rate-cap Show"]]);
    const local = [{ id: "id-orphan", key: "user-a rate-cap Show" }];
    expect(findSquatterIds(local, prodKeyById)).toEqual([]);
  });

  test("returns nothing when every binding matches", () => {
    const prodKeyById = new Map([["id-1", "user-a rate-cap Show"]]);
    expect(findSquatterIds([{ id: "id-1", key: "user-a rate-cap Show" }], prodKeyById)).toEqual([]);
  });
});

// The epoch id-binding reconcile: prod owns the rating/attendance id namespace.
// A local DB can hold an id prod has since rebound to different content; the
// id-preserving create then collides on the primary key (the compound-key
// upsert can't help — different key → falls to create). Epoch mode deletes the
// squatter first, so prod's real row inserts under its id and the squatter's own
// content re-inserts under ITS prod id in the same pass. Without it, the prod
// row that wanted the squatted id is silently dropped (the live-run failure).
describe("syncUserActivity — epoch id-binding reconcile", () => {
  test("rebinds a rating whose id prod now assigns to a different show", async () => {
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [
        { id: "show-cap", slug: "2024-08-12-cap-theatre" },
        { id: "show-starland", slug: "2025-03-15-starland-ballroom" },
      ],
      ratings: [
        {
          id: "r-shared",
          userId: "u-marc",
          value: 3,
          rateableType: "Show",
          rateableId: "show-starland",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-shared",
              userId: "u-marc",
              value: 5,
              rateableType: "Show",
              rateableId: "show-cap",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
            {
              id: "r-starland-real",
              userId: "u-marc",
              value: 4,
              rateableType: "Show",
              rateableId: "show-starland",
              createdAt: "2025-03-15T00:00:00Z",
              updatedAt: "2025-03-15T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
      list_all_attendance_ids: [{ ids: [] }],
      list_all_rating_ids: [{ ids: ["r-shared", "r-starland-real"] }],
      list_all_user_ids: [{ ids: ["u-marc"] }],
    });

    const result = await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: true,
      pruneOrphans: true,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(result.ratingsReconciled).toBe(1);
    const byId = new Map(state.ratings.map((r) => [r.id, r]));
    expect(byId.get("r-shared")).toMatchObject({ rateableId: "show-cap", value: 5 });
    expect(byId.get("r-starland-real")).toMatchObject({ rateableId: "show-starland", value: 4 });
    expect(state.ratings).toHaveLength(2);
  });

  test("rebinds an attendance whose id prod now assigns to a different show", async () => {
    const { db, state } = makeStubDb({
      users: [
        {
          id: "u-marc",
          email: "stub-u-marc@local.invalid",
          passwordDigest: "STUB",
          username: "trance-marc",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ],
      shows: [
        { id: "show-cap", slug: "2024-08-12-cap-theatre" },
        { id: "show-starland", slug: "2025-03-15-starland-ballroom" },
      ],
      attendances: [
        {
          id: "a-shared",
          userId: "u-marc",
          showId: "show-starland",
          createdAt: new Date("2023-01-01T00:00:00Z"),
          updatedAt: new Date("2023-01-01T00:00:00Z"),
        },
      ],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [
        {
          attendances: [
            {
              id: "a-shared",
              userId: "u-marc",
              showId: "show-cap",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
            {
              id: "a-starland-real",
              userId: "u-marc",
              showId: "show-starland",
              createdAt: "2025-03-15T00:00:00Z",
              updatedAt: "2025-03-15T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_all_attendance_ids: [{ ids: ["a-shared", "a-starland-real"] }],
      list_all_rating_ids: [{ ids: [] }],
      list_all_user_ids: [{ ids: ["u-marc"] }],
    });

    const result = await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: true,
      pruneOrphans: true,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(result.attendancesReconciled).toBe(1);
    const byId = new Map(state.attendances.map((a) => [a.id, a]));
    expect(byId.get("a-shared")).toMatchObject({ showId: "show-cap" });
    expect(byId.get("a-starland-real")).toMatchObject({ showId: "show-starland" });
    expect(state.attendances).toHaveLength(2);
  });
});

// The show-id-drift fix: prod ratings/attendances reference prod's show/track
// id, but a local show seeded from an old dump can carry a DIFFERENT id under
// the same slug. The show/track passes build prodShowIdToLocalId /
// prodTrackIdToLocalId; the user-activity loops resolve through them before the
// FK check + upsert, mirroring the existing user prodIdToLocalId remap. Without
// it, the rating/attendance FK-skips against the prod id that isn't local.
describe("syncUserActivity — show/track id-drift remap", () => {
  const driftUser = (): StubUserRow => ({
    id: "u-marc",
    email: "stub-u-marc@local.invalid",
    passwordDigest: "STUB",
    username: "trance-marc",
    avatarFileId: null,
    avatarFileUrl: null,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  });

  test("lands a Show rating that would FK-skip, remapped onto the drifted local show id", async () => {
    // Local show carries id "local-show"; prod's id for the same slug is
    // "prod-show". The rating references "prod-show".
    const { db, state } = makeStubDb({
      users: [driftUser()],
      shows: [{ id: "local-show", slug: "2026-01-01-show" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-1",
              userId: "u-marc",
              value: 5,
              rateableType: "Show",
              rateableId: "prod-show",
              createdAt: "2026-01-02T00:00:00Z",
              updatedAt: "2026-01-02T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      prodShowIdToLocalId: new Map([["prod-show", "local-show"]]),
      mcp,
    });

    // Without the remap this rating skips (prod-show isn't a local id). With it,
    // the rating lands on the local show id.
    expect(state.ratings).toHaveLength(1);
    expect(state.ratings[0].rateableId).toBe("local-show");
  });

  test("lands an attendance remapped onto the drifted local show id", async () => {
    const { db, state } = makeStubDb({
      users: [driftUser()],
      shows: [{ id: "local-show", slug: "2026-01-01-show" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [
        {
          attendances: [
            {
              id: "a-1",
              userId: "u-marc",
              showId: "prod-show",
              createdAt: "2026-01-02T00:00:00Z",
              updatedAt: "2026-01-02T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      prodShowIdToLocalId: new Map([["prod-show", "local-show"]]),
      mcp,
    });

    expect(state.attendances).toHaveLength(1);
    expect(state.attendances[0].showId).toBe("local-show");
  });

  test("still FK-skips when the show is genuinely absent (no remap entry)", async () => {
    const { db, state } = makeStubDb({ users: [driftUser()], shows: [] });
    const mcp = makeStubMcp({
      list_users_since: [{ users: [], nextCursor: null }],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-1",
              userId: "u-marc",
              value: 5,
              rateableType: "Show",
              rateableId: "prod-show",
              createdAt: "2026-01-02T00:00:00Z",
              updatedAt: "2026-01-02T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.ratings).toHaveLength(0);
  });
});

describe("syncUserActivity — avatarFileId FK safety", () => {
  // Stub users never write avatarFileId because the File table isn't synced.
  // Without this guard, prod users referencing a File row added after the
  // last db-restore dump would violate users_avatar_file_id_fkey on insert.
  // avatarFileUrl is a plain VarChar with no FK, so it still gets the
  // remote URL.
  test("inserts stub users with avatarFileId=null even when prod sends one", async () => {
    const { db, state } = makeStubDb({});
    const mcp = makeStubMcp({
      list_users_since: [
        {
          users: [
            {
              id: "u-marc",
              username: "trance-marc",
              avatarFileId: "file-not-in-local-db",
              avatarFileUrl: "https://cdn.example/marc.jpg",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_ratings_since: [{ ratings: [], nextCursor: null }],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    expect(state.users[0].avatarFileId).toBeNull();
    expect(state.users[0].avatarFileUrl).toBe("https://cdn.example/marc.jpg");
  });
});

describe("syncUserActivity — username-keyed user upsert", () => {
  // When a prod user's id doesn't match locally but their username does
  // (e.g. local was seeded from a dump that gave evan a different id), the
  // sync must update the local row in place — NOT create a second row that
  // would hit users_username_unique — and must remap ratings/attendances
  // owned by the prod id onto the local id so they attach to the right
  // account.
  test("matches a local user by username when ids differ and remaps the rating's userId", async () => {
    const { db, state } = makeStubDb({
      users: [
        {
          // Local id, kept stable across the sync (PKs aren't rewritten).
          id: "local-evan-id",
          email: "stub-local-evan-id@local.invalid",
          passwordDigest: "STUB",
          username: "evan",
          avatarFileId: null,
          avatarFileUrl: null,
          createdAt: new Date("2020-01-01T00:00:00Z"),
          updatedAt: new Date("2020-01-01T00:00:00Z"),
        },
      ],
      shows: [{ id: "show-1", slug: "2024-08-12-cap-theatre" }],
    });
    const mcp = makeStubMcp({
      list_users_since: [
        {
          users: [
            {
              // Prod's id for "evan" differs from local.
              id: "prod-evan-id",
              username: "evan",
              avatarFileId: null,
              avatarFileUrl: "https://cdn.example/evan.jpg",
              createdAt: "2020-01-01T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_ratings_since: [
        {
          ratings: [
            {
              id: "r-1",
              userId: "prod-evan-id",
              value: 5,
              rateableType: "Show",
              rateableId: "show-1",
              createdAt: "2024-08-12T00:00:00Z",
              updatedAt: "2024-08-12T00:00:00Z",
            },
          ],
          nextCursor: null,
        },
      ],
      list_attendances_since: [{ attendances: [], nextCursor: null }],
    });

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: false,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    // Only one user row — no users_username_unique violation; local id
    // stays stable; the prod-side update (new avatar URL) lands.
    expect(state.users).toHaveLength(1);
    expect(state.users[0].id).toBe("local-evan-id");
    expect(state.users[0].avatarFileUrl).toBe("https://cdn.example/evan.jpg");
    // Rating's userId was remapped from prod-evan-id to local-evan-id.
    expect(state.ratings).toHaveLength(1);
    expect(state.ratings[0].userId).toBe("local-evan-id");
  });
});

describe("syncUserActivity — pull-from-epoch (full reconcile)", () => {
  // When pullFromEpoch is set, the cursor is forced to 1970-01-01 instead of
  // local MAX(updatedAt). This is what unblocks the "missing-older rows"
  // case: a local DB seeded from a dump that's missing months of activity
  // can't backfill via the cursor approach (its MAX is too new).
  test("pulls ratings since epoch regardless of local MAX(updatedAt)", async () => {
    const { db } = makeStubDb({
      ratings: [
        {
          id: "r-recent",
          userId: "u-marc",
          value: 5,
          rateableType: "Show",
          rateableId: "show-1",
          createdAt: new Date("2026-05-01T00:00:00Z"),
          updatedAt: new Date("2026-05-01T00:00:00Z"),
        },
      ],
    });
    const calls: Array<{ tool: string; args: Record<string, unknown> }> = [];
    const mcp = async <T>(toolName: string, args: Record<string, unknown>): Promise<T> => {
      calls.push({ tool: toolName, args });
      if (toolName === "list_users_since") return { users: [], nextCursor: null } as T;
      if (toolName === "list_ratings_since") return { ratings: [], nextCursor: null } as T;
      if (toolName === "list_attendances_since") return { attendances: [], nextCursor: null } as T;
      throw new Error(`unexpected tool ${toolName}`);
    };

    await syncUserActivity(db as never, {
      isDryRun: false,
      pullFromEpoch: true,
      pruneOrphans: false,
      ratingService: stubRatingService(),
      cacheInvalidation: null,
      changedSlugs: new Set(),
      now: new Date(),
      mcp,
    });

    const ratingsCall = calls.find((c) => c.tool === "list_ratings_since");
    expect(ratingsCall?.args.since).toBe("1970-01-01T00:00:00.000Z");
  });
});

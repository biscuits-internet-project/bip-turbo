import { describe, expect, test } from "vitest";
import {
  buildShowCreateInput,
  buildSongCreateInput,
  buildTrackCreateInputs,
  buildTrackDriftUpdates,
  diffTrackAnnotations,
  buildSongDriftUpdate,
  buildVenueDriftUpdate,
  buildShowDriftUpdate,
  buildVenueCreateInput,
  collectSongSlugs,
  collectVenueKeys,
  isStubSlug,
  matchVenue,
  parseYearsArg,
  showNeedsUpdate,
  type LocalTrackForDrift,
  type McpSearchVenueResult,
  type McpSetlist,
  type McpShow,
} from "./sync-missing-shows";

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
        { averageRating: 4.2, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr" },
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
        { averageRating: 4.2, ratingsCount: 18, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr" },
        remote,
      ),
    ).toBe(true);
  });

  // Float re-encoding (e.g. 4.1999999 vs 4.2) must NOT trip drift — otherwise
  // every run would update every show. Tolerance is 1e-6.
  test("returns false for averageRating differences within float tolerance", () => {
    expect(
      showNeedsUpdate(
        { averageRating: 4.1999999, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr" },
        remote,
      ),
    ).toBe(false);
  });

  // A real averageRating change (more than 1e-6) must trip drift.
  test("returns true for averageRating differences beyond float tolerance", () => {
    expect(
      showNeedsUpdate(
        { averageRating: 4.1, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr" },
        remote,
      ),
    ).toBe(true);
  });

  // Notes edited on prod (e.g. band added setlist annotation) should mirror.
  test("returns true when notes drifts", () => {
    expect(
      showNeedsUpdate(
        { averageRating: 4.2, ratingsCount: 19, notes: "old note", relistenUrl: "https://relisten.example/rr" },
        remote,
      ),
    ).toBe(true);
  });

  // relistenUrl added upstream (from null → string) is drift.
  test("returns true when relistenUrl drifts from null to a value", () => {
    expect(
      showNeedsUpdate(
        { averageRating: 4.2, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: null },
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
        { averageRating: 4.2, ratingsCount: 19, notes: null, relistenUrl: null },
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
        { averageRating: 4.2, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr", countForStats: true, dayOrder: null },
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
        { averageRating: 4.2, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr", countForStats: true, dayOrder: 1 },
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
        { averageRating: 4.2, ratingsCount: 19, notes: "Fourth of July run opener", relistenUrl: "https://relisten.example/rr", countForStats: false, dayOrder: 3 },
        remote,
      ),
    ).toBe(false);
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
    expect(
      matchVenue(candidates, { name: "Higher Ground", city: "South Burlington", state: "VT" }),
    ).toBe("higher-ground");
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
      cover: null,
      legacyAuthor: null,
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
  // guitarTabsUrl) and the `cover`/`legacyAuthor` admin flags must mirror
  // verbatim on insert. These are the prod-curated columns the sync didn't
  // previously write — leaving them null on first insert meant Song pages
  // looked empty on local even though prod had content.
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
        cover: false,
        legacyAuthor: "Disco Biscuits",
        featuredLyric: "And the sky lights up",
        tabs: "https://example/tabs",
        notes: "Type II launches frequent",
        history: "Debuted NYE 2002",
        guitarTabsUrl: "https://example/guitar",
      },
      now,
    );
    expect(input).toMatchObject({
      cover: false,
      legacyAuthor: "Disco Biscuits",
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

// buildTrackCreateInputs is where the slug→id resolution happens for Song FKs.
// A missing mapping must skip the track, not insert a NULL songId (the column
// is non-nullable — Prisma would reject it anyway, but a pre-filter surfaces
// the problem earlier and keeps the insert-many call atomic.
describe("buildTrackCreateInputs", () => {
  // Canonical multi-set insertion: set label + position + segue pass through;
  // songId gets resolved via the slug→id map keyed off the upserted songs.
  test("resolves songId via slug map and preserves set/position/segue", () => {
    const setlist: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        {
          label: "S1",
          tracks: [
            { position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: ">" },
            { position: 2, songTitle: "Aceetobee", songSlug: "aceetobee", segue: null },
          ],
        },
      ],
    };
    const songSlugToId = new Map([
      ["basis-for-a-day", "song-basis-uuid"],
      ["aceetobee", "song-aceetobee-uuid"],
    ]);
    const tracks = buildTrackCreateInputs(setlist, "show-miami-uuid", songSlugToId);
    expect(tracks).toEqual([
      { showId: "show-miami-uuid", songId: "song-basis-uuid", set: "S1", position: 1, segue: ">", note: null, allTimer: false },
      { showId: "show-miami-uuid", songId: "song-aceetobee-uuid", set: "S1", position: 2, segue: null, note: null, allTimer: false },
    ]);
  });

  // allTimer and note are admin-curated on prod (admins toggle the all-timer
  // flag from track pages, and inline track annotations carry the `note`
  // string). New MCP payloads include both per track; the builder must
  // mirror them into the insert. Defaults: allTimer=false, note=null when MCP
  // omits — keeps pre-deploy MCP responses parsing.
  test("mirrors allTimer and note from MCP tracks into the insert", () => {
    const setlist: McpSetlist = {
      showSlug: "2025-07-04-red-rocks-morrison-co",
      showDate: "2025-07-04",
      venue: { name: "Red Rocks", city: "Morrison", state: "CO" },
      sets: [
        {
          label: "S2",
          tracks: [
            // Curated all-timer with an inline note — a typical Red Rocks moment.
            { position: 1, songTitle: "Crystal Ball", songSlug: "crystal-ball", segue: ">", allTimer: true, note: "Glow-stick war peak" },
            // Vanilla track, defaults apply.
            { position: 2, songTitle: "Helicopters", songSlug: "helicopters", segue: null },
          ],
        },
      ],
    };
    const songSlugToId = new Map([
      ["crystal-ball", "song-crystal-uuid"],
      ["helicopters", "song-helicopters-uuid"],
    ]);
    const tracks = buildTrackCreateInputs(setlist, "show-rr-uuid", songSlugToId);
    expect(tracks[0]).toMatchObject({ allTimer: true, note: "Glow-stick war peak" });
    expect(tracks[1]).toMatchObject({ allTimer: false, note: null });
  });

  // If a song slug is missing from the map (upstream skipped or errored), we
  // skip the track rather than fail the whole show. The show will still land;
  // missing tracks are logged elsewhere.
  test("skips tracks whose song slug is not in the resolution map", () => {
    const setlist: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        {
          label: "S1",
          tracks: [
            { position: 1, songTitle: "Shem-Rah-Boo", songSlug: "shem-rah-boo", segue: null },
            { position: 2, songTitle: "Munchkin Invasion", songSlug: "munchkin-invasion", segue: null },
          ],
        },
      ],
    };
    const songSlugToId = new Map([["shem-rah-boo", "song-shem-uuid"]]);
    const tracks = buildTrackCreateInputs(setlist, "show-uuid", songSlugToId);
    expect(tracks).toHaveLength(1);
    expect(tracks[0]?.songId).toBe("song-shem-uuid");
  });
});

// buildTrackDriftUpdates computes per-track patches for existing local tracks
// in a single show. The key is (showId, position) — within one show, position
// is unique. Drift fields: segue, note, allTimer. Returns a list of {trackId,
// patch} so the caller can issue scoped UPDATE statements without re-fetching.
// Empty array means "nothing changed".
describe("buildTrackDriftUpdates", () => {
  // Canonical drift: prod marked track 3 (Crystal Ball) as an all-timer and
  // added a note. Local row catches up on next sync. Other tracks unchanged
  // → not in the result.
  test("emits a patch only for the track whose fields drifted", () => {
    const local: LocalTrackForDrift[] = [
      { id: "track-1-uuid", position: 1, segue: ">", note: null, allTimer: false },
      { id: "track-2-uuid", position: 2, segue: null, note: null, allTimer: false },
      { id: "track-3-uuid", position: 3, segue: ">", note: null, allTimer: false },
    ];
    const remote: McpSetlist = {
      showSlug: "2025-07-04-red-rocks-morrison-co",
      showDate: "2025-07-04",
      venue: { name: "Red Rocks", city: "Morrison", state: "CO" },
      sets: [
        {
          label: "S2",
          tracks: [
            { position: 1, songTitle: "Helicopters", songSlug: "helicopters", segue: ">" },
            { position: 2, songTitle: "Munchkin Invasion", songSlug: "munchkin-invasion", segue: null },
            { position: 3, songTitle: "Crystal Ball", songSlug: "crystal-ball", segue: ">", allTimer: true, note: "Glow-stick war peak" },
          ],
        },
      ],
    };
    const patches = buildTrackDriftUpdates(local, remote);
    expect(patches).toEqual([
      { trackId: "track-3-uuid", patch: { allTimer: true, note: "Glow-stick war peak" } },
    ]);
  });

  // Idempotency: when local already matches remote on every field, no patches.
  // This is the no-op re-run path — the orchestrator must skip the UPDATE
  // entirely so updatedAt doesn't churn.
  test("returns an empty list when nothing drifted", () => {
    const local: LocalTrackForDrift[] = [
      { id: "track-1-uuid", position: 1, segue: ">", note: null, allTimer: false },
    ];
    const remote: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        { label: "S1", tracks: [{ position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: ">", allTimer: false, note: null }] },
      ],
    };
    expect(buildTrackDriftUpdates(local, remote)).toEqual([]);
  });

  // Segue edits land too — sometimes prod fixes a `>` to `,` after the fact.
  // (Tracks can drift segue independently of admin flags.)
  test("emits a patch when segue drifts", () => {
    const local: LocalTrackForDrift[] = [
      { id: "track-1-uuid", position: 1, segue: ">", note: null, allTimer: false },
    ];
    const remote: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        { label: "S1", tracks: [{ position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: "," }] },
      ],
    };
    expect(buildTrackDriftUpdates(local, remote)).toEqual([
      { trackId: "track-1-uuid", patch: { segue: "," } },
    ]);
  });

  // Pre-deploy MCP responses omit allTimer / note. Treat omission as "no
  // opinion" — don't claim drift just because the remote payload is sparse,
  // or every existing track would get its admin fields clobbered to defaults
  // on the next sync.
  test("ignores allTimer / note when remote omits them", () => {
    const local: LocalTrackForDrift[] = [
      { id: "track-1-uuid", position: 1, segue: null, note: "kept locally", allTimer: true },
    ];
    const remote: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        // No allTimer / note keys at all — pre-deploy MCP shape.
        { label: "S1", tracks: [{ position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: null }] },
      ],
    };
    expect(buildTrackDriftUpdates(local, remote)).toEqual([]);
  });

  // Position is the only stable key within a show — a track that appears in
  // local but not in the remote setlist (e.g. removed upstream) gets skipped,
  // not patched. Deletion is intentionally not handled by drift; it's a
  // separate cleanup concern.
  test("skips local tracks whose position is absent from the remote setlist", () => {
    const local: LocalTrackForDrift[] = [
      { id: "track-1-uuid", position: 1, segue: null, note: null, allTimer: false },
      { id: "track-99-uuid", position: 99, segue: null, note: null, allTimer: true },
    ];
    const remote: McpSetlist = {
      showSlug: "2026-02-06-miami-beach-bandshell-miami-beach-fl",
      showDate: "2026-02-06",
      venue: { name: "Miami Beach Bandshell", city: "Miami Beach", state: "FL" },
      sets: [
        { label: "S1", tracks: [{ position: 1, songTitle: "Basis for a Day", songSlug: "basis-for-a-day", segue: null }] },
      ],
    };
    expect(buildTrackDriftUpdates(local, remote)).toEqual([]);
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

// buildSongDriftUpdate diffs an existing local Song row against the latest
// MCP response and returns a patch — only the curated admin fields (title,
// lyrics, cover, legacyAuthor, featuredLyric, tabs, notes, history,
// guitarTabsUrl). It intentionally does NOT touch the derived stats columns
// (timesPlayed, dateFirstPlayed, dateLastPlayed, yearlyPlayData) — those are
// owned by the post-sync rebuild and would otherwise race against it.
describe("buildSongDriftUpdate", () => {
  const localBase = {
    title: "Crystal Ball",
    lyrics: "And the sky lights up...",
    cover: false,
    legacyAuthor: "Disco Biscuits",
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
        cover: false,
        legacyAuthor: "Disco Biscuits",
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

  // Multi-field drift: title rename + new featuredLyric + cover flag flip
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
      cover: true,
      featuredLyric: "Glow stick crescendo",
    });
    expect(patch).toEqual({
      title: "Crystal Ball (Reprise)",
      cover: true,
      featuredLyric: "Glow stick crescendo",
    });
  });

  // Pre-deploy MCP omits the new curated fields. Sparse remote payload must
  // never claim drift on `cover` / `legacyAuthor` / `featuredLyric` / `tabs`
  // / `notes` / `history` / `guitarTabsUrl` — otherwise every existing song
  // would have those fields clobbered to null on the next sync.
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

import { describe, expect, test } from "vitest";
import {
  buildShowCreateInput,
  buildSongCreateInput,
  buildTrackCreateInputs,
  buildVenueCreateInput,
  collectSongSlugs,
  collectVenueKeys,
  isStubSlug,
  matchVenue,
  parseYearsArg,
  showNeedsUpdate,
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

  // Two candidates tie on name + city + state: ambiguous, return null to stay
  // safe (extremely rare in practice, but correctness > optimism).
  test("returns null when multiple candidates match (ambiguous)", () => {
    const candidates: McpSearchVenueResult[] = [
      { slug: "fox-theatre-a", name: "Fox Theatre", city: "Boulder", state: "CO" },
      { slug: "fox-theatre-b", name: "Fox Theatre", city: "Boulder", state: "CO" },
    ];
    expect(matchVenue(candidates, { name: "Fox Theatre", city: "Boulder", state: "CO" })).toBeNull();
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
      createdAt: now,
      updatedAt: now,
    });
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
        slug: "tractorbeam",
        title: "Tractorbeam",
        author: "Disco Biscuits",
        lyrics: null,
        timesPlayed: 412,
        dateFirstPlayed: "1998-07-04",
        dateLastPlayed: "2026-02-06",
      },
      now,
    );
    expect(input).toEqual({
      slug: "tractorbeam",
      title: "Tractorbeam",
      lyrics: null,
      timesPlayed: 412,
      dateFirstPlayed: new Date("1998-07-04"),
      dateLastPlayed: new Date("2026-02-06"),
      createdAt: now,
      updatedAt: now,
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
      { showId: "show-miami-uuid", songId: "song-basis-uuid", set: "S1", position: 1, segue: ">" },
      { showId: "show-miami-uuid", songId: "song-aceetobee-uuid", set: "S1", position: 2, segue: null },
    ]);
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

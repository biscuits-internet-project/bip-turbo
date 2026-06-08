# Performer backfill — decisions log

> **TEMPORARY — DELETE AT THE FINAL PHASE.** This file and the Phase 3 extraction
> scaffolding (`scripts/spike-performer-sources.ts`,
> `scripts/generate-performer-backfill.ts`, `scripts/data/performer-backfill.json`,
> `scripts/data/REVIEW-batch-*.md`) are working artifacts for building the backfill
> migration. Once the migration has landed and the cutover/retirement phase is done,
> migrate any still-relevant rationale into the durable docs and remove these files.
> Tracked as a cleanup obligation in the project plan.

Durable record of decisions made while extracting and reviewing the structured
performer data (Phase 3 of the musicians/performers feature). Survives context
compaction; later phases (admin editors, footnote cutover, "played by" filter,
musician pages) should consult this for the rationale behind the data shape.

Master plan + phase status: auto-memory `project-musicians-performers-feature`.
Working plan: `/Users/evan/.claude/plans/phase-1-and-2-sequential-galaxy.md`.

## Data model (landed)
- Performer tables shipped in `add_musicians_performers` (prod). Phase 3 evolves
  them in `20260601140000_performer_instruments_and_known_from`:
  - **`musicians.known_from`** — free-text descriptor of where you'd recognize an
    artist (e.g. "Brothers Past, Ghost Light, JRAD"). NOT a relational entity, NOT
    a list of FKs — a display string only. Comma-joined affiliations are fine here
    because it's prose, not references.
  - **Instruments are a join, never a column list.** `show_musician_instruments`
    + `track_musician_instruments` bridge a ShowMusician/TrackMusician appearance
    to 1+ Instrument. One musician appears once per show/track (unique
    `[showId,musicianId]` / `[trackId,musicianId]`); the instruments they played
    hang off that appearance. A multi-instrument sit-in ("guitar/vocals") = one
    appearance + two instrument rows. (Rejected: widening the unique to include
    instrument; rejected: a CSV instruments column.)
  - **`Musician.defaultInstrumentId`** stays a single FK (one primary instrument
    for picker defaults).
  - **Display vs slug:** the keyboards instrument shows as "Keyboards" but keeps
    the stable slug `keys`.

## Extraction sources
- **`Annotation.desc`** — primary, ~per-track sit-ins, mostly the clean template
  "with <Name> on <instrument>". → per-track `present=true` deltas.
- **`Show.notes`** — whole-show stints + "without <member>" sat-outs.
- **`side_projects.mem*`** — musician + instrument VOCABULARY only (who plays
  what, knownFrom); its dates do NOT map to shows.
- **`Track.note`** — DROPPED as a source (its one real performer hit duplicates
  that track's annotation).
- **No DB provenance** — which annotation a row came from lives in the generated
  data file, not the schema. The future annotation-retirement (cutover) phase
  re-derives the match from that artifact / heuristically, not a DB link.

## Parsing rules
- Trusted frames: "with <Name> [(knownFrom)|of <KnownFrom>] on <instrument(s)>",
  bare "<Name> on <instrument>", and "without <member>" (sat-out ONLY when the
  word resolves to a known band member; bare "without ending vocals" etc. is
  musical-section language, ignored).
- Multi-instrument phrases ("guitar/vocals", "bass & vocals", "guitar and
  vocals") split into one instrument each; qualifiers stripped ("guitar only" →
  guitar, "backup vocals" → vocals).
- Instrument canon folds synonyms/typos (keyboards/kays → keys slug, saxaphone →
  saxophone, vox → vocals).
- **Whole-show promotion:** a guest annotated on ≥80% of a show's tracks (and ≥3
  tracks) becomes ONE lineup row instead of N per-track deltas.

## Band membership is PER-SHOW; the app is DATA-guided, not code-guided
There is no fixed "the members." Each show gets a full lineup of musicians, each
with their instrument(s). Once the data exists, the app queries it directly
(by player and/or instrument) — there is **no runtime era-lineup function**. The
ONLY era logic in code is the existing era filter (`song-filters.ts`) and the
default-lineup-for-a-NEW-show in `ShowService.create` (the Marlon four; could
alternatively default to the last show's lineup — code is fine either way).

The era rules below are a RECIPE the backfill uses to fill in historical lineup
DATA — they are baked into the throwaway generator script, NOT shipped as a
module. Each show's base lineup is computed from the eras and then OVERLAID with
the changes notes/annotations state. The backfill writes ShowMusician rows
directly (not via ShowService.create), so it sets the era-correct historical
lineup per show; the default-on-create logic only fires for new current-era
shows and is unaffected.

**Era-derived base lineup (decided with user):**
- **Guitar:** Jon Gutwillig (aka "Barber") — always.
- **Keys:** Aron Magner.
- **Bass:** Marc Brownstein (aka "Brownie") — **omit when not in the band (early
  2000s); no substitute asserted** unless a note names one.
- **Drums:** by era window, dates from `apps/web/app/lib/song-filters.ts`:
  - Sam Altman: through **2005-08-27**
  - Allen Aucoin: **2005-12-28** → **2025-09-07**
  - Marlon Lewis: **2025-10-31** onward
  - (Gaps 2005-08-27→12-28 and 2025-09-07→10-31 have no defined drummer — FLAG.)
- **Vocals:** Jon, Marc, Aron are ALSO on vocals on every show they play, EXCEPT a
  show billed as **Tractorbeam on/after 2019-10-03** (instrumental, no vocals).
  **Drummers never sing** (unless a one-off note says so).
- Instruments hang off each ShowMusician via the join table (a musician can have
  several, e.g. guitar + vocals). "Jon on MIDI" = Jon's lineup instrument for that
  show is MIDI (not an override concept, just what his row states).
- **Source of truth for era dates:** `apps/web/app/lib/song-filters.ts`
  (`eraFilters`). Core can't import from web (no cross-package); mirror the dates
  in a core constant with a pointer comment, or relocate them to a shared module.

**Derive-then-overlay (the governing principle):** compute each show's base
lineup from the era rules, then OVERLAY the changes notes/annotations state.
Note-derived performer info is authoritative and wins over the era default.
- **Era gaps** (2005-08-27→12-28, 2025-09-07→10-31): the era rule yields no
  drummer; the show's notes/annotations supply it (e.g. "Sam Altman on drums for
  both sets"). Don't guess across the transition — let the overlay fill it.
- **Marc Brownstein absent 2000-03-11 → 2000-07-12** (omit him from the base
  lineup in that window). Documented edge case on **2000-07-12**: show note says
  Jordan Crisman on bass + vocals; annotation says Brownie took over for the LAST
  2 SONGS — i.e. show-level lineup = Crisman, with a per-track override putting
  Marc on bass for the final two tracks. Good end-to-end test of base + overlay.
- **Tractorbeam / instrumental:** a show whose notes mention "Tractorbeam" with
  date ≥ 2019-10-03 is instrumental → suppress the +vocals on Jon/Marc/Aron.

## Reviewing thousands of base lineups: review SHAPES, not rows
The backfill writes a base lineup for EVERY show (thousands). You can't check them
one by one. But a base lineup is fully determined by (date → era) + isTractorbeam,
so there are only a handful of distinct lineup "shapes," each spanning a date
range. Review strategy: present the DISTINCT shapes (musicians + instruments),
each with its date range and show count, plus the exact shows at each era
BOUNDARY (where off-by-one/transition errors hide). Verifying ~6–8 shapes + the
boundary shows validates all the thousands. Note-derived OVERLAYS (the much
smaller set of guests/sit-ins/sat-outs/instrument-changes) are reviewed
separately, per-row, as before.

## "Billed as ..." shows: flag every one for individual review
Any show whose notes contain "billed as" (Tractorbeam, Electron, etc.) is a
special-billing show whose lineup/format may deviate from the era base — call
out every one for the user to review individually, never silently fold into a
shape.

## Review method: check misses, not just hits
Reviewing only the extracted rows cannot catch FALSE NEGATIVES (notes that name a
performer but the parser dropped). The Tom Hamilton undercount proved this. So
review also works from a COVERAGE report: every annotation/show.note containing
performer-signal language ("on <instrument>", with/sat/guest/without) that the
parser extracted NOTHING from, triaged into "real miss → fix parser" vs
"correctly skipped (song title / tease / festival / jam name)". Built via an
ad-hoc scan (see coverage-misses.json); ~99 such notes in the current data.

Parser-miss status after the targeted fixes:
- **FIXED:** case-insensitive instrument ("Tom Hamilton on Guitar for the whole
  set"); trailing/mid paren boundary ("Simon Green on bass (Bonobo)"); first
  clause of a chained line ("Sammy on bass ..."); instrument phrase stops at the
  next "and/& <Name> on ..." clause.
- **LEFT FOR HAND REVIEW** (regex too risky / ambiguous): chained SECOND clauses
  ("& DJ Mauricio on Roland MC-505", "Marc on keys & Aron on vocals" only gets
  Marc); "replacing Brownie on bass" (sit-in + implicit sat-out); "A and B (band)
  on horns" where a paren sits between the two names; trailing "and Jon on MIDI"
  (also a "billed as" 2010 case reviewed manually). These surface in the coverage
  list for manual entry.
- **Correctly skipped:** "Jam on the River" (festival), "with 'Fire On The
  Mountain' jam", "'On Time' teases/samples" (song/tease names).

## Sources: Annotation.desc + Show.notes ONLY (side_projects DROPPED)
side_projects is NO LONGER a backfill source. It produced most of the junk
instruments (guitar edrums, assorted gadgets, special guest set 2, bethany
lokken, dj) and phantom musicians. We only document performers that appear in
Annotation.desc or Show.notes. (A name/instrument that exists only in
side_projects is ignored for now.)

## Instrument decisions (from full-source review)
- "Allen on E-Drum Kit" → instrument **`e-drums`**.
- "Mike Greenfield (Drums eDrums)" etc. were side_project-only → now ignored;
  where a drummer appears in annotations they're just **`drums`**.
- **Mike Gordon** "special guest set 2 only": this was a side_projects artifact
  (The L. Cool Trio) — NOT present in any annotation/show-note, so with
  side_projects dropped there is nothing to backfill. Ignored.
- "with Keller Williams on vocals/guitar & Antibalas horns" → THREE results:
  Keller Williams on guitar; Keller Williams on vocals; and a performer named
  **"Antibalas horns"** (the Antibalas horn section, treated as one performer).
- **Chained "& B on Y" parse is being FIXED** so a second clause like
  "& DJ Mauricio on Roland MC-505" is captured (recovers DJ Mauricio + the
  `Roland MC-505` instrument, ~21 annotations; also catches the Antibalas case).

## The parser only generates JSON; weird shows go in a manual overrides file
The parser/generator handles the clean bulk. The irregular one-off shows are NOT
worth parser regex — they're encoded explicitly in a hand-authored overrides file
(`scripts/data/performer-overrides.json`) the generator merges LAST. Per show:
`removeMusicians`, `addLineup [{musician, knownFrom?, instruments}]`,
`trackDeltas [{set, position?, musician, present, instruments}]`. This is the
home for the Dec-2010 run, Antibalas horns, Mike Gordon set-2, the 2000-07-12
Crisman displacement, and the multi-name guests. The overrides file is part of
the reviewable source.

- **"Carey, Liz and Cat on vocals" → leave as a plain annotation** (reversed the
  earlier "one-off row" call). Removes the comma-name-list parser problem entirely.

## December 2010 NYE run — Allen hospitalized (asthma), replacement drummers
Per band history, Allen Aucoin missed the NYE run; guest drummers filled in. The
DATA shows the disruption spans **2010-12-27 → 2010-12-31** (5 shows), not just
"first 3". For these, **remove Allen from the base lineup**; the drummer comes
from the notes/annotations:
- 12-27 Terminal 5 — Mike Greenfield (whole show, "on drums for both sets")
- 12-28 Terminal 5 — Adam Deitch + Darren Shearer (per-track)
- 12-29 Terminal 5 — Sam Altman (whole show)
- 12-30 Tower Theater — Sam Altman base + Johnny Raab on noted tracks
- 12-31 Tower Theater — Sam Altman base + Johnny Raab on noted tracks ("unless noted otherwise")
General rule this implies: when a Show.note names a WHOLE-SHOW drummer ("X on
drums for both sets / for the whole show / unless noted otherwise") and the era
drummer differs, the era drummer is REMOVED (one drummer seat). Per-track guest
drummers then come from annotations as present=true deltas.

## Coverage-miss decisions (from the thorough pass)
- **Group 1 captured via the overrides file** (whole-show drummer/guitarist notes:
  Dec-2010 run, 2018 Hamilton, 2006 Hennessey, 2004 Jammys Greenfield), EXCEPT
  2024-04-11 "Marc on keys & Aron on vocals" → leave as annotation. DONE.
- **2002-08-06 "girl from crowd on vocals"** → leave as annotation (anonymous).
- **Group 2 multi-name guests → HAND ENTRY** (confirmed). Special: 2016-03-05
  "Natalie Cressman & Jen Hartswick (Trey Anastasio Band) on trombone & trumpet"
  → split into Natalie Cressman (trombone) + Jen Hartswick (trumpet), each
  knownFrom "Trey Anastasio Band".
- **Group 3 skipped** (festival/other-acts/teases), EXCEPT:
  - 2004-03-16 Jammys note ends "Entire set with Mike Greenfield on drums" →
    Greenfield whole-show (other-acts list before it is NOT performers).
  - 2010-12-31 (above) — Sam on drums for the show except where another drummer noted.

## Tractorbeam ALWAYS drops vocals (any date)
The band has always dropped vocals for the Tractorbeam format, so the 2019-10-03
cutoff is REMOVED: any show whose notes mention "Tractorbeam" suppresses vocals
for Jon/Marc/Aron, regardless of year (affects the 2007–2014 Tractorbeam shows
too). `isInstrumentalTractorbeam` is now date-independent.

## 2000-08-18 (Electron billing): not-for-stats + recompute-from
The migration must also: set `count_for_stats = false` for the 2000-08-18
Trocadero show, and queue a stats recompute FROM 2000-08-18 (insert into
`stats_recompute_requests`, the data-in-migration + force-rerun pattern). Lineup
(Marc, Aron, Jon, Sam Altman) is already correct from the era recipe.

## "Billed as" + era-boundary review — RESOLVED
- 17 of 18 "billed as" shows → NO change (billing name doesn't alter lineup;
  vocals handled by the Tractorbeam rule above).
- **2010-03-26 grand-central** → OVERRIDE: remove Jon, add Chris Michetti + Tom
  Hamilton on guitar (whole-show, the hand-injury run). Added to overrides.
- 3 era-boundary shows already resolve correctly (2005-09-13 gap = per-track
  drummers; 2005-12-28 = Allen; 2025-10-31 = Marlon).

## Duplicate-musician merges (applied directly to the SQL migrations)
The SQL migration files are the SOURCE now (not the generator). Duplicate people
under misspelled/variant slugs were found via a slug edit-distance scan and
merged by hand in the SQL (delete the dup row, rewrite its refs to canonical):
- Paul Norman: kept slug `paul-norman`, display name "DJ Paul Norman" (turntables;
  all 20 annotations say turntables). Merged away `dj-paul-norman`.
- `dom-lalli`/`dominic-lolli` → **`dominic-lalli`** "Dominic Lalli" (verified online).
- `brenden-bayliss`/`brandan-bayliss` → **`brendan-bayliss`**; default instrument
  corrected to guitar.
- `mike-greenfeld` → `mike-greenfield`; `tom-hammilton` → `tom-hamilton`;
  `chris-mitchetti` → `chris-michetti`; `dan-bratigan` → `dan-brantigan`
  (all canonical spellings verified online).
- `johnny-raab` → **`johnny-rabb`** (band history spelling, user-confirmed).
- Fixed dangling ref `al-schnier-of` → `al-schnier` (from "Al Schnier of (Moe.)
  on keyboards" — real keys guest, just a bad slug).
- Trimmed doubled known_from on Tom Hamilton and Al Schnier.
Final: 107 new musicians; integrity scan clean (no dup slugs / dangling refs /
orphans / near-identical slugs).

## APPROVED by user (no longer under review)
- **New musicians (118):** reviewed. Name-normalization via `performer-aliases.json`:
  merges Murph→David Murphy (STS9), Jeremy→Jeremy Salken (Big Gigantic),
  Ruu→Ruu Campbell (Younger Brother), Jeff→Jeff Light (Foxtrot Zulu); knownFrom
  fix Chris Barron→The Spin Doctors; DROP (left as plain annotation) Justin, Joe,
  Rocco. Override-added guests (Antibalas Horns, T.K. Kyan, Gabe Mervine, Drew
  Sayers, Trevor Garrod, Steve Molitz, Brendan Bayliss, Jake Cinninger, Natalie
  Cressman, Jen Hartswick, Ryan Stasik, Mike Greenfield, Sam Altman, Shawn
  Hennessey) carry proper display names + knownFrom. "Antibalas horns" is a
  PERFORMER (the horn section), not an instrument. Keep-as-is: Matisyahu,
  Snacktime, Tuphace, Cloudchord. STS9 is the current band name (was Sound Tribe
  Sector 9).
- **Instrument vocabulary (15 new):** antibalas horns*, banjo, beatbox, congas,
  didgeridoo, flute, harmonica, horns, mouth fluegel, piano, roland mc-505,
  saxophone, trumpet, turntables, vibraphone, violin. (*"antibalas horns" should
  become a performer name, not an instrument — single 2007-12-31 case, hand-fix.)
  Junk eliminated by dropping side_projects + parser guards (recorded/jam/the-article).
- **Base-lineup shapes (the 7):** roughly approved; revisit only if a mistake surfaces.
- **Top-12 extracted guests:** approved. Mike Greenfield's long knownFrom list →
  LEAVE as-is. Tom Hamilton knownFrom → "Brothers Past, Ghost Light, JRAD".
  Jordan Crisman knownFrom → "Cantus" (gorilla-suit text dropped, stays a note).
  "Barber" → merged into jon-gutwillig.
- **The 3 era-gap "drum-off" shows (2005-09-13, 11-18, 11-19):** base lineup has
  NO drummer; per-track annotations supply each track's guest drummer as
  `present=true` sit-in deltas (no base drummer to deviate from).
- **Carey, Liz and Cat:** one row (one-off, old).

## Displacement is MANUAL, not inferred
When a per-track sit-in covers an instrument a lineup member normally holds (e.g.
Marc takes bass for 2 tracks where Crisman is the lineup bassist), the displaced
member is NOT playing those tracks — but this is an INFERENCE the notes don't
state, and some shows genuinely have two players on one instrument (dual
drummers). So the generator does NOT auto-displace; displacements are marked by
hand in the data file per show. Known correction: **2000-07-12** — on the last 2
tracks (E12 Helicopters, E13 Svenghali) where Marc is present on bass, Jordan
Crisman is NOT playing; add a present=false for crisman on those 2 tracks by hand.

## Review approach: sample now, thorough pass later
Validate a representative sample first (a few of each overlay category + some
skipped/negative cases) to confirm the base+overlay engine is sound; then do the
exhaustive annotation→result pass (every extracted row + every performer-ish note
that extracted nothing, positive AND negative) once the mechanics are trusted.

## Review decisions (running)
- **Multi-artist sit-ins: AVOID in general.** A single "Carey, Liz and Cat on
  vocals"-style row collapsing several people is not how we want to model it.
  Exception: keep an old one-off as a single row rather than split.
  **APPROVED:** Carey, Liz and Cat (2 shows, 2001, Fillmore SF) stays one row.
- **Nicknames resolve to seeded members for sit-ins too**, not just sat-outs:
  "Barber" → Jon Gutwillig, "Sammy" → Sam Altman, "Brownie" → Marc Brownstein,
  "Magner" → Aron Magner. Prevents duplicate musician rows for the core band.
- **knownFrom is cleaned by hand in review** (no generator filtering). Junk that
  leaked from annotations ("dressed in gorilla suit") is removed and stays a
  plain annotation — it is NOT performer backfill.
  - Corrections applied: Tom Hamilton → "Brothers Past, Ghost Light, JRAD";
    Jordan Crisman → "Cantus".
- **A drummer playing other instruments is real data** — e.g. Sam Altman has
  guitar/bass sit-in deltas (bass in 2000), kept as-is.
- **Track counts that look high are usually correct** — they span many shows
  (Tom Hamilton: 36 per-track deltas across 12 shows, 2007–2025), not one show.
- **"A and B on <instrument>" splits into two sit-ins** (e.g. "Tom Hamilton and
  Chris Michetti on guitar" → two musicians). Guard: exactly two single clean
  names joined by one "and". A comma list of bare first names ("Carey, Liz and
  Cat") does NOT split — that stays a hand-decided one-off.
- **Whole-show stints are LINEUP rows, not per-track deltas.** "Entire/whole show
  with X on guitar" in Show.notes → one ShowMusician row for X (not N track
  deltas). This recovered the big Tom Hamilton + Chris Michetti miss: **2010,
  Jon Gutwillig broke his hand**, so the two of them covered guitar for ~16 whole
  shows (~219 track-equivalents) — originally dropped because the parser couldn't
  read "A and B on guitar" and the stints are show-level, not per-track.
  - **HARD REQUIREMENT for later phases:** because these are ShowMusician lineup
    rows (not track_musicians), the "played by musician" filter (Phase 8) and the
    show display/footnotes (Phase 7) MUST treat lineup membership as a match —
    `(X in show lineup AND no sat-out delta on the track) OR (present=true delta)`.
    A filter or display that only reads `track_musicians` would silently miss the
    entire 2010 run. Verify this end-to-end when those phases land.

## Notes for later phases
- **Cutover / annotation retirement:** delete a free-text annotation only when a
  structured row provably derives from it. With no DB provenance, match via the
  data file artifact or re-parse. Annotations like "dressed in gorilla suit" that
  were deliberately NOT migrated must survive untouched.
- **Footnote synthesis:** render one footnote per musician appearance with their
  instruments combined ("with Tom Hamilton on guitar and vocals"), reading the
  instrument join — do not emit one footnote per instrument row.
- **"Played by musician" filter & musician pages:** query the appearance unique
  (one row per musician/show/track); instruments are a detail, not the grain.

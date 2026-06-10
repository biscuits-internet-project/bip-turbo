import type { Annotation, SegueRecurrenceKind, Setlist, SetlistLight, TrackMusicianDelta } from "@bip/domain";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  debutFootnoteSuppressed,
  gapFootnoteSuppressed,
  LAST_TIME_PLAYED_GAP_THRESHOLD,
} from "~/lib/footnote-constants";
import { deriveShowLineupNotes, elevatedGuestIds } from "~/lib/lineup-notes";
import { formatDateShort } from "~/lib/utils";

/**
 * One numbered footnote source attached to a track. `dedupeKey` is the stable
 * string two identical footnotes share so they collapse to a single number;
 * `content` is what renders in the footnote list (plain text for annotations, a
 * sentence with a linked musician name for synthesized performer footnotes).
 */
export type FootnoteSource = {
  kind: "annotation" | "performer" | "ltp" | "debut" | "completes" | "flag";
  trackId: string;
  dedupeKey: string;
  content: ReactNode;
};

export type TrackFlag = "DYSLEXIC" | "INVERTED" | "UNFINISHED" | "ENDING_ONLY" | "MIDDLE_ONLY" | "BEGINNING_ONLY";

// How each structured flag reads in a footnote — the lowercase wording the
// free-text annotations used, so the migrated setlists look unchanged.
export const FLAG_LABELS: Record<TrackFlag, string> = {
  INVERTED: "inverted",
  DYSLEXIC: "dyslexic",
  UNFINISHED: "unfinished",
  ENDING_ONLY: "ending only",
  MIDDLE_ONLY: "middle only",
  BEGINNING_ONLY: "beginning only",
};

// Fixed display order for a track's flags within its single consolidated
// footnote, so combos read consistently across the setlist. The track flag
// editor reuses it so the checkbox order matches the footnote order.
export const FLAG_DISPLAY_ORDER: TrackFlag[] = [
  "DYSLEXIC",
  "INVERTED",
  "UNFINISHED",
  "BEGINNING_ONLY",
  "MIDDLE_ONLY",
  "ENDING_ONLY",
];

// The flags whose lowercase label links to its explainer on the music
// terminology page (/resources/music). Other flags have no glossary section.
const FLAG_GLOSSARY_ANCHORS: Partial<Record<TrackFlag, string>> = {
  DYSLEXIC: "dyslexic",
  INVERTED: "inverted",
};

/** A flag's label, linked to its music-terminology explainer when one exists. */
function flagLabel(flag: TrackFlag): ReactNode {
  const anchor = FLAG_GLOSSARY_ANCHORS[flag];
  if (!anchor) return FLAG_LABELS[flag];
  return (
    <Link to={`/resources/music#${anchor}`} className="text-brand-primary hover:text-brand-secondary">
      {FLAG_LABELS[flag]}
    </Link>
  );
}

// The partial-performance flags whose labels all end in " only". When a track
// has more than one, they collapse into "<part> and <part> only" (one shared
// "only") instead of "<part> only, <part> only".
const PARTIAL_ONLY_FLAGS: TrackFlag[] = ["BEGINNING_ONLY", "MIDDLE_ONLY", "ENDING_ONLY"];

/**
 * Combine the partial-only flags on a track into a single label that shares the
 * trailing "only": ["MIDDLE_ONLY", "ENDING_ONLY"] → "middle and ending only";
 * all three → "beginning, middle and ending only". Input order should already
 * be FLAG_DISPLAY_ORDER so the parts read consistently.
 */
function combinedPartialLabel(flags: TrackFlag[]): string {
  const parts = flags.map((flag) => FLAG_LABELS[flag].replace(/ only$/, ""));
  const joined = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  return `${joined} only`;
}

/** The show on the other end of a cross-show completion link (date + slug).
 *  `otherSongTitle` is set by the mapper only when the linked version is a
 *  DIFFERENTLY-named song, so the footnote can read "… version of <name>". */
export type CompletionShow = { date: string; slug: string; otherSongTitle?: string };

/** The prior performance in a recurrence series — null on a first-ever one. */
export type RecurrenceLastPlayed = { date: string; slug: string } | null;

/** A flag's recurrence context since this flag was last applied (null ⇒ first
 *  ever): `versionGap` = the song's own performances between, `gap` = shows
 *  between. Pre-gated by the mapper to only the kinds/gaps that should display. */
export type FlagRecurrence = {
  flag: TrackFlag;
  versionGap: number | null;
  gap: number | null;
  lastPlayed: RecurrenceLastPlayed;
};

/** A segue-shape recurrence context (standalone / not-segued-in / -out): both
 *  the version gap and the show gap since the prior same-shape version. */
export type SegueRecurrence = {
  kind: SegueRecurrenceKind;
  versionGap: number | null;
  gap: number | null;
  lastPlayed: RecurrenceLastPlayed;
};

// How each segue recurrence kind names itself inside the "first <…>" footnote.
const SEGUE_RECURRENCE_NOUNS: Record<SegueRecurrenceKind, string> = {
  STANDALONE: "standalone version",
  NOT_SEGUED_IN: "version not segued into",
  NOT_SEGUED_OUT: "version not segued out",
};

/** The slice of a song the auto debut footnote reads to decide its text. */
export type FootnoteSong = {
  slug: string;
  kind?: "original" | "cover" | "mashup" | "improvisation" | null;
  authorName?: string | null;
};

/** The slice of a track the auto last-time-played and debut footnotes read. */
export type FootnoteTrack = {
  id: string;
  songId: string;
  gap: number | null;
  previousPerformanceShow: { date: string; slug: string } | null;
  // The earlier (unfinished) versions this track completes, and the later
  // tracks that complete this one. Arrays because one ending can finish several
  // earlier versions ("completes 2/20 and 2/21 versions"). Each side drives one
  // completion footnote.
  completes?: CompletionShow[] | null;
  completedBy?: CompletionShow[] | null;
  // Structured performance flags, each rendered as its own footnote (unless a
  // partial-version flag folds into a completion footnote).
  flags?: TrackFlag[];
  // Pre-gated recurrence context for the flags / segue shape, folded into the
  // consolidated footnote line. The mapper only includes entries worth showing.
  flagRecurrences?: FlagRecurrence[];
  segueRecurrences?: SegueRecurrence[];
  song?: FootnoteSong;
};

export type DerivedFootnotes = {
  /** trackId -> the ordered footnote indices that track's `sup` marker shows. */
  trackFootnoteIndices: Map<string, number[]>;
  /** The footnote list, in display order. */
  orderedFootnotes: Array<{ index: number; content: ReactNode }>;
};

/**
 * Number footnote sources in track order so the inline `sup` markers and the
 * footnote list agree. Each distinct `dedupeKey` takes the next index on first
 * sighting; a track's sources are numbered in the order they are given, so
 * callers control precedence (annotations before synthesized performer notes)
 * by ordering each track's sources accordingly.
 */
export function deriveFootnotes(orderedTracks: Array<{ id: string }>, sources: FootnoteSource[]): DerivedFootnotes {
  const sourcesByTrack = new Map<string, FootnoteSource[]>();
  for (const source of sources) {
    const list = sourcesByTrack.get(source.trackId) ?? [];
    list.push(source);
    sourcesByTrack.set(source.trackId, list);
  }

  const indexByDedupeKey = new Map<string, number>();
  const orderedFootnotes: Array<{ index: number; content: ReactNode }> = [];
  const trackFootnoteIndices = new Map<string, number[]>();
  let nextIndex = 1;

  for (const track of orderedTracks) {
    const trackIndices: number[] = [];
    for (const source of sourcesByTrack.get(track.id) ?? []) {
      let index = indexByDedupeKey.get(source.dedupeKey);
      if (index === undefined) {
        index = nextIndex++;
        indexByDedupeKey.set(source.dedupeKey, index);
        orderedFootnotes.push({ index, content: source.content });
      }
      trackIndices.push(index);
    }
    // A track's markers render in ascending numeric order ("² ⁵", not "⁵ ²"),
    // independent of which footnote source was collected first.
    if (trackIndices.length > 0)
      trackFootnoteIndices.set(
        track.id,
        [...new Set(trackIndices)].sort((a, b) => a - b),
      );
  }

  return { trackFootnoteIndices, orderedFootnotes };
}

/** Footnote sources from the show's free-text annotations, deduped by description. */
export function annotationFootnoteSources(annotations: Annotation[]): FootnoteSource[] {
  return annotations
    .filter((annotation) => annotation.trackId && annotation.desc)
    .map((annotation) => ({
      kind: "annotation" as const,
      trackId: annotation.trackId as string,
      dedupeKey: annotation.desc as string,
      content: annotation.desc as string,
    }));
}

function instrumentNames(delta: TrackMusicianDelta): string {
  // Display instrument names with the casing stored in the DB.
  return delta.instruments.map((instrument) => instrument.name).join(", ");
}

function musicianLink(delta: TrackMusicianDelta): ReactNode {
  return (
    <Link to={`/musicians/${delta.musician.slug}`} className="text-brand-primary hover:text-brand-secondary">
      {delta.musician.name}
    </Link>
  );
}

/** The instrument set a delta plays, as a stable grouping key. */
function instrumentKey(delta: TrackMusicianDelta): string {
  return delta.instruments
    .map((instrument) => instrument.id)
    .sort()
    .join("+");
}

/** Apply "A", "A and B", "A, B, and C" grammar across items, rendering each
 *  with `renderItem`. */
function joinWithGrammar<T>(items: T[], key: (item: T) => string, renderItem: (item: T) => ReactNode): ReactNode {
  return items.map((item, index) => {
    const separator = index === 0 ? "" : items.length === 2 ? " and " : index === items.length - 1 ? ", and " : ", ";
    return (
      <span key={key(item)}>
        {separator}
        {renderItem(item)}
      </span>
    );
  });
}

/**
 * Join performer clauses, grouping musicians who play the same instrument so the
 * shared "on <instrument>" reads once: "Jon, Aron, and Eric on beatbox, and
 * Marc on rap". A single instrument group collapses to "A, B, and C on guitar";
 * all-distinct instruments read "A on x, B on y, and C on z". Instrument groups
 * appear in first-seen order and join with the same comma/"and" grammar.
 */
function joinClauses(deltas: TrackMusicianDelta[]): ReactNode {
  // Group by instrument set, preserving the order each group first appears.
  const groups: TrackMusicianDelta[][] = [];
  const groupByKey = new Map<string, TrackMusicianDelta[]>();
  for (const delta of deltas) {
    const key = instrumentKey(delta);
    let group = groupByKey.get(key);
    if (!group) {
      group = [];
      groupByKey.set(key, group);
      groups.push(group);
    }
    group.push(delta);
  }

  const renderGroup = (group: TrackMusicianDelta[]): ReactNode => {
    const instruments = instrumentNames(group[0]);
    return (
      <>
        {joinWithGrammar(group, (delta) => delta.musician.id, musicianLink)}
        {instruments ? ` on ${instruments}` : ""}
      </>
    );
  };

  // Groups join with a comma before the final "and" even for two groups, since
  // each group can carry its own internal commas ("A, B, and C on x, and D on y").
  return groups.map((group, index) => (
    <span key={instrumentKey(group[0])}>
      {index === 0 ? "" : index === groups.length - 1 ? ", and " : ", "}
      {renderGroup(group)}
    </span>
  ));
}

/** Stable dedupe key fragment for a group of same-verb deltas, so the same set
 *  of performers across tracks collapses to one footnote number. */
function verbGroupKey(verb: string, deltas: TrackMusicianDelta[]): string {
  const members = deltas
    .map(
      (delta) =>
        `${delta.musician.id}:${delta.instruments
          .map((i) => i.id)
          .sort()
          .join("+")}`,
    )
    .sort()
    .join("|");
  return `${verb}:${members}`;
}

/**
 * Synthesize ONE performer footnote per track from its sit-in / sat-out deltas.
 * Sit-ins and sat-outs combine on a single line — "with A on x and B on y,
 * without C" — so a track never shows more than one performer marker. The
 * known-from blurb is not shown (the linked name leads to it). Identical
 * combinations across tracks share one footnote number via a stable dedupe key.
 *
 * `elevatedGuestIds` are guests surfaced in the show-level note (they played
 * most/all of the show); their per-track "with" entries are suppressed here so
 * the note isn't repeated on every track.
 */
export function synthesizePerformerFootnotes(
  deltas: TrackMusicianDelta[],
  elevatedGuestIds: Set<string> = new Set(),
): FootnoteSource[] {
  // Group by track, splitting sit-ins from sat-outs, preserving input order.
  const byTrack = new Map<string, { with: TrackMusicianDelta[]; without: TrackMusicianDelta[] }>();
  for (const delta of deltas) {
    if (delta.present && elevatedGuestIds.has(delta.musician.id)) continue;
    const group = byTrack.get(delta.trackId) ?? { with: [], without: [] };
    (delta.present ? group.with : group.without).push(delta);
    byTrack.set(delta.trackId, group);
  }

  const sources: FootnoteSource[] = [];
  for (const [trackId, group] of byTrack) {
    if (group.with.length === 0 && group.without.length === 0) continue;

    // "with ..." and "without ..." clauses join into one footnote, separated by
    // a comma when both are present.
    const parts: ReactNode[] = [];
    if (group.with.length > 0) parts.push(<>with {joinClauses(group.with)}</>);
    if (group.without.length > 0) parts.push(<>without {joinClauses(group.without)}</>);

    sources.push({
      kind: "performer",
      trackId,
      dedupeKey: `${verbGroupKey("with", group.with)};${verbGroupKey("without", group.without)}`,
      content: (
        <>
          {parts.map((part, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed 2-part list (with, without)
            <span key={index}>
              {index > 0 ? ", " : ""}
              {part}
            </span>
          ))}
        </>
      ),
    });
  }
  return sources;
}

/**
 * Footnotes marking the tracks a whole-show guest did NOT play, so the
 * show-level "with <Name>, except where noted" claim is verifiable per track.
 *
 * A track where the guest has an explicit sat-out delta is skipped: that "without
 * <Name>" already rides in the combined performer footnote from
 * synthesizePerformerFootnotes, so emitting it here too would double-report it.
 */
export function guestExclusionFootnotes(
  guests: Array<{ musicianId: string; name: string; slug: string; absentTrackIds: string[] }>,
  deltas: TrackMusicianDelta[] = [],
): FootnoteSource[] {
  // (musicianId, trackId) pairs that already carry a "without" via a sat-out delta.
  const satOut = new Set(
    deltas.filter((delta) => !delta.present).map((delta) => `${delta.musician.id}:${delta.trackId}`),
  );

  const sources: FootnoteSource[] = [];
  for (const guest of guests) {
    for (const trackId of guest.absentTrackIds) {
      if (satOut.has(`${guest.musicianId}:${trackId}`)) continue;
      sources.push({
        kind: "performer",
        trackId,
        dedupeKey: `without:${guest.musicianId}:`,
        content: (
          <>
            without{" "}
            <Link to={`/musicians/${guest.slug}`} className="text-brand-primary hover:text-brand-secondary">
              {guest.name}
            </Link>
          </>
        ),
      });
    }
  }
  return sources;
}

/**
 * The debut footnote text for a song getting its first performance, or null
 * when no debut footnote should show. Improvisations (jams) never debut. A
 * mashup names its artists ("debut (X mashup)") or stays "debut (mashup)"; a
 * cover names its origin ("debut (X)") or, lacking an author, reads "debut
 * (cover - unknown author)"; everything else (original / null / unknown) names
 * its author when known ("debut (original - X)") or reads "debut (original -
 * unknown author)".
 */
export function buildDebutText(song: FootnoteSong): string | null {
  switch (song.kind) {
    case "improvisation":
      return null;
    case "mashup":
      return song.authorName ? `debut (${song.authorName} mashup)` : "debut (mashup)";
    case "cover":
      return song.authorName ? `debut (${song.authorName})` : "debut (cover - unknown author)";
    default:
      return song.authorName ? `debut (original - ${song.authorName})` : "debut (original - unknown author)";
  }
}

/** Footnotes marking each debut (gap === null), skipping improvisations. */
export function debutFootnoteSources(tracks: FootnoteTrack[]): FootnoteSource[] {
  const sources: FootnoteSource[] = [];
  for (const track of tracks) {
    if (track.gap !== null || !track.song) continue;
    const text = buildDebutText(track.song);
    if (!text) continue;
    sources.push({
      kind: "debut",
      trackId: track.id,
      // Keyed by the text so identical debuts (e.g. several originals debuting in
      // one show) collapse to a single shared footnote number.
      dedupeKey: `debut:${text}`,
      content: text,
    });
  }
  return sources;
}

/**
 * Footnotes for songs returning after a long absence: a track whose gap (shows
 * since the song last appeared) reaches `threshold` gets "last played <date link>
 * (N shows)". Debuts (null gap) and within-threshold returns are skipped, as are
 * improvisations — a one-off jam's gap since its last appearance is meaningless.
 */
export function lastTimePlayedFootnoteSources(tracks: FootnoteTrack[], threshold: number): FootnoteSource[] {
  const sources: FootnoteSource[] = [];
  for (const track of tracks) {
    if (track.gap === null || track.gap < threshold || !track.previousPerformanceShow) continue;
    if (track.song?.kind === "improvisation") continue;
    const { date, slug } = track.previousPerformanceShow;
    sources.push({
      kind: "ltp",
      trackId: track.id,
      // Keyed by song+gap so a song repeated in one show footnotes its return once.
      dedupeKey: `ltp:${track.songId}:${track.gap}`,
      content: (
        <>
          last played{" "}
          <Link to={`/shows/${slug}`} className="text-brand-primary hover:text-brand-secondary">
            {formatDateShort(date)}
          </Link>{" "}
          ({track.gap} shows)
        </>
      ),
    });
  }
  return sources;
}

/** A linked show date used inside a recurrence clause. */
function showDateLink(show: { date: string; slug: string }): ReactNode {
  return (
    <Link to={`/shows/${show.slug}`} className="text-brand-primary hover:text-brand-secondary">
      {formatDateShort(show.date)}
    </Link>
  );
}

/** "(N versions ago; M shows ago)" — the recurrence gap parenthetical, leading
 *  with the song's own performances and following with calendar shows. */
function recurrenceGaps(versionGap: number | null, gap: number | null): string {
  return `(${versionGap} versions ago; ${gap} shows ago)`;
}

/** "1st time" / "1st <noun>", plus "(after X played versions)" when the
 *  first-ever instance arrived late in the song's life. On a first-ever
 *  recurrence the mapper sets `versionGap` to the count of prior versions only
 *  when it cleared the kind's threshold, so a non-null value means "worth noting
 *  how late". */
function firstTimeText(lead: string, versionsBefore: number | null): string {
  return versionsBefore === null ? lead : `${lead} (after ${versionsBefore} played versions)`;
}

/**
 * The recurrence suffix for a flag: ", 1st time" (optionally "(after X
 * versions)") on a first-ever application, or ", last time <date link> (N
 * versions ago; M shows ago)" on a repeat. Appended to the flag's lowercase
 * label so it reads "dyslexic, last time 5/2/24 (14 versions ago; 47 shows ago)".
 */
function flagRecurrenceSuffix(recurrence: FlagRecurrence): ReactNode {
  if (!recurrence.lastPlayed) return `, ${firstTimeText("1st time", recurrence.versionGap)}`;
  return (
    <>
      , last time {showDateLink(recurrence.lastPlayed)} {recurrenceGaps(recurrence.versionGap, recurrence.gap)}
    </>
  );
}

/**
 * The full segue recurrence clause: "1st standalone version" (1st ever) or
 * "1st version not segued into since <date link> (N versions ago; M shows ago)".
 */
function segueRecurrenceClause(recurrence: SegueRecurrence): ReactNode {
  const noun = SEGUE_RECURRENCE_NOUNS[recurrence.kind];
  if (!recurrence.lastPlayed) return firstTimeText(`1st ${noun}`, recurrence.versionGap);
  return (
    <>
      1st {noun} since {showDateLink(recurrence.lastPlayed)} {recurrenceGaps(recurrence.versionGap, recurrence.gap)}
    </>
  );
}

/** " of <name>" when the completed/completing versions are all the same
 *  differently-named song; "" otherwise. The mapper only sets `otherSongTitle`
 *  when the linked song differs, so a single distinct value names it; mixed
 *  songs (rare) degrade to no name rather than guess. */
function completionOfSuffix(shows: CompletionShow[]): string {
  const names = new Set(shows.map((show) => show.otherSongTitle).filter((title): title is string => Boolean(title)));
  return names.size === 1 ? ` of ${[...names][0]}` : "";
}

/** Linked, comma-separated show dates for a completion footnote. */
function completionDateLinks(shows: CompletionShow[]): ReactNode {
  return shows.map((show, index) => (
    <span key={show.slug}>
      {index > 0 ? ", " : ""}
      <Link to={`/shows/${show.slug}`} className="text-brand-primary hover:text-brand-secondary">
        {formatDateShort(show.date)}
      </Link>
    </span>
  ));
}

/**
 * A track's segue recurrences, suppressed for improvisations: an improv is
 * inherently a standalone jam, so its standalone / segue-in / segue-out
 * footnotes carry no signal. The stored recurrence rows are left intact; this
 * only gates the display.
 */
function segueRecurrencesFor(track: FootnoteTrack): SegueRecurrence[] {
  if (track.song?.kind === "improvisation") return [];
  return track.segueRecurrences ?? [];
}

/**
 * One consolidated footnote per track combining ALL its data-driven markers:
 * the structured flags (in FLAG_DISPLAY_ORDER) followed by the cross-show
 * completion clauses ("completes <date(s)> version", then "completed by
 * <date(s)> version"). A track with several markers reads on a single line,
 * e.g. "dyslexic, inverted, ending only, completes 12/30/21 version", rather
 * than one footnote per marker. Tracks with identical marker sets share a
 * number via a stable dedupe key. Tracks with no data-driven markers emit
 * nothing (free-text annotations are handled by annotationFootnoteSources).
 *
 * `suppressRecurrences` drops the gap-derived recurrence clauses (the flag
 * "1st time" / "last time …" suffixes and the segue "1st standalone version …"
 * clauses) while keeping the flags and completion links themselves. The early
 * setlists are too scattered for those gap statistics to be trustworthy.
 */
export function dataDrivenFootnoteSources(
  tracks: FootnoteTrack[],
  { suppressRecurrences = false }: { suppressRecurrences?: boolean } = {},
): FootnoteSource[] {
  // A song played twice in one show carries its recurrence on only the notable
  // performance (the same-show repeat is gated out server-side). Share each
  // song's recurrence across all its tracks so both markers read the same and
  // collapse to one footnote. Keyed by songId+flag / songId+segueKind; the
  // entry with a prior show (the notable "last time …") wins over a first-time
  // or absent one. Left empty when recurrences are suppressed.
  const songFlagRecurrence = new Map<string, FlagRecurrence>();
  const songSegueRecurrence = new Map<string, SegueRecurrence>();
  if (!suppressRecurrences) {
    for (const track of tracks) {
      for (const recurrence of track.flagRecurrences ?? []) {
        const key = `${track.songId}:${recurrence.flag}`;
        const existing = songFlagRecurrence.get(key);
        if (!existing || (!existing.lastPlayed && recurrence.lastPlayed)) songFlagRecurrence.set(key, recurrence);
      }
      for (const recurrence of segueRecurrencesFor(track)) {
        const key = `${track.songId}:${recurrence.kind}`;
        const existing = songSegueRecurrence.get(key);
        if (!existing || (!existing.lastPlayed && recurrence.lastPlayed)) songSegueRecurrence.set(key, recurrence);
      }
    }
  }

  const sources: FootnoteSource[] = [];
  for (const track of tracks) {
    const flags = FLAG_DISPLAY_ORDER.filter((flag) => track.flags?.includes(flag));
    // Use the song-level recurrence (shared across repeats), falling back to the
    // track's own. A repeat whose own recurrence was gated out still shows the
    // notable performance's note.
    const segueRecurrences = suppressRecurrences
      ? []
      : segueRecurrencesFor(track).map((r) => songSegueRecurrence.get(`${track.songId}:${r.kind}`) ?? r);
    const completes = track.completes ?? [];
    const completedBy = track.completedBy ?? [];
    if (flags.length === 0 && segueRecurrences.length === 0 && completes.length === 0 && completedBy.length === 0)
      continue;

    // Each flag label optionally carries its recurrence suffix ("dyslexic, last
    // time …"). Recurrence-bearing flags render as ReactNodes; the rest stay text.
    const flagRecurrenceByFlag = new Map(
      flags.flatMap((flag) => {
        const recurrence = songFlagRecurrence.get(`${track.songId}:${flag}`);
        return recurrence ? [[flag, recurrence] as const] : [];
      }),
    );
    // The "<part> only" flags (beginning / middle / ending) collapse into a
    // single "<part> and <part> only" segment when a track carries more than
    // one, sharing the trailing "only" — unless any of them carries a
    // recurrence suffix, in which case each renders on its own to keep its note.
    const partialFlags = flags.filter((flag) => PARTIAL_ONLY_FLAGS.includes(flag));
    const collapsePartials = partialFlags.length > 1 && partialFlags.every((flag) => !flagRecurrenceByFlag.has(flag));

    const flagSegments: ReactNode[] = [];
    let collapsedPartialEmitted = false;
    for (const flag of flags) {
      if (collapsePartials && PARTIAL_ONLY_FLAGS.includes(flag)) {
        // Emit the combined partial segment once, in place of the first partial.
        if (collapsedPartialEmitted) continue;
        collapsedPartialEmitted = true;
        flagSegments.push(combinedPartialLabel(partialFlags));
        continue;
      }
      const recurrence = flagRecurrenceByFlag.get(flag);
      flagSegments.push(
        recurrence ? (
          <>
            {flagLabel(flag)}
            {flagRecurrenceSuffix(recurrence)}
          </>
        ) : (
          flagLabel(flag)
        ),
      );
    }

    // Flag labels (+ their recurrence shape) and the completion verbs drive the
    // dedupe key; the linked dates render separately but their slugs key it too.
    const keyParts: string[] = flags.map((flag) => {
      const recurrence = flagRecurrenceByFlag.get(flag);
      if (!recurrence) return flag;
      return `${flag}:${recurrence.lastPlayed?.slug ?? "1st"}`;
    });
    const clauses: ReactNode[] = [];
    for (const recurrence of segueRecurrences) {
      clauses.push(<span key={`segue-${recurrence.kind}`}>{segueRecurrenceClause(recurrence)}</span>);
      keyParts.push(`segue:${recurrence.kind}:${recurrence.lastPlayed?.slug ?? "1st"}`);
    }
    if (completes.length > 0) {
      clauses.push(
        <span key="completes">
          completes {completionDateLinks(completes)} {completes.length > 1 ? "versions" : "version"}
          {completionOfSuffix(completes)}
        </span>,
      );
      keyParts.push(`completes:${completes.map((show) => `${show.slug}:${show.otherSongTitle ?? ""}`).join(",")}`);
    }
    if (completedBy.length > 0) {
      clauses.push(
        <span key="completed-by">
          completed by {completionDateLinks(completedBy)} {completedBy.length > 1 ? "versions" : "version"}
          {completionOfSuffix(completedBy)}
        </span>,
      );
      keyParts.push(`completed-by:${completedBy.map((show) => `${show.slug}:${show.otherSongTitle ?? ""}`).join(",")}`);
    }

    // Join flag labels and the segue/completion clauses with ", " into one line.
    const segments: ReactNode[] = [...flagSegments, ...clauses];
    sources.push({
      kind: "flag",
      trackId: track.id,
      dedupeKey: keyParts.join("|"),
      content: (
        <>
          {segments.map((segment, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional and stable per render
            <span key={index}>
              {index > 0 ? ", " : ""}
              {segment}
            </span>
          ))}
        </>
      ),
    });
  }
  return sources;
}

/**
 * The single source of truth for a show's footnotes: collects every footnote
 * source (annotations, flags/completions, performer deltas, guest exclusions,
 * last-time-played, debuts) in precedence order, applies the era-based gaps/
 * debut suppression, and numbers them. Both the public setlist view and the
 * admin show-edit view derive through this so their wording can never diverge.
 */
export function buildShowFootnotes(setlist: Setlist | SetlistLight): DerivedFootnotes {
  const allTracks = setlist.sets.flatMap((set) => set.tracks);
  // Whole-show guests are surfaced in the show-level lineup note, so their
  // per-track "with" footnotes are suppressed; for guests below 100% coverage
  // the tracks they sat out are footnoted ("except where noted").
  const lineupNotes = deriveShowLineupNotes(
    setlist.show.date,
    setlist.lineup,
    setlist.trackMusicianDeltas,
    allTracks.map((track) => track.id),
  );
  // The early setlists are too scattered to trust a song's gap or first
  // appearance. Debuts firm up sooner than gaps, so they have separate start
  // dates: before each, that category is suppressed. Flags, completions,
  // annotations, and performer notes still render — observed facts, not stats.
  const suppressDebuts = debutFootnoteSuppressed(setlist.show.date);
  const suppressGaps = gapFootnoteSuppressed(setlist.show.date);
  const footnoteSources = [
    // DB annotations are numbered before synthesized performer footnotes on any
    // given track, so the existing annotation indices stay stable.
    ...annotationFootnoteSources(setlist.annotations),
    // All of a track's structured flags + completion links read on one line,
    // right after annotations so the setlist reads like its annotation era.
    ...dataDrivenFootnoteSources(allTracks, { suppressRecurrences: suppressGaps }),
    ...synthesizePerformerFootnotes(setlist.trackMusicianDeltas, elevatedGuestIds(lineupNotes)),
    ...guestExclusionFootnotes(lineupNotes.guests, setlist.trackMusicianDeltas),
    // Auto last-time-played / debut footnotes append after the above so the
    // existing annotation and performer footnote numbers stay stable.
    ...(!suppressGaps ? lastTimePlayedFootnoteSources(allTracks, LAST_TIME_PLAYED_GAP_THRESHOLD) : []),
    ...(!suppressDebuts ? debutFootnoteSources(allTracks) : []),
  ];
  return deriveFootnotes(allTracks, footnoteSources);
}

/**
 * Slice the show-level derivation into per-track footnote contents, so a view
 * that renders each track's footnotes in isolation (the admin show-edit rows)
 * can list them without the central numbered list. Keyed by track id; the
 * contents stay in the same ascending order as the track's `sup` markers.
 */
export function footnotesByTrack(derived: DerivedFootnotes): Map<string, ReactNode[]> {
  const contentByIndex = new Map(derived.orderedFootnotes.map((footnote) => [footnote.index, footnote.content]));
  const byTrack = new Map<string, ReactNode[]>();
  for (const [trackId, indices] of derived.trackFootnoteIndices) {
    byTrack.set(
      trackId,
      indices.map((index) => contentByIndex.get(index)),
    );
  }
  return byTrack;
}

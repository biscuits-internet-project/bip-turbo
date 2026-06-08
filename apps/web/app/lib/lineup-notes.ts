import type { ShowLineupMember, TrackMusicianDelta } from "@bip/domain";
import {
  type DrummerMilestone,
  drummerMilestonesForDate,
  type ExpectedMember,
  expectedMembersForDate,
} from "~/lib/musicians-constants";

/** Fraction of a show's tracks a guest must play to be elevated to a top note. */
export const WHOLE_SHOW_GUEST_THRESHOLD = 0.8;

/** A guest who played most/all of a show, surfaced as a show-level note rather
 *  than a footnote repeated on every track. */
export type WholeShowGuest = {
  musicianId: string;
  name: string;
  slug: string;
  instruments: string[];
  /** Track ids the guest did NOT play; non-empty means "except where noted". */
  absentTrackIds: string[];
};

/** A core/era member absent from the recorded lineup (the "without" case). */
export type MissingMember = ExpectedMember;

/** A core/era member present but playing something other than their usual
 *  instrument (e.g. Jon on midi instead of guitar). */
export type OffInstrumentMember = {
  slug: string;
  name: string;
  /** The non-default instruments they played, vocals omitted. */
  instruments: string[];
  /** Their usual instrument, for the "instead of" contrast. */
  defaultInstrument: string;
};

export type ShowLineupNotes = {
  missing: MissingMember[];
  guests: WholeShowGuest[];
  /** Core members present on a non-default instrument. */
  offInstrument: OffInstrumentMember[];
  /** Drummer first/last-show milestones landing on this show's date. */
  milestones: DrummerMilestone[];
};

/** A group of whole-show guests who played the same instrument(s), merged into
 *  one note ("with Tom Hamilton and Chris Michetti on guitar"). */
export type GuestGroup = {
  members: { name: string; slug: string }[];
  instruments: string[];
  /** True when the group sat out some tracks; renders ", except where noted". */
  exceptWhereNoted: boolean;
};

function instrumentNames(delta: TrackMusicianDelta): string[] {
  return delta.instruments.map((instrument) => instrument.name.toLowerCase());
}

/**
 * Derive the show-level lineup notes for a show: which expected members are
 * missing, and which guests played enough of the show (>= threshold of tracks)
 * to be elevated out of per-track footnotes.
 *
 * Guests are present=true deltas for musicians who are NOT expected members
 * (expected members absent from the lineup are reported via `missing`, never as
 * guests). A non-era drummer or any sit-in artist who covers most of the show
 * therefore lands in `guests` like any other whole-show guest.
 */
export function deriveShowLineupNotes(
  date: string,
  lineup: ShowLineupMember[],
  deltas: TrackMusicianDelta[],
  allTrackIds: string[],
): ShowLineupNotes {
  const expected = expectedMembersForDate(new Date(date));
  const expectedSlugs = new Set(expected.map((member) => member.slug));

  const missing =
    lineup.length === 0
      ? []
      : expected.filter((member) => !lineup.some((entry) => entry.musician.slug === member.slug));

  // Expected members present in the lineup but recorded without their usual
  // instrument (vocals don't count as "their instrument" and are never listed).
  const offInstrument: OffInstrumentMember[] = [];
  for (const member of lineup) {
    if (!expectedSlugs.has(member.musician.slug)) continue;
    const usual = member.musician.defaultInstrument;
    if (!usual) continue;
    if (member.instruments.some((instrument) => instrument.id === usual.id)) continue;
    const played = member.instruments
      .filter((instrument) => instrument.id !== usual.id && instrument.slug !== "vocals")
      .map((instrument) => instrument.name.toLowerCase());
    if (played.length === 0) continue;
    offInstrument.push({
      slug: member.musician.slug,
      name: member.musician.name,
      instruments: played,
      defaultInstrument: usual.name.toLowerCase(),
    });
  }

  // Group present=true deltas by guest musician (skip expected members).
  const presentByMusician = new Map<string, TrackMusicianDelta[]>();
  for (const delta of deltas) {
    if (!delta.present) continue;
    if (expectedSlugs.has(delta.musician.slug)) continue;
    const list = presentByMusician.get(delta.musician.id) ?? [];
    list.push(delta);
    presentByMusician.set(delta.musician.id, list);
  }

  const totalTracks = allTrackIds.length;
  const guests: WholeShowGuest[] = [];
  for (const musicianDeltas of presentByMusician.values()) {
    if (totalTracks === 0) continue;
    if (musicianDeltas.length / totalTracks < WHOLE_SHOW_GUEST_THRESHOLD) continue;

    const presentTrackIds = new Set(musicianDeltas.map((delta) => delta.trackId));
    // Union instruments across the guest's tracks, preserving first-seen order.
    const instruments: string[] = [];
    for (const delta of musicianDeltas) {
      for (const name of instrumentNames(delta)) if (!instruments.includes(name)) instruments.push(name);
    }
    const first = musicianDeltas[0];
    guests.push({
      musicianId: first.musician.id,
      name: first.musician.name,
      slug: first.musician.slug,
      instruments,
      absentTrackIds: allTrackIds.filter((id) => !presentTrackIds.has(id)),
    });
  }

  // A guest recorded only in the base lineup (no present=true deltas) read as
  // sitting in for the whole show. Surface them too, unless already elevated
  // above. Their exclusions come from any present=false sat-out deltas.
  const elevatedIds = new Set(guests.map((guest) => guest.musicianId));
  const absentByMusician = new Map<string, string[]>();
  for (const delta of deltas) {
    if (delta.present) continue;
    const list = absentByMusician.get(delta.musician.id) ?? [];
    list.push(delta.trackId);
    absentByMusician.set(delta.musician.id, list);
  }

  for (const member of lineup) {
    if (expectedSlugs.has(member.musician.slug)) continue;
    if (elevatedIds.has(member.musician.id)) continue;
    if (presentByMusician.has(member.musician.id)) continue;

    const absentTrackIds = absentByMusician.get(member.musician.id) ?? [];
    guests.push({
      musicianId: member.musician.id,
      name: member.musician.name,
      slug: member.musician.slug,
      instruments: member.instruments.map((instrument) => instrument.name.toLowerCase()),
      absentTrackIds,
    });
  }

  return { missing, guests, offInstrument, milestones: drummerMilestonesForDate(date) };
}

/**
 * Merge whole-show guests who played the same instrument(s) into one note, so
 * "with Tom Hamilton on guitar" and "with Chris Michetti on guitar" render as
 * "with Tom Hamilton and Chris Michetti on guitar". Guests with the same
 * instruments but a different "except where noted" status stay separate, since
 * one played the whole show and the other did not. First-seen order preserved.
 */
export function groupWholeShowGuests(guests: WholeShowGuest[]): GuestGroup[] {
  const groups = new Map<string, GuestGroup>();
  for (const guest of guests) {
    const exceptWhereNoted = guest.absentTrackIds.length > 0;
    const key = `${exceptWhereNoted}|${guest.instruments.join(",")}`;
    const existing = groups.get(key);
    if (existing) {
      existing.members.push({ name: guest.name, slug: guest.slug });
      continue;
    }
    groups.set(key, {
      members: [{ name: guest.name, slug: guest.slug }],
      instruments: guest.instruments,
      exceptWhereNoted,
    });
  }
  return [...groups.values()];
}

/** Musician ids elevated to the top note, whose per-track footnotes are suppressed. */
export function elevatedGuestIds(notes: ShowLineupNotes): Set<string> {
  return new Set(notes.guests.map((guest) => guest.musicianId));
}

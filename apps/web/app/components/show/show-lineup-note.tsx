import { Fragment } from "react";
import { Link } from "react-router-dom";
import { groupWholeShowGuests, type ShowLineupNotes } from "~/lib/lineup-notes";

/** A musician name linked to their profile, rendered un-italicized inside the note. */
function MusicianLink({ name, slug }: { name: string; slug: string }) {
  return (
    <Link to={`/musicians/${slug}`} className="text-brand-primary hover:text-brand-secondary not-italic">
      {name}
    </Link>
  );
}

/** Join linked musician names with commas and a trailing "and" ("A", "A and B", "A, B, and C"). */
function MusicianList({ members }: { members: { name: string; slug: string }[] }) {
  return (
    <>
      {members.map((member, index) => (
        <Fragment key={member.slug}>
          {index > 0 && (index === members.length - 1 ? (members.length > 2 ? ", and " : " and ") : ", ")}
          <MusicianLink name={member.name} slug={member.slug} />
        </Fragment>
      ))}
    </>
  );
}

/**
 * Show-level lineup note rendered beside the show notes: who was missing from
 * the standard lineup ("without Jon Gutwillig on guitar"), which core member
 * played a different instrument ("Jon Gutwillig on midi instead of guitar"),
 * and which guest played most or all of the show ("with Tom Hamilton on
 * guitar"). Guests on the same instrument combine into one sentence. A guest
 * who played less than the whole show gets ", except where noted", with the
 * skipped tracks footnoted in the setlist. Also notes a drummer's first or last
 * show ("1st show with Marlon Lewis on drums"). Names link to musician pages.
 * Renders nothing when there is nothing to report.
 */
export function ShowLineupNote({ notes }: { notes: ShowLineupNotes }) {
  const { missing, guests, offInstrument, milestones } = notes;
  if (missing.length === 0 && guests.length === 0 && offInstrument.length === 0 && milestones.length === 0) return null;
  const guestGroups = groupWholeShowGuests(guests);

  return (
    <div className="mb-4 text-sm text-content-text-secondary italic border-l border-glass-border pl-3 py-1 space-y-0.5">
      {milestones.map((milestone) => (
        <div key={`milestone-${milestone.slug}-${milestone.ordinal}`}>
          {milestone.ordinal} show with <MusicianLink name={milestone.name} slug={milestone.slug} /> on drums
        </div>
      ))}
      {missing.map((member) => (
        <div key={`missing-${member.slug}`}>
          without <MusicianLink name={member.name} slug={member.slug} /> on {member.instrument}
        </div>
      ))}
      {offInstrument.map((member) => (
        <div key={`off-${member.slug}`}>
          <MusicianLink name={member.name} slug={member.slug} /> on {member.instruments.join(", ")} instead of{" "}
          {member.defaultInstrument}
        </div>
      ))}
      {guestGroups.map((group) => (
        <div key={`guest-${group.members.map((member) => member.slug).join("-")}`}>
          with <MusicianList members={group.members} />
          {group.instruments.length > 0 ? ` on ${group.instruments.join(", ")}` : ""}
          {group.exceptWhereNoted ? ", except where noted" : ""}
        </div>
      ))}
    </div>
  );
}
